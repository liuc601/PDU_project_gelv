define(function(require) {
    var Vue = require('vue');

    return Vue.extend({
        template: '<label>{{$route.fullPath}}</label>'
    });
});