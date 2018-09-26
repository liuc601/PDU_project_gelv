define(function (require) {
    var Vue = require('vue');
    var VueFormGenerator = require('vue-form');
    var Datatable = require('datatable');
    require('components/x-panel');
    require('components/title-count');
    require('components/status-table');
    require('components/line-chart');
    require('pages/overview/ov-status-bar');
    require('components/form-action');
    require('components/dialog');
    Vue.use(VueFormGenerator);

    function sensor_unit(row, field) {
        var pattern = new RegExp('^T.*');

        if (pattern.test(row.id)) {
            return '℃';
        }
        return "%";
    }
    var mixin = {
        data: function () {
            return {
                fields: [{
                        name: 'event',
                        title: 'Event',
                    },
                    {
                        name: 'value',
                        title: 'Value'
                    },
                    {
                        name: 'status',
                        title: 'Status',
                        callback: 'renderStatusColor'
                    },
                    {
                        name: '__slot:actions',
                        title: 'Action',
                    }
                ]
            };
        },
        methods: {
            renderStatusColor: function (value) {
                if (value == "Normal") {
                    return "<span class='clr-green' style='font'>Normal<span>";
                }

                if (value == "Low Alarm") {
                    return "<span class='label label-danger'>Low Alarm<span>";
                }

                if (value == "Low Warning") {
                    return "<span class='label label-warning'>Low Warning<span>";
                }

                if (value == "High Warning") {
                    return "<span class='label label-warning'>High Warning<span>";
                }

                if (value == "High Alarm") {
                    return "<span class='label label-danger'>High Alarm<span>";
                }
                return value;
            },
        }
    };
    var vueData = Vue.extend({
        template: require('text!./overview.html'),
        components: {
            'ov-sysinfo': function (resolve) {
                require(['pages/overview/ov-sysinfo'], resolve);
            },
            'datatable': Datatable(mixin)
        },
        data: function () {
            return {
                chartOptions: {
                    responsive: true,
                    // responsive: false,
                    // height:300,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: 100,
                                min: 0,
                                stepSize: 10,
                            },
                        }]
                    }
                },
                chartData: {
                    time: [],
                    value: []
                },
                subtitle: '',
                model: {},
                schema4: {
                    groups: [{
                        fields: [{
                            type: 'label',
                            label: 'State',
                            model: 'state',
                        }, {
                            type: 'label',
                            label: 'Link',
                            model: 'link'
                        }, {
                            type: 'label',
                            label: 'Speed',
                            model: 'speed',
                            // unit: 'Mbps'
                        }, {
                            type: 'label',
                            label: 'Duplex',
                            model: 'duplex'
                        }, {
                            type: 'label',
                            label: 'Negotiation',
                            model: 'negotiate'
                        }, {
                            type: 'label',
                            label: 'Ethernet MAC Address',
                            model: 'macaddr'
                        }]
                    }]
                },
                schema6: {
                    groups: [{
                        fields: [{
                            type: 'label',
                            label: 'Autocfg IPv6 Address',
                            model: 'autoV6Addr'
                        }, {
                            type: 'label',
                            label: 'Stateless DHCPv6 Address',
                            model: 'v6addr'
                        }, {
                            type: 'label',
                            label: 'IPv4 Address',
                            model: 'v4addr'
                        }, {
                            type: 'label',
                            label: 'IPv4 Subnet Mask',
                            model: 'v4mask'
                        }, {
                            type: 'label',
                            label: 'IPv4 Gateway',
                            model: 'v4gateway'
                        }, {
                            type: 'label',
                            label: 'DNS',
                            model: 'dns'
                        }]
                    }]
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
                titleData: {
                    day: 0,
                    time: 0,
                    uptime: 0,
                    warnings: 0,
                    alerts: 0,
                    capacityUsed: 0,
                    activeEnergy: 0,
                    unutilizedOutlets: 0,
                    activeUser: 0,
                },
                lineFields: [{
                        name: 'id',
                        title: 'ID'
                    },
                    {
                        name: 'name',
                        title: 'Line Name'
                    },
                    {
                        name: 'value',
                        title: 'Current',
                        unit: 'A'
                    },
                    {
                        name: 'maxValue',
                        title: 'Status',
                        unit: 'A',
                        default: 32,
                        component: 'ov-status-bar',
                        style: {
                            width: "50%"
                        },
                        __target: 'value',
                        __color: function (row, field) { //需要有颜色的取值范围
                            switch (row.status) {
                                case 0:
                                    return 'status-bar-green';
                                    break;
                                case 14:
                                    return 'status-bar-red';
                                    break;
                                case 15:
                                    return 'status-bar-yellow';
                                    break;
                                case 16:
                                    return 'status-bar-yellow';
                                    break;
                                case 17:
                                    return 'status-bar-red';
                                    break;
                            }
                        }
                    }
                ],
                lines: [],
                sensorFields: [{
                        name: 'id',
                        title: 'ID'
                    },
                    {
                        name: 'name',
                        title: 'Sensor Name'
                    },
                    {
                        name: 'value',
                        title: 'Temperature/Humidity',
                        unit: sensor_unit
                    },
                    {
                        name: 'maxValue',
                        title: 'Status',
                        unit: sensor_unit,
                        component: 'ov-status-bar',
                        style: {
                            width: "40%"
                        },
                        __target: 'value',
                        __color: function (row, field) {
                            if (row.type == 2) {
                                if (row.status == 0) {
                                    return 'status-bar-green';
                                }
                                if (row.status == 7) {
                                    return 'progress-bar-gray'
                                }
                                if (row.status == 14) {
                                    return 'status-bar-red';
                                }
                                if (row.status == 15) {
                                    return 'status-bar-yellow';
                                }
                                if (row.status == 16) {
                                    return 'status-bar-blue';
                                }
                                if (row.status == 17) {
                                    return 'status-bar-purple';
                                }
                            }
                            if (row.type == 1) {
                                if (row.status == 0) {
                                    return 'status-bar-green';
                                }
                                if (row.status == 7) {
                                    return 'progress-bar-gray'
                                }
                                if (row.status == 14) {
                                    return 'status-bar-purple';
                                }
                                if (row.status == 15) {
                                    return 'status-bar-blue';
                                }
                                if (row.status == 16) {
                                    return 'status-bar-yellow';
                                }
                                if (row.status == 17) {
                                    return 'status-bar-red';
                                }
                            }
                            return 'status-bar-green';
                        }
                    }
                ],
                sensors: [{
                        id: 'T1',
                        name: 'Temp_Sensor_T1',
                        value: '25.2',
                        maxValue: 60
                    },
                    {
                        id: 'H1',
                        name: 'Humid_Sensor_H1',
                        value: '62',
                        maxValue: 100
                    },
                    {
                        id: 'T2',
                        name: 'Temp_Sensor_T2',
                        value: '42.0',
                        maxValue: 60
                    },
                    {
                        id: 'H2',
                        name: 'Humid_Sensor_H2',
                        value: '95',
                        maxValue: 100
                    }
                ],
                timer: null,
                timer_2: null,
                alternateUpDataFlag: false,
                showDialog: false,
                alertDatas: [], //告警的数据
            };
        },
        computed: {
            titles: function () {
                var _this = this;
                return [{
                    icon: 'fa fa-clock-o',
                    title: 'Uptime',
                    value: this.titleData.day,
                    unit: 'Days',
                    router: "/config/system/about",
                    prompt: this.titleData.time,
                    color: function (type, value) {
                        if (type === 'normal')
                            return 'green';
                    },
                    getValue: function (row, field) {
                        return _this.doValueDigit(this.unit, this.value, this);
                    }
                }, {
                    icon: 'fa fa-exclamation-triangle',
                    title: 'Total Alerts',
                    value: this.titleData.alerts + this.titleData.warnings,
                    router: "/peripherals/sensors",
                    prompt: 'Current Number of Alerts',
                    color: function (type, value) {
                        if (type === 'add')
                            return;
                        if (this.titleData.alerts > 0)
                            return 'red';

                        if (this.titleData.warnings > 0)
                            return 'orange';

                        return 'green';
                    }.bind(this),
                    getValue: function (row, field) {
                        return _this.doValueDigit(this.unit, this.value, this);
                    },
                    callBack: function (item) {
                        $.get('/cgi-bin/luci/api/v1/overview/alert').success(function (response) {
                            // console.log("弹窗页面有模拟数据", response);
                            _this.alertDatas = _this.processAlertData(response);
                            _this.alertDatas.push({
                                event: "Outlet 07", //(显示的名称),
                                group: "Line", //(用来标识跳转的页面)
                                status: 12, //(标识告警状态)
                                type: "", //(用来添加显示的单位)
                                value: "85" //(根据type来显示对应的值)
                            })
                        }.bind(this))
                        _this.showAlertDialog();
                    }
                }, {
                    icon: 'fa fa-battery-half',
                    title: 'Capacity Used',
                    value: this.titleData.capacityUsed,
                    unit: '%',
                    router: "/power/inlet/status",
                    prompt: 'Current Capacity Used',
                    color: function (type, value) {
                        if (type === 'add')
                            return;
                        if (value < 70)
                            return 'green';
                        if (value < 80)
                            return 'orange';
                        return 'red';
                    }.bind(this),
                    getValue: function (row, field) {
                        return _this.doValueDigit(this.unit, this.value, this);
                    }
                }, {
                    icon: 'fa fa-bolt',
                    title: 'Active Energy',
                    value: this.titleData.activeEnergy,
                    unit: 'kWh',
                    router: "/power/inlet/status",
                    prompt: 'Total Power Consumption',
                    color: function (type, value) {
                        if (type === 'add')
                            return;
                        return 'green';
                    },
                    getValue: function (row, field) {
                        return _this.doValueDigit(this.unit, this.value, this);
                    }
                }, {
                    icon: 'fa fa-toggle-off',
                    title: 'Unutilized Outlets',
                    value: this.titleData.unutilizedOutlets,
                    router: "/power/outlet/status",
                    prompt: 'Number of Outlets Off',
                    color: function (type, value) {
                        if (type === 'add')
                            return;
                        if (this.titleData.unutilizedOutlets == 0)
                            return 'gray';
                        return 'green'
                    }.bind(this),
                    getValue: function (row, field) {
                        return _this.doValueDigit(this.unit, this.value, this);
                    }
                }, {
                    icon: 'fa fa-user',
                    title: 'Active Users',
                    value: this.titleData.activeUser,
                    router: "/user/list",
                    prompt: 'Number of Active Users',
                    color: function (type, value) {
                        if (type === 'add')
                            return;
                        return 'green';
                    },
                    getValue: function (row, field) {
                        return _this.doValueDigit(this.unit, this.value, this);
                    }
                }]
            },
            chart: function () {
                return {
                    options: this.chartOptions,
                    labels: this.chartData.time,
                    datasets: [{
                        label: 'Power Utilization',
                        backgroundColor: '#f87979',
                        data: this.chartData.value
                    }]
                }
            }
        },
        mounted: function () {
            this.init();
            this.timer = setInterval(function () {
                this.init();
            }.bind(this), 3000);
        },
        beforeDestroy: function () {
            clearInterval(this.timer);
            clearInterval(this.timer_2);
        },
        methods: {
            init: function () {
                $.get('/cgi-bin/luci/api/v1/overview/lines').success(function (response) {
                    this.lines = [];
                    response.forEach(function (item) {
                        /*
                        if (item.current > item.maxCurrent) {
                            item.maxCurrent = item.current;
                        }*/
                        this.lines.push({
                            id: item.id,
                            name: item.name,
                            maxValue: item.maxCurrent,
                            value: this.toDecimal(item.current, 2),
                            minValue: 0,
                            status: item.status,
                            enable: 1,
                        })
                    }.bind(this))
                }.bind(this))
                $.get('/cgi-bin/luci/api/v1/overview/sensors').success(function (response) {
                    this.sensors = [];
                    response.forEach(function (item) {
                        var valid = 1;
                        if (item.status == 7) {
                            item.minValue = 0;
                            item.value = '--.-';
                            valid = 0;
                        }

                        this.sensors.push({
                            id: item.id,
                            name: item.name,
                            maxValue: item.maxValue,
                            value: item.value,
                            type: item.type,
                            minValue: item.minValue,
                            status: item.status,
                            enable: valid,
                        })
                    }.bind(this))
                }.bind(this))
                /*
                $.get('/cgi-bin/luci/api/v1/overview/netstats').success((response) => {
                    this.model = response;
                })*/
                $.get('/cgi-bin/luci/api/v1/overview/history?type=activePower').success(function (response) {
                    /* 
                    Input Active Power
                    */
                    var min = 100,
                        max = 0;

                    this.chartData.time = [];
                    this.chartData.value = [];
                    response.forEach(function (item) {
                        this.chartData.time.push(item.time.substring(14, 19));
                        this.chartData.value.push(item.percent);
                        max = (max > item.value) ? max : item.value;
                        min = (min < item.value) ? min : item.value;
                    }.bind(this))
                    /*
                    for (var i = 0; i < this.chartData.value.length; i++) {
                        if (this.chartData.value[i] > max) {
                            max = this.chartData.value[i];
                        }
                        if (this.chartData.value[i] < min) {
                            min = this.chartData.value[i]
                        }
                    }
                    */
                    this.subtitle = parseInt(min * 1000) + ' - ' + parseInt(max * 1000);
                }.bind(this))
                $.get('/cgi-bin/luci/api/v1/overview/status').success(function (response) {
                    clearInterval(this.timer_2);
                    // this.titleData = Object.assign({}, response);
                    this.titleData = response;
                    this.getData(response);
                    this.timer_2 = setInterval(function () {
                        // 客户要求overview页面的upTime的更新是每秒，
                        //设置完最新的时间之后开启新的定时器更新每秒的
                        //但是后台传回的时间是每三秒一次，所以会造成时间有时候时快时慢
                        this.upDataTimeOneSec();
                    }.bind(this), 1000);
                }.bind(this))

                this.getNetworkStatus();
            },
            showAlertDialog: function () {
                this.showDialog = true;
            },
            hideAlertDialog: function () {
                this.showDialog = false;
            },
            upDataTimeOneSec: function () { //这个函数用来更新UPtime的时间
                this.titleData.uptime += 1;
                // this.titleData = Object.assign({}, this.titleData);
                this.titleData = $.extend(true, {}, this.titleData);
                // this.titleData =this.titleData;
                this.getData();
            },
            getNetworkStatus: function () {
                $.get('/cgi-bin/luci/api/v1/network/status').success(function (response) {
                    var netstatus = response;
                    switch (response.state) {
                        case 0:
                            response.state = "Static"
                            break;
                        case 1:
                            response.state = "DHCP"
                            break;
                        default:
                            response.state = "UNKNOWN"
                            break;
                    }
                    switch (response.speed) {
                        case 0:
                            response.speed = "10 Mbps"
                            break;
                        case 1:
                            response.speed = "100 Mbps"
                            break;
                        case 2:
                            response.speed = "1000 Mbps"
                            break;
                    }

                    switch (response.link) {
                        case 0:
                            response.link = "Down"
                            break;
                        case 1:
                            response.link = "Up"
                            break;
                    }
                    switch (response.duplex) {
                        case 0:
                            response.duplex = "Full"
                            break;
                        case 1:
                            response.duplex = "Half"
                            break;
                    }
                    switch (response.negotiate) {
                        case 0:
                            response.negotiate = "Auto"
                            break;
                        case 1:
                            response.negotiate = "Manually"
                            break;
                    }

                    if (response.dns) {
                        var dns = response.dns[0];
                        if (response.dns.length == 2)
                            dns = dns + ", " + response.dns[1];
                        response.dns = dns;
                    }

                    this.model = response;
                }.bind(this))
            },
            getData: function (times) { //将获得的秒表数转换为具体的时间
                var date = new Date();
                this.titleData.day = parseInt(this.titleData.uptime / 86400);
                var hour = parseInt((this.titleData.uptime - this.titleData.day * 86400) / 3600);
                var min = parseInt((this.titleData.uptime - this.titleData.day * 86400 - hour * 3600) / 60);
                var seconds = parseInt(this.titleData.uptime - this.titleData.day * 86400 - hour * 3600 - min * 60);
                this.titleData.time = hour + ' hrs ' + min + ' min ' + seconds + ' sec';
                // console.log(this.titleData.uptime,this.titleData.day*86400+hour*3600+min*60+seconds);

            },
            handleItemOfAlert: function (item) {
                switch (item.group) {
                    case "Cord":
                        this.$router.push("/power/inlet/status");
                    case "Line":
                        this.$router.push("/power/inlet/status");
                    case "Phase":
                        this.$router.push("/power/inlet/status");
                        break;
                    case "OCP":
                        this.$router.push("/power/ocp/status");
                        break;
                    case "Outlet":
                        this.$router.push("/power/outlet/status");
                        break;
                    case "Sensor":
                        this.$router.push("/peripherals/sensors");
                        break;

                }
            },
            processAlertData: function (alertData) { //处理告警的数据
                //模拟一波数据
                var d = [{
                        event: "Outlet 02",
                        group: "Phase",
                        status: 12,
                        type: "OcpStatus",
                        value: "85"
                    },
                    {
                        event: "Outlet 04",
                        group: "OCP",
                        status: 14,
                        type: "OutletStatus",
                        value: "170"
                    },
                    {
                        event: "Outlet 05",
                        group: "Outlet",
                        status: 15,
                        type: "Voltage",
                        value: "85"
                    },
                    {
                        event: "Outlet 07",
                        group: "Sensor",
                        status: 17,
                        type: "Active Power",
                        value: "85"
                    },
                ];
                // alertData=d;
                alertData.forEach(function (item, index) {
                    switch (item.status) {
                        case 0:
                            item.status = "Normal";
                            break;
                        case 1:
                            item.status = "Disabled";
                            break;
                        case 12:
                            item.status = "Breaker Tripped";
                            break;
                        case 14:
                            item.status = "Low Alarm";
                            break;
                        case 15:
                            item.status = "Low Warning";
                            break;
                        case 16:
                            item.status = "High Warning";
                            break;
                        case 17:
                            item.status = "High Alarm";
                            break;

                    }
                    switch (item.type) {
                        case "OcpStatus":
                            if (item.value == 85) {
                                item.value = "Opened"
                            } else if (item.value == 170) {
                                item.value = "Closed"
                            }
                            break;
                        case "OutletStatus":
                            if (item.value == 85) {
                                item.value = "Off"
                            } else if (item.value == 170) {
                                item.value = "On"
                            }
                            break;
                        case "Current":
                            item.value = item.value + "A"
                            break;
                        case "Voltage":
                            item.value = item.value + "v"
                            break;
                        case "Active Power":
                            item.value = item.value + "KW"
                            break;
                        case "Apparent Power":
                            item.value = item.value + "kVA"
                            break;
                        case "Active Energy":
                            item.value = item.value + "kWh"
                            break;
                        case "Active Energy":
                            item.value = item.value + "kWh"
                            break;
                    }
                });
                return alertData
            }
        }
    });
    return vueData;
});