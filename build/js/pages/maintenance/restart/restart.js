define(function (require) {
  var Vue = require('vue');
  var VueFormGenerator = require('vue-form');

  require('components/x-panel');
  require('components/form-action');

  Vue.use(VueFormGenerator);

  return Vue.extend({
    template: require('text!./restart.html'),
    data: function () {
      return {
        model: {
          restart: 0,
        },
        schema: {
          groups: [{
            legend: 'Initiate a system restart',
            fields: [{
              label: "Action",
              model: "restart",
              buttons: [{
                classes: 'btn btn-success btn-sm',
                label: 'Restart',
                onclick: function (model, field) {
                    layer.msg('Confirm ? Restarting requires you to re-login in order to further control or configure the PDU via a web browser.', {
                    time: 0 //不自动关闭
                    , btn: ['yes', 'no']
                    , yes: function(index) {
                      layer.close(index);
                      $.ajax({
                        url: '/cgi-bin/luci/api/v1/system/restart',
                        type: "POST",
                        contentType: 'application/json',
                        dataType: 'json',
                        complete: function(response)  {
                          layer.msg("Restart Successful");
                          setTimeout(function(){
                            window.location.reload();
                          },1000);
                        }.bind(this)
                      })
                    }.bind(this)
                  });
                }
              }]
            }]
          }]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true
        }
      };
    },
    methods: {
      onApplyClick: function () {
      },
    }
  });
});