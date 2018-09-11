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
				fields: [/*{
					name: 'id',
					title: 'Date/Time',
				},
				{
					name: 'name',
					title: 'Host Name or IP Address'
				},
				{
					name: 'type',
					title: 'Response time'
				},
				*/
				{
					name: 'status',
					title: 'status'
				},]
			};
		},
	};

	return Vue.extend({
		template: require('text!./ping.html'),
		components: {
			'datatable': Datatable(mixin)
		},
		data: function () {
			return {
				model: {
					hysteresis: '',
				},
				schema: {
					fields: [{
						type: 'input',
						inputType: 'text',
						label: 'Host Name or IP Address',
						model: 'hysteresis'
					}]
				},
				formOptions: {
					validateAfterLoad: true,
					validateAfterChanged: true
				},
				datas: [/* {
					id: 1,
					name: 'Circuit Breaker B1',
					type: 'Circuit Breaker',
					highWarning: '14.0',
					highAlarm: '16.0',
					trapNotify: true,
					emailNotify: false
				}, {
					id: 2,
					name: 'Circuit Breaker B1',
					type: 'Circuit Breaker',
					highWarning: '14.0',
					highAlarm: '16.0',
					trapNotify: true,
					emailNotify: true
				}, {
					id: 3,
					name: 'Circuit Breaker B1',
					type: 'Circuit Breaker',
					highWarning: '14.0',
					highAlarm: '16.0',
					trapNotify: true,
					emailNotify: true
				} */],
			};
		},
		methods: {
			init:function() {

			},
			onApplyClick:function() {
				var target=this.model.hysteresis;
				if(target.trim()==""){
					layer.msg("ip is null");
					return
				}
				var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                  });
				this.datas=[];
				$.ajax({
					url: '/cgi-bin/luci/api/v1/maintenance/ping?target='+target,//获取所有的用户数据
					type: "POST",
					// data: JSON.stringify(this.userModel),
					contentType: 'application/json',
					dataType: 'json',
					success:function(response){
						response.forEach(function(item){
							var obj={};
							obj.status=item;
							this.datas.push(obj);
							layer.close(layerTime);
						}.bind(this));
					}.bind(this)
				})
			}
		}
	});
});