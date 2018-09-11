define(function(require) {
  var Vue = require('vue');
  var overview = require('_http/overviewApi');
  var sa = require('_http/serviceAccessApi');
  var sd = require('_http/serviceDefinitionApi');
  var objArr = [overview, sa,sd];
  var axios = Vue.axios;
  var obj = {};
  objArr.forEach(function(item) {
    addObjAttr(obj, item);
  });

  function addObjAttr(obj, item) {
    for (var i in item) {
      obj[i] = item[i];
    }
  }
  return obj;
});
