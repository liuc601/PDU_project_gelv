define(function(require) {
    var $ = require('jquery');
    var Vue = require('vue');

    return Vue.component('tab-pages', {
        template: require('text!./tabpages.html'),
        props: {
            'tabs': {
                type: Array,
                require: true
            },
        },
        data: function() {
            return {
                selected: null
            };
        },
        created: function() {
            this.tabpageIDUpdate();
        },
        watch: {
            tabs: function(nVal, oVal) {
                console.log('tabs update');
                this.tabpageIDUpdate();
            }
        },
        methods: {
            tabpageSwitch: function(path) {
                if (this.selected && this.selected.path === path)
                    return;

                for (var i = 0; i < this.tabs.length; i++) {
                    var tab = this.tabs[i];
                    if (tab.path === path) {
                        this.tabpageClicked(tab);
                        this.$forceUpdate();
                        (this.$refs[tab.id])[0].focus();
                        break;
                    }
                }
            },
            tabpageClicked: function(tab, event) {
                if (tab.selected)
                    return;

                if (this.selected)
                    this.selected.selected = false;

                tab.selected = true;
                this.selected = tab;
            },
            tabpageIDUpdate: function() {
                var tabs = this.tabs;

                for (var i = 0; tabs && i < tabs.length; i++) {
                    tabs[i].id = 'tabpages-tab' + i;
                }
            }
        }
        /*
        data: function() {
            return {
                unwatch: null,
                routeClicked: false,
            };
        },
        created: function() {
            var tabs = this.tabs;

            for (var i = 0; tabs && i < tabs.length; i++) {
                if (tabs[i].id)
                    cotinue;

                tabs[i].id = 'tabpages-tab' + i;
            }

            this.unwatch = this.$watch('$route', function() {
                if (this.routeClicked) {
                    this.routeClicked = false;
                    return;
                }

                for (var i = 0; i < this.tabs.length; i++) {
                    if (this.tabs[i].path.slice(1) === this.$route.path) {
                        this.tabClicked(this.tabs[i]);
                        (this.$refs[this.tabs[i].id])[0].focus();
                        break;
                    }
                }
            });
        },
        destroyed: function() {
            if (this.unwatch)
                this.unwatch();
        },
        methods: {
            tabClicked: function(tab, event) {
                if (event) {
                    this.routeClicked = true;
                }

                if (tab.selected)
                    return;

                var tabs = this.tabs;

                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].selected) {
                        tabs[i].selected = false;
                        break;
                    }
                }

                tab.selected = true;
            }
        }        */

    });
});