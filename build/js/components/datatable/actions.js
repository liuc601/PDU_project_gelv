define(function(require) {
    'use strict';
    var Vue = require('vue');

    return Vue.component("table-actions", {
        template: require('text!./actions.html'),
        props: {
            rowData: {
                type: Object,
                required: true
            },
            rowIndex: {
                type: Number
            },
            rowField: {
                type: Object,
                require: true
            },
            rowTrack: {
                require: true
            },
            actionsWrapClass: {
                type: String,
                default: ''
            },
            viewClass: {
                type: String,
                default: 'btn btn-default btn-xs'
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
        data: function() {
            return {
                showDel: true,
                showEdit: true,
            };
        },
        beforeMount: function() {
            if (this.rowField.__com) {
                var showDel = this.rowField.__com.showDel;
                var showEdit = this.rowField.__com.showEdit;

                this.showDel = (showDel !== undefined) ? showDel : this.showDel;
                this.showEdit = (showEdit !== undefined) ? showEdit : this.showEdit;
            }
        },
        methods: {
            itemAction: function(act, data, index) {
                var action = 'tableAction:' + act;

                this.$parent.$emit(action, index, data);
            }
        }
    });
});