define(function(require) {
    var Vue = require('vue');

    return Vue.component('status-bar', {
        template: require('text!./status-bar.html'),
        props: {
            color: {
                type: String,
                require: true,
                default: ''
            },
            percentage: {
                type: String,
                require: true,
                default: ''
            }
        }
    });
});