define(function (require) {
    var Vue = require('vue');
    var vueData =Vue.component('e-dialog',{
        template: require('text!./dialog.html'),
        props: {
            title: {
                type: String,
                default: ''
            },

            modal: {
                type: Boolean,
                default: true
            },
            visible: {
                type: Boolean,
                default: true
            },

            modalAppendToBody: {
                type: Boolean,
                default: true
            },

            lockScroll: {
                type: Boolean,
                default: true
            },

            closeOnClickModal: {
                type: Boolean,
                default: true
            },


            showClose: {
                type: Boolean,
                default: true
            },

            width: String,

            fullscreen: Boolean,

            customClass: {
                type: String,
                default: ''
            },

            top: {
                type: String,
                default: '15vh'
            },
            beforeClose: Function,
            center: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                showDialog: false
            };
        },
        watch: {
            visible:function(val) {
                if (val) {
                    this.showDialog = true;

                } 
            }
        },
        computed: {},
        mounted: function () {
        },
        beforeDestroy: function () {
            clearInterval(this.timer);
            clearInterval(this.timer_2);
        },
        methods: {
            open: function () {

            },
            handleClose:function(){
                this.showDialog = false;
                this.$emit("close");
            },
            showAlertDialog: function () {
                this.showDialog = !this.showDialog;
            },
        }
    });
    return vueData;
});