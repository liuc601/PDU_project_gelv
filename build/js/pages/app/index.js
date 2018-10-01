/* 
    这个是父组件，所有的子组件都通过这个父组件来进行渲染
*/
define(function (require) {
    //require('datatables');
    require('components/navleft');
    require('components/navtop');
    require('components/footer');

    var Vue = require('vue');
    var appRoutes = require('app/routes')[0].children; //包含所有模块的路由信息
    /*
        === props ~ interfaces
        menus:
            icon:
            path:
            title:
            access:
            children:
            selected:

        user:
            access:
            ...
    */
    function generateMenus(routes) {
        var menus = [];

        for (var i = 0; i < routes.length; i++) {
            if (!routes[i].meta || routes[i].meta.hide)
                continue;

            var menu = {
                path: routes[i].path,
                icon: routes[i].meta.icon,
                title: routes[i].meta.title,
                selected: routes[i].meta.selected,
                access: routes[i].meta.access
            };

            if (routes[i].children) {
                menu.children = generateMenus(routes[i].children);
            }

            menus.push(menu);
        }
        return menus;
    }

    return Vue.extend({
        template: require('text!./index.html'),
        data: function () {
            if (this.$store.getters.deviceCap.outletTotal == 0) {
                //appRoutes[1].children.pop();
                for (var i = 0; i < appRoutes[1].children.length; i++) {
                    if (appRoutes[1].children[i].path == "outlet") {
                        appRoutes[1].children.splice(i, 1);
                    }
                }
            }

            if (this.$store.getters.deviceCap.ocpTotal == 0) {
                //appRoutes[1].children.pop();
                for (var i = 0; i < appRoutes[1].children.length; i++) {
                    if (appRoutes[1].children[i].path == "ocp") {
                        appRoutes[1].children.splice(i, 1);
                    }
                }
            }

            return {
                leftHeight: 0,
                topHeight: 0,
                footerHeight: 0,
                bus: new Vue({
                    data: function () {
                        return {
                            NavTopIcon: true
                        }
                    }
                }),
                menus: generateMenus(appRoutes),
                user: {
                    access: 0,
                    userImg: '',
                    userName: '',
                },
                autoOutTimer: null,
            }
        },
        beforeCreate: function () {
            $('body').removeClass();
            $('body').addClass('nav-md');

            $('#app').removeClass();
            $('#app').addClass('container body');
        },
        beforeMount: function () {
            var that = this;
            this.setUserMsg(); //获取用户信息，设置到页面      

            this.bus.$on('navleft:resize', function (height) { //监听时间吗
                that.leftHeight = height;
            });

            this.bus.$on('navtop:resize', function (height) {
                that.topHeight = height;
            });
            this.bus.$on('footer:resize', function (height) {
                that.footerHeight = height;
            });
            this.bus.$on('loginOut', function () {
                that.loginOut();
            });
        },
        mounted: function () {
            var t = 15;
            var defaultRoute = '/' + appRoutes[0].path;
            if (appRoutes[0].children && appRoutes[0].children.length)
                defaultRoute += '/' + appRoutes[0].children[0].path;

            if (this.$store.getters.urlBeforeLogin !== '/') {
                defaultRoute = this.$store.getters.urlBeforeLogin;
                this.$store.commit('setUrlBeforeLogin', '/');
            }

            this.$router.push(defaultRoute);
            $.get('/cgi-bin/luci/api/v1/overview/sysinfo').success(function (response) {
                //获取所有的信息，然后设置进头部的状态栏
                // that.sysinfo = Object.assign({}, response);
                this.$store.commit("setSysinfo", response);
            }.bind(this))
            this.globalClickEvent(); //修复服务器登陆信息超时时，用户在操作的时候，仍然强制退出的问题
        },
        computed: {
            colHeight: function () {
                var defHeight = $(window).height() - this.footerHeight;

                $('.right_col').css('min-height', defHeight);

                var bodyHeight = $('body').outerHeight();
                var height = bodyHeight < this.leftHeight ? this.leftHeight : bodyHeight;

                height -= this.topHeight + this.footerHeight + 8;

                return height + 'px';
            },
            minHeight: function () {
                return {
                    'min-height': this.colHeight
                }
            },
        },
        methods: {
            setUserMsg: function () { //设置用户头像和用户名
                this.user.userName = this.$store.getters.userName;
                this.user.userImg = this.$store.getters.userImg;
                this.user.access = this.$store.getters.usrAccessLevel;
            },
            loginOut: function () {
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/logout',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify({
                        username: this.cookieGet('setUserName'),
                        password: this.cookieGet('setUserToken')
                    }),
                    success: function (response) {}
                })

                //退出登录，清除各种数据
                this.cookieSet('setUsrLoginState', false, 0);
                this.cookieSet('setUserName', '', 0); //本地cookie
                this.cookieSet('setUserImg', '', 0);
                this.$store.commit('setUsrLoginState', false);
                this.$emit('event', 'EVT_LOGOUT_SUCCESS');
                window.location.reload();
            },
            cookieSet: function (c_name, value, expiredays) {
                var exdate = new Date()
                exdate.setDate(exdate.getDate() + expiredays * 1000000)
                document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
            },
            cookieGet: function (name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = parent.document.cookie.match(reg)) {
                    return unescape(arr[2]);
                } else {
                    return null;
                }
            },
            globalClickEvent: function () { //全局点击事件
                this.autoOutTimer = setTimeout(function () {
                    this.loginOut();
                    clearTimeout(this.autoOutTimer);
                }.bind(this), this.$store.getters.deviceCap.timeout*60*1000)
                document.onclick = function () {
                    clearTimeout(this.autoOutTimer);
                    this.autoOutTimer = setTimeout(function () {
                        this.loginOut();
                        clearTimeout(this.autoOutTimer);
                    }.bind(this), this.$store.getters.deviceCap.timeout*60*1000)
                }.bind(this)
            }
        },

    });
});