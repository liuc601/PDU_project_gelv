define(function(require) {
  require('promise');
  var Vue = require('vue');
  var Vuex = require('vuex');
  var serDefiMd=require('./store-service-definition');
  Vue.use(Vuex);

  return new Vuex.Store({
    // modules: {
    //   serDefiMd:serDefiMd
    // },
    state: {
      beforeLoginUrl: '/', //存储登录之前的url
      isLogin: false, //存储登录状态
      userName: '', //用户名
      userLv: '0', //账号等级，暂定0最高，属于系统级别
      projectRoles: {},
      //搜索相关的数据
      serviceSearched: false,
      serviceSearchText: "",
      serviceSearchResults: [],
      /*
        verview的区分
      */
      //存储来自服务运行总览和接口运行总览的选择数据
      // sroPid:1,
      sroPid: null,
      sroCardOrList: null,
      iroPid: null,
      iroMid: null,
      iroCardOrList: null,
      nowService:'',//服务运行喝接口运行的当前名字
    },
    getters: {
      isLogin: function(state) {
        return state.isLogin;
      },
      getUserName: function(state) {
        return state.userName;
      },
      /*
        verview的区分
      */
      nowService: function(state) {
        return state.nowService;
      },
    },
    mutations: {
      setLoginState: function(state, login) {
        state.isLogin = login;
      },
      setgetUserName: function(state, name) {
        state.userName = name;
      },
      initProjectRoles: function(state, roles) {
        roles.forEach(function(r) {
          state.projectRoles[r.roleId] = Object.assign({}, r);
        });
      },
      //搜索结果啥的
      setServiceSearched: function(state, searched) {
        state.serviceSearched = searched;
      },
      setServiceSearchText: function(state, serviceSearchText) {
        state.serviceSearchText = serviceSearchText;
      },
      setServiceSearchResults: function(state, searchResults) {
        state.serviceSearchResults = [].concat(searchResults);
      },
      /*
        verview的区分
      */
      //设置服务运行总览和接口运行总览的数据
      setSroPid: function(state, pId) {
        state.sroPid = pId;
      },
      setSroCardOrList: function(state, sroCardOrList) {
        state.sroCardOrList = sroCardOrList;
      },
      setIroPid: function(state, pId) {
        state.iroPid = pId;
      },
      setIroMid: function(state, mId) {
        state.iroMid = mId;
      },
      setIroCardOrList: function(state, iroCardOrList) {
        state.iroCardOrList = iroCardOrList;
      },
      setNowService: function(state, nowService) {
        state.nowService = nowService;
      },
    },

  });
});
