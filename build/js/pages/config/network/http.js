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
                    http: {
                        enable: true,
                        port: 80,
                    },
                    https: {
                        enable: true,
                        port: 443,
                        userCert: false,
                        passphrase: '',
                        userCertFile: 'None',
                        installedCert: 'Factory'
                    },
                },
                schema: {
                    groups: [{
                        legend: 'HTTP Options',
                        fields: [{
                            type: 'switch',
                            label: 'HTTP Server',
                            model: 'http.enable',
                            textOn: 'Enabled',
                            textOff: 'Disabled'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'HTTP Port',
                            model: 'http.port'
                        }]
                    }, {
                        legend: 'HTTPS/SSL Options',
                        fields: [{
                            type: 'switch',
                            label: 'HTTPS Server',
                            model: 'https.enable',
                            textOn: 'Enabled',
                            textOff: 'Disabled'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'HTTPS Port',
                            model: 'https.port'
                        }, {
                            type: 'switch',
                            label: 'User Certificate',
                            model: 'https.userCert',
                            textOn: 'Enabled',
                            textOff: 'Disabled'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Passphrase',
                            model: 'https.passphrase'
                        }, {
                            type: 'label',
                            label: 'Stored Files',
                            model: 'https.userCertFile',
                            buttons: [{
                                classes: 'btn btn-primary btn-small',
                                label: 'Upload',
                                onclick: function(model, field) {

                                }
                            }]
                        }, {
                            type: 'label',
                            label: 'Installed Certificate',
                            model: 'https.installedCert',
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