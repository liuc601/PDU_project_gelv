define(function(require) {
    var Vue = require('vue');

    return Vue.component('x-panel', {
        template: require('text!./x-panel.html'),
        props: {
            title: {
                type: String,
                default: ''
            },
            subTitle: {
                type: String
            },
            subStyle: {
                type: Object,
                default: null
            },
            showToolbox: {
                type: Boolean,
                default: false
            },
            showTBCollapse: {
                type: Boolean,
                default: false
            },
            showTBSetting: {
                type: Boolean,
                default: false
            },
            showTBClose: {
                type: Boolean,
                default: true
            },
            showTitle: {
                type: Boolean,
                default: true
            },
            wrapClass: {
                type: String,
                default: 'col-md-12 col-sm-12 col-xs-12'
            },
            heightClass: {
                type: String,
                default: '' //tile fixed_height_320
            },
            addClass: {
                type: String,
                default: ''
            }
        },
        data: function() {
            return {
                collapsed: false
            };
        },
        computed: {
            xStyle: function() {
                if (this.title === '') {
                    if (this.subStyle)
                        return this.subStyle;

                    return {
                        'color': 'inherit',
                        'margin': 'inherit',
                        'font-size': '14px'
                    };
                }
            }
        },
        methods: {
            onCollapseClick: function() {
                this.collapsed = !this.collapsed;
            },
            onCloseClick: function() {
                this.$emit('close');
            }
        }
    });
});