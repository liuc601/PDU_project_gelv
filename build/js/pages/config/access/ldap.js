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
                    http: {
                        enable: true,
                        port: 80,
                    },
                    ldap: {
                        ldap: 'Disabled',
                        port: '389'
                    },
                },
                schema: {
                    groups: [{
                        legend: 'Configure LDAP Options',
                        fields: [{
                            type: "label",
                            label: "LDAP",
                            model: "ldap.ldap",
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Primary Host',
                            model: 'ldap.primary'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Secondary Host',
                            model: 'ldap.secondary'
                        }, {
                            type: 'input',
                            inputType: "text",
                            label: 'Port',
                            model: 'ldap.port',
                            hint: '(default389)'
                        }, {
                            type: 'select',
                            label: 'Bind Type',
                            model: 'ldap.type',
                            values: []
                        }]
                    }, {
                        legend: 'Search Bind',
                        fields: [{
                            type: 'input',
                            inputType: 'text',
                            label: 'DN',
                            model: 'ldap.dn'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Password',
                            model: 'ldap.password',
                            buttons: [{
                                classes: 'btn btn-primary btn-small',
                                label: 'Change',
                                onclick: function (model, field) {

                                }
                            }]
                        }]
                    }, {
                        legend: 'Search Bind',
                        fields: [{
                            type: 'input',
                            inputType: 'text',
                            label: 'Base DN',
                            model: 'ldap.base'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Filter',
                            model: 'ldap.filter'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Group Membership Attribute',
                            model: 'ldap.group'
                        }, {
							type: 'switch',
							label: 'Group Search',
							model: 'ldap.search',
							textOn: 'Enabled',
							textOff: 'Disabled',
						}, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Base DN',
                            model: 'ldap.basedn'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'User Membership Attribute',
                            model: 'ldap.user'
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
            onApplyClick: function () {

            },
            onCancelClick: function () {

            }
        }
    });
});