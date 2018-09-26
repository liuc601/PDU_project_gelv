define(function (require) {
    var Vue = require('vue');
    require('tabpages');
    require('pages/page');

    return Vue.extend({
        template: '<x-page :title="title"><tab-pages :tabs="tabs" ref="tabpage"></tab-pages></x-page>',
        data: function () {
            return {
                tabs: [],
                title: ''
            };
        },
        watch: {
            $route: function (nVal, oVal) {
                this.routeToTabpages();
                if (nVal.meta.children)
                    this.$nextTick(function () {
                        this.routeDefault();
                        this.title = nVal.meta.title;
                    });
                else {
                    this.$nextTick(function () {
                        this.$refs.tabpage.tabpageSwitch('#' + nVal.path);
                    });
                }
            }
        },
        beforeMount: function () {
            this.title = this.$route.meta.title;
            this.routeToTabpages();
        },
        mounted: function () {
            this.routeDefault();
        },
        methods: {
            routeDefault: function () {

                if (this.tabs === null || this.tabs === undefined) {
                    return;
                }

                var redirect = this.tabs[0].path.slice(1);
                if (this.$store.getters.urlSubRedirect !== '') {
                    redirect = this.$store.getters.urlSubRedirect;
                    this.$store.commit('setUrlSubRedirect', '');
                }

                this.$router.push(redirect);
            },
            routeToTabpages: function () {
                var tabs = [];
                var children = this.$route.meta.children;

                if (children) {
                    for (var i = 0; i < children.length; i++) {
                        if (children[i].meta) {
                            tabs.push({
                                title: children[i].meta.title,
                                path: '#' + this.$route.fullPath + '/' + children[i].path
                            });
                        }
                    }
                    this.tabs = tabs;
                }
            }
        }
    });
});