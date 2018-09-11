define(function(require) {
    var Vue = require('vue');

    return Vue.component('toolbar', {
        template: require('text!./toolbar.html'),
        props: {
            enableAddButton: {
                type: Boolean,
                default: true
            },
            enableDelButton: {
                type: Boolean,
                default: false
            },
            showAddButton: {
                type: Boolean,
                default: true
            },
            showDelButton: {
                type: Boolean,
                default: true
            },
            editClass: {
                type: String,
                default: 'btn btn-default btn-xs'
            },
            delClass: {
                type: String,
                default: 'btn btn-default btn-xs'
            }
        },
        methods: {
            toolbarAction: function(action) {
                this.$emit('toolbarAction:' + action);
            }
        }
    });
});