define(function (require) {
	var Vue = require('vue');
	var Datatable = require('datatable');
	var VueFormGenerator = require('vue-form');
	var layer = require('layer');
	require('components/x-panel');
	require('components/form-action');

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
		template: require('text!./files.html'),
		components: {
			'datatable': Datatable(mixin)
		},
		data: function () {
			return {
				model: {
					type:'',
					id: ''
				},
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
					fields: []
				}
			},
		},
		mounted: function () {
			this.getFileList();
		},
		methods: {
			getFileList:function() {
				var layerTime=layer.load(2, {
				    shade: [0.1,'#fff'] //0.1透明度的白色背景
				});

				$.ajax({
					url: '/cgi-bin/luci/api/v1/maintenance/files?dir=download',
					type: "GET",
					dataType: 'json',
					success:function(response){
						var url = location.href;
						var domain = url.split("#");
						response.forEach(function(item) {
	                        item.file = "<a href=" + domain[0] + "download/" + item.file + ">" + "<div class='blue'>" + item.file + "</div>" + "</a>"; 
	                    })

	                    this.datas = [];
						setTimeout(function() {
	                        this.datas = response;
	                        layer.close(layerTime);
	                    }.bind(this));
					}.bind(this)
				})
			}	
		}
	});
});