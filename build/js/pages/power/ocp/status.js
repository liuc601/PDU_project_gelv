define(function (require) {
    var Vue = require('vue');
    var Datatable = require('datatable');
    var VueFormGenerator = require('vue-form');
    var baseConfig = require('baseConfig');
    require('components/x-panel');
    require('components/form-action');
    require('components/line-chart');
    require('components/status-bar');

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
                        title: 'OCP Name'
                    },
                    {
                        name: 'type',
                        title: 'Type'
                    },
                    {
                        name: 'current',
                        title: 'Current',
                        callback: 'currentRender',
                        __normalize: function (obj) {
                            obj.unit = 'A';
                        },
                    },
                    {
                        // name: '__component:td-usage:maxCurrent',
                        name: '__component:td-usage:currentObj',
                        title: 'Status',
                        callback: 'setStatus',
                        __normalize: function (obj) {
                            var status = obj.status;
                            obj.__bar = {
                                unit: 'A',
                                target: 'current',
                                prompt: true,
                                range: 15
                            };
                            // console.log("这个是要传进去的数据吗",obj);
                        },
                        callback: 'setStatus'
                    },
                    {
                        name: 'outlets',
                        title: 'Protected Outlets'
                    },
                    {
                        name: 'phase',
                        title: 'Phases'
                    },
                    {
                        name: '__component:table-actions',
                        title: 'Action',
                        __normalize: function (obj) {
                            obj.__com = {};
                            obj.__com.showDel = false;
                            obj.__com.itemAction = function () {
                                console.log(1);
                            }
                        },
                        onClick: function () {

                        }
                    }
                ],
            };
        },
        methods: {
            currentRender: function (value, field, item) {
                // console.log(value, field, item);
                return this.getStatusColor(item[field.name + "Status"], this.doValueDigit(field.unit, value, item) + ' A');
                // return value + ' A';
            },
            setStatus: function (value) {
                console.log("设置", value);
            }
        }
    };

    return Vue.extend({
        template: require('text!./status.html'),
        components: {
            'datatable': Datatable(mixin)
        },
        data: function () {
            return {
                datas: [],
                showDetail: false, //默认值为false，表示不显示详情数据
                schema: {
                    fields: [{
                        type: "label",
                        label: 'State',
                        model: 'state',
                    }, {
                        type: "label",
                        label: 'OCP ID',
                        model: 'id',
                    }, {
                        type: "label",
                        label: 'Type',
                        model: 'type',
                    }, {
                        type: "label",
                        label: 'Protected Outlets',
                        model: 'outlets',
                    }, {
                        type: "label",
                        label: 'Phase',
                        model: 'phase',
                    }, {
                        type: "label",
                        label: 'Inlet',
                        model: 'inlet',
                        buttons: [{
                            classes: 'btn btn-primary btn-small',
                            label: 'status',
                            onclick: function (model, field) {
                                this.$router.push("/power/inlet/status");
                            }
                        }],
                    }, {
                        type: 'input',
                        label: 'Name',
                        inputType: 'text',
                        model: 'name',
                    }]
                },
                model: {
                    state: '',
                },
                line: [],
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
                chartData: {
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
                            ticks: {}
                        }]
                    }
                },
            };
        },
        computed: {
            chart: function () {
                return {
                    options: this.chartOptions,
                    labels: this.chartData.time,
                    datasets: [{
                        label: 'Ocp Current',
                        backgroundColor: '#f87979',
                        data: this.chartData.value
                    }]
                }
            },
            percent: function () {
                return (this.line[0].current * 100.0) / this.line[0].max;
            },
            percentage: function () {
                return this.percent + '%';
            },
            color: function () {
                /* if (this.percent > 90)
                     return 'status-bar-red';
                 if (this.percent > 60)
                     return 'status-bar-yellow';

                 return 'status-bar-green';
                 */
                switch (this.line[0].status) {
                    case 0:
                        return 'status-bar-green';

                    case 14:
                        return 'status-bar-red';

                    case 15:
                        return 'status-bar-yellow';

                    case 16:
                        return 'status-bar-yellow';

                    case 17:
                        return 'status-bar-red';

                    default:
                        return 'status-bar-green';
                }
            },
        },
        mounted: function () {
            this.init();
            this.timer = setInterval(this.init, 3000);
        },
        beforeDestroy: function () {
            clearInterval(this.timer);
        },
        watch: {
            showDetail: function (newVal, oldVal) { //估计这边的状态有问题
                if (newVal == true) { //当显示详情的时候，设置每3秒获取一次数字
                    clearInterval(this.timer);
                    this.timer = setInterval(function () {
                        this.getHistory();
                        this.getOcpStatus();
                    }.bind(this), 3000);
                } else { //如果不显示详情数据的话，就设置一个定时器，要干什么？不知道
                    clearInterval(this.timer);
                    this.timer = setInterval(this.init, 3000);
                }
            }
        },
        methods: {
            onCancelClick: function () {
                this.showDetail = false;
            },
            onApplyClick: function () {
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/ocp',
                    type: 'PUT',
                    data: JSON.stringify([{
                        id: this.model.id,
                        name: this.model.name
                    }]),
                    contentType: 'application/json',
                    success: function (response) {
                        this.showDetail = false;
                        this.init();
                    }.bind(this)
                })
            },
            init: function () {
                $.get('/cgi-bin/luci/api/v1/ocp/status').success(function (response) {
                    this.datas = response;
                    this.datas.forEach(function (item, index) {
                        item.currentObj = { //将需要的数据用对象的形式传进来，方便获取和计算
                            max: item.maxCurrent,
                            current: item.current,
                            status: item.currentStatus
                        };
                        /*
                        if (item.type == 0) {
                            item.type = 'FUSE'
                        } else {
                            item.type = 'BREAKER'
                        }*/
                    }.bind(this))
                }.bind(this))
            },
            updateOcpStatus: function (data) {
                this.model = data;
                this.editData = data;
                this.line[0] = {
                    max: this.editData.maxCurrent,
                    current: this.editData.current,
                    voltage: this.editData.current,
                    prompt: 'Current',
                    hint: 'A',
                    title: 'Rating',
                    status: this.model.currentStatus,
                }

                this.model.state = data.state == 85 ? 'Opened' : 'Closed';

                setTimeout(function () { //同时修改标签背景颜色
                    if ($('#state').text() == 'Opened') {
                        $('#state').css({
                            color: '#fff',
                            'background-color': 'red',
                            'padding': '0 5px',
                            'line-height': '22px',
                            'margin-top': '8px',
                            'height': '20px'
                        })
                    } else {
                        $('#state').css({
                            color: '#fff',
                            'background-color': 'green',
                            'padding': '0 5px',
                            'line-height': '22px',
                            'margin-top': '8px',
                            'height': '20px'
                        })
                    }
                });
            },
            getOcpStatus: function () {
                $.get('/cgi-bin/luci/api/v1/ocp/status?id=' + this.editData.id).success(function (response) {
                    //this.editData = response;
                    //this.line[0].current = this.editData.current;
                    //this.line[0].voltage = this.editData.current;
                    this.updateOcpStatus(response);
                }.bind(this))
            },
            getHistory: function () {
                var data = this.editData;
                $.get('/cgi-bin/luci/api/v1/ocp/history?id=' + data.id).success(function (response) {
                    var max = response.getMaxValue("value");
                    if (max > 1) {
                        this.chartOptions.scales.yAxes[0].ticks = {
                            beginAtZero: true,
                            max: max,
                            min: 0,
                            // stepSize: 10,
                        }
                    }else{
                        this.chartOptions.scales.yAxes[0].ticks = {
                            beginAtZero: true,
                            max: 1,
                            min: 0,
                        };
                    }
                    this.chartData.time = []
                    this.chartData.value = []
                    response.forEach(function (item) {
                        this.chartData.time.push(item.time.substring(14, 19));
                        this.chartData.value.push(item.value);
                    }.bind(this))
                }.bind(this))
            },
            editAction: function (data) { //当用户点击edit按钮的时候，调用这个函数，
                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });
                this.line = [];
                this.model = [];
                // this.showDetail = false;
                //this.model = data;
                this.updateOcpStatus(data);
                this.getOcpStatus();
                this.getHistory();
                this.showDetail = true; //当点击的时候，将显示状态修改为true，显示详情页
                setTimeout(function () {
                    layer.close(layerTime);
                });
                /*
                    this.interval = setInterval(() => {
                        this.editInit(data)
                    }, 3000);
                */
            },
            doColor: function (status) { //处理颜色
                switch (status) {
                    case 0:
                        return 'green';
                        break;
                    case 14:
                        return 'red';
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
            }
        }
    });
});