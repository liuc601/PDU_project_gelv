/*
 当前项目的一些小工具
 * @Author: 刘沙
 * @Date: 2018-06-15
 */
define(function (require) {
  return {
    install: function (Vue) {
      for (var i in this) {
        if (i != 'install' && this[i] !== undefined) {
          Vue.prototype[i] = this[i];
        }
      }
      this.init();
    },
    init: function () {
      this.addArrayFn();
    },
    cookieSet: function (c_name, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays * 1000000)
      document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
    },
    cookieGet: function (name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = parent.document.cookie.match(reg)) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },
    addEvent: function (ele, xEvent, fn) { //事件绑定函数，用来绑定滚动事件用
      if (ele.attachEvent) {
        ele.attachEvent('on' + xEvent, fn);
      } else {
        ele.addEventListener(xEvent, fn, false);
      }
    },
    copyData: function (txt, fn) { //可以复制文本
      var text = document.createElement("textarea");
      text.style.width = "1px";
      text.style.height = "1px";
      text.style.padding = "0px";
      text.style.position = "absolute";
      text.style.left = "0";
      text.style.bottom = "0";
      document.getElementsByTagName("body")[0].appendChild(text);
      text.value = txt;
      text.select(); // 选择对象
      if (document.execCommand("Copy")) {
        fn && fn();
        document.getElementsByTagName("body")[0].removeChild(text);
      }
    },
    addArrayFn: function () { //添加一些数组的方法
      Array.prototype.addValue = function (value) {
        if (!~this.indexOf(value)) { //如果没有查找到该值，就添加进数组
          this.push(value);
        }
      }
      Array.prototype.removeValue = function (value) {
        if (!!~this.indexOf(value)) { //如果没有查找到该值，就不删除
          var index = this.indexOf(value);
          this.splice(index, 1);
        }
      }
      Array.prototype.getMaxValue = function (attrname /*如果是对象的话，需要计算的属性名*/ ) { //获取数组中最大的value
        var max = 0;
        this.forEach(function (item, index) {
          if (attrname !== undefined) {
            if (parseFloat(item[attrname]) > max) {
              max = parseFloat(item[attrname]);
            }
          } else {
            if (parseFloat(item) > max) {
              max = parseFloat(item);
            }
          }
        })
        return max;
      }
      if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
          value: function (predicate) {
            'use strict';
            if (this == null) {
              throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
              throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
              value = list[i];
              if (predicate.call(thisArg, value, i, list)) {
                return value;
              }
            }
            return undefined;
          }
        });
      }
    },
    // 一些当前项目使用的方法
    clearSwitchControlLabel: function () {
      //因为VueFormGenerator插件的switch组件的触发范围包含了lebal，所以需要使用这个方法进行修正
      var switchList = Array.prototype.slice.call(document.getElementsByClassName("field-switch"));
      if (switchList.length == 0) return;
      switchList.forEach(function (item) {
        item.getElementsByClassName("control-label")[0].setAttribute("for", Math.random().toString(36).substr(2));
      })
    },
    getStatusColor: function (status, value) { //根据传进来的状态返回相对应的颜色和值
      switch (status) {
        case 0: //Normal
          return value
        case 1: //Disabled
          return value
        case 12: //"Breaker Tripped";
          return value
        case 14: //"Low Alarm";
          return "<div class='red'>" + value + '</div>'
        case 15: //"Low Warning";
          return "<div class='orange'>" + value + '</div>'
        case 16: //"High Warning";
          return "<div class='orange'>" + value + '</div>'
        case 17: //"High Alarm";
          return "<div class='red'>" + value + '</div>'
        default:
          return value
      }
    },
    doValueDigit: function (unit, value, item,bool) { //根据单位处理小数点的位数
      var Val = 0;
      switch (unit) {
        case 'kW':
          Val = this.doNumberDigit(value, 'W', item,bool);
          break;
        case 'kVA':
          Val = this.doNumberDigit(value, 'VA', item,bool);
          break;
        case 'kWh':
          Val = this.doNumberDigit(value, 'Wh', item,bool);
          break;
        case 'Hz':
          if (this.isDot(value)) {
            Val = parseFloat(value).toFixed(1);
          } else {
            Val = value + ".0"
          }
          break;
        case 'V':
          if (this.isDot(value)) {
            Val = parseFloat(value).toFixed(0);
          } else {
            Val = value
          }
          break;
        case 'v':
          if (this.isDot(value)) {
            Val = parseFloat(value).toFixed(0);
          } else {
            Val = value
          }
          break;
        case '%':
          if (this.isDot(value)) {
            Val = parseFloat(value).toFixed(1);
          } else {
            Val = value + ".0"
          }
          break;
        case 'A':
          if (this.isDot(value)) {
            Val = parseFloat(value).toFixed(2);
          } else {
            Val = value + ".00"
          }
          break;
        case 'PF':
          if (this.isDot(value)) {
            Val = parseFloat(value).toFixed(2);
          } else {
            Val = value + ".00"
          }
          break;
        case undefined:
          if (item.title == "Power Factor") { //判断是不是功率因素
            if (this.isDot(value)) {
              Val = parseFloat(value).toFixed(2);
            } else {
              Val = value + ".00"
            }
          }
          break;
        default:
          Val = value;
          break;
      }
      return Val
      // return value
    },
    integerLength: function (value) { //返回整数位的长度
      var i = (value + "").indexOf(".");
      return (value + "").slice(0, i).length;
    },
    floatLength: function (value) { //返回小数位的长度
      var i = (value + "").indexOf(".");
      return (value + "").slice(i + 1).length;
    },
    doNumberDigit: function (value, unit, item,bool) { //处理数字的位数
      var Val,u;
      if (this.isDot(value)) {
        if (this.integerLength(value) == 1 && this.floatLength(value) >= 3) {
          Val = (value * 1000).toFixed(0);
          item.unit = unit;
          u = unit;
        } else {
          Val = parseFloat(value).toFixed(1);
          u = "k"+unit;
        }
      } else {
        Val = value;
        u = "k"+unit;
      }
      if(!!bool){
        return [Val,u];
      }else{
        return Val;
      }
    },
    isDot: function (value) { //处理小数点
      var reg = new RegExp("\\.");
      return reg.test(value + "");
    },
  }
});
//type: 1 模块 2、 功能、 3 字段