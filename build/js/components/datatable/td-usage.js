define(function(require) {
    var Vue = require('vue');
    require('components/usage-bar');

    return Vue.component('td-usage', {
        template: '<usage-bar :current="value" :max="max" :range="range" :prompt="prompt" :unit="unit"></usage-bar>',
        props: {
            rowData: {
                type: Object,
                require: true
            },
            rowField: {
                type: Object,
                require: true
            }
        },
        methods: {
            loadValue: function() {
                var bar = this.field.__bar;

                if (bar) {
                    this.value = this.row[bar.target];
                    this.max = this.row[this.field.name];
                    this.range = bar.range;
                }
            }
        },
        computed: {
            prompt: function() {
                var bar = this.rowField.__bar;

                if (bar)
                    return bar.prompt;

                return false;
            },
            range: function() {
                var bar = this.rowField.__bar;

                if (bar)
                    return bar.range;
            },
            value: function() {
                var bar = this.rowField.__bar;

                if (bar)
                    return this.rowData[bar.target];
            },
            max: function() {
                var field = (this.rowField.sortField === undefined) ? this.rowField.name.split(':')[2] : this.rowField.sortField;

                return this.rowData[field];
            },
            unit: function() {
                var bar = this.rowField.__bar;

                if (bar) {
                    if (typeof(bar.unit) === "string")
                        return bar.unit;
                    else if (typeof(bar.unit) === "function") {
                        return bar.unit(this.row, this.field);
                    }
                }
            }
        }
    });
});