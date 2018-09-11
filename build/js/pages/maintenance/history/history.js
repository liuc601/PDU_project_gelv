define(function (require) {
	var Vue = require('vue');
	var Datatable = require('datatable');
	var VueFormGenerator = require('vue-form');
	var layer = require('layer');
	require('components/x-panel');
	require('components/form-action');
	require('axios')

	Vue.use(VueFormGenerator);

	var mixin = {
		data: function () {
			return {
				fields: [{
					name: 'idx',
					title: 'Index',
				},{
					name: 'file',
					title: 'File Name',
				},{
					name: 'size',
					title: 'Size(Byte)'
				}]
			};
		},
	};

	return Vue.extend({
		template: require('text!./history.html'),
		components: {
			'datatable': Datatable(mixin)
		},
		data: function () {
			return {
				model: {
					type:'',
					id: ''
				},
				typeList: [
					{ name: "Unit", value: "unit" },
					{ name: "Inlet Cord", value: "cord" },
					{ name: "Over-Current Protectors", value: "ocp" },
					{ name: "Outlet", value: "outlet" },
					{ name: "Sensor", value: "sensor" },
				],
				idList: [],
				datas: [],
				formOptions: {
					validateAfterLoad: true,
					validateAfterChanged: true
				},
			};
		},
		computed: {
			schema: function () {
				return {
					fields: [{
						type: 'select',
						id: 'typeSel',
						label: 'Selected history class',
						model: 'type',
						values: this.typeList,
						onChanged:function (model) {//当数据变化的时候，向后台请求数据，更新当前的状态
							var layerTime=layer.load(2, {
				                shade: [0.1,'#fff'] //0.1透明度的白色背景
				            });
							this.getHistoryTypeIdList(layerTime);
							//this.model.id = this.idList[0];
						}.bind(this)
					},
					{
						type: 'select',
						id: 'idSel',
						label: 'Selected object ID',
						model: 'id',
						values: this.idList,
						onChanged: function(model){//当数据变化的时候，向后台请求数据，更新当前的状态
							var layerTime=layer.load(2, {
				                shade: [0.1,'#fff'] //0.1透明度的白色背景
				            });
							this.getHistoryFileList(layerTime);
						}.bind(this)
					}]
				}
			},
		},
		mounted: function () {
			// console.log(this.model,this.model.type,this.typeList);
			var layerTime=layer.load(2, {
                shade: [0.1,'#fff'] //0.1透明度的白色背景
            });
			console.log(this.model,this.model.type,this.typeList);
			this.model.type = this.typeList[0];
			this.getHistoryTypeIdList(layerTime);
		},
		methods: {
			getHistoryTypeIdList:function(layerTime) {
				var type=this.model.type.value;
				$.ajax({
					url: '/cgi-bin/luci/api/v1/maintenance/history?type='+type,
					type: "GET",
					dataType: 'json',
					success:function(response){
						this.idList = [];
						this.idList=response;
						this.model.id = this.idList[0];
						this.getHistoryFileList(layerTime);
					}.bind(this)
				})
			},
			getHistoryFileList:function(layerTime) {
				var id=this.model.id.value;
				$.ajax({
					url: '/cgi-bin/luci/api/v1/maintenance/history?type=' + this.model.type.value + '&id=' + id,
					type: "GET",
					dataType: 'json',
					success:function(response){
						
						var url = location.href;
						var domain = url.split("#");
						response.forEach(function(item) {
	                        item.file = "<a href=" + domain[0] + "history/" + this.model.type.value + "/" + id + "/" + item.file + ">" 
	                        			+ "<div class='blue'>" + item.file + "</div>" + "</a>"; 
	                    }.bind(this))

	                    this.datas = [];
						setTimeout(function(){
	                        this.datas = response;
	                        layer.close(layerTime);
	                    }.bind(this));
					}.bind(this)
				})
			},
            downloadAll:function(){
            	var layerTime=layer.load(2, {
                	shade: [0.1,'#fff'] //0.1透明度的白色背景
            	});

            	var type=this.model.type.value;
            	var id=this.model.id.value;

				var url = '/cgi-bin/luci/api/v1/maintenance/history?type=' + type + '&id=' + id + '&dl=all';
				var xhr = new XMLHttpRequest();
				xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
				xhr.responseType = "blob";  // 返回类型blob
				
				// 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
				xhr.onload = function () {
				    // 请求完成
				    if (this.status === 200) {
				      	// 返回200
				      	var blob = this.response;
				      	var reader = new FileReader();
				      	reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a
				      	reader.onload = function (e) {
					        // 转换完成，创建一个a标签用于下载
					        var a = document.createElement('a');
					        a.download = 'history_' + type + '_' + id + '.tar.gz';
					        a.href = e.target.result;
					        $("body").append(a);  // 修复firefox中无法触发click
					        a.click();
					        $(a).remove();
				      	}
				    }
				    setTimeout(function(){
	                    layer.close(layerTime);
	                });
				};
				// 发送ajax请求
				xhr.send()
            }		
		}
	});
});