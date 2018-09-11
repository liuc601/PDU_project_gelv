define(function(require) {
    var Vue = require('vue');

    return Vue.component('form-action', {
        template: require('text!./form-action.html'),
        methods: {
            onApplyClick: function() {
                this.$emit('apply');
            },
            onCancelClick: function() {
                this.$emit('cancel');
            }
        }
    });
});