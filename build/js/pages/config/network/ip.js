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
                    config: {
                        v6addr: '',
                        v6gateway: '',
                        v4addr: '',
                        v4mask: '',
                        v4gateway:'',
                        primaryDns: '',
                        secondaryDns: '',
                        dhcp: false,
                        _fqdn: true,
                        fqdn: 'gelu',
                        bootdelay: false,
                        fallback: true,
                        ztp: true,
                    },
                    dhcp: {
                        
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
                                model: 'status.state',
                            }, {
                                type: 'label',
                                label: 'Link',
                                model: 'status.link'
                            }, {
                                type: 'label',
                                label: 'Speed',
                                model: 'status.speed',
                                // unit: 'Mbps'
                            }, {
                                type: 'label',
                                label: 'Duplex',
                                model: 'status.duplex'
                            }, {
                                type: 'label',
                                label: 'Negotiation',
                                model: 'status.negotiate'
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
                                model: 'config.v6addr',
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'IPv6 Gateway',
                                model: 'config.v6gateway'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'IPv4 Address',
                                model: 'config.v4addr'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'IPv4 Subnet Mask',
                                model: 'config.v4mask'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'IPv4 Gateway',
                                model: 'config.v4gateway'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'Primary DNS',
                                model: 'config.primaryDns'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'Secondary DNS',
                                model: 'config.secondaryDns'
                            }]
                        },
                        {
                            legend: 'Configure DHCP settings',
                            fields: [{
                                type: 'switch',
                                label: 'DHCP',
                                model: 'config.dhcp',
                                textOn: 'Enabled',
                                textOff: 'Disabled',
                                set:function(model,value){
                                    model.config.dhcp=value;
                                    _this.$nextTick(function(){
                                        //下面switch的显示是根据目前switch的状态进行改变的，dom更新的时候，清除switch的for
                                        _this.clearSwitchControlLabel();
                                    })

                                }
                            }, {
                                type: 'switch',
                                label: 'FQDN',
                                model: 'config._fqdn',
                                textOn: 'Enabled',
                                textOff: 'Disabled',
                                visible: function (model) {
                                    return model && model.config.dhcp === true;
                                }
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: '',
                                model: 'config.fqdn',
                                visible: function (model) {
                                    return model && model.config.dhcp === true && model.config._fqdn === true;
                                }
                            }, /*{
                                type: 'switch',
                                label: 'Boot Delay',
                                model: 'config.bootdelay',
                                textOn: 'Enabled',
                                textOff: 'Disabled',
                                visible: function (model) {
                                    return model && model.config.dhcp === true;
                                }
                            },*/ {
                                type: 'switch',
                                label: 'Static Address Fallback',
                                model: 'config.fallback',
                                textOn: 'Enabled',
                                textOff: 'Disabled',
                                visible: function (model) {
                                    return model && model.config.dhcp === true;
                                }
                            }, /*{
                                type: 'switch',
                                label: 'Zero Touch Provisioning',
                                model: 'config.ztp',
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

                this.getNetworkStatus(this.model);
                this.getNetworkConfig(this.model);

                setTimeout(function(){
                    layer.close(layerTime);
                });
            },
            onApplyClick: function () {
                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });

                console.log("network", this.model.config);

                this.putNetworkConfig(function (response) {
                    layer.close(layerTime);
                    window.location.reload();
                });
            },
            onCancelClick: function () {
                this.init();
            },  
            getNetworkStatus:function(model) {//
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/network/status',
                    type: 'GET',
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response) {
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
                        switch(response.speed) {
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

                        model.status = response;
                    },
                })
            },
            getNetworkConfig:function(model) {
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/network/config',
                    type: 'GET',
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response) {
                        model.config = response;
                        if(model.config.fqdn.length) {
                            model.config._fqdn = true;
                        } else {
                            model.config._fqdn = false;
                        }
                    },
                })
            },
            putNetworkConfig:function(fn) {
                var config = this.model.config;
                if(!config._fqdn)
                    config.fqdn = "";
                delete config._fqdn;

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