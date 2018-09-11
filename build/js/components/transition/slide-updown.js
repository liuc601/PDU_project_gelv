define(function(require){
    var Vue = require('vue');
    var Velocity = require('velocity');

    var template = '\
    <transition\
      name="slide-updown"\
      mode="out-in"\
      v-on:before-enter="beforeEnter"\
      v-on:leave="leave"\
    >\
        <slot></slot>\
    </transition>\
  ';

    return Vue.component('tr-slide-updown', {
        template: template,
        methods: {
            beforeEnter: function (el) {
                var that = this;

                $(el).velocity('slideDown', {
                    complete: function() {
                        that.$emit('slide', 'done')
                    }
                });

                return function () {
                    $(el).stop()
                }                
            },
            leave: function (el, done) {
                var that = this;

                $(el).velocity('slideUp', {
                    complete: function () {
                        done();
                        that.$emit('slide', 'done')
                    }
                });

                return function () {
                    $(el).stop()
                }
            }
        }
    });
});