define(function (require) {
    var $ = require('jquery');
    var Vue = require('vue');

    return Vue.component('ml-footer', {
        props: ['bus'],
        mounted: function(){
            this.bus.$emit('footer:resize', $('footer').height());
        },
        template: require('text!./footer.html')
    })
});