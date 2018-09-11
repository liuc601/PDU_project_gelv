/*
 vue路由的配置文件，主引导路由
 路由运行顺序2
 * @Author: xxx
 * @Date: 2018-04-23 11:37:13
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-01 23:45:05
 */
define(function(require) {
  var overview = require('_utils/router/router-overview'); //引入其他的路由配置
  var serviceDefinition = require('_utils/router/router-serviceDefinition'); //引入其他的路由配置
  var serviceAccess = require('_utils/router/router-serviceAccess'); //引入其他的路由配置
  var serviceEffectiveness = require('_utils/router/router-serviceEffectiveness'); //引入其他的路由配置
  var quickLinks = require('_utils/router/router-quickLinks'); //引入其他的路由配置
  var appRoutes = [
    overview,
    serviceDefinition,
    serviceAccess,
    serviceEffectiveness,
    quickLinks
    // {path: 'overview',
    //  component: function(resolve) {
    //     require(['_pages/overview/overview'], resolve);
    //  },
    // }
  ];
  return [ //分两个路由页面，一个负责平时的渲染，一个是负责登录
    {
      path: '/',
      children: appRoutes,
      name: '首页',
      component: function(resolve) {
        require(['_pages/index/index'], resolve);
        //  require(['_pages/home/home'], resolve);
      },
      meta: {
        access: 0,
        code:'SY'
      }
    },
    {
      path: '/login',
      component: function(resolve) {
        require(['_pages/login/login'], resolve);
      },
      meta: {
        access: 0,
        code:'DL'
      }
    }
  ]
});
