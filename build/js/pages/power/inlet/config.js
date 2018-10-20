define(function (require) {
    var Vue = require('vue');
    var Datatable = require('datatable');
    var VueFormGenerator = require('vue-form');
    var layer = require('layer');
    require('components/x-panel');
    require('components/form-action');

    Vue.use(VueFormGenerator);

    function getFieldUnit(row, field) {
        return '';  //temp
        // switch (row.id) {
        switch (row.type+1) {
            case 1:
                return 'kW';
            case 2:
                return 'kVA';
            case 3:
                return '';
            case 4:
                return 'kWh';
            case 5:
                return 'Hz';
            case 6:
                return '%';
            case 7:
                return 'A';
            case 8:
                return 'V';
            case 9:
                return 'A';
            case 10:
                return 'V';
            case 11:
                return 'A';
            case 12:
                return 'V';
        }
        return '';
    }

    var mixin = {
        data: function () {
            return {
                tablename:"power-inlet-config",//将当前的页面名字传入表格组件中，用作判断
                fields: [{
                    name: '__checkbox:checkbox',
                    titleClass: 'text-center',
                    dataClass: 'text-center'
                }, {
                    name: 'id',
                    title: 'ID',
                },
                {
                    name: 'showType',
                    title: 'Sensor Type'
                },
                {
                    //name: 'hysteresis',
                    name: '__component:inline-text:hysteresis',
                    title: 'Hysteresis',
                    __normalize: function (obj) {
                        obj.unit = getFieldUnit;
                    }
                },
                {
                    //name: 'lowAlarm',
                    name: '__component:inline-text:lowAlarm',
                    title: 'Low Alarm',
                    __normalize: function (obj) {
                        obj.unit = getFieldUnit;
                    }
                },
                {
                    //name: 'lowWarning',
                    name: '__component:inline-text:lowWarning',
                    title: 'Low Warning',
                    __normalize: function (obj) {
                        obj.unit = getFieldUnit;
                    }
                },
                {
                    //name: 'highWarning',
                    name: '__component:inline-text:highWarning',
                    title: 'High Warning',
                    __normalize: function (obj) {
                        obj.unit = getFieldUnit;
                    }
                },
                {
                    //name: 'highAlarm',
                    name: '__component:inline-text:highAlarm',
                    title: 'High Alarm',
                    __normalize: function (obj) {
                        obj.unit = getFieldUnit;
                    }
                },
                {
                    //name: 'trapNotify',
                    name: '__component:inline-checkbox:trapNotify',
                    title: 'SNMP Trap<br/>Notifications',
                },
                {
                    //name: 'emailNotify',
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
                model: {
                    id: 'I1',
                    type: 'NEMA 21-30P',
                    name: 'Inlet I1',
                    activeEnergy: '0'
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
                datas: [],
                choiseData: [],
                editData: [],
                InletID: []
            };
        },
        computed: {
            schema: function () {
                return {
                    fields: [{
                        type: 'select',
                        label: 'Inlet ID',
                        model: 'id',
                        values: this.InletID,
                        onChanged: function() {
                            this.init();
                        }.bind(this)
                    }, {
                        type: 'label',
                        label: 'Inlet Type',
                        model: 'type'
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: 'Inlet Name',
                        model: 'name'
                    }, {
                        type: 'label',
                        label: 'Active Energy',
                        model: 'activeEnergy',
                        buttons: [{
                            classes: 'btn btn-primary btn-sm',
                            label: 'Reset',
                            onclick:function () {
                                var that = this;
                                var conf = confirm('Confirm To Reset?');
                                if (conf == true) {
                                    $.ajax({
                                        url: '/cgi-bin/luci/api/v1/inlet/reset?type=activeEnergy&inlet=' + this.model.id,
                                        type: 'post',
                                        dataType: 'json',
                                        contentType: 'application/json',
                                        success: function (response) {
                                            that.model.activeEnergy = '0 Wh';
                                        }
                                    })
                                }
                            }.bind(this)
                        }]
                    }]
                }
            }
        },
        mounted: function () {
            $.get('/cgi-bin/luci/api/v1/inlet/all').success(function(response) {
                response.forEach(function(item) {
                    this.InletID.push({
                        id: item.id,
                        name: item.id
                    })
                }.bind(this))
            }.bind(this))
            this.init();
        },
        methods: {
            onApplyClick: function () {//提交时候的事件
                if(this.$refs["powerInletConfig"].errDataArr.length!=0){
                    layer.msg("There are incorrect values in the table");
                    return;
                }
                var data = {
                    name: '',
                    sensors: []
                };
                this.editData.forEach(function(item) {
                    this.datas[item.index][item.field] = item.value;//parseFloat(item.value);
                    this.datas[item.index].isEdit = true;
                }.bind(this))
                this.datas.forEach(function(item){
                    if (item.isEdit) {
                        delete item.isEdit;
                        data.sensors.push(item);
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
                    delete item.showType;
                }.bind(this))
                data.name = this.model.name;
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    url: '/cgi-bin/luci/api/v1/inlet?id=' + this.model.id,
                    contentType: 'application/json',
                    success:function (response) {
                        this.editData = [];
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
            resetThresh:function() {
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
                        id: this.datas[item.id-1].type
                    })
                }.bind(this))  

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/inlet/reset?type=threshold&inlet=' + this.model.id,
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
            init: function () {
                var layerTime=layer.load(2, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                var cacheData=null;
                this.editData = [];
                this.choiseData = [];
                $.get('/cgi-bin/luci/api/v1/inlet?id=' + this.model.id).success(function(response){
                    var pwr = {};
                    this.model.name = response.name;
                    this.model.type = response.type;
                    pwr.unit = 'Wh';
                    this.model.activeEnergy = this.doValuePower(response.activeEnergy, pwr.unit, pwr) + ' ' + pwr.unit;
                    //this.model.activeEnergy = this.toDecimal(response.activeEnergy, ) + ' kWh';
                    cacheData = response.sensors;
                    cacheData.forEach(function(item) {
                        switch (item.type) {
                            case 0:
                                item.showType = 'Inlet Active Power(kW)'
                                break;
                            case 1:
                                item.showType = 'Inlet Apparent Power(kVA)'
                                break;
                            case 2:
                                item.showType = 'Inlet Power Factor'
                                break;
                            case 3:
                                item.showType = 'Inlet Active Energy(kWh)'
                                break;
                            case 4:
                                item.showType = 'Inlet Line Frequency(Hz)'
                                break;
                            case 5:
                                if (this.$store.state.deviceCap.capability == 6) {
                                    item.showType = 'Inlet Unbalanced Current(%)'
                                } else if (this.$store.state.deviceCap.capability == 0) {
                                    item.showType = ''
                                } else if (this.$store.state.deviceCap.capability == 10) {
                                    item.showType = 'Inlet Unbalanced Current(%)'
                                }
                                break;
                            case 6:
                                if (this.$store.state.deviceCap.capability == 6) {
                                    item.showType = 'L1 Current(A)'
                                } else if (this.$store.state.deviceCap.capability == 0) {
                                    item.showType = 'Inlet Current(A)'
                                } else if (this.$store.state.deviceCap.capability == 10) {
                                    item.showType = 'L1 Current(A)'
                                }
                                break;
                            case 7:
                                if (this.$store.state.deviceCap.capability == 6) {
                                    item.showType = 'L1-N Voltage(V)'
                                } else if (this.$store.state.deviceCap.capability == 0) {
                                    item.showType = 'Inlet Voltage(V)'
                                } else if (this.$store.state.deviceCap.capability == 10) {
                                    item.showType = 'L1-L2 Voltage(V)'
                                }
                                break;
                            case 8:
                                if (this.$store.state.deviceCap.capability == 6) {
                                    item.showType = 'L2 Current(A)'
                                } else if (this.$store.state.deviceCap.capability == 0) {
                                    item.showType = ''
                                } else if (this.$store.state.deviceCap.capability == 10) {
                                    item.showType = 'L2 Current(A)'
                                }
                                break;
                            case 9:
                                if (this.$store.state.deviceCap.capability == 6) {
                                    item.showType = 'L2–N Voltage(V)'
                                } else if (this.$store.state.deviceCap.capability == 0) {
                                    item.showType = ''
                                } else if (this.$store.state.deviceCap.capability == 10) {
                                    item.showType = 'L2–L3 Voltage(V)'
                                }
                                break;
                            case 10:
                                if (this.$store.state.deviceCap.capability == 6) {
                                    item.showType = 'L3 Current(A)'
                                } else if (this.$store.state.deviceCap.capability == 0) {
                                    item.showType = ''
                                } else if (this.$store.state.deviceCap.capability == 10) {
                                    item.showType = 'L3 Current(A)'
                                }
                                break;
                            case 11:
                                if (this.$store.state.deviceCap.capability == 6) {
                                    item.showType = 'L3–N Voltage(V)'
                                } else if (this.$store.state.deviceCap.capability == 0) {
                                    item.showType = ''
                                } else if (this.$store.state.deviceCap.capability == 10) {
                                    item.showType = 'L3–L1 Voltage(V)'
                                }
                                break;
                            case 12:
                                if (this.$store.state.deviceCap.capability == 6) {
                                    item.showType = 'N Current(A)'
                                } else if (this.$store.state.deviceCap.capability == 0) {
                                    item.showType = ''
                                } else if (this.$store.state.deviceCap.capability == 10) {
                                    item.showType = ''
                                }
                                break;
                        }
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
                    }.bind(this));
                    this.datas=[];
                    setTimeout(function() {
                        //当前页面重新请求数据的时候，需要重置错误数组
                        this.$refs["powerInletConfig"].errDataArr=[];
                        this.datas=cacheData;
                        // console.log(this.datas);
                        layer.close(layerTime);
                    }.bind(this));
                }.bind(this))
            }
        }
    });
});