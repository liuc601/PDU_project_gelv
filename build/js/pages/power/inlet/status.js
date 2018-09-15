define(function (require) {
    var Vue = require('vue');
    var Datatable = require('datatable');
    var VueFormGenerator = require('vue-form');
    var baseConfig = require('baseConfig');
    require('components/x-panel');
    require('components/switch');
    require('components/title-count');
    require('components/form-action');
    require('components/line-chart');

    Vue.use(VueFormGenerator);

    var mixin = {
        data: function () {
            return {
                fields: [{
                        name: 'id',
                        title: 'ID',
                    },
                    {
                        name: 'name',
                        title: 'Phase Name'
                    },
                    {
                        name: 'voltage',
                        title: 'Voltage',
                        callback: 'renderWithUnit',
                        __normalize: function (obj) {
                            obj.unit = 'V';
                        },
                    },
                    {
                        name: 'current',
                        title: 'Current',
                        callback: 'renderWithUnit',
                        __normalize: function (obj) {
                            obj.unit = 'A';
                        },
                    }, {
                        icon: 'fa fa-exclamation-triangle',
                        name: 'activePower',
                        title: 'Active Power',
                        callback: 'renderWithUnit',
                        __normalize: function (obj) {
                            obj.unit = 'kW';
                        }
                    }, {
                        icon: 'fa fa-exclamation-triangle',
                        name: 'apparentPower',
                        title: 'Apparent Power',
                        callback: 'renderWithUnit',
                        __normalize: function (obj) {
                            obj.unit = 'kVA';
                        }
                    }, {
                        name: 'powerFactor',
                        title: 'Power Factor',
                        callback: 'renderWithUnit',
                    }, {
                        name: 'activeEnergy',
                        title: 'Active Energy',
                        callback: 'renderWithUnit',
                        __normalize: function (obj) {
                            obj.unit = 'kWh';
                        }
                    }, {
                        name: 'status',
                        title: 'Status',
                        callback: 'renderStatus'
                    }, {
                        name: '__slot:actions',
                        title: 'Action',
                    }
                ]
            };
        },
        methods: {
            renderStatus: function (value) {
                if (value == 0) {
                    return "<span class='clr-green' style='font'>Normal<span>";
                }

                if (value == 14) {
                    return "<span class='label label-danger'>Low Alarm<span>";
                }

                if (value == 15) {
                    return "<span class='label label-warning'>Low Warning<span>";
                }

                if (value == 16) {
                    return "<span class='label label-warning'>High Warning<span>";
                }

                if (value == 17) {
                    return "<span class='label label-danger'>High Alarm<span>";
                }
            },
            renderWithUnit: function (value, field, item) {
                // console.log("renderWithUnit",value, field, item);
                return this.getStatusColor(item[field.name + "Status"], this.doValueDigit(field.unit, value, item) + ' ' + (field.unit == undefined ? '' : field.unit));
            },
        }
    };

    return Vue.extend({
        template: require('text!./status.html'),
        components: {
            'datatable': Datatable(mixin),
            'line-status': require('pages/power/inlet/line-status')
        },
        data: function () {
            return {
                model: {
                    id: 'I1'
                },
                chartModel: {
                    type: 'activePower'
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
                statusData: {
                    activePower: 0,
                    activePowerStatus: 0,
                    apparentPowerStatus: 0,
                    powerFactorStatus: 0,
                    // activeEnergyStatus: 0,
                    activeEnergyStatus: 77,
                    frequencyStatus: 0,
                    outOfBalanceStatus: 0
                },
                datas: null,
                lines: [{
                    current: '10.3',
                    max: 30,
                    prompt: 'L1-L2',
                    voltage: 210
                }],
                chartData: {
                    label: 'Inlet Active Power',
                    time: [],
                    value: []
                },
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                // suggestedMax: 100,
                                // suggestedMin: -100,
                                // max: 100,
                                // min: 0,
                                // stepSize: 10,
                            }
                        }]
                    }
                },
                schemaSelect: [],
                selectValue: []
            };
        },
        computed: {
            status: function () {
                var _this = this;
                var val = [{
                        title: 'Active Power',
                        // value: this.statusData.activePower,//标记
                        value: this.statusData.activePower, //标记
                        status: this.statusData.activePowerStatus,
                        unit: 'kW',
                        prompt: 'Total Active Power',
                        color: function (row, field) {
                            return _this.doColor(this.status);
                        },
                        getValue: function (row, field) {
                            return _this.doValueDigit(this.unit, this.value, this);
                        }
                    },
                    {
                        title: 'Apparent Power',
                        value: this.statusData.apparentPower,
                        status: this.statusData.apparentPowerStatus,
                        unit: 'kVA',
                        prompt: 'Total Apparent Power',
                        color: function () {
                            return _this.doColor(this.status);
                        },
                        getValue: function (row, field) {
                            return _this.doValueDigit(this.unit, this.value, this);
                        }
                    },
                    {
                        title: 'Power Factor',
                        value: this.statusData.powerFactor,
                        status: this.statusData.powerFactorStatus,
                        prompt: 'Total Power Factor',
                        color: function () {
                            return _this.doColor(this.status);
                        },
                        getValue: function (row, field) {
                            return _this.doValueDigit(this.unit, this.value, this);
                        }
                    },
                    {
                        title: 'Active Energy',
                        value: this.statusData.activeEnergy,
                        status: this.statusData.activeEnergyStatus,
                        unit: 'kWh',
                        prompt: 'Total Power Consumption',
                        color: function () {
                            return _this.doColor(this.status);
                        },
                        getValue: function (row, field) {
                            return _this.doValueDigit(this.unit, this.value, this);
                        }
                    },
                    {
                        title: 'Frequency',
                        value: this.statusData.frequency == undefined ? 0.0 : this.statusData.frequency,
                        status: this.statusData.frequencyStatus,
                        unit: 'Hz',
                        prompt: 'Line Frequency',
                        color: function () {
                            return _this.doColor(this.status);
                        },
                        getValue: function (row, field) {
                            return _this.doValueDigit(this.unit, this.value, this);
                        }
                    }
                ];
                if (this.$store.getters.deviceCap.capability == 0) {
                    var tmp = {
                        title: 'Voltage deviation',
                        value: this.statusData.voltageDeviation == undefined ? 0 : this.statusData.voltageDeviation,
                        status: this.statusData.voltageDeviationStatus,
                        unit: '%',
                        prompt: 'Nominal voltage deviation factor',
                        color: function () {
                            return _this.doColor(this.status);
                        },
                        getValue: function (row, field) {
                            return _this.doValueDigit(this.unit, this.value, this);
                        }
                    };

                    val.push(tmp);

                } else {
                    var tmp = {
                        title: 'Unbalanced Current',
                        value: this.statusData.outOfBalance,
                        status: this.statusData.outOfBalanceStatus,
                        unit: '%',
                        prompt: '3-Phase Unbalanced Current',
                        color: function () {
                            return _this.doColor(this.status);
                        },
                        getValue: function (row, field) {
                            return _this.doValueDigit(this.unit, this.value, this);
                        }
                    };

                    val.push(tmp);
                }
                return val;
            },
            chartSchema: function () {
                return {
                    fields: [{
                        type: 'select',
                        label: 'type',
                        model: 'type',
                        values: this.selectValue,
                        onChanged: function () {
                            //baseConfig.chartLineMaxValue.activePower
                            $.get('/cgi-bin/luci/api/v1/inlet/history?type=' + this.chartModel.type + '&id=' + this.model.id).success(function (response) {
                                var types = this.chartModel.type;
                                //491行有相同的请求
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

                                this.chartData.time = []
                                this.chartData.value = []
                                this.chartData.label = this.selectValue.find(function (item) {
                                    return item.id === this.chartModel.type
                                }.bind(this))['name'];

                                response.forEach(function (item) {
                                    this.chartData.time.push(item.time.substring(14, 19));
                                    this.chartData.value.push(item.value);
                                }.bind(this))
                            }.bind(this))
                        }.bind(this)
                    }]
                }
            },
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
            schema: function () {
                return {
                    fields: [{
                        type: 'select',
                        label: 'Inlet ID',
                        model: 'id',
                        values: this.schemaSelect,
                        onChanged: function () {
                            this.init();
                        }
                    }]
                }
            },
            isFloat: function () {
                return this.lines.length == 1 ? 'none' : 'left';
            }
        },
        mounted: function () {
            this.init();
            this.timer = setInterval(this.init, 3000);
            if (this.$store.state.deviceCap.capability == 6) {
                this.selectValue = [{
                        id: 'activePower',
                        name: 'Inlet Active Power'
                    },
                    {
                        id: 'apparentPower',
                        name: 'Inlet Apparent Power'
                    },
                    {
                        id: 'l1current',
                        name: 'L1 Current'
                    },
                    {
                        id: 'l1voltage',
                        name: 'L1-N Voltage'
                    },
                    {
                        id: 'l2current',
                        name: 'L2 Current'
                    },
                    {
                        id: 'l2voltage',
                        name: 'L2–N Voltage'
                    },
                    {
                        id: 'l3current',
                        name: 'L3 Current'
                    },
                    {
                        id: 'l3voltage',
                        name: 'L3–N Voltage'
                    },
                    {
                        id: 'ncurrent',
                        name: 'N Current'
                    }
                ]
            } else if (this.$store.state.deviceCap.capability == 10) {
                this.selectValue = [{
                        id: 'activePower',
                        name: 'Inlet Active Power'
                    },
                    {
                        id: 'apparentPower',
                        name: 'Inlet Apparent Power'
                    },
                    {
                        id: 'l1current',
                        name: 'L1 Current'
                    },
                    {
                        id: 'l1voltage',
                        name: 'L1-L2 Voltage'
                    },
                    {
                        id: 'l2current',
                        name: 'L2 Current'
                    },
                    {
                        id: 'l2voltage',
                        name: 'L2–L3 Voltage'
                    },
                    {
                        id: 'l3current',
                        name: 'L3 Current'
                    },
                    {
                        id: 'l3voltage',
                        name: 'L3–L1 Voltage'
                    },
                ]
            } else if (this.$store.state.deviceCap.capability == 0) {
                this.selectValue = [{
                        id: 'activePower',
                        name: 'Inlet Active Power'
                    },
                    {
                        id: 'apparentPower',
                        name: 'Inlet Apparent Power'
                    },
                    {
                        id: 'l1current',
                        name: 'Inlet Current'
                    },
                    {
                        id: 'l1voltage',
                        name: 'Inlet Voltage'
                    }
                ]
            }
        },
        beforeDestroy: function () {
            clearInterval(this.timer);
        },
        methods: {
            init: function () {
                var that = this;
                $.get('/cgi-bin/luci/api/v1/inlet/status?id=' + this.model.id).success(function (response) {
                    this.statusData.activeEnergy = response.activeEnergy;
                    this.statusData.activeEnergyStatus = response.activeEnergyStatus;

                    this.statusData.activePower = response.activePower;
                    this.statusData.activePowerStatus = response.activePowerStatus;

                    this.statusData.apparentPower = response.apparentPower;
                    this.statusData.apparentPowerStatus = response.apparentPowerStatus;

                    this.statusData.frequency = response.frequency;
                    this.statusData.frequencyStatus = response.frequencyStatus;

                    if (response.outOfBalance) {
                        this.statusData.outOfBalance = response.outOfBalance;
                        this.statusData.outOfBalanceStatus = response.outOfBalanceStatus;
                    } else if (response.voltageDeviation) {
                        this.statusData.voltageDeviation = response.voltageDeviation;
                        this.statusData.voltageDeviationStatus = response.voltageDeviationStatus;
                    }

                    this.statusData.powerFactor = response.powerFactor;
                    this.statusData.powerFactorStatus = response.powerFactorStatus;

                    this.lines = []
                    for (var i = 0, len = response.lines.length; i < len; i++) {
                        that.lines.push({
                            name: response.lines[i].id,
                            max: response.lines[i].maxCurrent,
                            current: parseFloat(response.lines[i].current).toFixed(2),
                            voltage: parseFloat(response.lines[i].voltage).toFixed(0),
                            status: response.lines[i].currentStatus,
                            prompt: response.lines[i].voltageName
                        })
                    }
                    // console.log(response,that.lines);
                    that.datas = response.phases;
                    that.datas.forEach(function (item) {
                        this.doDataTableNumberDigit(item);
                    }.bind(this))
                }.bind(this))
                $.get('/cgi-bin/luci/api/v1/inlet/all').success(function (response) {
                    this.schemaSelect = [];
                    response.forEach(function (item) {
                        this.schemaSelect.push({
                            id: item.id,
                            name: item.id
                        })
                    }.bind(this))
                }.bind(this))
                $.get('/cgi-bin/luci/api/v1/inlet/history?type=' + this.chartModel.type + '&id=' + this.model.id).success(function (response) {
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
                    this.chartData.time = []
                    this.chartData.value = []
                    response.forEach(function (item) {
                        this.chartData.time.push(item.time.substring(14, 19));
                        this.chartData.value.push(item.value);
                    }.bind(this))
                }.bind(this))
            },
            itemAction: function (data) {
                var r = confirm("Confirm to Reset?");
                if (r == true) {
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: '/cgi-bin/luci/api/v1/inlet/reset?inlet=' + this.model.id + '&phase=' + data.rowData.id + '&type=activeEnergy',
                        contentType: 'application/json',
                        success: function (response) {

                        }
                    })
                }
            },
            doColor: function (status) { //处理颜色
                switch (status) {
                    case 0:
                        return 'green';
                        break;
                    case 14:
                        return 'clr-red';
                        break;
                    case 15:
                        // return 'yellow';
                        return 'clr-yellow';
                        break;
                    case 16:
                        return 'clr-yellow';
                        break;
                    case 17:
                        return 'red';
                        break;
                }
            },
            doDataTableNumberDigit: function (item) {
                item.voltage = parseInt(item.voltage).toFixed(0);
                item.current = parseInt(item.current).toFixed(2);
            }
        }
    });
});