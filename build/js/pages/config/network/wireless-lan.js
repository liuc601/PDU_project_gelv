define(function (require) {
    var Vue = require('vue');
    var VueFormGenerator = require('vue-form');

    require('components/x-panel');
    require('components/form-action');

    Vue.use(VueFormGenerator);

    return Vue.extend({
        template: require('text!pages/form.html'),
        data: function () {
            return {
                model: {
                    status: {
                        mode: 'Wireless',
                        state: 'Not Detected',
                        SSID: 'YFSYS',
                        FAB: true,
                        BSSID:'input BSSID value',
                        PSKSelected:'PSK',
                        PSKPwd:'PSKPwd',
                    },
                },
                schema: {
                    groups: [{
                        legend: 'Wireless Network Configuration',
                        fields: [{
                                type: 'select',
                                label: 'Network Interface',
                                model: 'status.mode',
                                values: [{
                                        id: 'Wireless',
                                        name: 'Wireless'
                                    },
                                    {
                                        id: 'Wireless',
                                        name: 'Wireless'
                                    },
                                    {
                                        id: 'Wireless',
                                        name: 'Wireless'
                                    }
                                ]
                            }, {
                                type: 'label',
                                label: 'Hardware State',
                                model: 'status.state'
                            },
                            {
                                type: 'input',
                                inputType: 'text',
                                label: 'SSID',
                                model: 'status.SSID',
                            },
                            {
                                type: 'switch',
                                label: 'Force AP BSSID',
                                model: 'status.FAB',
                                textOn: 'Enabled',
                                textOff: 'Disabled',
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'BSSID',
                                model: 'status.BSSID',
                                visible: function (model) {
                                    return true;
                                }
                            }, {
                                type: 'select',
                                label: 'Authentication',
                                model: 'status.PSKSelected',
                                values: [{
                                        id: 'PSK',
                                        name: 'PSK'
                                    },
                                    {
                                        id: 'PSK-1',
                                        name: 'PSK-1'
                                    },
                                    {
                                        id: 'PSK-2',
                                        name: 'PSK-2'
                                    }
                                ]
                            }, {
                                type: 'input',
                                inputType: 'text',
                                label: 'Pre-Shared Key',
                                model: 'status.PSKPwd',
                                visible: function (model) {
                                    return true;
                                }
                            }
                        ]
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
            onApplyClick: function () {
                console.log(this.model.status);
            },
            onCancelClick: function () {

            }
        }
    });
});