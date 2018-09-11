define(function(require) {
    var Vue = require('vue');
    var VueFormGenerator = require('vue-form');

    require('components/x-panel');
    require('components/form-action');
    require('datetimepicker');

    Vue.use(VueFormGenerator);

    return Vue.extend({
        template: require('text!pages/form.html'),
        data: function() {
            return {
                model: {
                    autoDaylight: false,
                    ntpenabled: true,
                    datetime: new Date(),
                    timezone: '',
                    ntpserver1: 'time1.aliyun.com',
                    ntpserver2: 'time2.aliyun.com',
                },
                timeZones: [],
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                }
            };
        },
        computed: {
            schema: function () {
                return {
                    groups: [{
                        legend: 'Date/Time Settings',
                        fields: [{
                            type: 'select',
                            label: 'Time Zone',
                            model: 'timezone',
                            values: this.timeZones
                        }, {
                            type: "DateTimePicker",
                            label: "Date and Time",
                            model: "datetime",
                            dateTimePickerOptions: {
                                /*http://eonasdan.github.io/bootstrap-datetimepicker/Options/#extraformats*/
                                format: "YYYY-MM-DD HH:mm:ss",
                                focusOnShow: false,
                                keepOpen: false,
                                showTodayButton: true,
                                showClose: true
                            }
                        }, {
                            type: 'switch',
                            label: 'Auto Daylight Saving Time Adjustment',
                            model: 'autoDaylight',
                            textOn: 'Enabled',
                            textOff: 'Disabled',
                        }, {
                            type: 'switch',
                            label: 'Synchronize with NTP Server',
                            model: 'ntpenabled',
                            textOn: 'Enabled',
                            textOff: 'Disabled',
                        }]
                    }, {
                        legend: 'NTP Server Settings',
                        fields: [{
                            type: 'input',
                            inputType: "text",
                            label: 'Primary Host',
                            model: 'ntpserver1',
                        }, {
                            type: 'input',
                            inputType: "text",
                            label: 'Secondary Host',
                            model: 'ntpserver2',
                        }]
                    }]
                }
            }
        },        
        mounted:function() {
            this.clearSwitchControlLabel();//消除switch按钮的事件区域过大的问题
            this.init();
            //this.timer = setInterval(function () {
            //    that.getSystemTime();
            //}, 3000);
        },        
        methods: {
            init: function () {
                var layerTime=layer.load(2, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                this.getSystemTime();
                setTimeout(function(){
                    layer.close(layerTime);
                }.bind(this));                
            }, 
            getSystemTime: function() {
                $.get('/cgi-bin/luci/api/v1/system/time').success(function(response) {
                    this.model.datetime = response.time;
                    this.model.timezone = response.timezone;
                    var timeZones = response.timeZones;
                    timeZones.forEach(function(item){
                        this.timeZones.push({
                            name: item.text,
                            id: item.value
                        })
                    }.bind(this))
                    this.model.ntpenabled = response.ntpenabled;
                    this.model.ntpserver1 = response.ntpserver1;
                    this.model.ntpserver2 = response.ntpserver2;
                    //console.log("response time", response);
                }.bind(this))
            },
            timestampToTime: function(timestamp) {
                if(timestamp) {
                    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                    Y = date.getFullYear() + '-';
                    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    D = date.getDate() + ' ';
                    h = date.getHours() + ':';
                    m = date.getMinutes() + ':';
                    s = date.getSeconds();
                    return Y+M+D+h+m+s;
                }

                return undefined;
            },            
            setSystemTime: function() {
                var data = {
                    timezone: this.model.timezone,
                    time: this.timestampToTime(this.model.datetime),//this.model.datetime/1000,
                    ntpenabled: this.model.ntpenabled,
                    ntpserver1: this.model.ntpserver1,
                    ntpserver2: this.model.ntpserver2
                };

                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/cgi-bin/luci/api/v1/system/time',
                    success:function (response) {
                        // location.reload();
                        this.init();
                        console.log("reload time", response);
                    }.bind(this)
                })
            },      
            onApplyClick: function() {
                this.setSystemTime();
            },
            onCancelClick: function() {
                this.init();
            }
        }
    });
});