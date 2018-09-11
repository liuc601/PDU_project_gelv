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
                    host: '',
                    port: 514,
                    logLevel: 8,
                    protocol: 'udp'
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                }
            };
        },
        computed: {
            schema: function () {
                return {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: 'External system log server',
                        model: 'host',
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: 'External system log server port',
                        model: 'port',
                        hint: 'Default: 514'
                    }, {
                        type: 'select',
                        label: 'Log output level',
                        model: 'logLevel',
                        values: [
                            { name: "Debug", id: 8 },
                            { name: "Info",  id: 7 },
                            { name: "Notice", id: 6 },
                            { name: "Warning", id: 5 },
                            { name: "Error", id: 4 },
                            { name: "Critical", id: 3 },
                            { name: "Alert", id: 2 },
                            { name: "Emergency", id: 1 },
                        ],
                        onChanged:function (model){
                        }
                    }, {
                        type: 'select',
                        label: 'Protocol',
                        model: 'protocol',
                        values: [
                            { id: 'udp', name: 'RFC3164(UDP)' },
                            { id: 'tcp', name: 'RFC3195(TCP)' },
                        ]
                    }]
                }
            },
        },        
        mounted: function () {
            this.init();
        },        
        methods: {
            init: function () {
                var layerTime=layer.load(2, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });

                $.get('/cgi-bin/luci/api/v1/network/syslog').success(function(response){
                    if(response.host)
                        this.model.host = response.host;
                    if(response.port)
                        this.model.port = response.port;
                    if(response.logLevel)
                        this.model.logLevel = response.logLevel;
                    if(response.protocol)
                        this.model.protocol = response.protocol;

                    //console.log(this.model.protocol)

                    setTimeout(function() {
                        layer.close(layerTime);
                    });
                }.bind(this))        
            },
            onApplyClick: function() {
                var data = this.model;
                if(data.port == 0 || data.port >= 65535)
                    data.port = 514;
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/cgi-bin/luci/api/v1/network/syslog',
                    success: function(response) {
                        // location.reload();
                        this.init();
                        console.log("reload system syslog", response);
                    }.bind(this)
                })
            },
            onCancelClick: function() {
                this.init();
            }
        }
    });
});