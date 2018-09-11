/*
路由的配置文件，引入路由插件，引入路由配置
路由运行顺序：1
 * @Author: 刘沙
 * @Date: 2018-04-23 22:05:56
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-02 10:11:50
 */
define(['vue', 'vue-router', '_utils/router/router-index'],
  function(vue, vueRouter, routerIndex) {
    vue.use(vueRouter); //vue引入路由
    var router = new vueRouter({
      mode: 'hash', //使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。
      routes: routerIndex, //把路由的所有配置文件放进来
    });
    //路由守卫，之后进行设置
    router.beforeResolve(function(to, from, next) {
      var app = router.app;
      // console.log('router-config   所有的路由配置',routerIndex);
      // console.log('router-config   当前的路由',to);
      // console.log('beforeResolve: ' + from.fullPath + ' --> ' + to.fullPath);
      if (to.path != '/login') {
        // if (app.$store.getters.isLogin) { //已经登录
          next();
          return;
        // } else {
          // next('/login');
          // return;
        // }
      } else {//禁止login的路由跳转
        next(from.fullPath);
        return;
      }
      next();
    });
    return router;

  });
