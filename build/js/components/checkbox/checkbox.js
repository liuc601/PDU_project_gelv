define(function(require) {
    var Vue = require('vue');
    var $ = require('jquery');
    var iCheck = require('iCheck');
    var icheckDefOptions = {
        checkboxClass: 'icheckbox_flat-green',
        inheritClass: true
    };

    return Vue.component('checkbox', {
        template: '<input type="checkbox"></input>',
        props: {
            checked: {
                type: Boolean
            }
        },
        data: function() {
            return {
                __checked: false
            };
        },
        mounted: function() {
            var vm = this;
            vm.__checked = this.checked;

            $(this.$el).iCheck(icheckDefOptions);
            $(this.$el).on('ifToggled', function(event) {
                vm.$emit('change', event);
                vm.__checked = event.currentTarget.checked;
            });

            if (this.__checked === true) {
                $(this.$el).iCheck('check');
            } else if (this.__checked === false) {
                $(this.$el).iCheck('uncheck');
            }
            $(this.$el).iCheck('uncheck');
        },
        watch: {
            checked: function(nVal, oVal) {
                this.__checked = nVal;

                if (nVal) {
                    $(this.$el).prop('checked', 'checked');
                } else {
                    $(this.$el).removeProp('checked');
                }

                $(this.$el).iCheck('update');
            }
        }
    });
});