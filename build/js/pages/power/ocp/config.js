define(function (require) {
    var Vue = require('vue');
    var Datatable = require('datatable');
    var VueFormGenerator = require('vue-form');
    var layer = require('layer');
    require('components/x-panel');
    require('components/form-action');

    Vue.use(VueFormGenerator);

    function getFieldUnit(row, field) {
        switch (row.id) {
            case 1:
                return 'kW';
            case 2:
                return 'kVA';
            case 4:
                return 'kWh';
            case 5:
                return 'Hz';
            case 6:
                return '%';
            case 7:
            case 9:
            case 11:
                return 'A';
            case 8:
            case 10:
            case 12:
                return 'V';
        }
        return '';
    }

    var mixin = {
        data: function () {
            return {
                fields: [{
                    name: '__checkbox:checkbox',
                    titleClass: 'text-center',
                    dataClass: 'text-center'
                }, {
                    name: 'id',
                    title: 'ID',
                },
                {
                    name: '__component:inline-text:name',
                    title: 'OCP Name'
                },
                {
                    name: 'type',
                    title: 'Type'
                },
                {
                    name: '__component:inline-text:hysteresis',
                    title: 'hysteresis'
                },
                {
                    name: '__component:inline-text:highWarning',
                    title: 'Current<br/>High Warning',
                    __normalize: function (obj) {
                        obj.unit = 'A';
                    }
                },
                {
                    name: '__component:inline-text:highAlarm',
                    title: 'Current<br/>High Alarm',
                    __normalize: function (obj) {
                        obj.unit = 'A';
                    }
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
    };

    return Vue.extend({
        template: require('text!./config.html'),
        components: {
            'datatable': Datatable(mixin)
        },
        data: function () {
            return {
                schema: {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: 'Current hysteresis',
                        model: 'hysteresis',
                        hint: 'Unit: A'
                    }]
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
                choiseData:[],
                datas: [],
                editData: []
            };
        },
        mounted: function () {
            this.init();
        },
        methods: {
            init:function() {
                this.choiseData = [];
                
                var layerTime=layer.load(2, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                $.get('/cgi-bin/luci/api/v1/ocp').success(function(response) {
                    response.forEach(function(item){
                        item.showType="Current(A)";//设置当前表格的类型
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
                        /*
                        if (item.type == 0) {
                            item.type = 'FUSE'
                        } else {
                            item.type = 'BREAKER'
                        }*/
                    }.bind(this))
                    this.datas = [];
                    setTimeout(function() {
                        this.datas = response;
                        layer.close(layerTime);
                    }.bind(this));
                }.bind(this))
            },
            onApplyClick: function () {
                var data = [];
                this.editData.forEach(function(item) {
                    this.datas[item.index][item.field] = item.value;
                    this.datas[item.index].isEdit = true;
                }.bind(this))
                this.datas.forEach(function(item) {
                    if (item.isEdit) {
                        delete item.isEdit;
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
                        data.push(item);
                    }
                }.bind(this))
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/cgi-bin/luci/api/v1/ocp',
                    success:function (response){
                        this.init();
                    }.bind(this)
                })
            },
            clearSelectedCheckeBox: function() {
                //this.$children[0].$children[1].$refs.vuetable.selectedTo = [];
            },
            onCancelClick: function () {
                this.init();
                this.clearSelectedCheckeBox();//清除所有选中的状态
            },
            resetClick:function(){
                if (this.choiseData.length == 0) {
                    alert('please choose a threshold');
                    return false;
                }                

                var r = confirm("Confirm to Reset?");
                if(r != true)
                    return true;

                //var type = type;
                var data = [];

                this.choiseData.forEach(function(item) {
                    data.push({
                        id: item.id
                    })
                }.bind(this))  

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/ocp/reset?type=threshold',
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
            }
        }
    });
});