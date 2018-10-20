define(function(require) {
    var Vue = require('vue');

    return Vue.component('title-count', {
        template: require('text!./title-count.html'),
        props: {
            items: {
                type: Array,
                require: true
            }
        },
        beforeMount: function() {
            if (this.items && this.items.length > 6)
                this.items.slice(6);

            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];

                if (item.color === undefined) {
                    item.color = this.color;
                }
            }
        },
        mounted:function(){

        },
        methods: {
            color: function() {
                return 'green';
            },
            pushRouter:function(str,item){
                if(item.callBack){
                    if(item.value==0){
                        return;
                    }
                    item.callBack(item);
                    return
                }
                if(!str)return;
                // console.log(item,this.$store.getters.usrAccessLevel);
                // return;
                // if(item.title=="Unutilized Outlets"&&this.$store.getters.usrAccessLevel<3){
                //     //权限不够，不允许弹窗
                //     return
                // }
                this.$router.push(str);
            },

        }
    });
});