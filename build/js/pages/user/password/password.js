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
          oldPassword: '',
          newPassword: '',
          verifyNewPassword: '',
        },
        username:null,
        schema: {
          groups: [{
            legend: 'Enter current and new password',
            fields: [{
              type: 'input',
              inputType: 'password',
              label: 'Current Password',
              model: 'oldPassword'
            }, {
              type: 'input',
              inputType: 'password',
              label: 'New Password',
              model: 'newPassword'
            }, {
              type: 'input',
              inputType: 'password',
              label: 'Verify New Password',
              model: 'verifyNewPassword'
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
        this.username = this.$store.getters.userName;
        var data = {
          oldPassword: this.model.oldPassword,
          newPassword: this.model.newPassword,
        }
        console.log(data);
        if(this.model.verifyNewPassword!=data.newPassword){
          layer.msg("The twice passwords do not match");
          return;
        }
        if(data.newPassword.length<6||data.newPassword.length>32){
          layer.msg("Length of 6 - 32");
          return;
        }

        this.passwordChange(data);

        // var layerTime = layer.load(2, {
        //   shade: [0.1, '#fff'] //0.1透明度的白色背景
        // });
        // this.passwordChange("PUT",data,response=>{
        //   this.model.oldPassword='';
        //   this.model.newPassword='';
        //   this.model.verifyNewPassword= '';

        //   var rsp = response.responseText;

        //   layer.close(layerTime);

        //   if(rsp.result == "SUCCESS")
        //     layer.msg("Your password has been successfully changed. Please login using your new password.");
        //   else
        //     layer.msg("The current password is not correct!")
        // });
      },
      onCancelClick: function () {
        this.model.oldPassword='';
        this.model.newPassword='';
        this.model.verifyNewPassword= '';
      },
      passwordChange:function(obj) {//obj,用户的数据
        console.log(obj);
        var layerTime = layer.load(2, {
          shade: [0.1, '#fff'] //0.1透明度的白色背景
        });        
        var username=this.username;
        $.ajax({
          url: '/cgi-bin/luci/api/v1/user/password?username=' +username,//获取所有的用户数据
          type: "PUT",
          data: JSON.stringify(obj),
          contentType: 'application/json',
          dataType: 'json',
          //complete: (response) => {
          success:function(response) {
            this.model.oldPassword='';
            this.model.newPassword='';
            this.model.verifyNewPassword= '';

            layer.close(layerTime);

            if(response.result == "SUCCESS")
              layer.msg("Your password has been successfully changed. <br> Please login using your new password.");
            else
              layer.msg("The current password is not correct!")
          }.bind(this)
        })
      },
    }
  });
});