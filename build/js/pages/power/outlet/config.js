define(function (require) {
    var Vue = require('vue');
    var Datatable = require('datatable');
    var VueFormGenerator = require('vue-form');
    var layer = require('layer');
    require('components/x-panel');
    require('components/form-action');

    Vue.use(VueFormGenerator);

    var mixin = {
        data: function () {
            return {
                fields: [{
                    name: '__checkbox:checkbox',
                    titleClass: 'text-center',
                    dataClass: 'text-center'
                },
                {
                    name: 'id',
                    title: 'ID',
                },
                {
                    name: '__component:inline-text:name',
                    title: 'Outlet Name'
                },
                {
                    name: 'showType',
                    title: 'Socket Type'
                },
                {
                    name: 'activeEnergy',
                    title: 'Active Energy',
                    callback: 'renderActiveEnergy'
                },
                {
                    name: '__component:inline-text:delay',
                    title: 'Extra On<br>Delay(sec)',
                    __normalize: function (obj) {
                        obj.unit = 's';
                    }
                },
                {
                    name: '__component:inline-select:wakeupState',
                    title: 'Wake Up State',
                    __normalize: function (obj) {
                        obj.__options = [
                            { value: 0, text: 'ON' },
                            { value: 1, text: 'OFF' },
                            { value: 2, text: 'LAST' }
                        ];
                    }
                },
                {
                    name: '__component:inline-checkbox:locked',
                    title: 'Locked/<br/>No Control',
                },
                {
                    name: '__component:inline-checkbox:trapNotify',
                    title: 'SNMP Trap<br/>Notifications',
                },
                {
                    name: '__component:inline-checkbox:emailNotify',
                    title: 'Email<br/>Notifications',
                },
                ]
            };
        },
        methods: {
            renderActiveEnergy: function (value) {
                return value + ' kWh';
            }
        }
    };

    return Vue.extend({
        template: require('text!./config.html'),
        components: {
            'datatable': Datatable(mixin)
        },
        data: function () {
            return {
                model: {
                    stateLogging: true,
                    sequenceInterval: 2,
                    cycleDelay: 10,
                    selectGroup: 'all',
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
                datas: [],
                group: [],
                choiseData: [],
                editData: []
            };
        },
        computed: {
            schema: function () {
                return {
                    groups: [{
                        legend: 'Global Outlet Options',
                        fields: [/*{
                            type: 'switch',
                            label: 'State Changing Logging',
                            model: 'stateLogging',
                            textOn: 'Enabled',
                            textOff: 'Disabled'
                        },*/{
                            type: 'input',
                            inputType: 'text',
                            label: 'Sequence Interval',
                            model: 'sequenceInterval',
                            hint: 'Unit: Seconds',
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Cycle Delay',
                            model: 'cycleDelay',
                            hint: 'Unit: Seconds',
                        }]
                    }, {
                        legend: 'Unit Outlet Options',
                        fields: [{
                            type: 'select',
                            label: 'Selected Group',
                            model: 'selectGroup',
                            values: this.group,
                            self: this,
                            onChanged: function(model, newVal, oldVal, field) {
                                this.init();
                            }.bind(this)
                        }]
                    }]
                }
            }
        },
        mounted: function () {
            this.clearSwitchControlLabel();//消除switch按钮的事件区域过大的问题
            // $.get('/cgi-bin/luci/api/v1/outlet/config')
            $.get('/cgi-bin/luci/api/v1/outlet/group').success(function(response) {
                response.forEach(function(item){
                    this.group.push({
                        name: item.name,
                        id: item.name
                    })
                }.bind(this))
            }.bind(this))
            this.init();
        },
        methods: {
            onApplyClick: function () {
                var data = {
                    outlets: []
                };
                this.editData.forEach(function(item){
                    this.datas[item.index][item.field] = item.value;
                    this.datas[item.index].isEdit = true;
                }.bind(this))

                data.stateLogging = this.model.stateLogging;
                data.sequenceInterval = parseInt(this.model.sequenceInterval);
                data.cycleDelay = parseInt(this.model.cycleDelay);
                this.datas.forEach(function(item) {
                    if (item.isEdit) {
                        delete item.isEdit;
                        data.outlets.push(item);
                    }
                    if (item.trapNotify == true && item.emailNotify == true) {
                        item.notify = 3;
                        delete item.trapNotify;
                        delete item.emailNotify;
                    } else if (item.trapNotify == false && item.emailNotify == true) {
                        item.notify = 2;
                        delete item.trapNotify;
                        delete item.emailNotify;
                    } else if (item.trapNotify == true && item.emailNotify == false) {
                        item.notify = 1;
                        delete item.trapNotify;
                        delete item.emailNotify;
                    } else if (item.trapNotify == false && item.emailNotify == false) {
                        item.notify = 0;
                        delete item.trapNotify;
                        delete item.emailNotify;
                    }
                    /*
                                        if (item.wakeupState == 'ON') {
                                            item.wakeupState = 0
                                        }
                                        if (item.wakeupState == 'OFF') {
                                            item.wakeupState = 1
                                        }
                                        if (item.wakeupState == 'LAST') {
                                            item.wakeupState = 2
                                        }
                    */
                    item.delay = parseInt(item.delay);
                }.bind(this))
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/cgi-bin/luci/api/v1/outlet/config',
                    success:function (response) {
                        // location.reload();
                        this.init();
                    }.bind(this)
                })
            },
            onCancelClick: function () {
                this.init();
                this.choiseData = [];
                this.clearSelectedCheckeBox();//清除所有选中的状态
            },
            clearSelectedCheckeBox:function() {
                this.$children[0].$children[1].$refs.vuetable.selectedTo = [];
            },
            reset:function() {
                if (this.choiseData.length == 0) {
                    alert('please choose a outlet');
                    return false;
                }                

                var r = confirm("Confirm to Reset?");
                if(r != true)
                    return true;

                var type = type;
                var data = [];

                this.choiseData.forEach(function(item) {
                    data.push({
                        id: item.id
                    })
                }.bind(this))  

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/outlet/reset?type=activeEnergy',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response) {
                        this.init();
                        this.choiseData = [];
                        this.clearSelectedCheckeBox();//清除所有选中的状态
                    }.bind(this)
                })
            },
            init:function() {
                var layerTime=layer.load(2, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                $.get('/cgi-bin/luci/api/v1/outlet/config?group=' + this.model.selectGroup).success(function(response) {
                    this.model.cycleDelay = response.cycleDelay;
                    this.model.stateLogging = response.stateLogging;
                    this.model.sequenceInterval = response.sequenceInterval;
                    // this.datas = response.outlets;
                    response.outlets.forEach(function(item){
                        switch (item.notify) {
                            case 0:
                                item.trapNotify = false;
                                item.emailNotify = false;
                                break;
                            case 1:
                                item.trapNotify = true;
                                item.emailNotify = false;
                                break;
                            case 2:
                                item.trapNotify = false;
                                item.emailNotify = true;
                                break;
                            case 3:
                                item.trapNotify = true;
                                item.emailNotify = true;
                                break;
                        }

                        item.showType = item.type;
                        /*
                        switch (item.type) {
                            case 0:
                                item.showType = 'IEC320 C13 UL';
                                break;
                            case 1:
                                item.showType = 'IEC320 C13 IEC';
                                break;
                            case 2:
                                item.showType = 'IEC320 C19 UL';
                                break;
                            case 3:
                                item.showType = 'IEC320 C19 IEC';
                                break;
                            case 4:
                                item.showType = 'GB1002/10A';
                                break;
                            case 5:
                                item.showType = 'GB1002/16A';
                                break;
                            case 6:
                                item.showType = 'NEMA5-15R';
                                break;
                            case 7:
                                item.showType = 'NEMA5-20R';
                                break;
                        }*/
                    }.bind(this))
                    this.datas = [];
                    setTimeout(function() {
                        this.datas = response.outlets;
                        layer.close(layerTime);
                    }.bind(this));
                }.bind(this))
            }
        }
    });
});