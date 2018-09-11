define(function(require) {
    var Vue = require('vue');
    require('components/status-bar');
    require('components/x-panel');

    return Vue.component('status-panel', {
        template: require('text!./status-panel.html'),
        props: {
            title: {
                type: String,
                default: ''
            },
            subTitle: {
                type: String,
                default: null,
            },
            subStyle: {
                type: Object,
                default: null,
            },
            showToolbox: {
                type: Boolean,
                default: false
            },
            wrapClass: {
                type: String,
                default: 'col-md-12 col-sm-12 col-xs-12'
            },
            heightClass: {
                type: String,
                default: '' //tile fixed_height_320
            },
            addClass: {
                type: String,
                default: ''
            },
            status: {
                type: Object,
                require: true
            },
        },
        computed: {
            percent: function() {
                if(!this.status.enable)
                    return 0;
                return ((this.status.current - this.status.min) * 100) / (this.status.max - this.status.min);
            },
            percentage: function() {
                return this.percent + '%';
            },
            color: function() {
                return 'status-bar-' + this.status.color;
                /*
                var ranges = this.status.ranges;

                if (ranges) {
                    for (var i = 0; i < ranges.length; i++) {
                        if (this.status.current <= ranges[i].value) {
                            return 'status-bar-' + ranges[i].color;
                        }
                    }
                }


                return 'status-bar-green';
                */
            }
        }
    });
});