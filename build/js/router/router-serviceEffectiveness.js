/*
 服务成效页面
 * @Author: xxx
 * @Date: 2018-04-23 11:37:13
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-23 22:18:29
 */
 define(function() {
     var callChain={
       path: 'childrenMenu',//项目列表
       component: function(resolve) {
         require(['_pages/serviceEffectiveness/tip-component'], resolve);
       },
       name: '子菜单',
       children: [],
       meta: {
         access: 2,
         title: '子菜单',
       }
     };
     var serviceDispatch={
       path: '//192.25.105.229:8899',//项目列表
       component: function(resolve) {
         require(['_pages/serviceEffectiveness/tip-component'], resolve);
       },
       name: '服务调度',
       children: [],
       meta: {
         access: 2,
         title: '服务调度',
       }
     };
     var motManage={
       path: 'http://192.25.105.96:7080/mot/index',//项目列表
       component: function(resolve) {
         require(['_pages/serviceEffectiveness/tip-component'], resolve);
       },
       name: 'mot管理平台',
       children: [],
       meta: {
         access: 2,
         title: 'mot管理平台',
       }
     };
     var weiChat={
       path: 'http://27.151.112.180:8079/wechatbiz/backstage/main?token=y1mmpfmzns',//项目列表
       component: function(resolve) {
         require(['_pages/serviceEffectiveness/tip-component'], resolve);
       },
       name: '微信运营平台',
       children: [],
       meta: {
         access: 2,
         title: '微信运营平台',
       }
     };
     var serviceEffectiveness={
         path: 'serviceEffectiveness',
         component: function(resolve) {
             // require(['_pages/serviceEffectiveness/serviceEffectiveness'], resolve);
             require(['_pages/home/home'], resolve);
         },
         name: '成效分析',
         children: [callChain],
         meta: {
             access: 1,
             icon: 'fa-table',
             title: '成效分析',
             token:'CXFX'
         }
     };
     return serviceEffectiveness;
 });
