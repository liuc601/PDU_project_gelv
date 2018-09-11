/* 
    里面配置的是power页面的路由，并且返回power模块下子模块的所有路由
*/
define(function() {
    var inletChildren = [{
            path: 'status',
            component: function(resolve) {
                require(['pages/power/inlet/status'], resolve);
                //require(['pages/path'], resolve);
            },
            meta: {
                access: 3,
                title: 'Inlet Status'
            }
        },
        {
            path: 'config',
            component: function(resolve) {
                require(['pages/power/inlet/config'], resolve);
                //require(['pages/path'], resolve);
            },
            meta: {
                access: 3,
                title: 'Configuration'
            }
        }
    ];

    var ocpChildren = [{
            path: 'status',
            component: function(resolve) {
                require(['pages/power/ocp/status'], resolve);
                //require(['pages/path'], resolve);
            },
            meta: {
                access: 3,
                title: 'OCP Status'
            }
        },
        {
            path: 'config',
            component: function(resolve) {
                require(['pages/power/ocp/config'], resolve);
                //require(['pages/path'], resolve);
            },
            meta: {
                access: 3,
                title: 'Configuration'
            }
        }
    ];
    var outletChildren = [{
            path: 'status',
            component: function(resolve) {
                require(['pages/power/outlet/status'], resolve);
                //require(['pages/path'], resolve);
            },
            meta: {
                access: 3,
                title: 'Outlet Status'
            }
        },
        {
            path: 'config',
            component: function(resolve) {
                require(['pages/power/outlet/config'], resolve);
                //require(['pages/path'], resolve);
            },
            meta: {
                access: 3,
                title: 'Configuration'
            }
        },
        {
            path: 'thresholds',
            component: function(resolve) {
                require(['pages/power/outlet/thresholds'], resolve);
            },
            meta: {
                access: 3,
                title: 'Thresholds'
            }
        }
    ];

    return {
        path: 'power',
        component: {
            template: '<router-view></router-view>',
        },
        children: [{
                path: 'inlet',
                component: function(resolve) {
                    require(['components/tabpages/index'], resolve);
                },
                children: inletChildren,
                meta: {
                    access: 3,
                    title: 'Inlet',
                    children: inletChildren
                }
            },
            {
                path: 'ocp',
                component: function(resolve) {
                    require(['components/tabpages/index'], resolve);
                },
                children: ocpChildren,
                meta: {
                    access: 3,
                    title: 'Over-Current Protectors',
                    children: ocpChildren
                }
            },
            {
                path: 'outlet',
                component: function(resolve) {
                    require(['components/tabpages/index'], resolve);
                },
                children: outletChildren,
                meta: {
                    access: 3,
                    title: 'Outlets',
                    children: outletChildren
                }
            }
        ],
        meta: {
            access: 3,
            icon: 'fa-tachometer',
            title: 'Power'
        }
    };
});