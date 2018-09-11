define(function() {
    return {
        path: 'user',
        component: {
            template: '<router-view></router-view>',
        },
        children: [{
                path: 'list',
                component: function(resolve) {
                    require(['pages/user/user/user'], resolve);
                },
                meta: {
                    access:0,
                    title: 'Users'
                }
            },
            {
                path: 'preference',
                component: function(resolve) {
                    require(['pages/user/preference/preference'], resolve);
                },
                meta: {
                    access: 3,
                    title: 'User Preference'
                }
            },
            {
                path: 'password',
                component: function(resolve) {
                    require(['pages/user/password/password'], resolve);
                },
                meta: {
                    access: 3,
                    title: 'Change Password'
                }
            }
        ],
        meta: {
            access: 3,
            icon: 'fa-users',
            title: 'User Management'
        }
    };
});