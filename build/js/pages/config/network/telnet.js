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
                    telnet: {
                        enable: true,
                        port: 23,
                    },
                    ssh: {
                        enable: true,
                        port: 22,
                        auth: 'kop'
                    },
                },
                schema: {
                    groups: [{
                        legend: 'Telnet Options',
                        fields: [{
                            type: 'switch',
                            label: 'Telnet Server',
                            model: 'telnet.enable',
                            textOn: 'Enabled',
                            textOff: 'Disabled'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Telnet Port',
                            model: 'telnet.port'
                        }]
                    }, {
                        legend: 'SSH Options',
                        fields: [{
                            type: 'switch',
                            label: 'SSH Server',
                            model: 'ssh.enable',
                            textOn: 'Enabled',
                            textOff: 'Disabled'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'SSH Port',
                            model: 'ssh.port'
                        }, {
                            type: 'select',
                            label: 'Authentication Method',
                            model: 'ssh.auth',
                            values: [
                                { id: 'kop', name: 'Keyboard Interactive or Password' }
                            ]
                        }]
                    }, ]
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