define(function (require) {
    var Vue = require('vue');
    var VueFormGenerator = require('vue-form');
    require('components/checkbox/checkbox');
    require('components/x-panel');
    require('components/form-action');

    Vue.use(VueFormGenerator);

    return Vue.extend({
        template: require('text!pages/form.html'),
        data: function () {
            return {
                model: {
                    host: '',
                    port: 25,
                    authType: '',
                    authUser: '',
                    authPwd: '',
                    addrFrom: '',
                    addrTo1st: '',
                    addrTo2nd: '',
                    //subjectID: 'default',
                    ntfyEventEnable: false,
                    ntfyAccessEvt: false,
                    ntfyConfigEvt: false,
                    ntfyOutletCtrlEvt: true,
                    ntfyUserAdminEvt: false,
                    ntfyDeviceEvt: false,
                    ntfySystemEvt: false,
                    ntfyPowerEvt: true,
                    ntfySensorEvt: true,
                },
                typeList:[
                    { value: 0, name: 'On/Auto' },
                    { value: 1, name: 'Off' },
                    { value: 2, name: 'PLAIN' },
                    { value: 3, name: 'LOGIN' },
                    { value: 4, name: 'CRAM-MD5' },
                    { value: 5, name: 'DIGEST-MD5' },
                    { value: 6, name: 'SCRAM-SHA-1' },
                    { value: 7, name: 'GSSAPI' },
                    { value: 8, name: 'EXTERNAL' },
                ],
                schema: {
                    groups: [{
                        legend: 'Email/SMTP Options',
                        fields: [{
                            type: 'input',
                            inputType: 'text',
                            label: 'SMTP Host',
                            model: 'host',
                        }, {
                            type: 'input',
                            inputType: 'number',
                            label: 'SMTP Port',
                            model: 'port'
                        }, {
                            type: 'select',
                            label: 'SMTP Authentication',
                            model: 'authType',
                            values: [
                                { value: 0, name: 'On/Auto' },
                                { value: 1, name: 'Off' },
                                { value: 2, name: 'PLAIN' },
                                { value: 3, name: 'LOGIN' },
                                { value: 4, name: 'CRAM-MD5' },
                                { value: 5, name: 'DIGEST-MD5' },
                                { value: 6, name: 'SCRAM-SHA-1' },
                                { value: 7, name: 'GSSAPI' },
                                { value: 8, name: 'EXTERNAL' },
                            ]
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'SMTP Username',
                            model: 'authUser'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'SMTP Password',
                            model: 'authPwd'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: '\'From\' Address',
                            model: 'addrFrom'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Primary \'To\' Address',
                            model: 'addrTo1st'
                        }, {
                            type: 'input',
                            inputType: 'text',
                            label: 'Secondary \'To\' Address',
                            model: 'addrTo2nd'
                        }/*, {
                            type: 'select',
                            label: 'Subject ID',
                            model: 'smtp.subjectID',
                            values: [
                                { id: 'default', name: 'Use Default' },
                                { id: 'subject1', name: 'Subject1' },
                                { id: 'subject2', name: 'Subject2' },
                            ],
                        }*/]
                    }, {
                        legend: 'Notification Options',
                        fields: [{
                            type: 'switch',
                            label: 'Event Notifications',
                            model: 'ntfyEventEnable',
                            textOn: 'Enabled',
                            textOff: 'Disabled'
                        }, {
                            type: 'checkbox',
                            label: 'Access Events',
                            model: 'ntfyAccessEvt',
                            visible: function (model) {
                                return model && model.ntfyEventEnable;
                            }
                        }, {
                            type: 'checkbox',
                            label: 'Config Events',
                            model: 'ntfyConfigEvt',
                            visible: function (model) {
                                return model && model.ntfyEventEnable;
                            }
                        }, {
                            type: 'checkbox',
                            label: 'Outlet Control Events',
                            model: 'ntfyOutletCtrlEvt',
                            visible: function (model) {
                                return model && model.ntfyEventEnable;
                            }
                        }, {
                            type: 'checkbox',
                            label: 'User Administration Events',
                            model: 'ntfyUserAdminEvt',
                            visible: function (model) {
                                return model && model.ntfyEventEnable;
                            }
                        }, {
                            type: 'checkbox',
                            label: 'Device Events',
                            model: 'ntfyDeviceEvt',
                            visible: function (model) {
                                return model && model.ntfyEventEnable;
                            }
                        }, {
                            type: 'checkbox',
                            label: 'System Events',
                            model: 'ntfySystemEvt',
                            visible: function (model) {
                                return model && model.ntfyEventEnable;
                            }
                        }, {
                            type: 'checkbox',
                            inputName: 'checkbox',
                            label: 'Power Events',
                            model: 'ntfyPowerEvt',
                            visible: function (model) {
                                return model && model.ntfyEventEnable;
                            }
                        }, {
                            type: 'checkbox',
                            inputName: 'checkbox',
                            label: 'Sensor Events',
                            model: 'ntfySensorEvt',
                            visible: function (model) {
                                return model && model.ntfyEventEnable;
                            }
                        }]
                    },]
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                }
            };
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
                this.getSmtpConfig();
                setTimeout(function(){
                    layer.close(layerTime);
                }.bind(this)); 
            },
            onApplyClick: function () {
                var data = this.model;
                data.authType = this.model.authType.value;
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/cgi-bin/luci/api/v1/network/smtp',
                    success: function(response) {
                        // location.reload();
                        this.init();
                    }.bind(this)
                })
            },
            onCancelClick: function () {
            },
            getSmtpConfig:function() {//obj,用户的数据
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/network/smtp',//获取所有的用户数据
                    type: 'GET',
                    // data: JSON.stringify(obj),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response){
                        var data = response;
                        data.authType = this.typeList[response.authType];
                        this.model = data;

                        //this.model.authType = this.typeList[response.authType];
                    }.bind(this),
                })
            },
        }
    });
});