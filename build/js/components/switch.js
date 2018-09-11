define(function(require) {
    var Vue = require('vue');

    return Vue.component('x-switch', {
        template: require('text!./switch.html'),
        props: {
            value: {
                type: Boolean,
                default: false,
            }
        },
        computed: {
            length: function() {
                if (this.value)
                    return '12px';
                return '0px';
            }
        },
        methods: {
            onClick: function() {
                this.value = !this.value;
                this.$emit('input', this.value);
                this.$parent.$emit('input', this.value);
            }
        }
    });
});