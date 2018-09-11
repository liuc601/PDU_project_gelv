define(function(require) {
    var Vue = require('vue');
    require('components/status-bar');

    return Vue.component('ov-status-bar', {
        template: '<status-bar :percentage="value" :color="color"></status-bar>',
        props: {
            row: {
                type: Object,
                require: true
            },
            field: {
                type: Object,
                require: true
            }
        },
        computed: {
            color: function() {
                return this.field.__color(this.row, this.field);
            },
            value: function() {
                var enable = this.row['enable'];
                if(!enable) {
                    return 0 + '%';
                }
                var max = this.row['maxValue'];
                var min = this.row['minValue'];
                var val = this.row[this.field.__target];
                if(val < min) {
                    val = min;
                }
                /*var percent = (Math.abs(this.row[this.field.__target]) * 100) / ((max === undefined) ? this.field.default : max - min);*/
                var percent = Math.abs((val-min)*100 / ((max === undefined) ? this.field.default : max - min));
                return percent + '%';
            }
        }
    });
});