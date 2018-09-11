define(function(require) {
    var powerRoutes = require('app/routesPower');
    var peripheralsRoutes = require('app/routesPeripherals');
    var configRoutes = require('app/routesConfig');
    var userRoutes = require('app/routesUser');
    var maintenanceRoutes = require('app/routesMaintenance');

    var homeIndex1Children = [{
            path: 'index11',
            component: function(resolve) {
                require(['pages/home/page11/page11'], resolve);
            },
            meta: {
                access: 3,
                title: 'Index11'
            }
        },
        {
            path: 'index12',
            component: function(resolve) {
                require(['pages/home/page12/page11'], resolve);
            },
            meta: {
                access: 3,
                title: 'Index12'
            }
        },
        {
            path: 'index13',
            component: {
                template: "<p>index 13</p>"
            },
            meta: {
                access: 3,
                title: 'Index13'
            }
        }
    ];

    var appRoutes = [{
            path: 'overview',
            component: function(resolve) {
                require(['pages/overview/overview'], resolve);
            },
            meta: {
                access: 3,
                icon: 'fa-home',
                title: 'Overview'
            }
        },
        powerRoutes,
        peripheralsRoutes,
        configRoutes,
        userRoutes,
        maintenanceRoutes,
        /*
        {
            path: 'test1',
            component: {
                template: '<router-view></router-view>',
            },
            children: [{
                    path: 'index1',
                    component: function(resolve) {
                        require(['pages/home/index'], resolve);
                    },
                    children: homeIndex1Children,
                    meta: {
                        access: 2,
                        title: 'Dashboard',
                        children: homeIndex1Children
                    }
                },
                {
                    path: 'index2',
                    component: {
                        template: '<tab-pages></tab-pages>'
                    },
                    meta: {
                        access: 2,
                        title: 'Dashboard2'
                    }
                },
                {
                    path: "*",
                    component: function(resolve) {
                        require(['pages/missing/missing'], resolve);
                    },
                    meta: {
                        hide: true,
                        access: 65534,
                    }
                }
            ],
            meta: {
                access: 3,
                icon: 'fa-home',
                title: 'test1'
            }
        },
        {
            path: 'forms',
            component: {
                template: '<div><p>Form Index Page</p><router-view></router-view></div>'
            },
            children: [{
                    path: 'general',
                    component: {
                        template: '<p>form general</p>'
                    },
                    meta: {
                        access: 3,
                        title: 'General Form'
                    }
                },
                {
                    path: 'advanced',
                    component: {
                        template: '<p>advanced components</p>'
                    },
                    meta: {
                        access: 2,
                        title: 'Advanced Components'
                    }
                },
                {
                    path: "*",
                    component: function(resolve) {
                        require(['pages/missing/missing'], resolve);
                    },
                    meta: {
                        hide: true,
                        access: 65534,
                    }
                }
            ],
            meta: {
                access: 4,
                icon: 'fa-edit',
                title: 'Forms'
            }
        }
        */
    ];

    return [{
            path: '/',
            component: function(resolve) {
                require(['pages/app/index'], resolve);
            },
            children: appRoutes,//包含所有项目的路由配置
            meta: {
                hide: true,
                access: 65534,
            }
        },
        {
            path: '/login',
            component: function(resolve) {
                require(['pages/login/index'], resolve);
            },
            meta: {
                hide: true,
                access: 65535
            }
        }
    ];
});