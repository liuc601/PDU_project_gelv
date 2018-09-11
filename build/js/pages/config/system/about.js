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
                    name: '',
                    location: '',
                    contact: '',
                    model: '',
                    serial: '',
                    boardID: '',
                    rating: '',
                    fwVer: '',
                    hwVer: '',
                    buildInfo: '',
                    uptime: '',
                },
                schema: {
                    groups: [{
                        legend: 'System information',
                        fields: [{
                            type: "label",
                            label: "Model",
                            model: "model",
                        }, {
                            type: "label",
                            label: "Serial Number",
                            model: "serial",
                        }, {
                            type: "label",
                            label: "Board ID",
                            model: "boardID",
                        }, {
                            type: "label",
                            label: "Rating",
                            model: "rating",
                        }, {
                            type: "label",
                            label: "Firmware Version",
                            model: "fwVer",
                        }, {
                            type: "label",
                            label: "Hardware Revision",
                            model: "hwVer",
                        }, {
                            type: "label",
                            label: "Build Info",
                            model: "buildInfo",
                        }, {
                            type: "label",
                            label: "Uptime",
                            model: "uptime",
                        }]

                    }, {
                        legend: 'Configure system options',
                        fields: [{
                            type: "input",
                            inputType: "text",
                            placeholder: "Name of PDU",
                            label: "PDU Name",
                            model: "name",
                        }, {
                            type: "input",
                            inputType: "text",
                            label: "Location",
                            model: "location",
                            placeholder: "Device Location",
                        }, {
                            type: "input",
                            inputType: "text",
                            label: "Contact",
                            model: "contact",
                            placeholder: "System Contact",
                        }]

                    }]
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
            };
        },
        mounted:function() {
            this.init();
        },        
        methods: {
            init: function () {
                var layerTime=layer.load(2, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                this.getSystemInfo();
                setTimeout(function() {
                    layer.close(layerTime);
                });                
            }, 
            getSystemInfo: function() {
                $.get('/cgi-bin/luci/api/v1/system/info').success(function(response) {
                    this.model.model = response.model;
                    this.model.serial = response.serial;
                    this.model.boardID = response.boardID;
                    this.model.rating = response.rating;
                    this.model.fwVer = response.fwVersion;
                    this.model.hwVer = response.hwRevision;
                    this.model.buildInfo = response.fwBuildInfo;
                    this.model.uptime = this.getData(response.uptime);
                    this.model.name = response.name;
                    this.model.location = response.location;
                    this.model.contact = response.contact;
                    //console.log("response time", response);
                }.bind(this))
            },
            setSystemInfo: function() {
                var data = {
                    name: this.model.name,
                    location: this.model.location,
                    contact: this.model.contact
                };

                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/cgi-bin/luci/api/v1/system/info',
                    success: function(response) {
                        // location.reload();
                        this.init();
                        console.log("reload system info", response);
                    }.bind(this)
                })
            }, 
            getData:function(uptime) {//将获得的秒表数转换为具体的时间
                var day = parseInt(uptime / 86400);
                var hour = parseInt((uptime - day * 86400) / 3600);
                var min = parseInt((uptime - day * 86400 - hour * 3600) / 60);
                var seconds = parseInt(uptime - day * 86400 - hour * 3600 - min * 60);

                var time = hour + ' hours ' + min + ' minutes ' + seconds + ' seconds';
                if(day > 0)
                    time = day + ' days ' + time;
                // console.log(this.titleData.uptime,this.titleData.day*86400+hour*3600+min*60+seconds);
                return time;
            },                          
            onCancelClick: function() {
                this.init();
            },
            onApplyClick: function() {
                this.setSystemInfo();
                this.init();
            }
        }
    });
});