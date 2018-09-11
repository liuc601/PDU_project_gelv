define(function (require) {
	var Vue = require('vue');
	var Datatable = require('datatable');
	var VueFormGenerator = require('vue-form');

	require('components/x-panel');
	require('components/form-action');

	Vue.use(VueFormGenerator);

	var mixin = {
		data: function () {
			return {
				fields: [{
					name: 'id',
					title: 'Date/Time',
				},
				{
					name: 'name',
					title: 'Previous Version'
				},
				{
					name: 'type',
					title: 'Upgrade Version'
				},
				{
					name: 'type',
					title: 'Status'
				}]
			};
		},
	};

	return Vue.extend({
		template: require('text!./firmware.html'),
		components: {
			'datatable': Datatable(mixin)
		},

		data: function () {
			return {
				model: {
					file: '',
					filename: '',
				},
				loaded: 0,				// 已上传大小
				total: 0,				// 总大小
				progress: 0,			// 上传进度
				fileInfo: [],			// 图片信息
				progressShow: false, 	// 是否显示进度条				
				datas:[],
				schema: {
					fields: [{
						type: 'input',
						inputType: 'text',
						label: 'Upgrade File',
						model: 'file.name',
						buttons: [{
			                classes: 'btn btn-primary btn-small',
			                label: 'Browse...',
			                onclick: function (model, field) {
			                	$(".filess").click();
			                }
		              	}]
					}]
				},
				formOptions: {
					validateAfterLoad: true,
					validateAfterChanged: true
				},
			};
		},
		filters: {
			default: function(v) {
				if(v!==undefined && v==='') {
					return '--';
				} else {
					return v;
				}
			}
		},		
		methods: {
			selectedShow: function(e) {
				this.model.file = e.target.files[0];
			},
			messageBox: function(message) {
				var ret = false;
	            layer.msg(message, {
	                time: 0, //不自动关闭
	                btn: ['yes', 'no'],
	                yes: function(index ) {
	                	layer.close(index);
	                	ret = true;
	                }
	            });

	            return ret;
			},
			upload: function() {
				this.fileInfo = [];
				this.loaded = 0;
				this.total = 0;
				this.progress = 0;
				if(this.model.file) {
					// FormData
					var formData = new FormData();
					formData.append('package', this.model.file);

					var xhr = new XMLHttpRequest();
					xhr.responseType = 'json';
					// 状态改变事件
					xhr.onreadystatechange = function() {
						if(xhr.readyState===4 && xhr.status===200) {
							var data = xhr.response;
							console.log(data);							
						}

						if(xhr.readyState === 4) {
							this.progressShow = false;

							if(xhr.status === 200) {
								//alert('Upgrade successful;)');
								layer.msg('Upgrade successful;)', {
					                time: 0, //不自动关闭
					                btn: ['OK'],
					                yes: function(index) {
					                	layer.close(index);
					                }
					            });
							} else {
								//alert('Upgrade Failed:(');
								layer.msg('Upgrade Failed:(', {
					                time: 0, //不自动关闭
					                btn: ['OK'],
					                yes:function( index) {
					                	layer.close(index);
					                }
					            });
							}
						}

					}.bind(this);

					// 进度事件
					xhr.upload.onprogress = function(e) {
						this.progressShow = true;
						var loaded = e.loaded,
							total = e.total,
							progress = Math.floor(loaded/total*100);
						this.loaded = loaded;
						this.total = total;
						this.progress = progress;
					}.bind(this);

					xhr.open('post', '/cgi-bin/luci/api/v1/upload?type=package');
					xhr.send(formData);
				} else {
					alert('Please select file~');
				}
			},
			onApplyClick:function() {
				layer.msg('Confirm to Upgrade?', {
	                time: 0, //不自动关闭
	                btn: ['yes', 'no'],
	                yes:function( index ) {
	                	layer.close(index);
	                	this.upload();
	                }.bind(this)
	            });
			}
		}
	});
});