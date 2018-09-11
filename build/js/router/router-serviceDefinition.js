/*
 vue路由的配置文件，主引导路由
 * @Author: xxx
 * @Date: 2018-04-23 11:37:13
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-23 22:18:29
 */
define(function() {
  var projectManage = {
    path: 'projectManage', //服务管理
    component: function(resolve) {
      require(['_pages/serviceDefinition/project-manage'], resolve);
    },
    name: '项目管理',
    meta: {
      access: 2,
      title: '项目管理',
      token:'XMGL'
    },
    children: [{
        path: 'new',
        name: '新增项目',
        component: function(resolve) {
          require(['_project/add'], resolve);
        },

        meta: {
          menu: false
        }
      },
      {
        path: ':id(\\d+)',
        name: '修改项目',
        component: function(resolve) {
          require(['_project/edit'], resolve);
        },
        meta: {
          menu: false
        }
      },
      {
        path: ':id(\\d+)/modules',
        name: '模块管理',
        component: function(resolve) {
          require(['_module/index'], resolve);
        },
        meta: {
          menu: false
        },
        children: [{
          path: 'new',
          name: '新增',
          component: function(resolve) {
            require(['_module/add'], resolve);
          },
          meta: {
            menu: false
          }
        }, {
          path: ':mid(\\d+)',
          name: '修改',
          component: function(resolve) {
            require(['_module/edit'], resolve);
          },
          meta: {
            menu: false
          }
        }]
      },
      {
        path: ':id(\\d+)/interfaces',
        name: '接口详情',
        component: function(resolve) {
          require(['_interface/index'], resolve);
        },
        meta: {
          menu: false
        }
      }, {
        path: ':id(\\d+)/teams',
        name: '团队管理',
        component: function(resolve) {
          require(['_team/index'], resolve);
        },
        meta: {
          menu: false
        }
      }
    ]
  };
  var interfaceDifi = {
    path: 'interfaceDefi', //服务管理
    component: function(resolve) {
      require(['_pages/serviceDefinition/interface-definition'], resolve);
    },
    name: '接口定义',
    meta: {
      access: 2,
      title: '接口定义',
      token:'JKDY'
    },
  };
  var serviceManage = {
    path: 'serviceManage', //服务管理
    component: function(resolve) {
      require(['_pages/serviceDefinition/service-manage'], resolve);
    },
    name: '服务编排',
    meta: {
      access: 2,
      title: '服务编排',
      token:'G_FWBP',
      token:'FWBP'
    },
    children: [
        {
          path: 'new',
          name: '新增服务',
          component: function(resolve) {
            require(['_module/add'], resolve);
          },
          meta: {
            menu: false
          }
        }, {
          // path: ':id(\\d+)/services/:mid(\\d+)',
          path: ':mId(\\d+)/services',
          name: '修改服务',
          component: function(resolve) {
            require(['_module/edit'], resolve);
          },
          meta: {
            menu: false
          }
        }
    ]
  };
  var interfaceSearch = {
    path: 'interfaceSearch', //服务检索
    component: function(resolve) {
      require(['_pages/serviceDefinition/search'], resolve);
    },
    name: '接口检索',
    meta: {
      access: 2,
      title: '接口检索'
    },
    children: [{
      path: 'interfaces/:id(\\d+)',
      name: '详情',
      component: function(resolve) {
        require(['_interface/detail'], resolve);
      },
      icon: 'el-icon-document',
      meta: {
        menu: false
      }
    }]
  }
  var interfaceMock = {
    path: 'interfaceMock', //服务检索
    component: function(resolve) {
      // require(['_pages/serviceDefinition/serviceMock/index'], resolve);
      require(['_pages/serviceDefinition/interface-mock'], resolve);
    },
    name: '接口Mock',
    meta: {
      access: 2,
      title: '接口Mock',
      token:'JKMOCK'
    },
  }
  var interfaceTest = {
    path: 'interfaceTest', //服务检索
    component: function(resolve) {
      require(['_pages/serviceDefinition/interface-test'], resolve);
    },
    name: '接口测试',
    meta: {
      access: 2,
      title: '接口测试',
      token:'JKCS'
    },
    children: [{
      path: 'callChainDetail/:callStr(\\S+)',
      name: '接口测试调用链详情',
      component: function(resolve) {
        require(['_roverview/call-chain-detail'], resolve);
      },
      icon: 'el-icon-document',
      meta: {
        menu: false
      }
    }]
  }
  var serviceDefinition = {
    path: 'serviceDefinition',
    component: function(resolve) {
      // require(['_pages/serviceDefinition/serviceDefinition'], resolve);
      require(['_pages/home/home'], resolve);
    },
    children: [projectManage, serviceManage, interfaceDifi, interfaceSearch, interfaceMock, interfaceTest],
    name: '服务定义',
    meta: {
      access: 1,
      icon: 'fa-desktop',
      title: '服务定义',
      token:'FWDY'
    }
  };
  return serviceDefinition;
});
