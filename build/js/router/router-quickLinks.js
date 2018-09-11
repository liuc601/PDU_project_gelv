/*
 服务成效页面
 * @Author: xxx
 * @Date: 2018-04-23 11:37:13
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-23 22:18:29
 */
define(function() {
  var callChain = {
    path: 'http://www.xyzqts.cn:8072/hibbert/index.html?simpson_sso=4717a882-f79e-4d46-b6d9-54b75729a7ef', //项目列表
    component: function(resolve) {
      require(['_pages/serviceEffectiveness/tip-component'], resolve);
    },
    name: '调用链',
    children: [],
    meta: {
      access: 2,
      title: '调用链',
      icon: 'fa-life-ring',
      token:'DYL'
    }
  };
  var serviceDispatch = {
    path: '//192.25.105.229:8899', //项目列表
    component: function(resolve) {
      require(['_pages/serviceEffectiveness/tip-component'], resolve);
    },
    name: '服务调度',
    children: [],
    meta: {
      access: 2,
      title: '服务调度',
      icon: 'fa-cube',
      token:'FWDD'
    }
  };
  var motManage = {
    path: 'http://192.25.105.96:7080/mot/index', //项目列表
    component: function(resolve) {
      require(['_pages/serviceEffectiveness/tip-component'], resolve);
    },
    name: 'MOT管理平台',
    children: [],
    meta: {
      access: 2,
      title: 'MOT管理平台',
      icon: 'fa-road',
      token:'MOTGLPT'
    }
  };
  var weiChat = {
    path: 'http://27.151.112.180:8079/wechatbiz/backstage/main?token=y1mmpfmzns', //项目列表
    component: function(resolve) {
      require(['_pages/serviceEffectiveness/tip-component'], resolve);
    },
    name: '微信运营平台',
    children: [],
    meta: {
      access: 2,
      title: '微信运营平台',
      icon: 'fa-weixin',
      token:'WXYYPT'
    }
  }
  var quickLinks = {
    path: 'quickLinks',
    component: function(resolve) {
      // require(['_pages/serviceEffectiveness/serviceEffectiveness'], resolve);
      require(['_pages/home/home'], resolve);
    },
    name: '快速链接',
    children: [callChain,serviceDispatch,motManage,weiChat],
    meta: {
      access: 1,
      icon: 'fa-cube',
      title: '快速链接',
      token:'KSLJ'
    }
  };
  return quickLinks;
});
