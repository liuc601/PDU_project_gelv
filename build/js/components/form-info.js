define(function(require) {
    var Vue = require('vue');

    return Vue.component('form-info', {
        template: require('text!./form-info.html'),
        props: {
            model: {
                type: Object,
                require: true,
            },
            fields: {
                type: Array,
                require: true,
            }
        }
    });
});