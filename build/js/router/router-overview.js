/*
 vue路由的配置文件，主引导路由
 * @Author: xxx
 * @Date: 2018-04-23 11:37:13
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-01 23:12:11
 */
define(function() {
  var app = {
    path: 'app', //应用概览
    component: function(resolve) {
      // require(['_pages/overview/app'], resolve);
      require(['_pages/home/home'], resolve);
    },
    name: '应用概览',
    meta: {
      access: 2,
      title: '应用概览',
      token:'YYGL'
    }
  };
  var appOfTopo = {
    path: 'appOfTopo', //主机概览
    component: function(resolve) {
      require(['_pages/overview/app-of-topo'], resolve);
    },
    name: '应用拓扑',
    meta: {
      access: 2,
      title: '应用拓扑',
      token:'YYTP'
    }
  };
  var serviceRuningOverview = {
    path: 'serviceRuningOverview', //服务运行总览
    component: function(resolve) {
      require(['_pages/overview/service-runing-overview'], resolve);
    },
    name: '服务运行总览',
    meta: {
      access: 2,
      title: '服务运行总览',
      token:'FWYXZL'
    },
    children: [{
        path: ':pId(\\d+)/detail/:mId(\\d+)', //服务运行总览
        component: function(resolve) {
          // require(['_sro/detail'], resolve);
          require(['_roverview/detail'], resolve);
        },
        name: '服务运行详情',
        meta: {
          access: 2,
          title: '服务运行详情'
        },
        children: [{
            path: 'callChainDetail/:callStr(\\S+)', //服务运行总览
            // path: 'callChainDetail', //服务运行总览
            component: function(resolve) {
              // require(['_sro/detail'], resolve);
              require(['_roverview/call-chain-detail'], resolve);
            },
            name: '服务详情调用链详情',
            meta: {
              access: 2,
              title: '服务详情调用链详情'
            },
          }]
      },
      {
        path: ':pId(\\d+)/realTime/:mId(\\d+)', //服务运行总览
        component: function(resolve) {
          // require(['_sro/real-time'], resolve);
          require(['_roverview/real-time'], resolve);

        },
        name: '服务运行实时信息',
        meta: {
          access: 2,
          title: '服务运行实时信息'
        },
      },
      {
        path: 'callChainList/:id(\\d+)', //服务运行总览
        component: function(resolve) {
          require(['_roverview/call-chain-list'], resolve);
        },
        name: '服务调用链列表',
        meta: {
          access: 2,
          title: '服务调用链列表'
        }
      },
    ]
  };
  var interfaceRuningOverview = {
    path: 'interfaceRuningOverview', //服务运行总览
    component: function(resolve) {
      require(['_pages/overview/interface-runing-overview'], resolve);
    },
    name: '接口运行总览',
    meta: {
      access: 2,
      title: '接口运行总览',
      token:'JKYXZL'
    },
    children: [{
        path: ':mId(\\d+)/detail/:fId(\\d+)', //接口运行详情
        component: function(resolve) {
          // require(['_iro/detail'], resolve);
          require(['_roverview/detail'], resolve);
        },
        name: '接口运行详情',
        meta: {
          access: 2,
          title: '接口运行运行详情'
        },
        // children: [{
        //     path: 'callChainDetail/:callStr(\\w+)', //服务运行总览
        //     // path: 'callChainDetail', //服务运行总览
        //     component: function(resolve) {
        //       // require(['_sro/detail'], resolve);
        //       require(['_roverview/call-chain-detail'], resolve);
        //     },
        //     name: '接口详情调用链列表',
        //     meta: {
        //       access: 2,
        //       title: '接口详情调用链列表'
        //     },
        //   }]
      },
      {
        path: ':mId(\\d+)/realTime/:fId(\\d+)', //服务运行总览
        component: function(resolve) {
          // require(['_iro/real-time'], resolve);
          require(['_roverview/real-time'], resolve);
        },
        name: '接口运行实时信息',
        meta: {
          access: 2,
          title: '接口运行实时信息'
        },
      },
      {
        path: 'interfaceCallChainList/:id(\\d+)', //服务运行总览
        component: function(resolve) {
          require(['_roverview/interface-call-chain-list'], resolve);
        },
        name: '接口调用链列表',
        meta: {
          access: 2,
          title: '接口调用链列表'
        },
        children: [{
            path: 'callChainDetail/:callStr(\\S+)', //服务运行总览
            component: function(resolve) {
              // require(['_sro/detail'], resolve);
              require(['_roverview/call-chain-detail'], resolve);
            },
            name: '接口调用链详情',
            meta: {
              access: 2,
              title: '接口调用链详情'
            },
        }]
      },
    ],
  };
  var overview = {
    path: 'overview',
    component: function(resolve) {
      // require(['_pages/overview/overview'], resolve);
      require(['_pages/home/home'], resolve);
    },
    // children: [app,mainframe],
    children: [app, appOfTopo, serviceRuningOverview, interfaceRuningOverview],
    name: '概况',
    meta: {
      access: 1,
      title: '概况',
      icon: 'fa-home',
      token:'GK'

    }
  };
  return overview;
});
