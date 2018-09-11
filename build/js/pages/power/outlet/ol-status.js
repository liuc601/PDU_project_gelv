define(function(require) {
    var Vue = require('vue');
    require('components/status-bar');

    return Vue.extend({
        template: require('text!./ol-status.html'),
        props: {
            status: {
                type: Object,
                require: true
            }
        },
        computed: {
            percent: function() {
                return (this.status.value * 100) / this.status.max;
            },
            percentage: function() {
                return this.percent + '%';
            },
            color: function() {
                switch (this.status.status) {
                    case 0:
                        return 'status-bar-green';
                    case 14:
                        return 'status-bar-red';
                    case 15:
                        return 'status-bar-yellow';
                    case 16:
                        return 'status-bar-yellow';
                    case 17:
                        return 'status-bar-red';
                    default:
                        return 'status-bar-green';
                }
            }
        }
    });
});