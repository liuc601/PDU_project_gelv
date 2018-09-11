define(function(require) {
    var Vue = require('vue');
    var $ = require('jquery');
    /*
        === props ~ interfaces
        menus:
            icon:
            title:
            access:
            children:
            selected:

        user:
            access:
            ...
    */

    require('transition/slide-updown');

    return Vue.component('ml-navleft', {
        template: require('text!./navleft.html'),
        props: ['bus', 'menus', 'user'],
        data: function() {
            return {
                currentMenu: this.menus[0],
                currentSubMenu: this.menus[0].children ? this.menus[0].children[0] : undefined,
            }
        },
        /*
                computed: {
                    height: function () {
                        return $('.left_col').eq(1).height();
                    }
                },
        */
        mounted: function() {
            this.currentMenu.selected = true;

            if (this.currentSubMenu)
                this.currentSubMenu.selected = true;

            this.bus.$emit('navleft:resize', $('.left_col').height());
        },
        beforeMount: function() {
            var that = this;

            $(window).resize(function() {
                that.bus.$emit('navleft:resize', $('#nav-left').height());
            });

            this.bus.$on('navtop:menutoggle', function() {
                $('body').toggleClass('nav-md nav-sm');

                var current = that.currentMenu;

                if ($('body').hasClass('nav-md')) {
                    current.selected = true;
                    this.NavTopIcon=true;//收起的图标
                } else {
                    current.selected = false;
                    this.NavTopIcon=false;//收起的图标
                }
            });
        },
        methods: {
            unSelectPrev: function() {
                if (this.currentSubMenu)
                    this.currentSubMenu.selected = false;
            },
            menuClick: function(self, parent, event) {
                if (this.currentMenu != self)
                    this.currentMenu.selected = false;

                self.selected = !self.selected;

                this.currentMenu = self;

                if (this.currentMenu.children === undefined ||
                    this.currentMenu.children.length == 0) {
                    this.unSelectPrev();
                    this.$router.push('/' + this.currentMenu.path);
                }
            },
            subMenuClick: function(self, parent) {
                if ($('body').hasClass('nav-sm')) {
                    this.currentMenu.selected = false;
                }

                if (self.selected)
                    return;

                self.selected = true;

                this.unSelectPrev();
                this.currentSubMenu = self;
            },
            slideDone: function(event) {
                this.bus.$emit('navleft:resize', $('#nav-left').height());
            },
            loginOut:function(){//退出登录的写法
                this.bus.$emit('loginOut');
            }
        }
    })
});