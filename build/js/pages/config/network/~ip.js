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
                        fqdn: true,
                        sentry: 'sentry-6027d9',
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
                return {
                    groups: [
                        {
                            legend: 'Network Configuration',
                            fields: [{
                                type: 'select',
                                label: 'Network',
                                model: 'status._mode',
                                values: this.statusModeList,
                                onChanged: function (model) {
                                    model.status.mode=model.status._mode.value;
                                    console.log(model);
                                }
                            }, {
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
                                model: 'status.v6mask'
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
                            legend: 'Configure Static IPv4/IPv6 Settings',
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
                            legend: 'DHCP Settings',
                            fields: [{
                                type: 'switch',
                                label: 'DHCP',
                                model: 'dhcp.enable',
                                textOn: 'Enabled',
                                textOff: 'Disabled'
                            }, {
                                type: 'switch',
                                label: 'FQDN',
                                model: 'dhcp.fqdn',
                                textOn: 'Enabled',
                                textOff: 'Disabled'
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: '',
                                model: 'dhcp.fqdnEntry',
                                visible: function (model) {
                                    return model && model.dhcp.fqdn === true;
                                }
                            }, {
                                type: 'switch',
                                label: 'Boot Delay',
                                model: 'dhcp.bootdelay',
                                textOn: 'Enabled',
                                textOff: 'Disabled'
                            }, {
                                type: 'switch',
                                label: 'Static Address Fallback',
                                model: 'dhcp.staticFallback',
                                textOn: 'Enabled',
                                textOff: 'Disabled'
                            }, {
                                type: 'switch',
                                label: 'Zero Touch Provisioning',
                                model: 'dhcp.ztp',
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
                var _this = this;
                this.getPutNetworkStatus("GET", {}, function (response) {
                    console.log("status", response);
                    _this.doNetworkStatusData(response);
                    _this.model.status = response;
                });
                this.getPutNetworkStatic("GET", {}, function (response) {
                    console.log("Static", response);
                    _this.doNetworkStaticData(response);
                    _this.model.static = response;
                });
                this.getPutNetworkDhcpc("GET", {}, function (response) {
                    console.log("Dhcpc", response);
                    _this.model.dhcp = response;
                });
            },
            onApplyClick: function () {
                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                  });
                console.log("又是你这个按钮", this.model.status);
                // return;
                this.getPutNetworkStatus("PUT", this.model.status, function (response) {
                });
                this.getPutNetworkStatic("PUT", this.model.static, function (response) {
                });
                this.getPutNetworkDhcpc("PUT", this.model.dhcp, function (response) {
                    layer.close(layerTime);
                    window.location.reload();
                });
            },
            onCancelClick: function () {
            },
            getPutNetworkStatus(type, obj, fn) {//obj,用户的数据
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/network/status',//获取所有的用户数据
                    type: type,
                    data: JSON.stringify(obj),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response ) {
                        fn(response);
                    },
                })
            },
            doNetworkStatusData(response) {
                response._mode = this.statusModeList[response.mode];
                switch (response.state) {
                    case 0:
                        response._state = "IPv4"
                        break;
                    case 1:
                        response._state = "IPv6"
                        break;
                    case 3:
                        response._state = "DHCP"
                        break;
                    case 3:
                        response._state = "Static"
                        break;
                }
                response._speed = response.speed + " Mbps"
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
                response.primaryDns = response.dns[0];
                response.secondaryDns = response.dns[1];
            },
            getPutNetworkStatic(type, obj, fn) {//obj,用户的数据
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/network/static',//获取所有的用户数据
                    type: type,
                    data: JSON.stringify(obj),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response) {
                        fn(response);
                    },
                })
            },
            doNetworkStaticData(response) {
                response.primaryDns = response.dns[0];
                response.secondaryDns = response.dns[1];
            },
            getPutNetworkDhcpc(type, obj, fn) {//obj,用户的数据
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/network/dhcpc',//获取所有的用户数据
                    type: type,
                    data: JSON.stringify(obj),
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