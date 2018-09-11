define(function (require) {
    var Vue = require('vue');
    require('components/title-count');

    return Vue.extend({
        template: require('text!./ov-sysinfo.html'),
        data: function () {
            return {
                sysinfo: {
                }
            };
        },
        mounted: function () {
            var that = this
            $.get('/cgi-bin/luci/api/v1/overview/sysinfo').success(function(response) {
                // that.sysinfo = Object.assign({}, response);
                that.sysinfo = response;
            }.bind(this))
        }
    });
});