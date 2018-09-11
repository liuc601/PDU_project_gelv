define(function (require) {
    var Vue = require('vue');
    var $ = require('jquery');

    return Vue.component('ml-navtop', {
        template: require('text!./navtop.html'),
        props: ['bus','user'],
        mounted: function () {
            this.bus.$emit('navtop:resize', $('.nav_menu').height());
        },
        computed:{
            menuToggleIcon:function(){
                if(this.bus.NavTopIcon){
                    return "fa fa-outdent"
                }else{
                    return "fa fa-indent"
                }
            },
            sysinfo:function(){
                return this.$store.getters.getSysinfo
            }
        },
        // watch:{
        //     "this.bus.NavTopIcon":function(){
        //         console.log();
        //     }
        // },
        methods: {
            menuTrigger: function(){
                this.bus.$emit('navtop:menutoggle');
            },
            loginOut:function(){//退出登录的写法
                this.bus.$emit('loginOut');
            }
        }
    });
});