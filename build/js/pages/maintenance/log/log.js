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
					name: 'idx',
					title: 'Index',
				},
				{
					name: 'time',
					title: 'Date/Time'
				},
				{
					name: 'type',
					title: 'Type'
				},
				{
					name: 'descr',
					title: 'Message'
				}]
			};
		},
	};

	return Vue.extend({
		template: require('text!./log.html'),
		components: {
			'datatable': Datatable(mixin)
		},
		data: function () {
			return {
				model: {
					type: null,
				},
				typeList: [
					{ name: "All", value: 0 },
					{ name: "Access", value: 1 },
					{ name: "Config", value: 2 },
					{ name: "Outlet Control", value: 3 },
					{ name: "User Administration", value: 4 },
					{ name: "Device", value: 5 },
					{ name: "System", value: 6 },
					{ name: "Power", value: 7 },
					{ name: "Sensor", value: 8 },
				],
				formOptions: {
					validateAfterLoad: true,
					validateAfterChanged: true
				},			
				datas: {
				    pagination: {
				      // pagination information
				    },
				  	data: []
				},
				total: 0,
				currentPage: 1,
				perPage: 15
			};
		},
		computed: {
			schema: function () {
				return {
					fields: [{
						type: 'select',
						label: 'Selected event type',
						model: 'type',
						values: this.typeList,
						onChanged: function(model) {//当数据变化的时候，向后台请求数据，更新当前的状态
							// console.log(this.datas);
							this.getLogItemCount(false);
						}.bind(this)
					}]
				}
			},
		},
		mounted: function () {
			this.model.type = this.typeList[0];
			this.getLogItemCount(false);
		},
		methods: {
			OnPageChange:function(currentPage, perPage) {
				this.currentPage = currentPage;
				this.perPage = perPage;
				this.getLogItemCount(false);
			},
			getLogItemCount:function(dl) {
				var type = this.model.type.value;

				$.ajax({
					url: '/cgi-bin/luci/api/v1/maintenance/log?type=' + type + '&total=',
					type: "GET",
					dataType: 'json',
					success:function(response){
						//console.log(response);
						if(response.total) {
	            			this.total = response.total;
		            		if(this.total > 0) {
		            			if(dl == false)
									this.getLogItem();
							} else {
								this.datas = {};
							}
            			} else {
            				this.datas = {};
            			}
					}.bind(this)
				})				
			},
			getLogItem:function() {
				if(this.total == 0)
					return;

				var layerTime=layer.load(2, {
	                shade: [0.1,'#fff'] //0.1透明度的白色背景
	            });
				var type = this.model.type.value;
				var num = this.perPage;
				var row = (this.currentPage -1)* this.perPage;
				if(row > this.total) {
					this.currentPage = Math.ceil(this.total/this.perPage);
					row = (this.currentPage - 1) * this.perPage;
				}

				$.ajax({
					url: '/cgi-bin/luci/api/v1/maintenance/log?type='+type+ '&row=' + row + '&num=' + num,
					type: "GET",
					dataType: 'json',
					success:function(response){
						//console.log(response);						
            			response.rows.forEach(function(item){
                			switch(item.type) {
                				case 1:
                					item.type = 'Access';
                					break;
                				case 2:
                					item.type = 'Config';
                					break;
                				case 3:
                					item.type = 'Outlet Control';
                					break;
                				case 4:
                					item.type = 'User Administration';
                					break;
                				case 5:
                					item.type = 'Device';
                					break;
                				case 6:
                					item.type = 'System';
                					break;
                				case 7:
                					item.type = 'Power';
                					break;	
                				case 8:
                					item.type = 'Sensor';
                					break;					
                			} 
            			}.bind(this))
            			setTimeout(function() {
							var pagination = {};
							pagination.total = this.total;
							pagination.per_page = this.perPage;
							pagination.current_page = this.currentPage;
							pagination.last_page = Math.ceil(pagination.total / pagination.per_page) || 0;
							pagination.from = (pagination.current_page - 1) * pagination.per_page + 1;
        					pagination.to = Math.min(pagination.current_page * pagination.per_page, pagination.total);

        					this.datas= {};
							this.datas.data = response.rows;
	            			this.datas.pagination = pagination;
	                        
	                        //this.datas = response.rows;
	                        // console.log(this.datas);
	                        layer.close(layerTime);
	                    }.bind(this));
					}.bind(this)
				})		
			},
			downloadLog:function(){
				this.getLogItemCount(true);

            	var layerTime=layer.load(2, {
                	shade: [0.1,'#fff'] //0.1透明度的白色背景
            	});

            	var type=this.model.type.value;
				var url = '/cgi-bin/luci/api/v1/maintenance/log?type=' + type + '&dl=all' + '&total=' + this.total;
				var xhr = new XMLHttpRequest();
				
				switch(type) {
    				case 1:
    					type = 'Access';
    					break;
    				case 2:
    					type = 'Config';
    					break;
    				case 3:
    					type = 'Outlet Control';
    					break;
    				case 4:
    					type = 'User Administration';
    					break;
    				case 5:
    					type = 'Device';
    					break;
    				case 6:
    					type = 'System';
    					break;
    				case 7:
    					type = 'Power';
    					break;
    				case 8:
    					type = 'Sensor';
    					break;	
    				default:
    					type = 'All';
    					break;				
    			} 

				// xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
				xhr.open('POST', url, true);    // 也可以使用POST方式，根据接口
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
					        a.download = type + '_log' + '.csv';
					        a.href = e.target.result;
					        $("body").append(a);  // 修复firefox中无法触发click
					        a.click();
					        $(a).remove();
				      	}
				    }
				    setTimeout(function() {
	                    layer.close(layerTime);
	                }.bind(this));
				};
				// 发送ajax请求
				xhr.send()
            }
		}
	});
});