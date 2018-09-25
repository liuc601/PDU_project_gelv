/*
 *该文件用来编写不同表格的不同验证规则
 */
define(function (require) {
    return {
        data: function () {
            return {
                maxValueName: '', //最大值的字段名
                minValueName: '', //最大值的字段名
                分辨率: 1,
            };
        },
        methods: {
            minDiffValue: function () { //给出当前分辨率的函数
                var showType = this.rowData.showType;
                var mdvTable = {
                    "Inlet Active Power(kW)": 0.001,
                    "Active Power(kW)": 0.001,
                    "activePower": 0.001,

                    "Inlet Apparent Power(kVA)": 0.001,
                    "Apparent Power(kVA)": 0.001,
                    "apparentPower": 0.001,

                    "Inlet Power Factor": 0.01,
                    "Power Factor(%)": 0.01,
                    "powerFactor": 0.01,

                    "Inlet Active Energy(kWh)": 0.001,
                    "Active Energy(kWh)": 0.001,
                    "activeEnergy": 0.001,

                    "Inlet Line Frequency(Hz)": 0.1,
                    "Line Frequency(Hz)": 0.1,
                    "frequency": 0.1,

                    "Inlet Current(A)": 0.1,
                    "Current(A)": 0.1,
                    "current": 0.1,

                    "Inlet Voltage(V)": 1,
                    "Voltage(V)": 1,
                    "voltage": 1,

                    "Temperature": 0.1,
                    "Humidity(%RH)": 1
                }
                if (mdvTable[showType]) {
                    return mdvTable[showType]
                } else {
                    console.log("没有找到当前的分辨率    ", showType);
                    return 0.000001
                }
            },
            hysteresisMaxValue: function () { //给出hysteresis的最大设置值,所有的最小设置值为0
                var showType = this.rowData.showType;
                var hysteresisMaxValue = {
                    "Inlet Active Power(kW)": 1,
                    "Active Power(kW)": 1,
                    "activePower": 1,

                    "Inlet Apparent Power(kVA)": 1,
                    "Apparent Power(kVA)": 1,
                    "apparentPower": 1,

                    "Inlet Power Factor": 0.2,
                    "Power Factor(%)": 0.2,
                    "powerFactor": 0.2,

                    "Inlet Active Energy(kWh)": 1,
                    "Active Energy(kWh)": 1,
                    "activeEnergy": 1,

                    "Inlet Line Frequency(Hz)": 10,
                    "Line Frequency(Hz)": 10,
                    "frequency": 10,

                    "Inlet Current(A)": 10,
                    "Current(A)": 10,
                    "current": 10,

                    "Inlet Voltage(V)": 20,
                    "Voltage(V)": 20,
                    "voltage": 20,

                    "Temperature": 50,
                    "Humidity(%RH)": 20
                }
                if (hysteresisMaxValue[showType]) {
                    return hysteresisMaxValue[showType]
                } else {
                    console.log("hysteresisMaxValue    ", showType);
                    return 10
                }
            },
            /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
            hl的判断规则
            ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
            hlRule: function (field, isTp) {
                var nowField = this.field; //当前是哪个组件？
                var showType=this.showType;
                var val = parseFloat(this.rowData['_' + nowField] != undefined ? this.rowData['_' + nowField] : this.rowData[nowField]); //找到当前修改的值
                val = val == '-' ? '-' : parseFloat(val);
                var min = parseFloat(this.rowData.minValue);
                var max = parseFloat(this.rowData.maxValue);
                var maxValueHysteresis = parseFloat(this.rowData.maxValueHysteresis);
                var h = this.rowData._hysteresis != undefined ? this.rowData._hysteresis : this.rowData.hysteresis;
                h = h == '-' ? '-' : parseFloat(h);
                var lowAlarm = parseFloat(this.rowData._lowAlarm != undefined ? this.rowData._lowAlarm : this.rowData.lowAlarm);
                lowAlarm = lowAlarm == '-' ? '-' : parseFloat(lowAlarm);
                var lowWarning = parseFloat(this.rowData._lowWarning != undefined ? this.rowData._lowWarning : this.rowData.lowWarning);
                lowWarning = lowWarning == '-' ? '-' : parseFloat(lowWarning);
                var highWarning = parseFloat(this.rowData._highWarning != undefined ? this.rowData._highWarning : this.rowData.highWarning);
                highWarning = highWarning == '-' ? '-' : parseFloat(highWarning);
                var highAlarm = parseFloat(this.rowData._highAlarm != undefined ? this.rowData._highAlarm : this.rowData.highAlarm);
                highAlarm = highAlarm == '-' ? '-' : parseFloat(highAlarm);
                var fieldArr = ['min', 'lowAlarm', 'lowWarning', 'highWarning', 'highAlarm', 'max'];
                var index = fieldArr.indexOf(nowField);
                var errStr = '';
                var downArr = fieldArr.slice(0, index).reverse();
                downArr.push('hysteresis');
                var upArr = fieldArr.slice(index + 1, fieldArr.length);


                console.log(isTp?'当前是传感器':'普通',max,min);


                if (val == '-') { //如果当前的值是  - ，就不做任何比较，跳过
                    return;
                }
                if (nowField == 'hysteresis') { //当hysteresis发生修改时，只向上遍历,并且
                    downArr = [];
                    downArr.push('hysteresis');
                }
                downArr.forEach(function (item, i) {
                    if (errStr != '') { //如果已经有错误信息了，就不必循环了
                        return;
                    }
                    switch (item) {
                        case 'hysteresis':
                            if (h == '-') {
                                errStr = "hysteresis is not allowed to be set to -";
                                return;
                            }
                            if (h < 0) {
                                errStr = "Less than minim 0";
                                return;
                            } else if (h > maxValueHysteresis) {
                                errStr = "Over the maximum " + maxValueHysteresis;
                                return
                            }
                            //再判断除了hysteresis自身以外的所有差值判断
                            if (field == 'hysteresis' || nowField == 'hysteresis') {
                                return;
                            }
                            // if (this.sub(val, h) < 0 && min>=0) {
                            if (this.sub(val, h) < min) {
                                errStr = 'Lower Alarm - hysteresis must be greater or equal than min '+min;
                                return;
                            }
                            break;
                        case 'highWarning':
                            if (highWarning == '-') {
                                return;
                            }
                            if (this.sub(val, h) < highWarning) {
                                errStr = "highAlarm - hysteresis must be greater or equal to highWarning"
                            }
                            break;
                        case 'lowWarning':
                            if (lowWarning == '-') {
                                return;
                            }
                            if (this.sub(val, 2 * h) < lowWarning) {
                                errStr = field + " - 2 * hysteresis must be greater or equal to lowWarning"
                            }
                            break;
                        case 'lowAlarm':
                            if (lowAlarm == '-') {
                                return;
                            }
                            //必须保证high和low之间的差值是两倍回差，所以当前正在修改是highWarning或者highAlarm时，
                            //往下判断时，lowWarning被跳过了，到了lowAlarm这里时，必须保证还是减去两倍的回差值
                            if (field == 'highWarning' || field == 'highAlarm') {
                                if (this.sub(val, 2 * h) < lowAlarm) {
                                    errStr = field + " -  2 * hysteresis must be greater or equal to lowAlarm"
                                }

                            } else {
                                if (this.sub(val, h) < lowAlarm) {
                                    errStr = field + " -  hysteresis must be greater or equal to lowAlarm"
                                }

                            }
                            break;
                        case 'min':
                            if (val < min) {
                                errStr = field + "must be greater min " + min;
                            }
                            break;
                    }

                }.bind(this));
                upArr.forEach(function (item, i) {
                    if (errStr != '') { //如果已经有错误信息了，就不必循环了
                        return;
                    }
                    switch (item) {
                        case 'lowWarning':
                            if (lowWarning == '-') {
                                return;
                            }
                            if (nowField == 'hysteresis') { //当hysteresis发生修改时，只向上遍历,并且
                                if (lowAlarm == '-') {
                                    return;
                                }
                                val = lowAlarm;
                            }
                            if (this.add(val, h) > lowWarning) {
                                if (field == 'hysteresis') {
                                    // errStr = "lowAlarm + hysteresis must be less than or less than to lowWarning";
                                    return
                                }
                                errStr = field + " + hysteresis must be less than or equal to lowWarning"
                            }
                            break;
                        case 'highWarning':
                            if (highWarning == '-') {
                                return;
                            }
                            if (nowField == 'hysteresis') { //当hysteresis发生修改时，只向上遍历,并且
                                if (lowWarning == '-') {
                                    return;
                                }
                                val = lowWarning;
                            }
                            if (this.add(val, 2 * h) > highWarning) {
                                if (field == 'hysteresis') {
                                    errStr = "lowWarning + 2 * hysteresis must be less than or equal to highWarning";
                                    return
                                }
                                errStr = field + " + 2 * hysteresis must be less than or equal to highWarning"
                            }
                            break;
                        case 'highAlarm':
                            if (highAlarm == '-') {
                                return;
                            }
                            if (nowField == 'hysteresis') { //当hysteresis发生修改时，只向上遍历,并且
                                if (highWarning == '-') {
                                    return;
                                }
                                val = highWarning;
                            }
                            //必须保证high和low之间的差值是两倍回差，所以当前正在修改是lowWarning或者lowAlarm时，
                            //向上判断时，highWarning被跳过了，到了highAlarm这里时，必须保证还是加上两倍的回差值
                            if (field == 'lowWarning' || field == 'lowAlarm') {
                                if (this.add(val, 2 * h) > highAlarm) {
                                    if (nowField == 'hysteresis') { //只是对要显示的名字做判断和处理
                                        errStr = "highWarning + 2*hysteresis must be less than or equal to highAlarm";
                                        return
                                    }
                                    errStr = field + " +  hysteresis must be less than or equal to highAlarm"
                                }
                            } else {
                                if (this.add(val, h) > highAlarm) {
                                    if (nowField == 'hysteresis') { //只是对要显示的名字做判断和处理
                                        errStr = "highWarning + hysteresis must be less than or equal to highAlarm";
                                        return
                                    }
                                    errStr = field + " +  hysteresis must be less than or equal to highAlarm"
                                }

                            }
                            break;
                        case 'max':
                            if (val > max) {
                                errStr = field + " must be less than or equal to Max " + max;
                            }

                            break;
                    }
                }.bind(this));
                if (errStr != '') {
                    if (nowField == field) {
                        this.addErrMsg(errStr);
                    } else if (this.alarmTxt != '') { //如果已经有错误的提示，就覆盖原本的
                        this.addErrMsg(errStr);
                    }
                } else {
                    this.removeErrMsg();
                }
            },
            /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
            hl的判断规则
            ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
        }
    };
});