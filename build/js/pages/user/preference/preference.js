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
        userName: null,
        model: {
          UserPreferencesModel: { //创建新用户的数据model
            Language: 0,
            TemperatureUnit: 0,
            LengthUnit: 0,
            PressureUnit: 0,
          },
        },
        LanguageList: [{
            name: "English",
            value: 0
          },
          {
            name: "简体中文",
            value: 1
          },
        ],
        TemperatureList: [{
            name: "℃",
            value: 0
          },
          {
            name: "℉",
            value: 1
          },
        ],
        LengthList: [
          //0：Meter；1：Feet
          {
            name: "Meter",
            value: 0
          },
          {
            name: "Feet",
            value: 1
          },
        ],
        PressureList: [
          //0：Pascal；1：Psi
          {
            name: "Pascal",
            value: 0
          },
          {
            name: "Psi",
            value: 1
          },
        ],
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true
        }
      };
    },
    computed: {
      schema: function () {
        return {
          groups: [{
            legend: 'Setup user preference',
            fields: [{
              type: 'select',
              label: 'Language',
              model: 'UserPreferencesModel.Language',
              values: this.LanguageList
            }, {
              type: 'select',
              label: 'Temperature Unit',
              model: 'UserPreferencesModel.TemperatureUnit',
              values: this.TemperatureList
            }, {
              type: 'select',
              label: 'Length Unit',
              model: 'UserPreferencesModel.LengthUnit',
              values: this.LengthList
            }, {
              type: 'select',
              label: 'Pressure Unit',
              model: 'UserPreferencesModel.PressureUnit',
              values: this.PressureList
            }]
          }]
        }
      },
    },
    mounted: function () {
      this.userName = this.$store.getters.userName;
      this.init();
    },
    methods: {
      init: function () {
        /* var layerTime = layer.load(2, {
          shade: [0.1, '#fff'] //0.1透明度的白色背景
        }); */
        this.getUserPrefer();
      },
      onApplyClick: function () {
        var obj = {};
        obj.language = this.model.UserPreferencesModel.Language.value;
        obj.tempUnit = this.model.UserPreferencesModel.TemperatureUnit.value;
        obj.lenUnit = this.model.UserPreferencesModel.LengthUnit.value;
        obj.pressUnit = this.model.UserPreferencesModel.PressureUnit.value;
        var layerTime = layer.load(2, {
          shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        $.ajax({
          url: '/cgi-bin/luci/api/v1/user/prefer?userName=' + this.userName, //获取所有的用户数据
          type: "put",
          data: JSON.stringify(obj),
          dataType: 'json',
          contentType: 'application/json',
          success: function (response) {
            console.log(response);
          }.bind(this),
          complete: function (response) {
            this.$store.getters.deviceCap.tempUnit = obj.tempUnit;
            this.init();
            layer.close(layerTime);
            layer.msg("success");
          }.bind(this)
        })
      },
      onCancelClick: function () {

      },
      initSelect: function (data) {
        var Language = {
          name: "English",
          value: 0
        };
        var TemperatureUnit = {
          name: "℃",
          value: 0
        };
        var LengthUnit = {
          name: "Meter",
          value: 0
        };
        var PressureUnit = {
          name: "Pascal",
          value: 0
        };
        if (data != undefined) { //有数据
          Language = this.LanguageList[data.language];
          TemperatureUnit = this.TemperatureList[data.tempUnit];
          LengthUnit = this.LengthList[data.lenUnit];
          PressureUnit = this.PressureList[data.pressUnit];
        }
        this.model.UserPreferencesModel.Language = Language;
        this.model.UserPreferencesModel.TemperatureUnit = TemperatureUnit;
        this.model.UserPreferencesModel.LengthUnit = LengthUnit;
        this.model.UserPreferencesModel.PressureUnit = PressureUnit;
      },
      getUserPrefer: function () { //obj,用户的数据
        $.ajax({
          url: '/cgi-bin/luci/api/v1/user/prefer?userName=' + this.userName, //获取所有的用户数据
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json',
          success: function (response) {
            console.log(response);
            this.initSelect(response);
          }.bind(this)
        })
      },
    }
  });
});
/* 
https://192.168.10.127/cgi-bin/luci/api/v1/user/prefer?userName=root
*/