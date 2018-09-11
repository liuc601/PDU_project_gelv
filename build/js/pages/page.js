define(function(require) {
    var Vue = require('vue');

    return Vue.component('x-page', {
        template: require('text!./page.html'),
        props: {
            title: {
                type: String,
                require: true
            }
        }
    });
});