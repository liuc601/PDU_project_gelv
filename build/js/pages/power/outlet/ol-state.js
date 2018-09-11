define(function(require) {
    var Vue = require('vue');

    return Vue.component('ol-state', {
        template: require('text!./ol-state.html'),
        props: {
            rowData: {
                type: Object,
                required: true
            },
            rowIndex: {
                type: Number,
                require: true,
            },
            rowField: {
                type: Object,
                require: true
            },
            rowTrack: {
                require: true
            }
        },
        computed: {
            state: function() {
                var field = this.rowField.sortField;
                field = (field === undefined) ? this.rowField.name.split(':')[2] : field;
                if (this.rowData[field])
                    return 'On';

                return 'Off';
            },
            class: function() {
                return (this.rowData[field]) ? 'label-warning' : 'label-success';
            },
            locked: function() {
                return this.rowData.locked;
            }
        }
    });
});