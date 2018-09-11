define(function(require) {
    var Vue = require('vue');

    return Vue.component('status-table', {
        template: require('text!./status-table.html'),
        props: {
            fields: {
                type: Array,
                require: true
            },
            datas: {
                type: Array,
                require: true
            }
        },
        beforeMount: function() {
            for (var i = 0; i < this.fields.length; i++) {
                var field = this.fields[i];

                field.__getValue = this.getFieldValue;
                field.__getUnit = this.getFieldUnit;
            }
        },
        methods: {
            getFieldValue: function(row, field) {
                return (row[field.name] === undefined) ? field.default : row[field.name];
            },
            getFieldUnit: function(row, field) {
                return (typeof(field.unit) === 'function') ? field.unit(row, field.name) : field.unit;
            }
        }
    });
});