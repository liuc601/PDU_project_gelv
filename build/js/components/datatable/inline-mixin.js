define(function (require) {
    return {
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
        data: function () {
            return {
                field: '',
                value: '',
                original: '',
                isModified: false,
                isAlarm: false, //是否显示告警图标
                alarmTxt: "",
                eventPrefix: 'inlineEditor:'
            };
        },
        mounted: function () {
            var field = this.rowField.sortField;

            field = (field === undefined) ? this.rowField.name.split(':')[2] : field;

            this.field = field;

            // this.contextReset();
        },
        watch: {
            rowTrack: function (nVal, oVal) {
                // this.contextReset();
            }
        },
        methods: {
            fireEvent: function (event) {
                this.$parent.$emit(this.eventPrefix + 'change', this.rowIndex, this.field, this.value);
            },
            contextReset: function () {//对电压的数据进行特殊处理，可能没用
                this.isModified = false;
                var showType = this.rowData.showType;
                var cptType = this.$parent.$parent.cptType;
                if (
                    cptType == 'hl' && (
                        showType == 'Inlet Voltage(V)' || showType == 'Voltage(V)' || showType == 'voltage'
                    )
                ) {
                    if (this.field == "lowAlarm" || this.field == "lowWarning" || this.field == "highWarning" || this.field == "highAlarm") {
                        this.value = this.original = parseFloat(this.rowData[this.field]).toFixed(0);
                    }else{
                        this.value = this.original = this.rowData[this.field];
                    }
                } else {
                    this.value = this.original = this.rowData[this.field];
                }
            },
            discardChange: function (event) {
                this.isModified = false;
                this.value = this.original;
                this.fireEvent();
            },
            isTrueValue: function () { //这个函数在失去焦点的时候调用，判断用户输入的值时候合法，如果不合法，就直接变成原来的数值
                var nVal = this.value;
                var names = "_" + this.field;
                if (nVal == '') {
                    this.addErrMsg("Please enter a value");
                    return false;
                }
                if (nVal == "-") { //如果是无限大，就不用判断了；
                    this.rowData[names] = '-';
                } else {
                    if (!this.isFirst && !this.isMR(nVal, this.rowData.mdValue)) { //如果修改的值不是分辨率要求的值，就报错
                        layer.msg("The difference shall not be less than " + this.rowData.mdValue);
                        this.addErrMsg("The difference shall not be less than " + this.rowData.mdValue);
                        this.value = oVal;
                        return false;
                    } else {
                        this.removeErrMsg();
                    }
                }
                this.rowData[names] = nVal; //把输入的值保存起来，方便之后做判断
                return true;
            },
            updataView: function (cptType, field, isTp) { //给父组件调用，当同行的其他组件数据发生改变时，父组件遍历，并且调用这个方法来进行判断
                /*
                 *更新页面的时候，需要让父组件也知道，当前这个元素的状态已经被改变，用户可以提交更改的数据。
                 *如果当前这个输入框的值不对，需要将当前输入框的组件id传入父组件的一个数组里面，之后可以数据正确的时候，再去去除id
                 */
                if (cptType == 'hl') {
                    // this["hl" + this.field] && this["hl" + this.field](field);
                    this.hlRule && this.hlRule(field, isTp); //传进去的当前发生修改的项目
                }
            },
            regValue: function (value) { //验证用户输入的是否为正确的字符
                var reg = new RegExp("[^0-9-\.]", "ig");
                var dotResult = value.match(/\./ig);
                var _result = value.match(/-/ig);
                // var reg = new RegExp("^\\d+(\\.\\d+)?$");//匹配数字
                if (reg.test(value)) { //如果检测到非数字和-，就返回true
                    return true;
                } else if (dotResult != null && dotResult.length > 1) {
                    return true;
                } else if (_result != null && _result.length > 1) {
                    return true;
                }
            },
            addIdToErrArray: function (id) {
                var parent = this.$parent.$parent;
                parent.errDataArr.addValue(id);
            },
            removeErrId: function (id) {
                var parent = this.$parent.$parent;
                parent.errDataArr.removeValue(id);
            },
            addErrMsg: function (msg) { //添加错误的提示
                this.alarmTxt = msg;
                this.isAlarm = true;
                this.addIdToErrArray(this._uid);
            },
            removeErrMsg: function () { //一处错误的提示
                this.isAlarm = false;
                this.alarmTxt = "";
                this.removeErrId(this._uid);
            },
            isMR: function (diffQ, md) { //判断修改的差值是否匹配分辨率
                var a = 1 / md; //进行整数倍放大
                var _diffQ = Math.abs(diffQ * a); //放大差值
                return parseInt(_diffQ) == parseFloat(_diffQ);
            }

        }
    };
});