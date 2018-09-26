define(function (require) {
    var Vue = require('vue');
    require('pages/page');
    var layer = require('layer');

    return Vue.extend({
        template: require('text!./sensors.html'),
        components: {
            'th-sensor': function (resolve) {
                require(['pages/peripherals/th-sensor'], resolve);
            },
            'wc-sensor': function (resolve) {
                require(['pages/peripherals/wc-sensor'], resolve);
            },
            'temp-editor': function (resolve) {
                require(['pages/peripherals/tempEditor'], resolve);
            },
        },
        data: function () {
            return {
                editorMode: false,
                sensorEditor: '',
                sensorEditing: null,//每次被点击的时候，将要编辑的传感器数据放在这
                tempUnit: '℃',
                tempRanges: [
                    { value: '0', color: 'green' },
                    { value: '14', color: 'purple' }, //低于下限告警
                    { value: '15', color: 'blue' },   //低于下限预警
                    { value: '16', color: 'yellow' }, //高于上限预警
                    { value: '17', color: 'red' },    //高于上限告警
                ],
                tempSensors: [ ],
                humidUnit: '%RH',
                humidRanges: [
                    { value: '0', color: 'green' },
                    { value: '14', color: 'red' }, //低于下限告警
                    { value: '15', color: 'yellow' },   //低于下限预警
                    { value: '16', color: 'blue' }, //高于上限预警
                    { value: '17', color: 'purple' },    //高于上限告警
                ],
                humidSensors: [
                    {//湿度传感器数据
                        id: 'h1',
                        installed: false,
                        name: 'Humid_Sensor_H1',
                        value: '62',
                        minValue: '0',
                        maxValue: '100',
                        position: 'Cabinet top'
                    }, {
                        id: 'h2',
                        installed: false,
                        name: 'Humid_Sensor_H2',
                        value: '95',
                        minValue: '0',
                        maxValue: '100',
                        position: 'Door'
                    }, {
                        id: 'h3',
                        installed: false,
                        name: 'Humid_Sensor_H3',
                        value: '95',
                        minValue: '0',
                        maxValue: '100',
                        position: 'Bottom'
                    }
                ],
                waterSensors: [
                    {//水浸传感器数据
                        id: 'w1',
                        name: 'Water_sensor_W1',
                        status: 'Warning',
                        position: 'Cabinet top'
                    }
                ],
                contactSensors: [
                    {
                        id: 'c1',
                        name: 'Contact_sensor_C1',
                        status: 'Normal',
                        position: 'Cabinet front'
                    }, {
                        id: 'c2',
                        name: 'Contact_sensor_C2',
                        status: 'Alarm',
                        position: 'Cabinet back'
                    }
                ]
            };
        },
        mounted: function () {
            this.init();
            this.timer = setInterval(this.updateAllStatus, 3000);
        },
        beforeDestroy:function() {
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
            init: function () {//数据初始化
/*                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });*/
                var tempSensors = [];//温度传感器
                var humidSensors = [];//湿度传感器
                var waterSensors = [];//水浸传感器
                var contactSensors = [];//门禁
                if (this.$store.getters.deviceCap.tempUnit == 1) {
                    this.tempUnit = "℉"
                }

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/sensor',
                    type: 'get',
                    dataType: 'json',
                    success: function(response){
                        //清空数据
                        // console.log("all sensor", response);
                        // response[0].status=0
                        // console.log("all sensor", response);
                        // layer.close(layerTime);
                        // return
                        response.forEach(function(item){
                            // item.value=-5;
                            switch (item.type) {
                                case 1://温度
                                    //item.status = this.computedStatus(item);
                                    this.computedStatus(item);
                                    item.unit = this.tempUnit,
                                    item.ranges = this.tempRanges;
                                    item.value = this.tempValue(item.value);
                                    item.minValue = this.tempValue(item.minValue);
                                    item.maxValue = this.tempValue(item.maxValue);
                                    tempSensors.push(item);
                                    break;
                                case 2://湿度
                                    //item.status = this.computedStatus(item);
                                    this.computedStatus(item);
                                    item.unit = this.humidUnit,
                                    item.ranges = this.humidRanges;
                                    humidSensors.push(item);
                                    break;
                                case 3://水浸
                                    item.status = this.computedStatus(item);
                                    //this.computedStatus(item);
                                    waterSensors.push(item);
                                    break;
                                case 4://门禁
                                    item.status = this.computedStatus(item);
                                    //this.computedStatus(item);
                                    contactSensors.push(item);
                                    break;
                            }
                        }.bind(this));
                        
                        this.tempSensors = [];//温度传感器
                        this.humidSensors = [];//湿度传感器
                        this.waterSensors = [];//水浸传感器
                        this.contactSensors = [];//门禁
                        setTimeout(function() {
                            this.tempSensors = tempSensors;//温度传感器
                            this.humidSensors = humidSensors;//湿度传感器
                            this.waterSensors = waterSensors;//水浸传感器
                            this.contactSensors = contactSensors;//门禁
                            //layer.close(layerTime);
                        }.bind(this));
                        
                    }.bind(this)
                })
            },
            computedStatus: function (item) {
                switch (item.status) {
                    case 0://正常
                        item.installed = true;
                        return 'Normal';
                        break;
                    case 7:
                        item.installed = false;
                        return 'Uninstall';
                        break;
                    case 14://低于下限告警
                        item.installed = true;
                        return 'Low Alarm';
                        break;
                    case 15://低于下限预警
                        item.installed = true;
                        return 'Low Warning';
                        // item.status
                        break;
                    case 16://高于上限预警
                        item.installed = true;
                        return 'High Warning';
                        break;
                    case 17://高于上限告警
                        item.installed = true;
                        return 'High Alarm';
                        break;
                    case 255://未安装；
                        item.installed = false;
                        // item.installed = true;//这边之后需要修改
                        return 'Uninstall';
                        break;
                }
            },
            updateAllStatus: function() {
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/sensor/status',
                    type: 'get',
                    dataType: 'json',
                    success: function(response){
                        var tempIndex = 0;
                        var humidIndex = 0;
                        var waterIndex = 0;
                        var ccIndex = 0;
                        //console.log("all sensor", response);
                        response.forEach(function(item) {
                            // item.value=-5;
                            switch (item.type) {
                                case 1://温度
                                    //this.tempSensors[tempIndex].status = this.computedStatus(item);
                                    this.computedStatus(item);
                                    this.tempSensors[tempIndex].value = this.tempValue(item.value);
                                    this.tempSensors[tempIndex].status = item.status;
                                    this.tempSensors[tempIndex].minValue = this.tempValue(item.minValue);
                                    this.tempSensors[tempIndex].maxValue = this.tempValue(item.maxValue);
                                    this.tempSensors[tempIndex].installed = item.installed;
                                    tempIndex++;
                                    break;
                                case 2://湿度
                                    //this.humidSensors[humidIndex].status = this.computedStatus(item);
                                    this.computedStatus(item);
                                    this.humidSensors[humidIndex].value = item.value;
                                    this.humidSensors[humidIndex].status = item.status;
                                    this.humidSensors[humidIndex].installed = item.installed;
                                    this.humidSensors[humidIndex].minValue = item.minValue;
                                    this.humidSensors[humidIndex].maxValue = item.maxValue;
                                    humidIndex++;
                                    break;
                                case 3://水浸
                                    //item.status = this.computedStatus(item);
                                    //waterSensors.push(item);
                                    //this.waterSensors[waterIndex].status = this.computedStatus(item);
                                    this.waterSensors[waterIndex].status = this.computedStatus(item);
                                    this.waterSensors[waterIndex].installed = item.installed;
                                    waterIndex++;
                                    break;
                                case 4://门禁
                                    //item.status = this.computedStatus(item);
                                    //contactSensors.push(item);
                                    //this.contactSensors[ccIndex].status = this.computedStatus(item);
                                    this.contactSensors[ccIndex].status = this.computedStatus(item);
                                    this.contactSensors[ccIndex].installed = item.installed;
                                    ccIndex++;
                                    break;
                            }


                        }.bind(this));
                    }.bind(this)
                })
            }, 
            updateStatus: function() {
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/sensor/status?id=' + this.sensorEditing.id,
                    type: 'get',
                    dataType: 'json',
                    success: function(response) {
                        if(response.status == 7)
                            this.sensorEditing.installed = false;
                        else
                            this.sensorEditing.installed = true;

                        this.sensorEditing.status = response.status;
                        if(this.sensorEditing.type == 1)
                            this.sensorEditing.value = this.tempValue(response.value);
                        else
                            this.sensorEditing.value = response.value;
                    }.bind(this)
                })                
            },               
            onEditorExit: function () {//退出编辑模式
                this.editorMode = false;
                clearInterval(this.timer);
                this.init();
                this.timer = setInterval(this.updateAllStatus, 3000);
            },
            onSensorEdit: function (sensor) {//显示的传感器
                //console.log("editing sensor",sensor);
                clearInterval(this.timer);
                this.sensorEditing = sensor;
                this.sensorEditor = 'temp-editor';
                this.editorMode = true;
                this.timer = setInterval(this.updateStatus, 3000);
            }
        }
    });
});

/* 
    1，重置按钮的需要接口，年后等接口
    2，水浸传感器和接触传感器不需要按钮


*/