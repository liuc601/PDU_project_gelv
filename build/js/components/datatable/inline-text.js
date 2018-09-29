define(function (require) {
    'use strict';
    var Vue = require('vue');
    var $ = require('jquery');
    var InlineMixin = require('components/datatable/inline-mixin');
    var InlineMixin2 = require('components/datatable/inline-mixin-2');

    return Vue.component('inline-text', {
        /*
                template: require('text!./inline-text.html'),
                props: {
                    rowData: {
                        type: Object,
                        required: true
                    },
                    rowIndex: {
                        type: Number,
                        require: true,
                    },
                    rowField: {
                        type: Object,
                        require: true
                    },
                    rowTrack: {
                        require: true
                    }
                },
                data: function() {
                    return {
                        prev: '',
                        textWidth: '0',
                        field: '',
                        value: '',
                        original: '',
                        isModified: false,
                        eventPrefix: 'inlineEditor:'
                    };
                },
                watch: {
                    rowData: function(nVal, oVal) {
                        this.contextReset();
                    },
                    /*
                                value: function(nVal, oVal) {
                                    this.$nextTick(function() {
                                        var textWidth = $(this.$refs.widthSpan).width();

                                        this.textWidth = textWidth;
                                    });
                                }
                    /
                },
                mounted: function() {
                    var field = this.rowField.sortField;

                    field = (field === undefined) ? this.rowField.name.split(':')[2] : field;

                    this.field = field;

                    this.contextReset();
                    this.prev = this.value;
                },
                methods: {
                    onFocus: function(event) {
                        this.prev = this.value;
                    },
                    onBlur: function(event) {
                        this.isModified = (this.value !== this.original) ? true : false;

                        if (this.prev !== this.value) {
                            this.fireEvent();
                        }
                    },
                    __getUnit: function() {
                        if (typeof this.rowField.unit === 'string')
                            return this.rowField.unit;

                        if (typeof this.rowField.unit === 'function')
                            return this.rowField.unit(this.rowData, this.field);
                    },
                    onClick: function() {
                        $(this.$el).children().find('input').focus();
                    },
                    fireEvent: function(event) {
                        this.$parent.$emit(this.eventPrefix + 'change', this.rowIndex, this.field, this.value);
                    },
                    contextReset: function() {
                        this.isModified = false;
                        this.value = this.original = this.rowData[this.field];
                    },
                    discardChange: function(event) {
                        this.isModified = false;
                        this.value = this.original;
                        this.fireEvent();
                    }
                }*/
        template: require('text!./inline-text.html'),

        mixins: [InlineMixin, InlineMixin2],
        data: function () {
            return {
                prev: '',
                textWidth: 0,
                height: '',
                cptType: '',
                isFirst: true,
            };
        },
        mounted: function () {
            // console.log("获取到父元素",this.rowData);
            // console.log(this.rowData);
            if (!this.rowData.mdValue) { //如果找不到分辨率的值，就直接调用分辨率函数进行配置
                this.rowData.mdValue = this.minDiffValue();
            }
            if (!this.rowData.maxValueHysteresis) {
                this.rowData.maxValueHysteresis = this.hysteresisMaxValue();
            }
            this.contextReset();
            this.prev = this.value;
            this.cptType = this.$parent.$parent.cptType;
        },
        computed: {
            inputWrapDivLength: function () {
                return this.textWidth + 20 + 'px';
            }
        },
        // Here get the performance issues at Edge and Firefox

        watch: {
            value: function (nVal, oVal) {
                //根据不同的表格，使用不同的判断规则
                if (this.cptType == 'hl') { //如果是hl的更新规则，就使用这种判断规则
                    if (this.regValue(nVal)) { //判断输入的值是否正确
                        layer.msg('请输入数字0~9或-');
                        this.value = oVal;
                        return
                    }
                    this.isFirst = false;
                } else if (this.cptType == 'hcc') {
                    if (this.field != 'name') {
                        if (this.regValue(nVal)) { //判断输入的值是否正确
                            layer.msg('请输入数字0~9或-');
                            this.value = oVal;
                            return
                        }
                    }
                    this.isFirst = false;
                }else if (this.cptType == 'ex') {
                    if (this.field != 'name') {
                        if (this.regValue(nVal)) { //判断输入的值是否正确
                            layer.msg('请输入数字0~9或-');
                            this.value = oVal;
                            return
                        }
                    }
                    this.isFirst = false;
                }
                this.$nextTick(function () {
                    var textWidth = $(this.$refs.widthSpan).width();
                    this.textWidth = textWidth;
                    this.isModified = false;
                });
            }
        },

        methods: {
            onFocus: function (event) {
                this.prev = this.value;
            },
            onBlur: function (event) {
                this.isModified = (this.value !== this.original) ? true : false;
                if (this.prev !== this.value) {
                    this.fireEvent();
                }
                if (this.cptType == 'hcc' && this.field == 'name') {
                    if(this.isTrueValue(true)){//仅用作判断是否输入,只要有输入就可以了
                        this.removeErrMsg();
                    }
                }else if (this.cptType == 'ex' && this.field == 'name') {
                    if(this.isTrueValue(true)){//仅用作判断是否输入,只要有输入就可以了
                        this.removeErrMsg();
                    }
                } else {
                    if (!this.isTrueValue()) {
                        return;
                    }
                }
                // this.ttt(this.field,this.rowData[names]);
                this.$parent.$parent.forEachChildrenUpdataView(this.rowData.id, this.field);
            },
            __getUnit: function () {
                if (typeof this.rowField.unit === 'string')
                    return this.rowField.unit;

                if (typeof this.rowField.unit === 'function')
                    return this.rowField.unit(this.rowData, this.field);
            },
            onClick: function () {
                $(this.$el).children().find('input').focus();
            },
        }
    });
});