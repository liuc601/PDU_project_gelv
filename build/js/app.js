// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
require.config({
    urlArgs: "v=2.1.7012",
    baseUrl: 'js/lib',
    paths: {
        'vue': 'vue.min',
        'vuex': 'vuex.min',
        'vue-router': 'vue-router',
        'vue-axios': 'vue-axios.min',
        'vue-table': 'vuetable-2.min',
        'vue-i18n': 'vue-i18n.min',
        'vue-form': 'vue-form.min',
        'vue-chart': 'vue-chartjs',
        'axios': 'axios.min',
        'velocity': 'velocity.min',
        'promise': 'es6-promise.auto.min',
        'jquery': 'jquery.min',
        'webTool': '../utils/web-tool',//一些全局的通用方法
        'baseConfig':'../utils/base-config',
        'layer': 'layer',
        'cookie': 'cookie.min',
        'bootstrap': 'bootstrap.min',
        'switchery': 'switchery.min',
        'iCheck': 'icheck.min',
        'moment': 'moment-with-locales.min',
        'app': '../app',
        'i18n-dir': '../app/i18n',
        'i18n': '../app/i18n/i18n',
        'pages': '../pages',
        'components': '../components',
        'transition': '../components/transition',
        'tabpages': '../components/tabpages/tabpages',
        'datatable': '../components/datatable/datatable',
        'datetimepicker': '../components/datetimepicker/bootstrap-datetimepicker.min'
    },
    shim: {
        'vue': {
            exports: 'Vue'
        },
        'vuex': {
            exports: 'Vuex'
        },
        'vue-router': {
            exports: 'VueRouter'
        },
        'cookie': {
            exports: 'cookie'
        },
        "velocity": {
            deps: ["jquery"]
        },
        'switchery': ['jquery'],
        'bootstrap': ['jquery'],
        'iCheck': {
            deps: ['jquery'],
            exports: 'jQuery.fn.iCheck'
        },
        'fireevent': {
            deps: ['jquery'],
            exports: 'jQuery.fn.fireEvent'
        },
        'jplayer': ['jquery'],
    },
    /*
    map: {
        '*': {
            'datatables.net': 'datatables',
        }
    },
    */
    waitSeconds: 0
});

// Start loading the main app file. Put all of
// your application logic in there.
require([
    'vue',
    'vue-axios',
    'axios',
    'i18n',
    'app/router',
    'app/store',
    'jquery',
    'layer',
    'webTool'
], function (Vue, VueAxios, axios, I18n, router, store, $,layer,webTool) {
    Vue.config.debug = true;
    Vue.config.devtools = true;

    axios.defaults.withCredentials = true;
    axios.defaults.timeout = 5000;
    axios.defaults.baseURL = 'https://192.168.155.1';
    Vue.prototype.$axios = axios;

    Vue.use(VueAxios, axios);
    Vue.use(webTool);
    /* 
     *jie:万恶之源，一切vue的入口，所有的一切将从这里诞生
     */
    var app = new Vue({
        el: '#app',
        i18n: I18n,
        store: store,
        router: router,
        mounted: function () {
            $(document).ajaxError(
                function(event, xhr, options, exc){
                    if (xhr.status == 403) {
                        this.$router.push('/login');
                        layer.msg('Invalid user or password!', {
                            time: 1000
                        });
                    }
                }.bind(this)
            )
        },
        methods: {
            eventHandle: function (event) {
                if (event === 'EVT_LOGIN_SUCCESS') {
                    this.$router.push('/');
                    //捕获到登陆成功事件
                    
                    console.log();
                } else if (event === 'EVT_LOGOUT_SUCCESS') {
                    this.$router.push('/login');
                    layer.msg('Logout successful!', {
                        time: 1000
                    });
                }
            }
        }
    });
});