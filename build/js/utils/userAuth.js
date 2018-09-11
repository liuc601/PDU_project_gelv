define(function(require) {

  var Vue = require('vue');
  function Auth$(list) { //需要传vue对象进来吗
    this.LISTOBJ = this.doAuthList(list);//吧数据处理成索引的对象
    this.router=null;//留着用来保存路由对象
    this.maxCopy = 10; //最大复制次数
    this.copyNum = 0;
    this.setVueAuth$();
  }
  Auth$.prototype.setVueAuth$ = function() {
    /*
      设置指令的绑定
    */
    Vue.directive('auth$', {
      bind: function(el, binding) {
        if (!this.LISTOBJ[binding.value]) {
          el.style.display = "none";
        }
      }.bind(this),
      inserted: function(el, binding) {},
      componentUpdated: function(el, binding) {
        // console.log('componentUpdated...');\
        if (!this.LISTOBJ[binding.value]) {
          el.style.display = "none";
        }else{
          el.style.display = "block";
        }
      }.bind(this),
      update: function(el, binding) {
        if (!this.LISTOBJ[binding.value]) {
          el.style.display = "none";
        }else{
          el.style.display = "block";
        }
      }.bind(this)
    });
  }
  /*
    根据传进来的权限列表进行路由更新
  */
  Auth$.prototype.filtrationRoute = function(routeList) {//过滤路由对象
    this.forInArr(routeList[0].children); //遍历删除权限控制的菜单
    return routeList
  };
  Auth$.prototype.filtrationMenuList = function(routeList) {//过滤菜单列表
    this.forInArr(routeList); //遍历删除权限控制的菜单
    return routeList
  };
  Auth$.prototype.forInArr = function(list) {
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (!this.LISTOBJ[item.meta.token]&&!!item.meta.token ) {
        list.splice(i, 1);
        i -= 1;
      }else{
        // console.log(item.title);
      }
      if (item.children) {
        this.forInArr(item.children);
      }
    }
  };
  Auth$.prototype.doAuthList = function(list) {
    /*
      如果没有列表的数据。就直接返回一个空对象
    */
    var obj = {};
    if(list===undefined||list.length<0){
      return obj
    }
    list.forEach(function(item) { //把权限列表转换成键值对形式存储
      obj[item] = item;
    });
    return obj
  }
  Auth$.prototype.copy = function(element) { //来一个copy函数，可以复制array和对象
    // console.log(element);
    if (this.copyNum > this.maxCopy) return false;
    this.copyNum++;
    var _element = null;
    var _type = this.whatsType(element);
    switch (_type) {
      case 'undefined' || 'null':
        break;
      case 'number':
        _element = element;
        break;
      case 'string':
        _element = element;
        break;
      case 'array':
        _element = [];
        element.forEach(function(item, index) {
          _element.push(this.copy(item));
        }.bind(this));
        break;
      case 'object':
        _element = {};
        for (var i in element) {
          _element[i] = this.copy(element[i]);
        }
        _element = element;
        break;
      case 'function':
        _element = 'function';
        break;
      default:
    }
    return element;
  };
  Auth$.prototype.whatsType = function(element) { //来一个copy函数，可以复制array和对象
    var _type = typeof element;
    if (element === null) _type = 'null';
    switch (_type) {
      case 'object':
        if (element instanceof Object) {
          _type = 'object';
        };
        if (element instanceof Array) {
          _type = 'array';
        };
        break;
    }
    return _type;
  };
  Auth$.prototype.setList = function(list) {
    this.LISTOBJ = this.doAuthList(list);
  };
  Auth$.prototype.setRoute = function() {
    this.LISTOBJ = this.doAuthList(list);
    app.$router =this.filtrationRoute();
  }
  //控制是否可以提示，

  return Auth$
});
//type: 1 模块 2、 功能、 3 字段
