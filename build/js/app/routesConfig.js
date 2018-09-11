define(function () {
    var systemChildren = [{
            path: 'about',
            component: function (resolve) {
                require(['pages/config/system/about'], resolve);
            },
            meta: {
                access: 0,
                title: 'About'
            }
        },
        {
            path: 'frontpanel',
            component: function (resolve) {
                require(['pages/config/system/panel'], resolve);
            },
            meta: {
                access: 0,
                title: 'Front-Panel'
            }
        },
        {
            path: 'date',
            component: function (resolve) {
                require(['pages/config/system/date'], resolve);
            },
            meta: {
                access: 0,
                title: 'Date/Time'
            }
        },
    ];

    var networkChildren = [{
            path: 'ip',
            component: function (resolve) {
                require(['pages/config/network/ip'], resolve);
            },
            meta: {
                access: 0,
                title: 'DHCP/IP'
            }
        },
        {
            path: 'email',
            component: function (resolve) {
                require(['pages/config/network/smtp'], resolve);
            },
            meta: {
                access: 0,
                title: 'SMTP/Email'
            }
        },
        {
            path: 'snmp',
            component: function (resolve) {
                require(['pages/config/network/snmp'], resolve);
            },
            meta: {
                access: 0,
                title: 'SNMP'
            }
        },
        {
            path: 'syslog',
            component: function (resolve) {
                require(['pages/config/network/syslog'], resolve);
            },
            meta: {
                access: 0,
                title: 'Syslog'
            }
        },
        {
            /*
            这个是按照要求添加的无线网卡管理菜单，原本就存在一个无线网卡管理，
            但是不清楚是不是原来的，所以原本的wlan不去动它，直接复制一份，重新修改
            */
            path: 'wirelessLan',
            component: function (resolve) {
                require(['pages/config/network/wireless-lan'], resolve);
            },
            meta: {
                access: 3,
                title: 'wirelessLan'
            }
        }
        /*
        {
            path: 'http',
            component: function(resolve) {
                require(['pages/config/network/http'], resolve);
            },
            meta: {
                access: 3,
                title: 'Http/Https'
            }
        },
        {
            path: 'telnet',
            component: function(resolve) {
                require(['pages/config/network/telnet'], resolve);
            },
            meta: {
                access: 3,
                title: 'Telnet/SSH'
            }
        },
        {
            path: 'wlan',
            component: function(resolve) {
                require(['pages/config/network/wlan'], resolve);
            },
            meta: {
                access: 3,
                title: 'WLAN'
            }
        }
        */
    ];

    var accessChildren = [{
            path: 'general',
            component: function (resolve) {
                require(['pages/config/access/general'], resolve);
            },
            meta: {
                access: 0,
                title: 'General'
            }
        },
        {
            path: 'ldap',
            component: function (resolve) {
                require(['pages/config/access/ldap'], resolve);
            },
            meta: {
                access: 0,
                title: 'LDAP'
            }
        },
        {
            path: 'radius',
            component: function (resolve) {
                require(['pages/config/access/radius'], resolve);
            },
            meta: {
                access: 0,
                title: 'RADIUS'
            }
        },
        {
            path: 'tacacsplus',
            component: function (resolve) {
                require(['pages/config/access/tacacsplus'], resolve);
            },
            meta: {
                access: 0,
                title: 'TACACS+'
            }
        },
        {
            path: 'ldapgroups',
            component: function (resolve) {
                require(['pages/config/access/ldapgroups'], resolve);
            },
            meta: {
                access: 0,
                title: 'LDAP Groups'
            }
        },
        {
            path: 'tacprivi',
            component: function (resolve) {
                require(['pages/config/access/privileges'], resolve);
            },
            meta: {
                access: 0,
                title: 'TACACS+ Privileges'
            }
        }
    ];

    return {
        path: 'config',
        component: {
            template: '<router-view></router-view>',
        },
        children: [{
                path: 'system',
                component: function (resolve) {
                    require(['components/tabpages/index'], resolve);
                },
                children: systemChildren,
                meta: {
                    access: 0,
                    title: 'System',
                    children: systemChildren,
                }
            },
            {
                path: 'network',
                component: function (resolve) {
                    require(['components/tabpages/index'], resolve);
                },
                children: networkChildren,
                meta: {
                    access: 0,
                    title: 'Network',
                    children: networkChildren
                }
            },
            /*
                        {
                            path: 'access',
                            component: function(resolve) {
                                require(['components/tabpages/index'], resolve);
                            },
                            children: accessChildren,
                            meta: {
                                access: 3,
                                title: 'Access',
                                children: accessChildren
                            }
                        }*/
        ],
        meta: {
            access: 0,
            icon: 'fa-cogs',
            title: 'Configuration'
        }
    };
});