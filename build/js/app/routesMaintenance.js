define(function() {
    return {
        path: 'maintenance',
        component: {
            template: '<router-view></router-view>',
        },
        children: [{
                path: 'ping',
                component: function(resolve) {
                    require(['pages/maintenance/ping/ping'], resolve);
                },
                meta: {
                    access: 3,
                    title: 'Ping'
                }
            },
            {
                path: 'firmware',
                component: function(resolve) {
                    require(['pages/maintenance/firmware/firmware'], resolve);
                },
                meta: {
                    access: 0,
                    title: 'Upgrade Firmware'
                }
            },
            {
                path: 'backup',
                component: function(resolve) {
                    require(['pages/maintenance/backup/backup'], resolve);
                },
                meta: {
                    access: 0,
                    title: 'Backup/Restore'
                }
            },
            {
                path: 'history',
                component: function(resolve) {
                    require(['pages/maintenance/history/history'], resolve);
                },
                meta: {
                    access: 3,
                    title: 'History Data Files'
                }
            },            
            {
                path: 'files',
                component: function(resolve) {
                    require(['pages/maintenance/files/files'], resolve);
                },
                meta: {
                    access: 0,
                    title: 'Files'
                }
            },
            {
                path: 'log',
                component: function(resolve) {
                    require(['pages/maintenance/log/log'], resolve);
                },
                meta: {
                    access: 3,
                    title: 'View Event Log'
                }
            },
            {
                path: 'restart',
                component: function(resolve) {
                    require(['pages/maintenance/restart/restart'], resolve);
                },
                meta: {
                    access: 0,
                    title: 'Restart'
                }
            }
        ],
        meta: {
            access: 3,
            icon: 'fa-wrench',
            title: 'Maintenance'
        }
    };
});