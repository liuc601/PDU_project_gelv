define(function (require) {
    var Vue = require('vue');
    require('tabpages');

    return Vue.extend({
        template: '<tab-pages :tabs="tabs" ref="tabpage"></tab-pages>',
        data: {
            tabs: []
        },
        beforeCreate: function () {
            var tabs = [];
            var children = this.$route.meta.children;

            if (children) {
                for (var i = 0; i < children.length; i++) {
                    tabs.push({
                        title: children[i].meta.title,
                        path: '#' + this.$route.fullPath + '/' + children[i].path
                    })
                }

                this.tabs = tabs;
            }
        },
        mounted: function () {
            this.$router.push(this.tabs[0].path.slice(1));
        }
    })
});