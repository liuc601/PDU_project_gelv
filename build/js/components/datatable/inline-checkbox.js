define(function(require) {
    'use strict';
    var Vue = require('vue');

    var InlineMixin = require('components/datatable/inline-mixin');

    return Vue.component('inline-checkbox', {
        template: require('text!./inline-checkbox.html'),
        mixins: [InlineMixin],
        mounted: function() {
            var parent = $(this.$el).parent();
            var span = $(this.$el).children('span');

            span.css('top', (parent.height() - span.height()) / 2 + 'px');
            this.contextReset();
        },
        methods: {
            onClick: function() {
                this.fireEvent();
                this.isModified = (this.value !== this.original);
            }
        }
    });
});