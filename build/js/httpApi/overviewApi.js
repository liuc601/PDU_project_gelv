/*
  服务预览的接口文件
*/
define(function(require) {
  var Vue = require('vue');
  var axios = Vue.axios;
  return {

    getProjectList: function() { //之后可能要放到另外一个文件里面
      return axios.get('/project/list');
    },
    getProjectModuleList: function(data) { //之后可能要放到另外一个文件里面
      return axios.get('/project/module/list?' + $.param(data));
    },

    //获取用户的权限列表
    getUserAuthList: function() {
      return axios.get('/front/permitmenus' );
    },

    //1.2.1 获取服务总览数据
    getServiceOverview: function(data) {
      return axios.get('/module/stats/list?' + $.param(data));
    },

    //1.2.2 关注、取消关注
    setConcern(data) {
      return axios.post('/module/concern', $.param(data));
    },

    //1.2.3 获取服务时序图表数据
    getServiceSequence: function(data) {
      return axios.get('/module/sequence/list?' + $.param(data));
    },

    //1.2.4 获取服务相关信息
    getServiceInfo: function(data) {
      return axios.get('/module/stats/info?' + $.param(data));
    },

    //1.2.5 获取接口总览数据
    getInterfaceOverview: function(data) {
      return axios.get('/function/stats/list?' + $.param(data));
    },

    //1.2.7 获取接口时序图表数据
    getInterfaceSequence: function(data) {
      return axios.get('/function/sequence/list?' + $.param(data));
    },

    //1.2.8 获取接口相关信息
    getInterfaceInfo: function(data) {
      return axios.get('/function/stats/info?' + $.param(data));
    },

    //1.4.1 获取服务调用链列表
    getServiceCallChain: function(data) {
      return axios.get('/module/function/list?' + $.param(data));
    },

    //1.4.2 获取接口调用链列表
    getInterfaceCallChain: function(data) {
      return axios.get('/function/callchain/list?' + $.param(data));
    },

    //1.5.1 获取APM工程列表
    getAPMProjectList: function() {
      return axios.get('/apm/project/list');
    },

    //1.5.2 获取APM工程下接口列表
    getAPMProjectInterfaceList: function(data) {
      return axios.get('/apm/project/function/list?' + $.param(data));
    },

    //1.5.3 保存APM导入接口
    saveAPMProjectInterfaceList: function(data) {
      return axios.get('/apm/project/function/save?' + $.param(data));
    },

    //1.5.3 保存APM导入接口
    clearAPMInterfaceCache: function() {
      return axios.get('/sys/clear');
    },
  }

});
