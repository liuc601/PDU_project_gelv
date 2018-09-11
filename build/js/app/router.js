define([
    'vue',
    'vue-router',
    'app/routes'
], function(Vue, VueRouter, routes) {
    Vue.use(VueRouter);

    var router = new VueRouter({
        mode: 'hash',
        routes: routes,
    });

    function checkUserAuthorization(store, route) {
        var meta = route.meta;

        if (meta.access === undefined)
            return false;

        if (store.getters.usrAccessLevel >meta.access){
            //如果企图从路由表进入的话，提示没有权限
            layer.msg("No access");
            return false;
        }

        return true;
    }

    router.beforeResolve(function(to, from, next) {
        //这边路由可能也要做判断
        var vi = router.app;
        var tml = to.matched.length;
        var fml = from.matched.length;

        // console.log('beforeResolve: ' + from.fullPath + ' --> ' + to.fullPath);

        if (to.path !== '/login') {
            if (!vi.$store.getters.usrLoginState) {
                vi.$store.commit('setUrlBeforeLogin', to.path);
                next('/login');
                return;
            }
        }

        if (!checkUserAuthorization(vi.$store, to)) {
            next(false);
            return;
        }

        if ((tml !== 4) ||
            (fml === 3 && from.matched[fml - 1].path === to.matched[tml - 2].path) ||
            (fml === 4 && from.matched[fml - 2].path === to.matched[tml - 2].path)) {
            next();
            return;
        }
        // save redirect:
        vi.$store.commit('setUrlSubRedirect', to.fullPath);
        next(to.matched[tml - 2].path);
    });

    return router;
});