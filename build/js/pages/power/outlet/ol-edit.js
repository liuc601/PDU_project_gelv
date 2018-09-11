define(function (require) {
    var Vue = require('vue');
    var $ = require('jquery');
    var layer = require('layer');
    var DataTable = require('datatable');
    var VueFormGenerator = require('vue-form');

    require('components/switch');
    require('components/form-action');
    require('components/line-chart');
    require('components/status-bar');

    Vue.use(VueFormGenerator);

    var mixin = {
        data: function () {
            return {
                fields: [{
                        name: '__checkbox:checkbox',
                        titleClass: 'text-center',
                        dataClass: 'text-center',
                        /* onChanged(){
                            console.log("onchange");
                        } */
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
                            //obj.unit = getFieldUnit;
                        }
                    },
                    {
                        //name: 'lowAlarm',
                        name: '__component:inline-text:lowAlarm',
                        title: 'Low Alarm',
                        __normalize: function (obj) {
                            //obj.unit = getFieldUnit;
                        }
                    },
                    {
                        //name: 'lowWarning',
                        name: '__component:inline-text:lowWarning',
                        title: 'Low Warning',
                        __normalize: function (obj) {
                            //obj.unit = getFieldUnit;
                        }
                    },
                    {
                        //name: 'highWarning',
                        name: '__component:inline-text:highWarning',
                        title: 'High Warning',
                        __normalize: function (obj) {
                            //obj.unit = getFieldUnit;
                        }
                    },
                    {
                        //name: 'highAlarm',
                        name: '__component:inline-text:highAlarm',
                        title: 'High Alarm',
                        __normalize: function (obj) {
                            //obj.unit = getFieldUnit;
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
    var mixin2 = {
        data: function () {
            return {
                fields: [{
                        name: 'id',
                        title: 'ID',
                    },
                    {
                        name: 'showType',
                        title: 'Sensor Type'
                    },
                    {
                        name: 'hysteresis',
                        title: 'Hysteresis',
                    },
                    {
                        name: 'lowAlarm',
                        title: 'Low Alarm',
                    },
                    {
                        name: 'lowWarning',
                        title: 'Low Warning',
                    },
                    {
                        name: 'highWarning',
                        title: 'High Warning',
                    },
                    {
                        name: 'highAlarm',
                        title: 'High Alarm',
                    },
                    {
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
        template: require('text!./ol-edit.html'),
        components: {
            'datatable': DataTable(mixin),
            'datatable2': DataTable(mixin2),
            'ol-status': require('pages/power/outlet/ol-status'),
        },
        props: {
            outlet: {
                type: Object,
                require: true,
            }
        },
        data: function () {
            return {
                model: { //详情页的数据model
                    locked: false
                },
                schema: {
                    groups: [{
                        legend: 'Outlet information',
                        fields: [
                            /*{
                                                        type: "switch",
                                                        label: 'Action',
                                                        model: 'state',
                                                        textOn: "On",
                                                        textOff: "Off",
                                                        valueOn: "On",
                                                        valueOff: "Off",
                                                        //当点击开关切换的时候，向后台传输开关状态Action 
                                                        onChanged: function () {
                                                            var type = this.model.state.toLowerCase();
                                                            var r;

                                                            if (this.model.locked) {//如果是被锁定的状态，弹出提示窗
                                                                layer.msg("No permission");
                                                                if(type == 'on') {
                                                                    this.model.state = 'Off';
                                                                } else {
                                                                    this.model.state = 'On';
                                                                }
                                                                return
                                                            }
                                                            
                                                            if(type == 'on') {
                                                                r = confirm("Confirm to On?");
                                                                if(r != true)
                                                                {
                                                                    this.model.state = 'Off';
                                                                    return;
                                                                }
                                                            } else {
                                                                r = confirm("Confirm to Off?");
                                                                if(r != true)
                                                                {
                                                                    this.model.state = 'On';
                                                                    return;
                                                                }
                                                            }


                                                            var layerTime = layer.load(2, {
                                                                shade: [0.1, '#fff'] //0.1透明度的白色背景
                                                            });

                                                            $.ajax({
                                                                type: 'post',
                                                                url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=' + type,
                                                                data: JSON.stringify([{ id: this.model.id }]),
                                                                contentType: 'application/json',
                                                                success: function (response) {
                                                                    layer.close(layerTime);
                                                                }
                                                            })
                                                        }

                                                    }, {
                                                        type: "label",
                                                        label: 'State',
                                                        model: 'state',
                                                    }, {
                                                        type: "label",
                                                        label: 'Voltage',
                                                        model: 'voltage',
                                                    }, {
                                                        type: "label",
                                                        label: 'Frequency',
                                                        model: 'frequency',
                                                    }, {
                                                        type: "label",
                                                        label: 'Power Factor',
                                                        model: 'powerFactor',
                                                    }, {
                                                        type: "label",
                                                        label: 'Active Energy',
                                                        model: 'activeEnergy',
                                                    }, {
                                                        type: "label",
                                                        label: 'Cycle',
                                                        buttons: [{
                                                                classes: "btn-location",
                                                                label: "Cycle",
                                                                onclick: function (model) {
                                                                    if (this.model.locked) {//如果是被锁定的状态，弹出提示窗
                                                                        layer.msg("No permission");
                                                                        return
                                                                    }

                                                                    var layerTime = layer.load(2, {
                                                                        shade: [0.1, '#fff'] //0.1透明度的白色背景
                                                                    });
                                                                    $.ajax({
                                                                        type: 'post',
                                                                        url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=cycle',
                                                                        data: JSON.stringify([{ id: this.model.id }]),
                                                                        contentType: 'application/json',
                                                                        success: function (response) {
                                                                            layer.close(layerTime);
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        ]
                                                    }, */
                            {
                                type: "label",
                                label: 'Outlet ID',
                                model: 'id',
                            }, {
                                type: "label",
                                label: 'Socket Type',
                                model: 'showType',
                            }, {
                                type: "label",
                                label: 'Over current protector',
                                model: 'ocp',
                            }, {
                                type: "label",
                                label: 'Phase',
                                model: 'phase',
                            }, {
                                type: "label",
                                label: 'Inlet',
                                model: 'inlet',
                            }
                        ]
                    }, {
                        legend: 'Outlet settings',
                        fields: [{
                            type: "switch",
                            label: 'Locked / No Controll',
                            model: 'locked',
                            textOn: "On",
                            textOff: "Off",
                            valueOn: true,
                            valueOff: false,
                            /* 当点击开关切换的时候，向后台立即传输Lock状态 */
                            onChanged: function () {
                                var type = this.model.locked;
                                var layerTime = layer.load(2, {
                                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                                });
                                $.ajax({
                                    type: 'post',
                                    url: '/cgi-bin/luci/api/v1/outlet/ctrl?lock=' + type,
                                    data: JSON.stringify([{
                                        id: this.model.id
                                    }]),
                                    contentType: 'application/json',
                                    success: function (response) {
                                        layer.close(layerTime);
                                    }
                                })
                            },
                            visible: function (model) {
                                return model && model.accessCtrl == 1;
                            },
                        }, {
                            type: "input",
                            inputType: 'text',
                            label: 'Name',
                            model: 'name',
                        }, {
                            type: "input",
                            inputType: 'text',
                            label: 'Extra On Delay(sec)',
                            model: 'delay',
                        }, {
                            type: 'select',
                            label: 'Wake Up State',
                            model: 'wakeupState',
                            values: [{
                                    name: 'LAST',
                                    value: 2
                                },
                                {
                                    name: 'ON',
                                    value: 0
                                },
                                {
                                    name: 'OFF',
                                    value: 1
                                }
                            ]
                        }]
                    }]
                },
                infoSchema: {
                    groups: [{
                        fields: [{
                            type: "switch",
                            label: 'Action',
                            model: 'state',
                            textOn: "On",
                            textOff: "Off",
                            valueOn: "On",
                            valueOff: "Off",
                            visible: function (model) {
                                return model && model.accessCtrl == 1;
                            },
                            /* 当点击开关切换的时候，向后台传输开关状态Action */
                            onChanged: function () {
                                var type = this.model.state.toLowerCase();
                                var r;

                                if (this.model.locked) { //如果是被锁定的状态，弹出提示窗
                                    layer.msg("No permission");
                                    if (type == 'on') {
                                        this.model.state = 'Off';
                                    } else {
                                        this.model.state = 'On';
                                    }
                                    return
                                }

                                if (type == 'on') {
                                    r = confirm("Confirm to On?");
                                    if (r != true) {
                                        this.model.state = 'Off';
                                        return;
                                    }
                                } else {
                                    r = confirm("Confirm to Off?");
                                    if (r != true) {
                                        this.model.state = 'On';
                                        return;
                                    }
                                }


                                var layerTime = layer.load(2, {
                                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                                });

                                $.ajax({
                                    type: 'post',
                                    url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=' + type,
                                    data: JSON.stringify([{
                                        id: this.model.id
                                    }]),
                                    contentType: 'application/json',
                                    success: function (response) {
                                        layer.close(layerTime);
                                    }
                                })
                            },
                            buttons: [{
                                classes: "btn-location",
                                label: "Cycle",
                                onclick: function (model) {
                                    if (this.model.locked) { //如果是被锁定的状态，弹出提示窗
                                        layer.msg("No permission");
                                        return
                                    }

                                    var layerTime = layer.load(2, {
                                        shade: [0.1, '#fff'] //0.1透明度的白色背景
                                    });
                                    $.ajax({
                                        type: 'post',
                                        url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=cycle',
                                        data: JSON.stringify([{
                                            id: this.model.id
                                        }]),
                                        contentType: 'application/json',
                                        success: function (response) {
                                            layer.close(layerTime);
                                        }
                                    })
                                }
                            }],

                        }, {
                            type: "label",
                            label: 'State',
                            model: 'state',
                        }, {
                            type: "label",
                            label: 'Voltage',
                            model: 'voltage',
                        }, {
                            type: "label",
                            label: 'Frequency',
                            model: 'frequency',
                        }, {
                            type: "label",
                            label: 'Power Factor',
                            model: 'powerFactor',
                        }, {
                            type: "label",
                            label: 'Active Energy',
                            model: 'activeEnergy',
                        }, /* {
                            type: "label",
                            label: 'Cycle',
                            buttons: [{
                                classes: "btn-location",
                                label: "Cycle",
                                onclick: function (model) {
                                    if (this.model.locked) { //如果是被锁定的状态，弹出提示窗
                                        layer.msg("No permission");
                                        return
                                    }

                                    var layerTime = layer.load(2, {
                                        shade: [0.1, '#fff'] //0.1透明度的白色背景
                                    });
                                    $.ajax({
                                        type: 'post',
                                        url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=cycle',
                                        data: JSON.stringify([{
                                            id: this.model.id
                                        }]),
                                        contentType: 'application/json',
                                        success: function (response) {
                                            layer.close(layerTime);
                                        }
                                    })
                                }
                            }],
                            visible: function (model) {
                                return model && model.accessCtrl == 1;
                            },
                        }, */ {
                            type: "reset-btn",
                            label: 'c',
                            style: "display:none;",
                            buttons: [{
                                classes: "btn-primary",
                                label: "Reset Energy",
                                onclick: function (model) {
                                    // layer.msg("重置按钮");
                                    // return;
                                    var layerTime = layer.load(2, {
                                        shade: [0.1, '#fff'] //0.1透明度的白色背景
                                    });
                                    $.ajax({
                                        type: 'post',
                                        url: '/cgi-bin/luci/api/v1/outlet/reset?type=activeEnergy&id=' + this.model.id,
                                        // data: JSON.stringify([{ id: this.model.id }]),
                                        contentType: 'application/json',
                                        success: function (response) {
                                            layer.close(layerTime);
                                            layer.msg("Reset Energy Success");
                                        }
                                    })
                                }
                            }],
                            visible: function (model) {
                                return model && model.accessCtrl == 1;
                            },
                        }]
                    }]
                },
                chartModel: {
                    type: 'activePower'
                },
                chartData: {
                    label: 'Active Power',
                    time: [],
                    value: []
                },
                chartOptions: {
                    responsive: true,
                    // responsive: false,
                    // height:300,
                    maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks:{}
                            }]
                        }
                },
                timer: null,
                choiseData: [],
                threshDatas: [],
                editData: [],
                eStatus: [],
                wakeupStateList: [{
                        name: 'ON',
                        value: 0
                    },
                    {
                        name: 'OFF',
                        value: 1
                    },
                    {
                        name: 'LAST',
                        value: 2
                    },
                ],
                selectValue: [{
                        id: 'activePower',
                        name: 'Active Power'
                    },
                    {
                        id: 'apparentPower',
                        name: 'Apparent Power'
                    },
                    {
                        id: 'current',
                        name: 'Current'
                    },
                    {
                        id: 'voltage',
                        name: 'Voltage'
                    },
                ],
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
            };
        },
        computed: {
            chart: function () {
                return {
                    options: this.chartOptions,
                    labels: this.chartData.time,
                    datasets: [{
                        label: this.chartData.label,
                        backgroundColor: '#f87979',
                        data: this.chartData.value
                    }]
                }
            },
            chartSchema: function () {
                return {
                    fields: [{
                        type: 'select',
                        label: 'type',
                        model: 'type',
                        values: this.selectValue,
                        onChanged: function () {
                            $.get('/cgi-bin/luci/api/v1/outlet/history?type=' + this.chartModel.type + '&id=' + this.outlet.id).success(function (response) {
                                var types = this.chartModel.type;
                                var max = response.getMaxValue("value");
                                if (max > 1) {
                                    if (!!~types.indexOf('activePower') || !!~types.indexOf('apparentPower') || !!~types.indexOf('current')) {
                                        this.chartOptions.scales.yAxes[0].ticks = {
                                            beginAtZero: true,
                                            max: parseInt(max * 1.25),
                                            min: 0,
                                        };
                                    } else if (!!~types.indexOf('voltage')) {
                                        this.chartOptions.scales.yAxes[0].ticks = {
                                            beginAtZero: true,
                                            max: parseInt(max * 2),
                                            min: 0,
                                        };
                                    }
                                }
                                this.chartData.time = [];
                                this.chartData.value = [];
                                this.chartData.label = this.selectValue.find(function (item) {
                                    return item.id === this.chartModel.type
                                }.bind(this))['name'];
                                response.forEach(function (item) {
                                    this.chartData.time.push(item.time);
                                    this.chartData.value.push(item.value);
                                }.bind(this))
                            }.bind(this))
                        }.bind(this)
                    }]
                }
            },
        },
        mounted: function () {
            this.clearSwitchControlLabel(); //消除switch按钮的事件区域过大的问题
            clearInterval(this.timer);
            this.init();
            //this.timer = setInterval(this.getHistoryData, 3000);//两分钟更新一次
            this.timer = setInterval(function () {
                this.getOutletStatus();
                this.getHistoryData();
            }.bind(this), 3000);
        },
        destroyed: function () {
            clearInterval(this.timer);
        },
        methods: {
            init: function () { //编辑界面的传感器初始化
                this.getOutletDetail();
                this.getHistoryData();
            },
            onReturn: function () {
                this.$emit('exit');
            },
            onCancelClick: function () {
                this.getOutletDetail();
            },
            onApplyClick: function () {
                if (this.$refs["powerOutletsEdit"].errDataArr.length != 0) {
                    layer.msg("There are incorrect values in the table");
                    return;
                }
                var data = {};
                data.delay = parseInt(this.model.delay);
                data.name = this.model.name;
                data.locked = this.model.locked;
                data.wakeupState = this.model.wakeupState.value;
                // if (data.wakeupState.name == 'ON') {
                //     data.wakeupState = 0
                // }
                // if (data.wakeupState.name == 'OFF') {
                //     data.wakeupState = 1
                // }
                // if (data.wakeupState.name == 'LAST') {
                //     data.wakeupState = 2
                // }
                data.thresholds = [];
                this.editData.forEach(function (item) {
                    this.threshDatas[item.index][item.field] = item.value;
                    this.threshDatas[item.index].isEdit = true;
                }.bind(this))
                this.threshDatas.forEach(function (item) {
                    if (item.isEdit) {
                        if (item.trapNotify == true && item.emailNotify == true) {
                            item.notify = 3;
                        } else if (item.trapNotify == false && item.emailNotify == true) {
                            item.notify = 2;
                        } else if (item.trapNotify == true && item.emailNotify == false) {
                            item.notify = 1;
                        } else if (item.trapNotify == false && item.emailNotify == false) {
                            item.notify = 0;
                        }

                        delete item.trapNotify;
                        delete item.emailNotify;
                        delete item.isEdit;
                        data.thresholds.push(item);
                    }
                }.bind(this))

                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    url: '/cgi-bin/luci/api/v1/outlet?id=' + this.outlet.id,
                    contentType: 'application/json',
                    success: function (response) {
                        this.getOutletDetail();
                    }.bind(this)
                })
            },
            clearSelectedCheckeBox: function () {
                this.$children[2].$refs.vuetable.selectedTo = [];
            },
            resetOutletThresh: function () {
                if (this.choiseData.length == 0) {
                    alert('please choose a threshold');
                    return false;
                }

                var r = confirm("Confirm to Reset?");
                if (r != true)
                    return true;

                //var type = type;
                var data = [];

                this.choiseData.forEach(function (item) {
                    data.push({
                        id: this.threshDatas[item.id - 1].id
                    })
                }.bind(this))

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/outlet/reset?type=threshold&id=' + this.outlet.id,
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (response) {
                        this.choiseData = [];
                        this.clearSelectedCheckeBox(); //清除所有选中的状态
                        this.getOutletDetail();
                    }.bind(this)
                })
            },
            getHistoryData: function () {
                $.get('/cgi-bin/luci/api/v1/outlet/history?type=' + this.chartModel.type + '&id=' + this.outlet.id).success(function (response) {
                    var types = this.chartModel.type;
                    var max = response.getMaxValue("value");
                    if (max > 1) {
                        if (!!~types.indexOf('activePower') || !!~types.indexOf('apparentPower') || !!~types.indexOf('current')) {
                            this.chartOptions.scales.yAxes[0].ticks = {
                                beginAtZero: true,
                                max: parseInt(max * 1.25),
                                min: 0,
                            };
                        } else if (!!~types.indexOf('voltage')) {
                            this.chartOptions.scales.yAxes[0].ticks = {
                                beginAtZero: true,
                                max: parseInt(max * 2),
                                min: 0,
                            };
                        }
                    }
                    this.chartData.time = [];
                    this.chartData.value = [];
                    response.forEach(function (item) {
                        this.chartData.time.push(item.time.substring(14, 19));
                        this.chartData.value.push(item.value);
                    }.bind(this))
                }.bind(this))
            },
            getOutletDetail: function () {
                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });

                $.get('/cgi-bin/luci/api/v1/outlet?id=' + this.outlet.id).success(function (response) {
                    // console.log("编辑详情页返回的数据", response);
                    this.model = response;
                    this.model.voltage = response.voltage + ' V';
                    this.model.frequency = response.frequency + ' Hz';
                    this.model.activeEnergy = response.activeEnergy + ' kWh';
                    this.model.state = this.model.state == '85' ? 'Off' : 'On';
                    this.model.showType = this.model.type;
                    this.model.accessCtrl = this.model.accessCtrl; //对应的是按钮
                    this.model.accessConfig = this.model.accessConfig; //配置输入框
                    this.model.wakeupState = this.wakeupStateList[response.wakeupState];
                    response.thresholds.forEach(function (item) {
                        item.accessCtrl = this.model.accessCtrl; //对应的是按钮
                        item.accessConfig = this.model.accessConfig; //配置输入框
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
                        switch (item.id) {
                            case 1:
                                item.showType = "Current(A)";
                                break;
                            case 2:
                                item.showType = "Voltage(V)";
                                break;
                            case 3:
                                item.showType = "Active Power(kW)";
                                break;
                            case 4:
                                item.showType = "Apparent Power(kVA)";
                                break;
                            case 5:
                                item.showType = "Power Factor(%)";
                                break;
                            case 6:
                                item.showType = "Active Energy(kWh)";
                                break;
                            case 7:
                                item.showType = "Line Frequency(Hz)";
                                break;
                        }
                    }.bind(this))

                    this.eStatus[0] = {
                        title: 'Current',
                        value: response.current,
                        status: response.currentStatus,
                        max: this.model.currentCapacity,
                        prompt: 'Capacity',
                        unit: 'A'
                    }
                    this.eStatus[1] = {
                        title: 'Active Power',
                        value: response.activePower,
                        status: response.activePowerStatus,
                        max: this.model.powerCapacity,
                        prompt: 'Capacity',
                        unit: 'kW'
                    }
                    this.eStatus[2] = {
                        title: 'Apparent Power',
                        value: response.apparentPower,
                        status: response.apparentPowerStatus,
                        max: this.model.powerCapacity,
                        prompt: 'Capacity',
                        unit: 'kVA'
                    }
                    this.threshDatas = [];
                    setTimeout(function () {
                        this.threshDatas = response.thresholds;
                        layer.close(layerTime);
                    }.bind(this));
                }.bind(this));
            },
            getOutletStatus: function () {
                $.get('/cgi-bin/luci/api/v1/outlet/status?id=' + this.outlet.id).success(function (response) {
                    this.eStatus = []

                    this.eStatus[0] = {
                        title: 'Current',
                        value: response.current,
                        status: response.currentStatus,
                        max: this.model.currentCapacity,
                        prompt: 'Capacity',
                        unit: 'A'
                    }
                    this.eStatus[1] = {
                        title: 'Active Power',
                        value: response.activePower,
                        status: response.activePowerStatus,
                        max: this.model.powerCapacity,
                        prompt: 'Capacity',
                        unit: 'kW'
                    }
                    this.eStatus[2] = {
                        title: 'Apparent Power',
                        value: response.apparentPower,
                        status: response.apparentPowerStatus,
                        max: this.model.powerCapacity,
                        prompt: 'Capacity',
                        unit: 'kVA'
                    }
                    //this.model.current = response.current;
                    //this.model.activePower = response.activePower;
                    //this.model.apparentPower = response.apparentPower;
                    this.model.voltage = response.voltage + ' V';
                    this.model.frequency = response.frequency + ' Hz';
                    this.model.activeEnergy = response.activeEnergy + ' kWh';
                }.bind(this))
            }
        }
    });
});