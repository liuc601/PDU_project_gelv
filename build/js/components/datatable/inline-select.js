define(function(require) {
    'use strict';
    var Vue = require('vue');
    var $ = require('jquery');
    var InlineMixin = require('components/datatable/inline-mixin');

    return Vue.component('inline-select', {
        template: require('text!./inline-select.html'),
        mixins: [InlineMixin],
        data: function() {
            return {
                options: []
            };
        },
        mounted: function() {
            this.options = this.rowField.__options;
            this.contextReset();
        },
        methods: {
            onChange: function() {
                this.fireEvent();

                if (this.value !== this.original) {
                    this.isModified = true;
                } else {
                    this.isModified = false;
                }
            }
        }
    });
});