define(function(require) {
    var Vue = require('vue');
    var VueFormGenerator = require('vue-form');

    require('components/x-panel');
    require('components/form-action');

    Vue.use(VueFormGenerator);

    return Vue.extend({
        template: require('text!pages/form.html'),
        data: function() {
            return {
                model: {
                    datetimeSetup: false,
                    outletSwitch: true,
                    portName: 'RS-485',
                    baudRate: { name: "115200", value: 7 },
                    address: 1,
                },
                baudrateList: [
                    { name: "1200", value: 0 }, 
                    { name: "2400", value: 1 },
                    { name: "4800", value: 2 },
                    { name: "9600", value: 3 },
                    { name: "19200", value: 4 },
                    { name: "38400", value: 5 },
                    { name: "57600", value: 6 },
                    { name: "115200", value: 7 },
                ],
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
                    legend: 'Front-Panel permissions',
                    fields: [{
                        type: 'switch',
                        label: 'Outlet Switching',
                        model: 'outletSwitch',
                        textOn: 'Enabled',
                        textOff: 'Disabled',
                        visible: function (model) {
                            if (this.$store.getters.deviceCap.outletTotal == 0)
                                return false;
                            return true;
                        }
                    }, {
                        type: 'switch',
                        label: 'Date/Time Setup',
                        model: 'datetimeSetup',
                        textOn: 'Enabled',
                        textOff: 'Disabled',
                    }]
                }, {
                    legend: 'Configure serial port options',
                    fields: [{
                        type: 'label',
                        label: 'Port Name',
                        model: 'portName',
                    }, {
                        type: 'select',
                        label: 'Baud Rate',
                        model: 'baudRate',
                        values: this.baudrateList,
                        onChanged: function(model) {//当数据变化的时候，向后台请求数据，更新当前的状态
                            console.log(model);
                            // console.log(model.AccessLevel);
                        }
                    }, {
                        type: "input",
                        inputType: "number",
                        label: "Address",
                        model: "address",
                        placeholder: "Address of communication",
                    }]

                }]
            }
          },
        },        
        mounted:function() {
            this.clearSwitchControlLabel();//消除switch按钮的事件区域过大的问题
            this.init();
        },        
        methods: {
            init: function () {
                var layerTime=layer.load(2, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                this.getSystemFrontpanel();
                setTimeout(function() {
                    layer.close(layerTime);
                });                
            }, 
            convertBaudRateValue: function(baudRate) {
                var baudRateValue = { name: "115200", value: 7 };
                switch(baudRate) {
                    case 0:
                        baudRateValue.name = "1200";
                        break;
                    case 1:
                        baudRateValue.name = "2400";
                        break;
                    case 2:
                        baudRateValue.name = "4800";
                        break;
                    case 3:
                        baudRateValue.name = "9600";
                        break;
                    case 4:
                        baudRateValue.name = "19200";
                        break;
                    case 5:
                        baudRateValue.name = "38400";
                        break;
                    case 6:
                        baudRateValue.name = "57600";
                        break;
                    default:
                        baudRateValue.name = "115200";
                        baudRate = 7;
                        break;
                }

                baudRateValue.value = baudRate;

                return baudRateValue;
            },
            getSystemFrontpanel: function() {
                $.get('/cgi-bin/luci/api/v1/system/frontpanel').success(function(response) {
                    this.model.datetimeSetup = response.datetimeSetup;
                    this.model.outletSwitch = response.outletSwitch;
                    this.model.portName = response.portName;
                    this.model.baudRate = this.convertBaudRateValue(response.baudrate);
                    this.model.address = response.address;
                    //this.model.baudRate = response.baudrate;
                    //console.log("response time", response);
                }.bind(this))
            },
            setSystemFrontpanel: function() {
                var data = {
                    datetimeSetup: this.model.datetimeSetup,
                    outletSwitch: this.model.outletSwitch,
                    baudrate: this.model.baudRate.value,
                    address: this.model.address,
                };

                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/cgi-bin/luci/api/v1/system/frontpanel',
                    success:function (response) {
                        // location.reload();
                        this.init();
                        console.log("reload system frontpanel", response);
                    }.bind(this)
                })
            },             
            onApplyClick: function() {
                this.setSystemFrontpanel();
            },
            onCancelClick: function() {
                this.init();
            }
        }
    });
});