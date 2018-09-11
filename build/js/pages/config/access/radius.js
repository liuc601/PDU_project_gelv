define(function (require) {
  var Vue = require('vue');
  var VueFormGenerator = require('vue-form');

  require('components/x-panel');
  require('components/form-action');

  Vue.use(VueFormGenerator);

  return Vue.extend({
    template: require('text!pages/form.html'),
    data: function () {
      return {
        model: {

        },
        schema: {
          groups: [{
            legend: 'Configure local and remote access settings',
            fields: [{
              type: "label",
              label: "LDAP",
              model: "radius.radius",
            }, {
              type: 'input',
              inputType: 'text',
              label: 'Primary Server',
              model: 'radius.primary'
            }, {
              type: 'input',
              inputType: 'text',
              label: 'Shared Secret',
              model: 'radius.password',
              buttons: [{
                classes: 'btn btn-primary btn-small',
                label: 'Change',
                onclick: function (model, field) {
                }
              }]
            }, {
              type: 'input',
              inputType: "text",
              label: 'Port',
              model: 'radius.port',
              hint: '(default1812)'
            }, {
              type: 'input',
              inputType: "text",
              label: 'Timeout',
              model: 'radius.port',
              hint: '(seconds)'
            }, {
              type: 'input',
              inputType: 'text',
              label: 'Retries',
              model: 'radius.primary'
            }, {
              type: 'input',
              inputType: 'text',
              label: 'Secondary Server',
              model: 'radius.primary'
            }, {
              type: 'input',
              inputType: 'text',
              label: 'Shared Secret',
              model: 'radius.password',
              buttons: [{
                classes: 'btn btn-primary btn-small',
                label: 'Change',
                onclick: function (model, field) {
                }
              }]
            }, {
              type: 'input',
              inputType: "text",
              label: 'Port',
              model: 'radius.port',
              hint: '(default1812)'
            }, {
              type: 'input',
              inputType: "text",
              label: 'Timeout',
              model: 'radius.port',
              hint: '(seconds)'
            }, {
              type: 'input',
              inputType: "text",
              label: 'Retries',
              model: 'radius.port',
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
      onCancelClick: function () {

      }
    }
  });
});