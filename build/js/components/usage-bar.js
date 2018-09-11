define(function(require) {
    var Vue = require('vue');
    require('components/status-bar');

    return Vue.component('usage-bar', {
        template: require('text!./usage-bar.html'),
        props: {
            current: {
                type: [Number, String],
                require: true
            },
            max: {//将需要的数据用对象的形式传进来，方便获取和计算
                type: [Number, String,Object],
                require: true,
            },
            range: {//status的状态一直没有办法传进来，利用这个作为status值
                // type: Array,
                type: [Number, String],
                require: true,
            },
            unit: {
                type: String,
                default: ''
            },
            prompt: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            value: function() {
                return (this.current * 100) / this.max.max + '%';
            },
            color: function() {
                switch (this.max.status) {//可以根据状态进行变化颜色，还需要将状态传进来
                    case 0:
                        return 'status-bar-green';
                        break;
                    case 14:
                        return 'status-bar-red';
                        break;
                    case 15:
                        return 'status-bar-yellow';
                        break;
                    case 16:
                        return 'status-bar-yellow';
                        break;
                    case 17:
                        return 'status-bar-red';
                        break;
                }
                /* for (var i = 0; i < this.range.length; i++) {
                    var range = this.range[i];

                    if (this.current <= range.value)
                        return 'status-bar-' + range.color;
                }
                return 'status-bar-green'; */
            }
        }
    });
});