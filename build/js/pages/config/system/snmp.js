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
                    v2: {
                        enable: true,
                        roCommunity: '',
                        rwCommunity: ''
                    },
                    v3: {
                        enable: false,
                        engineID: '800006B0200000000000000000000FFF42D6D0BE',

                        roUserName: '',
                        roUserAcessLevel: 1,
                        roUserAuthMethod: 1,
                        roUserAuthPassword: '',
                        roUserPrivacyProto: 1,
                        roUserPrivacyPassword: '',

                        rwUserName: '',
                        rwUserAcessLevel: 1,
                        rwUserAuthMethod: 1,
                        rwUserAuthPassword: '',
                        rwUserPrivacyProto: 1,
                        rwUserPrivacyPassword: ''
                    },
                    trap: {
                        trapVersion: 2,
                        trapFormat: 1,
                        trapHost: '',
                        destination2: '',
                        errorRepeatTime: 60,

                        v2trapCommunity: 'public',

                        v3trapEngineID: '',
                        v3trapUserName: '',
                        v3trapSecLevel: 1,
                        v3trapAuthMethod: 1,
                        v3trapAuthPassword: '',
                        v3trapPrivacyProto: 1,
                        v3trapPrivacyPassword: '',
                    },
                },
                schema: {
                    groups: [{
                        legend: 'SNMPv2 Options',
                        fields: [{
                            type: 'switch',
                            label: 'Agent',
                            model: 'v2.enable',
                            textOn: 'Enabled',
                            textOff: 'Disabled',
                        }, {
                            type: 'input',
                            inputType: "text",
                            label: 'GET Community(RO)',
                            model: 'v2.roCommunity'
                        }, {
                            type: 'input',
                            inputType: "text",
                            label: 'SET Community(RW)',
                            model: 'v2.rwCommunity'
                        }]
                    }, {
                        legend: 'SNMPv3 Options',
                        fields: [{
                            type: 'switch',
                            label: 'Agent',
                            model: 'v3.enable',
                            textOn: 'Enabled',
                            textOff: 'Disabled',
                        }, {
                            type: 'label',
                            label: 'Engine ID',
                            model: 'v3.engineID'
                        },

                        {
                            type: 'label',
                            label: '                 ',
                        },
                        {/////////////////////////////////////////////////////
                            type: 'input',
                            inputType: 'text',
                            label: 'Read-Only Username',
                            model: 'v3.roUserName',
                            visible: function (model) {
                                return model.v3.enable;
                            }
                        }, {
                            type: 'select',
                            label: 'Read-Only Access Level',
                            model: 'v3.roUserAcessLevel',
                            values: [
                                { id: 1, name: 'NoAuth and NoPrivacy' },
                                { id: 2, name: 'Auth Only' },
                                { id: 3, name: 'Auth and Privacy' },
                            ],
                            visible: function (model) {
                                return model.v3.enable;
                            }
                        }, {
                            type: 'select',
                            label: 'Read-Only User Auth Method',
                            model: 'v3.roUserAuthMethod',
                            values: [
                                { id: 1, name: 'MD5' },
                                { id: 2, name: 'SHA' },
                            ],
                            visible: function (model) {
                                if(!model.v3.enable)
                                    return false;

                                if(model) {
                                    if(model.v3.roUserAcessLevel == 2
                                        || model.v3.roUserAcessLevel == 3)
                                        return true;
                                }
                                return false;
                            }
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Read-Only User Auth Password',
                            model: 'v3.roUserAuthPassword',
                            visible: function (model) {
                                if(!model.v3.enable)
                                    return false;
                                if(model) {
                                    if(model.v3.roUserAcessLevel == 2
                                        || model.v3.roUserAcessLevel == 3)
                                        return true;
                                }
                                return false;
                            }
                        }, {
                            type: 'select',
                            label: 'Read-Only User Privacy Protocol',
                            model: 'v3.roUserPrivacyProto',
                            values: [
                                { id: 1, name: 'DES' },
                                { id: 2, name: 'AES' },
                            ],
                            visible: function (model) {
                                if(!model.v3.enable)
                                    return false;
                                if(model) {
                                    if(model.v3.roUserAcessLevel == 3)
                                        return true;
                                }
                                return false;
                            }
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Read-Only User Privacy Password',
                            model: 'v3.roUserPrivacyPassword',
                            visible: function (model) {
                                if(!model.v3.enable)
                                    return false;
                                if(model) {
                                    if(model.v3.roUserAcessLevel == 3)
                                        return true;
                                }
                                return false;
                            }
                        }, 

                        {
                            type: 'label',
                            label: '                 ',
                        },
                        /////////snmp v3 user config///////////////////////////////
                        {
                            type: 'input',
                            inputType: 'text',
                            label: 'Read-Write Username',
                            model: 'v3.rwUserName',
                            visible: function (model) {
                                return model.v3.enable;
                            }
                        }, {
                            type: 'select',
                            label: 'Read-Write Access Level',
                            model: 'v3.rwUserAcessLevel',
                            values: [
                                { id: 1, name: 'NoAuth and NoPrivacy' },
                                { id: 2, name: 'Auth Only' },
                                { id: 3, name: 'Auth and Privacy' }
                            ],
                            visible: function (model) {
                                return model.v3.enable;
                            }
                        }, {
                            type: 'select',
                            label: 'Read-Write User Auth Method',
                            model: 'v3.rwUserAuthMethod',
                            values: [
                                { id: 1, name: 'MD5' },
                                { id: 2, name: 'SHA' },
                            ],
                            visible: function (model) {
                                if(!model.v3.enable)
                                    return false;
                                if(model) {
                                    if(model.v3.rwUserAcessLevel == 2
                                        || model.v3.rwUserAcessLevel == 3)
                                        return true;
                                }
                                return false;
                            }
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Read-Write User Auth Password',
                            model: 'v3.rwUserAuthPassword',
                            visible: function (model) {
                                if(!model.v3.enable)
                                    return false;
                                if(model) {
                                    if(model.v3.rwUserAcessLevel == 2
                                        || model.v3.rwUserAcessLevel == 3)
                                        return true;
                                }
                                return false;
                            }
                        }, {
                            type: 'select',
                            label: 'Read-Write User Privacy Protocol',
                            model: 'v3.rwUserPrivacyProto',
                            values: [
                                { id: 1, name: 'DES' },
                                { id: 2, name: 'AES' },
                            ],
                            visible: function (model) {
                                if(!model.v3.enable)
                                    return false;
                                if(model) {
                                    if(model.v3.rwUserAcessLevel == 3)
                                        return true;
                                }
                                return false;
                            }
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Read-Write User Privacy Password',
                            model: 'v3.rwUserPrivacyPassword',
                            visible: function (model) {
                                if(!model.v3.enable)
                                    return false;
                                if(model) {
                                    if(model.v3.rwUserAcessLevel == 3)
                                        return true;
                                }
                                return false;
                            }
                        }]
                    }, {
                        legend: 'Trap Options',
                        fields: [{
                            type: 'select',
                            label: 'Trap Version',
                            model: 'trap.trapVersion',
                            values: [
                                { id: 1, name: 'v1' },
                                { id: 2, name: 'v2c' },
                                { id: 3, name: 'v3' },
                            ]
                        },{
                            type: 'select',
                            label: 'Trap Format',
                            model: 'trap.trapFormat',
                            values: [
                                { id: 1, name: 'TRAPs' },
                                { id: 2, name: 'INFORMs' },
                            ]
                        },{
                            type: 'input',
                            inputType: 'text',
                            label: 'Destination Host',
                            model: 'trap.trapHost'
                        }, /*{
                            type: 'input',
                            inputType: 'text',
                            label: 'Destination 2',
                            model: 'trap.destination2'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Error Repeat Time',
                            model: 'trap.errorRepeatTime',
                            hint: 'Unit: Seconds'
                        },*/ {
                            type: 'input',
                            inputType: 'text',
                            label: 'v1/v2c Community',
                            model: 'trap.v2trapCommunity',
                            visible: function (model) {
                                if(model) {
                                    if(model.trap.trapVersion == 1
                                        || model.trap.trapVersion == 2)
                                        return true;
                                }
                                return false;
                            }
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'v3 Username',
                            model: 'trap.v3trapUserName',
                            visible: function (model) {
                                if(model) {
                                    if(model.trap.trapVersion == 3)
                                        return true;
                                }
                                return false;
                            }
                        }, {
                            type: 'select',
                            inputType: 'text',
                            label: 'v3 Security Level',
                            model: 'trap.v3trapSecLevel',
                            values: [
                                { id: 1, name: 'NoAuth and NoPrivacy' },
                                { id: 2, name: 'Auth Only' },
                                { id: 3, name: 'Auth and Privacy' }
                            ],
                            visible: function (model) {
                                if(model) {
                                    if(model.trap.trapVersion == 3)
                                        return true;
                                }
                                return false;
                            }
                        }, {
                            type: 'select',
                            inputType: 'text',
                            label: 'v3 Auth Method',
                            model: 'trap.v3trapAuthMethod',
                            values: [
                                { id: 1, name: 'MD5' },
                                { id: 2, name: 'SHA' },
                            ],
                            visible: function (model) {
                                if(model) {
                                    if(model.trap.trapVersion == 3) {
                                        if(model.trap.v3trapSecLevel == 2 
                                            || model.trap.v3trapSecLevel == 3)
                                            return true;
                                    }
                                }
                                return false;
                            }
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'v3 Auth Password',
                            model: 'trap.v3trapAuthPassword',
                            visible: function (model) {
                                if(model) {
                                    if(model.trap.trapVersion == 3) {
                                        if(model.trap.v3trapSecLevel == 2 
                                            || model.trap.v3trapSecLevel == 3)
                                            return true;
                                    }
                                }
                                return false;
                            }
                        }, {
                            type: 'select',
                            label: 'v3 Privacy Protocol',
                            model: 'trap.v3trapPrivacyProto',
                            values: [
                                { id: 1, name: 'DES' },
                                { id: 2, name: 'AES' },
                            ],
                            visible: function (model) {
                                if(model) {
                                    if(model.trap.trapVersion == 3
                                        && model.trap.v3trapSecLevel == 3)
                                        return true;
                                }
                                return false;
                            }
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'v3 Privacy Password',
                            model: 'trap.v3trapPrivacyPassword',
                            visible: function (model) {
                                if(model) {
                                    if(model.trap.trapVersion == 3
                                        && model.trap.v3trapSecLevel == 3)
                                        return true;
                                }
                                return false;
                            }
                        }]
                    }]
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                }
            };
        },
        mounted:function() {
            this.clearSwitchControlLabel();//消除switch按钮的事件区域过大的问题
            var layerTime=layer.load(2, {
                shade: [0.1,'#fff'] //0.1透明度的白色背景
            });
            this.init();
            setTimeout(function() {
                layer.close(layerTime);
            }); 
        },        
        methods: {
            init: function () {
                this.getSnmpConfig();
            },
            getSnmpConfig: function() {
                $.get('/cgi-bin/luci/api/v1/network/snmp').success(function(response) {
                    this.model.v2.enable = response.v2Enable;
                    this.model.v2.roCommunity = response.roCommunity;
                    this.model.v2.rwCommunity = response.rwCommunity;

                    this.model.v3.enable = response.v3Enable;
                    this.model.v3.engineID = response.engineID;
                    this.model.v3.roUserName = response.roUserName;
                    this.model.v3.roUserAcessLevel = response.roUserAcessLevel + 1;
                    this.model.v3.roUserAuthMethod = response.roUserAuthMethod + 1;
                    this.model.v3.roUserPrivacyProto = response.roUserPrivacyProto + 1;
                    this.model.v3.roUserAuthPassword = response.roUserAuthPassword;
                    this.model.v3.roUserPrivacyPassword = response.roUserPrivacyPassword;

                    this.model.v3.rwUserName = response.rwUserName;
                    this.model.v3.rwUserAcessLevel = response.rwUserAcessLevel + 1;
                    this.model.v3.rwUserAuthMethod = response.rwUserAuthMethod + 1;
                    this.model.v3.rwUserPrivacyProto = response.rwUserPrivacyProto + 1;
                    this.model.v3.rwUserAuthPassword = response.rwUserAuthPassword;
                    this.model.v3.rwUserPrivacyPassword = response.rwUserPrivacyPassword;

                    this.model.trap.trapVersion = response.trapVersion + 1;
                    this.model.trap.trapFormat = response.trapFormat + 1;
                    this.model.trap.trapHost = response.trapHost;
                    this.model.trap.v2trapCommunity = response.v2trapCommunity;
                    this.model.trap.v3trapEngineID = response.v3trapEngineID;
                    this.model.trap.v3trapUserName = response.v3trapUserName;
                    this.model.trap.v3trapSecLevel = response.v3trapSecLevel + 1;
                    this.model.trap.v3trapAuthMethod = response.v3trapAuthMethod + 1;
                    this.model.trap.v3trapAuthPassword = response.v3trapAuthPassword;
                    this.model.trap.v3trapPrivacyProto = response.v3trapPrivacyProto + 1;
                    this.model.trap.v3trapPrivacyPassword = response.v3trapPrivacyPassword;

                    //console.log("response time", response);
                }.bind(this))
            },
            setSnmpConfig: function() {
                var data = {
                    v2Enable: this.model.v2.enable,
                    roCommunity: this.model.v2.roCommunity,
                    rwCommunity: this.model.v2.rwCommunity,
                    v3Enable: this.model.v3.enable,

                    roUserName: this.model.v3.roUserName,
                    roUserAcessLevel: this.model.v3.roUserAcessLevel - 1,
                    roUserAuthMethod: this.model.v3.roUserAuthMethod - 1,
                    roUserPrivacyProto: this.model.v3.roUserPrivacyProto - 1,
                    roUserAuthPassword: this.model.v3.roUserAuthPassword,
                    roUserPrivacyPassword: this.model.v3.roUserPrivacyPassword,

                    rwUserName: this.model.v3.rwUserName,
                    rwUserAcessLevel: this.model.v3.rwUserAcessLevel - 1,
                    rwUserAuthMethod: this.model.v3.rwUserAuthMethod - 1,
                    rwUserPrivacyProto: this.model.v3.rwUserPrivacyProto - 1,
                    rwUserAuthPassword: this.model.v3.rwUserAuthPassword,
                    rwUserPrivacyPassword: this.model.v3.rwUserPrivacyPassword, 

                    trapVersion: this.model.trap.trapVersion -1,
                    trapFormat: this.model.trap.trapFormat -1,
                    trapHost: this.model.trap.trapHost,
                    v2trapCommunity: this.model.trap.v2trapCommunity,
                    v3trapEngineID: this.model.trap.v3trapEngineID,
                    v3trapUserName: this.model.trap.v3trapUserName,
                    v3trapSecLevel: this.model.trap.v3trapSecLevel - 1,
                    v3trapAuthMethod: this.model.trap.v3trapAuthMethod - 1,
                    v3trapAuthPassword: this.model.trap.v3trapAuthPassword,
                    v3trapPrivacyProto: this.model.trap.v3trapPrivacyProto - 1,
                    v3trapPrivacyPassword: this.model.trap.v3trapPrivacyPassword,
                };

                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/cgi-bin/luci/api/v1/network/snmp',
                    success:function (response) {
                        // location.reload();
                        this.init();
                        console.log("reload snmp config", response);
                    }.bind(this)
                })
            },    
            onApplyClick: function() {
                var layerTime=layer.load(2, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                this.setSnmpConfig();
                setTimeout(function() {
                    layer.close(layerTime);
                });
            },
            onCancelClick: function() {
                var layerTime=layer.load(2, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                this.init();
                setTimeout(function() {
                    layer.close(layerTime);
                });
            }
        }
    });
});