define(function(require) {
    require('promise');
    var Vue = require('vue');
    var Vuex = require('vuex');
    Vue.use(Vuex);

    return {
        state: {
            //搜索相关的数据
            a:'今天天气不错'
        },
        getters: {
            geta: function(state) {
                return state.a;
            },
        },
        mutations: {
            //设置服务运行总览和接口运行总览的数据
            seta:function(state,a,rootState){
              state.a=a;
              console.log('根节点',rootState);
            },
        },
        actions:{
          actionsa({state,commit,rootState}){
            setTimeout(function(){
              state.a=666;
            },1500);
          }
        }

    };
});
