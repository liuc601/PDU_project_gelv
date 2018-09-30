define(function (require) {
  var Vue = require('vue');
  var VueFormGenerator = require('vue-form');

  require('components/x-panel');
  require('components/form-action');

  Vue.use(VueFormGenerator);

  function ChangeTimeToString(DateIn) {
    // 初始化时间
    var Year = DateIn.getFullYear();
    var Month = DateIn.getMonth() + 1;
    var Day = DateIn.getDate();
    var Hour = DateIn.getHours();
    var Minute = DateIn.getMinutes();
    var CurrentDate = "";

    CurrentDate = Year + "-";

    if (Month >= 10) {
      CurrentDate = CurrentDate + Month + "-";
    } else {
      CurrentDate = CurrentDate + "0" + Month + "-";
    }

    if (Day >= 10) {
      CurrentDate = CurrentDate + Day + "_";
    } else {
      CurrentDate = CurrentDate + "0" + Day + "_";
    }

    if (Hour >= 10) {
      CurrentDate = CurrentDate + Hour;
    } else {
      CurrentDate = CurrentDate + "0" + Hour;
    }

    if (Minute >= 10) {
      CurrentDate = CurrentDate + "-" + Minute;
    } else {
      CurrentDate = CurrentDate + "-0" + Minute;
    }

    return CurrentDate;
  }

  return Vue.extend({
    template: require('text!./backup.html'),
    data: function () {
      return {
        model: {
          fileDownload: '',
          fileUpload: '',
        },
        loaded: 0, // 已上传大小
        total: 0, // 总大小
        progress: 0, // 上传进度
        fileInfo: [], // 信息
        progressShow: false, // 是否显示进度条            
        schema: {
          groups: [{
            legend: 'Backup system configuration file',
            fields: [{
              label: "System configuration file",
              model: "fileDownload",
              buttons: [{
                classes: 'btn btn-success btn-sm',
                label: 'Backup',
                onclick: function (model, field) {
                  //this.downloadConfig();
                  var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                  });

                  var url = '/cgi-bin/luci/api/v1/download?type=config';
                  var xhr = new XMLHttpRequest();
                  xhr.open('GET', url, true); // 也可以使用POST方式，根据接口
                  xhr.responseType = "blob"; // 返回类型blob

                  // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                  xhr.onload = function () {
                    // 请求完成
                    if (this.status === 200) {
                      // 返回200
                      var blob = this.response;
                      var reader = new FileReader();
                      reader.readAsDataURL(blob); // 转换为base64，可以直接放入a
                      reader.onload = function (e) {
                        // 转换完成，创建一个a标签用于下载
                        var a = document.createElement('a');
                        var time = ChangeTimeToString(new Date());
                        /* var disposition = xhr.getResponseHeader('Content-Disposition');
                         if (disposition && disposition.indexOf('attachment') !== -1) {
                             var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                             var matches = filenameRegex.exec(disposition);
                             if (matches != null && matches[1]) { 
                               filename = matches[1].replace(/['"]/g, '');
                             }
                         }*/
                        a.download = 'backup_config_' + time + '.tar.gz';
                        a.href = e.target.result;
                        $("body").append(a); // 修复firefox中无法触发click
                        a.click();
                        $(a).remove();
                      }
                    }
                    setTimeout(function() {
                      layer.close(layerTime);
                    });
                  };
                  // 发送ajax请求
                  xhr.send()
                }
              }]
            }]
          }, {
            legend: 'Restore system configuration',
            fields: [{
              type: 'input',
              inputType: 'text',
              label: 'System configuration file',
              model: 'fileUpload.name',
              buttons: [{
                classes: 'btn btn-primary btn-small',
                label: 'Browse...',
                onclick: function (model, field) {
                  $(".filess").click();
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
      selectedShow: function (e) {
        this.model.fileUpload = e.target.files[0];
      },
      uploadConfig: function () {
        this.fileInfo = [];
        this.loaded = 0;
        this.total = 0;
        this.progress = 0;
        if (this.model.fileUpload) {
          // FormData
          var formData = new FormData();
          formData.append('config', this.model.fileUpload);

          var xhr = new XMLHttpRequest();
          xhr.responseType = 'json';
          // 状态改变事件
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              var data = xhr.response;
              console.log(data);
            }

            if (xhr.readyState === 4) {
              this.progressShow = false;

              if (xhr.status === 200) {
                //alert('Upgrade successful;)');
                layer.msg(';) Restore successful, Please wait for system rebooting...', {
                  time: 0, //不自动关闭
                  btn: ['OK'],
                  yes: function (index) {
                    layer.close(index);
                  }
                });
              } else {
                //alert('Upgrade Failed:(');
                layer.msg('Restore Failed:(', {
                  time: 0, //不自动关闭
                  btn: ['OK'],
                  yes: function(index ) {
                    layer.close(index);
                  }
                });
              }
            }

          }.bind(this);

          // 进度事件
          xhr.upload.onprogress = function (e) {
            this.progressShow = true;
            var loaded = e.loaded,
              total = e.total,
              progress = Math.floor(loaded / total * 100);
            this.loaded = loaded;
            this.total = total;
            this.progress = progress;
          }.bind(this);

          xhr.open('post', '/cgi-bin/luci/api/v1/upload?type=config');
          xhr.send(formData);
        } else {
          alert('Please select file~');
        }
      },
      onApplyClick: function () {
        layer.msg('Confirm to Restore?', {
          time: 0, //不自动关闭
          btn: ['yes', 'no'],
          yes: function(index) {
            layer.close(index);
            this.uploadConfig();
          }.bind(this)
        });
      }
    }
  });
});