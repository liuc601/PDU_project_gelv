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
      Array.prototype.getMaxValue = function (attrname/*如果是对象的话，需要计算的属性名*/) {//获取数组中最大的value
        var max=0;
        this.forEach(function(item,index){
            if(attrname!==undefined){
              if(parseFloat(item[attrname])>max){
                max=parseFloat(item[attrname]);
              }
            }else{
              if(parseFloat(item)>max){
                max=parseFloat(item);
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
    }
  }
});
//type: 1 模块 2、 功能、 3 字段