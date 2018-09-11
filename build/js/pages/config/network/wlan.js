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
                    status: {
                        mode: 'dual',
                        state: 'Static IPv4',
                        link: 'Up',
                        speed: '100 Mbps',
                        duplex: 'Full',
                        negotiation: 'Auto',
                        mac: '00-0A-9C-60-27-D9',
                        autov6: 'FE80::20A:9CFF:FE60:27D9/64',
                        dhcpv6: '2600:6C24:3:20A:9CFF:FE60:27D9/64',
                        v4addr: '66.214.208.190',
                        v4mask: '255.255.255.0',
                        v4gateway: '66.214.208.1',
                        primaryDNS: '71.9.127.107',
                        secondaryDNS: '68.190.192.35'
                    },
                    static: {
                        v6addr: '::/64',
                        v6gateway: '::',
                        v4addr: '66.214.208.190',
                        v4mask: '255.255.255.0',
                        v4gateway: '66.214.208.1',
                        primaryDNS: '71.9.127.107',
                        secondaryDNS: '68.190.192.35'
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
                schema: {
                    groups: [{
                        legend: 'Network Configuration',
                        fields: [{
                            type: 'select',
                            label: 'Network',
                            model: 'status.mode',
                            values: [
                                { id: 'dual', name: 'Dual IPv6/IPv4' },
                                { id: 'v4', name: 'IPv4' },
                                { id: 'v6', name: 'IPv6' }
                            ]
                        }, {
                            type: 'label',
                            label: 'State',
                            model: 'status.state'
                        }, {
                            type: 'label',
                            label: 'Link',
                            model: 'status.link'
                        }, {
                            type: 'label',
                            label: 'Speed',
                            model: 'status.speed'
                        }, {
                            type: 'label',
                            label: 'Duplex',
                            model: 'status.duplex'
                        }, {
                            type: 'label',
                            label: 'Negotiation',
                            model: 'status.negotiation'
                        }, {
                            type: 'label',
                            label: 'Ethernet MAC Address',
                            model: 'status.mac'
                        }, {
                            type: 'label',
                            label: 'Autocfg IPv6 Address',
                            model: 'status.autov6'
                        }, {
                            type: 'label',
                            label: 'Stateless DHCPv6 Address',
                            model: 'status.dhcpv6'
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
                            model: 'status.primaryDNS'
                        }, {
                            type: 'label',
                            label: 'Secondary DNS',
                            model: 'status.secondaryDNS'
                        }]
                    }, {
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
                            model: 'static.primaryDNS'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Secondary DNS',
                            model: 'static.secondaryDNS'
                        }]
                    }, {
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
                            model: 'dhcp.sentry',
                            visible: function(model) {
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
                            model: 'dhcp.fallback',
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
                                onclick: function(model, field) {
                                    console.log(model);
                                    console.log(field);
                                }
                            }]
                        }]
                    }]
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                }
            };
        },
        mounted:function(){
            this.clearSwitchControlLabel();//消除switch按钮的事件区域过大的问题
        },
        methods: {
            onApplyClick: function() {

            },
            onCancelClick: function() {

            }
        }
    });
});