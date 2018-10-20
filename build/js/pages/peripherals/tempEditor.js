define(function (require) {
    var Vue = require('vue');
    var $ = require('jquery');
    var layer = require('layer');
    var DataTable = require('datatable');
    var VueFormGenerator = require('vue-form');

    require('components/form-action');
    require('components/line-chart');

    Vue.use(VueFormGenerator);

    var mixin = {
        data: function () {
            return {
                fields: [{
                    name: '__checkbox:checkbox',
                    titleClass: 'text-center',
                    dataClass: 'text-center'
                }, {
                    name: 'index',
                    title: 'No.',
                },
                {
                    name: 'typeName',
                    title: 'Sensor Type'
                },
                {
                    //name: 'hysteresis',
                    name: '__component:inline-text:hysteresis',
                    title: 'Hysteresis',
                    __normalize: function (obj) {
                        //obj.unit = "℃";
                    }
                },
                {
                    //name: 'lowAlarm',
                    name: '__component:inline-text:lowAlarm',
                    title: 'Low Alarm',
                    __normalize: function (obj) {
                        //obj.unit = "℃";
                    }
                },
                {
                    //name: 'lowWarning',
                    name: '__component:inline-text:lowWarning',
                    title: 'Low Warning',
                    __normalize: function (obj) {
                        //obj.unit = "℃";
                    }
                },
                {
                    //name: 'highWarning',
                    name: '__component:inline-text:highWarning',
                    title: 'High Warning',
                    __normalize: function (obj) {
                        //obj.unit = "℃";
                    }
                },
                {
                    //name: 'highAlarm',
                    name: '__component:inline-text:highAlarm',
                    title: 'High Alarm',
                    __normalize: function (obj) {
                        //obj.unit = "℃";
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
        template: require('text!./tempEditor.html'),
        components: {
            datatable: DataTable(mixin),
        },
        props: {
            sensor: {
                type: Object,
                require: true,
            }
        },
        data: function () {
            return {
                timer: null,
                tempUnit: '℃',
                fields: [
                    { label: 'Peripherals ID', model: 'id' },
                    { label: 'Type', model: 'type' },
                    { label: 'Model', model: 'model' },
                    { label: 'Serial Number', model: 'serial' },
                    { label: 'Port', model: 'port' },
                ],
                model: {
                    name: "Temp_Sensor_T1",
                    position: "Cabinet top",
                    unit: '',
                },
                schema: {
                    fields: [{
                        type: "input",
                        inputType: "text",
                        placeholder: "Sensor name",
                        label: "Name",
                        model: "name",
                    }, {
                        type: "input",
                        inputType: "text",
                        label: "Position",
                        model: "position",
                        placeholder: "Sensor position",
                    }]
                },
                //阈值表格的数据
                datas: [],
                editData: [],
                choiseData: [],
                /*chart: {
                    labels: ['13:30', '13:40', '13:50', '14:00', '14:10', '14:20', '14:30', '14:40', '14:50', '15:00', '15:10', '15:20', '15:30', '15:40', '15:50', '16:00', '16:10', '16:20', '16:30', '16:40'],
                    datasets: [{
                        label: 'Temperature History',
                        backgroundColor: '#f87979',
                        data: [20, 23, 25, 30, 28, 35, 40, 31, 35, 27, 24, 22, 21, 18, 26, 29, 34, 33, 32, 7]
                    }]
                },*/
                chartData: {
                    label: '',
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
                            ticks: {},
                        }]
                    }
                },
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
                        //label: 'Temperature History',
                        fill:false,
                        label: this.chartData.label,
                        backgroundColor: '#f87979',
                        data: this.chartData.value
                    }]
                }
            }
        },        
        mounted:function() {
            this.init();
            this.timer = setInterval(this.getHistory, 3000);//两分钟更新一次
            // console.log(this);
        },
        destroyed: function () {
            clearInterval(this.timer);
        },
        methods: {
            tempValue: function(cTemp) {
                if (this.$store.getters.deviceCap.tempUnit == 1) {
                    //this.tempUnit = "℉"
                    var value = ((cTemp*9)/5) + 32;
                    return value.toFixed(2);
                }

                return cTemp;
            }, 
            tempValueCel: function(temp) {//转换位摄氏度
                if (this.$store.getters.deviceCap.tempUnit == 1) {
                    var value = 5/9 * (temp - 32);
                    return value.toFixed(2);
                }
                return temp;
            },        
            init: function () {//编辑界面的传感器初始化
                this.choiseData = [];
                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });

                if (this.$store.getters.deviceCap.tempUnit == 1) {
                    this.tempUnit = "℉"
                }

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/sensor?id=' + this.sensor.id,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response)  {
                        //清空数据
                        var data;
    
                        this.model.name = response.name;
                        this.model.position = response.position;

                        data = response;

                        data.index = 1;
                        if (response.type == 1) {//温度
                            this.chartOptions.scales.yAxes[0].ticks = {
                                beginAtZero: false,
                                suggestedMax: 75,
                                suggestedMin: -20,
                            }
                            data.typeName = "Temperature" + "(" + this.tempUnit + ")";
                            data.showType = "Temperature";
                            data.highAlarm = this.tempValue(data.highAlarm);
                            data.highWarning = this.tempValue(data.highWarning);
                            data.hysteresis = this.tempValue(data.hysteresis);
                            data.lowAlarm = this.tempValue(data.lowAlarm);
                            data.lowWarning = this.tempValue(data.lowWarning);
                            //data.unit = "℃";
                            this.chartData.label = "Temperature History";
                        } else if (response.type == 2) {//湿度
                            this.chartOptions.scales.yAxes[0].ticks = {
                                beginAtZero: true,
                                max: 100,
                                min: 0,
                            }
                            data.typeName = "Humidity(%RH)";
                            data.showType = "Humidity(%RH)";
                            //data.unit = "%RH";
                            this.chartData.label = "Humidity History";
                        }

                        switch (response.notify) {
                            case 0:
                                data.trapNotify = false;
                                data.emailNotify = false;
                                break;
                            case 1:
                                data.trapNotify = true;
                                data.emailNotify = false;
                                break;
                            case 2:
                                data.trapNotify = false;
                                data.emailNotify = true;
                                break;
                            case 3:
                                data.trapNotify = true;
                                data.emailNotify = true;
                                break;
                        }                        

                        this.datas = [];
                        setTimeout(function() {
                            this.datas.push(data);
                            this.$refs["sensorConfig"].errDataArr=[];
                            layer.close(layerTime);
                        }.bind(this));

                        this.getHistory();
                    }.bind(this)
                })
            },    
            onPanelClose: function () {
                this.$emit('exit');
            },
            onCancelClick: function () {
                // this.$emit('exit');//不退出，直接在当前的页面刷新
                this.init();
            },
            onApplyClick: function () {
                if(this.$refs["sensorConfig"].errDataArr.length!=0){
                    layer.msg("There are incorrect values in the table");
                    return;
                }
                // this.$emit('exit');
                var data = [];

                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });

                //遍历阈值配置表,可能存在修改的值
                this.editData.forEach(function(item) {
                    this.datas[item.index][item.field] = item.value;
                    this.datas[item.index].isEdit = true;
                }.bind(this))

                data = this.datas[0]; //对传感器来说，阈值表格数据只有一条
                data.name = this.model.name;
                data.position = this.model.position;

                if (data.type == 1) {//对于温度传感器,后台一律是用摄氏度来计算处理
                    data.highAlarm = this.tempValueCel(data.highAlarm);
                    data.highWarning = this.tempValueCel(data.highWarning);
                    data.hysteresis = this.tempValueCel(data.hysteresis);
                    data.lowAlarm = this.tempValueCel(data.lowAlarm);
                    data.lowWarning = this.tempValueCel(data.lowWarning);
                }

                if (data.trapNotify == true && data.emailNotify == true) {
                    data.notify = 3;
                } else if (data.trapNotify == false && data.emailNotify == true) {
                    data.notify = 2;
                } else if (data.trapNotify == true && data.emailNotify == false) {
                    data.notify = 1;
                } else if (data.trapNotify == false && data.emailNotify == false) {
                    data.notify = 0;
                }

                delete data.index;
                delete data.trapNotify;
                delete data.emailNotify;
                delete data.isEdit;
                delete data.typeName;
 
                /*
                this.datas.forEach((item) => {
                    item.name = this.model.name;
                    item.position = this.model.position;

                    if (item.isEdit) {
                        if (item.type == 1) {//对于温度传感器,后台一律是用摄氏度来计算处理
                            item.highAlarm = this.tempValueCel(item.highAlarm);
                            item.highWarning = this.tempValueCel(item.highWarning);
                            item.hysteresis = this.tempValueCel(item.hysteresis);
                            item.lowAlarm = this.tempValueCel(item.lowAlarm);
                            item.lowWarning = this.tempValueCel(item.lowWarning);
                        }

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
                        delete item.typeName;
                    }

                    data.push(item);
                })*/


                //layer.close(layerTime);
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    url: '/cgi-bin/luci/api/v1/sensor',
                    contentType: 'application/json',
                    complete:function (response) {
                        this.editData = [];
                        // this.$emit('exit');
                        //this.init();
                        setTimeout(function() {
                            layer.close(layerTime);
                        });
                        this.init();//设置完成之后，初始化                       
                    }.bind(this)
                })

            },
            clearSelectedCheckeBox:function() {
                this.$children[0].$children[0].$children[2].$children[1].$children[0].$refs.vuetable.selectedTo = [];
            },
            resetSensorThresh:function() {
                if (this.choiseData.length == 0) {
                    alert('please choose a threshold');
                    return false;
                }                

                var r = confirm("Confirm to Reset?");
                if(r != true)
                    return true;

                //var type = type;
                var data = [];

                /*
                this.choiseData.forEach((item) => {
                    data.push({
                        id: this.datas[item.id-1].type
                    })
                })
                */  

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/sensor/reset?type=threshold&id=' + this.sensor.id,
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response) {
                        this.choiseData = [];
                        this.clearSelectedCheckeBox();//清除所有选中的状态
                        this.init();
                    }.bind(this)
                })
            },                       
            refreshChart: function () {
                this.getHistory();
                /*  var charData = {};
 
                 $.extend(charData, this.chart);
 
                 var value = charData.datasets[0].data.shift();
                 charData.datasets[0].data.push(value);
 
                 var label = charData.labels.shift();
                 charData.labels.push(label);
 
                 this.chart = charData;
  */
                /*
                var value = this.chart.datasets[0].data.shift();

                this.chart.datasets[0].data.push(value);

                var label = this.chart.labels.shift();
                var newLabels = [];
                $.extend(true, newLabels, [label], this.chart.labels);

                this.chart.labels = newLabels;

                console.log(newLabels);
                */
                /*
                var label = this.chart.labels.shift();
                var data = this.chart.datasets[0].data.shift();

                this.chart.labels.push(label);
                this.chart.datasets[0].data.push(data);
                */
            },
            onRefreshClick: function () {
                this.refreshChart();
            },
            getHistory: function () {
                $.get('/cgi-bin/luci/api/v1/sensor/history?id=' + this.sensor.id).success(function(response){
                    //this.chart = [];
                    //this.chart = response;
                    //console.log("temp sensor", response);
                    this.chartData.time = []
                    this.chartData.value = []
                    //this.chartData.label = "Humidity History";
                    response.forEach(function(item) {
                        this.chartData.time.push(item.time.substring(14, 19));
                        this.chartData.value.push(item.value);
                    }.bind(this))
                }.bind(this))
            },
            doNotifyData: function () {

            }
        }
    });
});