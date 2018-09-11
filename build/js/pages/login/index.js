define(function (require) {
    var $ = require('jquery');
    var Vue = require('vue');
    var layer=require('layer');
    return Vue.extend({
        template: require('text!./index.html'),
        data: function () {
            return {
                name: '',
                passwd: '',
                isThird: false,//这个参数是干嘛的，为什么传了却不接收？
                logined: false,
                tryAutoLogin: true
            }
        },
        beforeCreate: function () {
            $('body').removeClass();
            $('body').addClass('login');
        },
        beforeMount: function () {
            var that = this;
            // read cookies info here??
            if (this.cookieGet('setUsrLoginState')) {//每次都会先判断有没有登录
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/login?type=quick',
                    type: 'POST',
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                    contentType: 'application/json',
                    success: function(response) {
                        that.cookieSet('setUsrLoginState', true, 1);
                        that.$store.commit('setUserName', response.user);
                        that.$store.commit('setUserImg', response.userImg);
                        that.$store.commit('setUsrAccessLevel', response.accessLevel);
                        that.$store.commit('setUsrLoginState', true);
                        that.$store.commit('setDeviceCap', response.deviceCap);
                        that.$emit('event', 'EVT_LOGIN_SUCCESS');
                    }.bind(this)
                    
                })
                // that.$store.commit('setUsrAccessLevel', 0);
                // that.$store.commit('setUsrLoginState', true);
                // that.$emit('event', 'EVT_LOGIN_SUCCESS');
            }
        },
        methods: {
            loginClick: function () {
                var that = this;
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/login',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify({
                        username: this.name,
                        password: this.passwd
                    }),
                    xhrFields: {
                        withCredentials: true
                    },
                    contentType: 'application/json',
                    success: function(response) {
                        that.cookieSet('setUsrLoginState', true, 1);
                        that.$store.commit('setUsrAccessLevel', 0);
                        that.$store.commit('setUsrLoginState', true);
                        that.$store.commit('setDeviceCap', response.deviceCap);
                        //设置用户头像和用户名
                        var time = new Date();
                        var token = time.getFullYear() + '/' + (time.getMonth()+1) + '/' + time.getDate() + ',' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
                        that.cookieSet('setUserName', response.user);//本地cookie
                        that.cookieSet('setUserImg', '');
                        that.cookieSet('setUserToken', token);
                        that.$store.commit('setUserName', response.user);//传给store
                        that.$store.commit('setUserImg', '');
                        that.$store.commit('setUsrAccessLevel', response.accessLevel);//设置用户等级
                        that.$emit('event', 'EVT_LOGIN_SUCCESS');
                        location.reload(true) ;
                    }.bind(this)
                })
            },
            enterEvent:function(e){//用户点击按下键盘的时候，调用登录的方法
                if(e.keyCode=="13"){
                    this.loginClick();
                }
            },
            loginSwitch: function (type) {
                if (type === 'local') {
                    this.isThird = false;
                } else {
                    this.isThird = true;
                }
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
            }
        }
    });
});