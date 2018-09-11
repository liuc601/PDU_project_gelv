define(function (require) {
    var Vue = require('vue');
    var VueFormGenerator = require('vue-form');

    require('components/x-panel');
    require('components/form-action');

    Vue.use(VueFormGenerator);

    function ipv4_addr_verify(addr) { //验证ip地址的合法性
        //var reg = /^(/d{1,2}|1/d/d|2[0-4]/d|25[0-5])(/.(/d{1,2}|1/d/d|2[0-4]/d|25[0-5])){3}$/;
        var exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;  
        if(addr && addr.match(exp))
        {
            return true;
        }
        else 
        {
            return false;
        }
    }

    return Vue.extend({
        template: require('text!pages/form.html'),
        data: function () {
            return {
                model: {
                    status: {
                    },
                    static: {
                    },
                    dhcp: {
                        enable: false,
                        _fqdn: true,
                        fqdn: 'gelu',
                        bootdelay: false,
                        fallback: true,
                        ztp: true,
                    }
                },
                statusModeList: [
                    { name: 'Disabled', value: 0 },
                    { name: 'IPv4 Only', value: 1 },
                    { name: 'Dual IPv6/IPv4', value: 2 }
                ],
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                }
            };
        },
        computed: {
            schema: function () {
                var _this=this;
                return {
                    groups: [
                        {
                            legend: 'Network configuration',
                            fields: [/*{
                                type: 'select',
                                label: 'Network',
                                model: 'status._mode',
                                values: this.statusModeList,
                                onChanged: function (model) {
                                    model.status.mode=model.status._mode.value;
                                    console.log(model);
                                }
                            },*/{
                                type: 'label',
                                label: 'State',
                                model: 'status._state',
                            }, {
                                type: 'label',
                                label: 'Link',
                                model: 'status._link'
                            }, {
                                type: 'label',
                                label: 'Speed',
                                model: 'status._speed',
                                // unit: 'Mbps'
                            }, {
                                type: 'label',
                                label: 'Duplex',
                                model: 'status._duplex'
                            }, {
                                type: 'label',
                                label: 'Negotiation',
                                model: 'status._negotiate'
                            }, {
                                type: 'label',
                                label: 'Ethernet MAC Address',
                                model: 'status.macaddr'
                            }, {
                                type: 'label',
                                label: 'Autocfg IPv6 Address',
                                model: 'status.autoV6Addr'
                            }, {
                                type: 'label',
                                label: 'Stateless DHCPv6 Address',
                                model: 'status.v6addr'
                            }, {
                                type: 'label',
                                label: 'IPv4 Address',
                                model: 'status.v4addr'
                            }, {
                                type: 'label',
                                label: 'IPv4 Subnet Mask',
                                model: 'status.v4mask'
                            }, {
                                type: 'label',
                                label: 'IPv4 Gateway',
                                model: 'status.v4gateway'
                            }, {
                                type: 'label',
                                label: 'Primary DNS',
                                model: 'status.primaryDns'
                            }, {
                                type: 'label',
                                label: 'Secondary DNS',
                                model: 'status.secondaryDns'
                            }]
                        },
                        {
                            legend: 'Configure static IPv4/IPv6 Settings',
                            fields: [{
                                type: 'input',
                                inputType: 'text',
                                label: 'IPv6 Address',
                                model: 'static.v6addr',
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'IPv6 Gateway',
                                model: 'static.v6gateway'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'IPv4 Address',
                                model: 'static.v4addr'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'IPv4 Subnet Mask',
                                model: 'static.v4mask'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'IPv4 Gateway',
                                model: 'static.v4gateway'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'Primary DNS',
                                model: 'static.primaryDns'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'Secondary DNS',
                                model: 'static.secondaryDns'
                            }]
                        },
                        {
                            legend: 'Configure DHCP settings',
                            fields: [{
                                type: 'switch',
                                label: 'DHCP',
                                model: 'status.dhcp',
                                textOn: 'Enabled',
                                textOff: 'Disabled',
                                set:function(model,value){
                                    model.status.dhcp=value;
                                    _this.$nextTick(function(){
                                        //下面switch的显示是根据目前switch的状态进行改变的，dom更新的时候，清除switch的for
                                        _this.clearSwitchControlLabel();
                                    })

                                }
                            }, {
                                type: 'switch',
                                label: 'FQDN',
                                model: 'status._fqdn',
                                textOn: 'Enabled',
                                textOff: 'Disabled',
                                visible: function (model) {
                                    return model && model.status.dhcp === true;
                                }
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: '',
                                model: 'status.fqdn',
                                visible: function (model) {
                                    return model && model.status.dhcp === true && model.status._fqdn === true;
                                }
                            }, {
                                type: 'switch',
                                label: 'Boot Delay',
                                model: 'status.bootdelay',
                                textOn: 'Enabled',
                                textOff: 'Disabled',
                                visible: function (model) {
                                    return model && model.status.dhcp === true;
                                }
                            }, {
                                type: 'switch',
                                label: 'Static Address Fallback',
                                model: 'status.staticFallback',
                                textOn: 'Enabled',
                                textOff: 'Disabled',
                                visible: function (model) {
                                    return model && model.status.dhcp === true;
                                }
                            }, /*{
                                type: 'switch',
                                label: 'Zero Touch Provisioning',
                                model: 'status.ztp',
                                textOn: 'Enabled',
                                textOff: 'Disabled',
                                buttons: [{
                                    classes: 'btn btn-primary btn-sm',
                                    label: 'Reset',
                                    onclick: function (model, field) {
                                        console.log(model);
                                        console.log(field);
                                    }
                                }]
                            }*/]
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

                var _this = this;

                this.getPutNetworkStatus("GET", {}, function (response) {
                    console.log("Status", response);
                    _this.doNetworkStatusData(response);
                    _this.model.status = response;
                });

                this.getPutNetworkStatic("GET", {}, function (response) {
                    console.log("Static", response);
                    _this.doNetworkStaticData(response);
                    _this.model.static = response;
                });

                setTimeout(function(){
                    layer.close(layerTime);
                });
            },
            onApplyClick: function () {
                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                  });
                console.log("又是你这个按钮", this.model.status);
                // return;
                /*
                this.getPutNetworkStatus("PUT", this.model.status, function (response) {
                });
                */
                /*
                if(!ipv4_addr_verify(this.model.static.dns[0])){
                    this.model.static.dns[0] = undefined;
                    this.model.static.dns[1] = undefined;
                } else {
                    if(!ipv4_addr_verify(this.model.static.dns[1])){
                        this.model.static.dns[1] = undefined;
                    }
                }*/
                /*
                this.getPutNetworkStatic("PUT", this.model.static, function (response) {
                });

                this.getPutNetworkDhcpc("PUT", this.model.dhcp, function (response) {
                    layer.close(layerTime);
                    //window.location.reload();
                    this.init();
                });
                */
                this.putNetworkConfig(function (response) {
                    layer.close(layerTime);
                    window.location.reload();
                });
            },
            onCancelClick: function () {
                this.init();
            },
            doNetworkStatusData:function(response) {
                response._mode = this.statusModeList[response.mode];
                switch (response.state) {
                    case 0:
                        response._state = "Static"
                        break;
                    case 1:
                        response._state = "DHCP"
                        break;
                    default:
                        response._state = "UNKNOWN"
                        break;
                }
                switch(response.speed) {
                    case 0:
                        response._speed = "10 Mbps"
                        break;
                    case 1:
                        response._speed = "100 Mbps"
                        break;
                    case 2:
                        response._speed = "1000 Mbps"
                        break;
                }

                switch (response.link) {
                    case 0:
                        response._link = "Down"
                        break;
                    case 1:
                        response._link = "Up"
                        break;
                }
                switch (response.duplex) {
                    case 0:
                        response._duplex = "Full"
                        break;
                    case 1:
                        response._duplex = "Half"
                        break;
                }
                switch (response.negotiate) {
                    case 0:
                        response._negotiate = "Auto"
                        break;
                    case 1:
                        response._negotiate = "Manually"
                        break;
                }

                if(response.state == 1) {
                    response.dhcp = true;
                    if(response.fqdn) {
                        response._fqdn = true;
                    } else {
                        response._fqdn = false;
                    }
                } else {
                    response.dhcp = false;
                }

                if(response.dns) {
                    response.primaryDns = response.dns[0];
                    response.secondaryDns = response.dns[1];
                }
            },
            doNetworkStaticData:function(response) {
                if(response.dns) {
                    response.primaryDns = response.dns[0];
                    response.secondaryDns = response.dns[1];
                }
            },            
            getPutNetworkStatus:function(type, obj, fn) {//
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/network/status',
                    type: type,
                    data: JSON.stringify(obj),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response){
                        fn(response);
                    },
                })
            },
            getPutNetworkStatic:function(type, obj, fn) {
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/network/static',
                    type: type,
                    data: JSON.stringify(obj),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response){
                        fn(response);
                    },
                })
            },
            putNetworkConfig:function(fn) {
                var config = {
                    mode: 0,
                    proto: '',
                    fqdn: '',
                    v4addr: '',
                    v4mask: '',
                    v4gateway: '',
                    v6addr: '',
                    v6gateway: '',
                    v6rtpfx: '',
                    dns: [],
                };

                config.mode = this.model.status.mode;

                if(this.model.status.dhcp) {
                    config.proto = "dhcp";
                    if(this.model.status.fqdn) {
                        config.fqdn = this.model.status.fqdn;
                    } else {
                        config.fqdn = undefined;
                    }
                    config.v6addr = undefined;
                    config.v6gateway = undefined;
                    config.v6rtpfx = undefined;
                    config.v4addr = undefined;
                    config.v4mask = undefined;
                    config.v4gateway = undefined;
                    config.dns = undefined;

                } else {
                    config.proto = "static";

                    config.fqdn = undefined;

                    if(this.model.static.v6addr){
                        config.v6addr = this.model.static.v6addr;
                    } else {
                        config.v6addr = undefined;
                    }

                    if(this.model.static.v6gateway) {
                        config.v6gateway = this.model.static.v6gateway;
                    } else {
                        config.v6gateway = undefined;
                    }

                    config.v6rtpfx = undefined;

                    if(ipv4_addr_verify(this.model.static.v4addr)) {
                        config.v4addr = this.model.static.v4addr;
                    } else {
                        config.v4addr = undefined;
                    }

                    if(ipv4_addr_verify(this.model.static.v4mask)) {
                        config.v4mask = this.model.static.v4mask;
                    } else {
                        config.v4mask = undefined;
                    }

                    if(ipv4_addr_verify(this.model.static.v4gateway)) {
                        config.v4gateway = this.model.static.v4gateway;
                    } else {
                        config.v4gateway = undefined;
                    }   
                    
                    if(ipv4_addr_verify(this.model.static.primaryDns)) {
                        config.dns[0] = this.model.static.primaryDns;
                        if(ipv4_addr_verify(this.model.static.secondaryDns)) {
                            config.dns[1] = this.model.static.secondaryDns;
                        } else {
                            //config.dns[1] = undefined;
                        }
                    } else {
                        if(ipv4_addr_verify(this.model.static.secondaryDns)) {
                            config.dns[0] = this.model.static.secondaryDns;
                            //config.dns[1] = undefined;
                        } else {
                            config.dns = undefined;
                        }
                    }
                }

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/network/config',
                    type: 'PUT',
                    data: JSON.stringify(config),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response){
                        fn(response);
                    },
                })
            },     
        }
    });
});