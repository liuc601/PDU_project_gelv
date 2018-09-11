/*
 vue路由的配置文件，主引导路由
 * @Author: xxx
 * @Date: 2018-04-23 11:37:13
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-23 22:18:29
 */
define(function() {
  var project = {
    path: 'project', //项目列表
    component: function(resolve) {
      require(['_pages/serviceAccess/project'], resolve);
    },
    name: '网关设置',
    meta: {
      access: 2,
      title: '网关设置',
      token:'WGSZ'
    },
    children: [{
      path: ':id(\\d+)/modules',
      // path: 'interfaces/:id',
      name: '服务列表',
      component: function(resolve) {
        require(['_projectSa/module-list'], resolve);
      },
      icon: 'el-icon-document',
      meta: {
        menu: false
      },
      children: [{
        path: ':mId(\\d+)/router',
        // path: 'interfaces/:id',
        name: '路由配置',
        component: function(resolve) {
          require(['_projectSa/router'], resolve);
        },
        icon: 'el-icon-document',
        meta: {
          menu: false,
        }
      }, {
        path: 'authentication/:mId(\\d+)',
        // path: 'interfaces/:id',
        name: '应用鉴权',
        component: function(resolve) {
          require(['_projectSa/authentication'], resolve);
        },
        icon: 'el-icon-document',
        meta: {
          menu: false
        }
      }],
    }]
  }
  var manage = {
    path: 'manage', //应用管理
    component: function(resolve) {
      require(['_pages/serviceAccess/manage'], resolve);
    },
    name: '接入管理',
    meta: {
      access: 2,
      title: '接入管理',
      token:'JRGL'
    },
    children: [{
        path: 'addApp',
        name: '新增应用',
        component: function(resolve) {
          require(['_application/edit'], resolve);
        },
        meta: {
          menu: false
        }
      },
      {
        path: 'updateApp',
        name: '编辑应用',
        component: function(resolve) {
          require(['_application/edit'], resolve);
        },
        meta: {
          menu: false
        }
      },
      {
        path: 'appDetails',
        name: '授权详情',
        component: function(resolve) {
          require(['_application/details'], resolve);
        },
        meta: {
          menu: false
        },
        props: true
      }
    ]
  }
  var serviceAccess = {
    path: 'serviceAccess',
    component: function(resolve) {
      // require(['_pages/serviceAccess/serviceAccess'], resolve);
      require(['_pages/home/home'], resolve);
    },
    children: [project, manage],
    name: '网关接入',
    meta: {
      access: 1,
      icon: 'fa-exchange',
      title: '网关接入',
      token:'WGJR'
    }
  };
  return serviceAccess;
});
