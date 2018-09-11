define(function() {
    return {
        path: 'peripherals',
        component: {
            template: '<router-view></router-view>',
        },
        children: [{
                path: 'sensors',
                component: function(resolve) {
                    require(['pages/peripherals/sensors'], resolve);
                },
                meta: {
                    access: 3,
                    title: 'Sensors'
                }
            }/*,
            {
                path: 'camera',
                component: function(resolve) {
                    require(['pages/peripherals/webcam'], resolve);
                },
                meta: {
                    access: 3,
                    title: 'Web Camera'
                }
            },
            {
                path: 'test',
                component: function(resolve) {
                    require(['pages/home/page11/page11'], resolve);
                },
                meta: {
                    access: 3,
                    title: 'Test'
                }
            }*/
        ],
        meta: {
            access: 3,
            icon: 'fa-thermometer-half',
            title: 'Peripherals'
        }
    };
});