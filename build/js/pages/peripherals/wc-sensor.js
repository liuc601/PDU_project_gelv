define(function(require) {
    var Vue = require('vue');
    require('components/x-panel');

    return Vue.extend({
        template: require('text!./wc-sensor.html'),
        props: {
            title: {
                type: String,
                default: ''
            },
            subTitle: {
                type: String,
                default: null,
            },
            showToolbox: {
                type: Boolean,
                default: false
            },
            wrapClass: {
                type: String,
                default: 'col-md-4 col-sm-4 col-xs-12'
            },
            heightClass: {
                type: String,
                default: '' //tile fixed_height_320
            },
            addClass: {
                type: String,
                default: 'no-border'
            },
            sensor: {
                type: Object,
                require: true
            },
        },
        computed: {
            color: function() {
                if (this.sensor.status.toLocaleLowerCase() === 'normal')
                    return 'clr-green';
                if (this.sensor.status.toLocaleLowerCase() === 'warning')
                    return 'clr-yellow';
                if (this.sensor.status.toLocaleLowerCase() === 'alarm')
                    return 'clr-red';
                return 'clr-green';
            }
        },
        methods: {
            onEditClick: function(sensor) {
                console.log(sensor);
            }
        }
    });
});