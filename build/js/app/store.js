define(function (require) {
    require('promise');

    var Vue = require('vue');
    var Vuex = require('vuex');

    Vue.use(Vuex);

    return new Vuex.Store({
        state: {
            urlBeforeLogin: '/',
            urlSubRedirect: '',
            usrLoginState: false,
            usrAccessLevel: 65535,
            userName: '',//需要将用户数据存储在本地
            userImg: '',
            deviceCap: 0,
            sysinfo:{
                fwVersion:'---',
                model:'---',
            }
        },
        getters: {
            usrAccessLevel: function (state) {
                return state.usrAccessLevel;
            },
            usrLoginState: function (state) {
                return state.usrLoginState;
            },
            urlBeforeLogin: function (state) {
                return state.urlBeforeLogin;
            },
            urlSubRedirect: function (state) {
                return state.urlSubRedirect;
            },
            deviceCap: function (state) {
                return state.deviceCap;
            },
            userName: function (state) {//获取用户名
                return state.userName;
            },
            userImg: function (state) {//获取用户头像
                return state.userImg;
            },
            getSysinfo:function(state){
                return state.sysinfo;
            }
        },
        mutations: {
            setUsrAccessLevel: function (state, level) {
                state.usrAccessLevel = level;
            },
            setUsrLoginState: function (state, login) {
                state.usrLoginState = login;
            },
            setUrlBeforeLogin: function (state, url) {
                state.urlBeforeLogin = url;
            },
            setUrlSubRedirect: function (state, url) {
                state.urlSubRedirect = url;
            },
            setDeviceCap: function (state, data) {
                state.deviceCap = data;
            },
            setUserName: function (state, data) {
                state.userName = data;
            },
            setUserImg: function (state, data) {
                state.userImg = data;
            },
            setSysinfo:function(state, data){
                state.sysinfo.model = data.model;
                state.sysinfo.fwVersion = data.fwVersion;
            }
        }
    });
});