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
                    /* 
                        之后有时间的话，通过正则来进行判断
                    */
                    // 功率
                    "Inlet Active Power(kW)": 0.001,
                    "Active Power(kW)": 0.001,
                    "activePower": 0.001,
                    
                    // 功率因子
                    "Inlet Apparent Power(kVA)": 0.001,
                    "Apparent Power(kVA)": 0.001,
                    "apparentPower": 0.001,
                    
                    // 反正就是百分比
                    "Inlet Power Factor": 0.01,
                    "Power Factor(%)": 0.01,
                    "powerFactor": 0.01,
                    
                    // 反正active功率应该是
                    "Inlet Active Energy(kWh)": 0.001,
                    "Active Energy(kWh)": 0.001,
                    "activeEnergy": 0.001,
                    
                    // 频率
                    "Inlet Line Frequency(Hz)": 0.1,
                    "Line Frequency(Hz)": 0.1,
                    "frequency": 0.1,
                    
                    // 电流
                    "Inlet Current(A)": 0.1,
                    "Current(A)": 0.1,
                    "current": 0.1,
                    "L1 Current(A)": 0.1,
                    "L2 Current(A)": 0.1,
                    "L3 Current(A)": 0.1,
                    "N Current(A)": 0.1,
                    "Inlet Unbalanced Current(%)": 0.1,
                    
                    // 电压
                    "Inlet Voltage(V)": 1,
                    "Voltage(V)": 1,
                    "voltage": 1,
                    "L1-N Voltage(V)": 1,
                    "L1-L2 Voltage(V)": 1,
                    "L2-N Voltage(V)": 1,
                    "L2-L3 Voltage(V)": 1,
                    "L3-N Voltage(V)": 1,
                    "L3-L1 Voltage(V)": 1,
                    
                    // 传感器
                    "Temperature": 0.1,
                    "Humidity(%RH)": 1
                }
                if (mdvTable[showType]) {
                    return mdvTable[showType]
                } else if (this.field == "name") {
                    return 1
                } else {
                    console.log("没有找到当前的分辨率    ", showType);
                    return 0.000001
                }
            },
            hysteresisMaxValue: function () { //给出hysteresis的最大设置值,所有的最小设置值为0
                var showType = this.rowData.showType;
                var hysteresisMaxValue = {
                    // 功率
                    "Inlet Active Power(kW)": 1,
                    "Active Power(kW)": 1,
                    "activePower": 1,
                    
                    // 功率因子
                    "Inlet Apparent Power(kVA)": 1,
                    "Apparent Power(kVA)": 1,
                    "apparentPower": 1,
                    
                    // 反正就是百分比
                    "Inlet Power Factor": 0.2,
                    "Power Factor(%)": 0.2,
                    "powerFactor": 0.2,
                    
                    // 反正active功率应该是
                    "Inlet Active Energy(kWh)": 1,
                    "Active Energy(kWh)": 1,
                    "activeEnergy": 1,
                    
                    // 频率
                    "Inlet Line Frequency(Hz)": 10,
                    "Line Frequency(Hz)": 10,
                    "frequency": 10,
                    
                    // 电流
                    "Inlet Current(A)": 10,
                    "Current(A)": 10,
                    "current": 10,
                    "L1 Current(A)": 10,
                    "L2 Current(A)": 10,
                    "L3 Current(A)": 10,
                    "N Current(A)": 10,
                    "Inlet Unbalanced Current(%)": 10,
                    
                    // 电压
                    "Inlet Voltage(V)": 20,
                    "Voltage(V)": 20,
                    "voltage": 20,
                    "L1-N Voltage(V)": 20,
                    "L1-L2 Voltage(V)": 20,
                    "L2-N Voltage(V)": 20,
                    "L2-L3 Voltage(V)": 20,
                    "L3-N Voltage(V)": 20,
                    "L3-L1 Voltage(V)": 20,
                    

                    // 传感器
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
                var showType = this.showType;
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
                                errStr = "Less than minimum 0";
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
                                errStr = 'Low Alarm - hysteresis must be greater or equal than min ' + min;
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
                            if (nowField == 'highWarning' || nowField == 'highAlarm') {
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
                            if (nowField == 'lowWarning' || nowField == 'lowAlarm') {
                                if (this.add(val, 2 * h) > highAlarm) {
                                    if (nowField == 'hysteresis') { //只是对要显示的名字做判断和处理
                                        errStr = "highWarning + 2*hysteresis must be less than or equal to highAlarm";
                                        return
                                    }
                                    errStr = field + " +  2*hysteresis must be less than or equal to highAlarm"
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
            /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
            hl的判断规则
            ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
            exRule: function (field, isTp) {
                //"delay"
                var nowField = this.field; //当前是哪个组件？
                var showType = this.showType;
                var errStr = '';
                var val = parseFloat(this.rowData['_' + nowField] != undefined ? this.rowData['_' + nowField] : this.rowData[nowField]); //找到当前修改的值
                val = val == '-' ? '-' : parseFloat(val);
                var min = 0;
                var max = 900;
                if (nowField == "delay") {
                    if (val > max) {
                        errStr = field + " must be less than or equal to Max " + max;
                        this.addErrMsg(errStr);
                    } else if (val < min) {
                        errStr = field + "must be greater min " + min;
                        this.addErrMsg(errStr);
                    } else {
                        this.removeErrMsg();
                    }
                }
            },
            /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
            hl的判断规则
            ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
        }
    };
});