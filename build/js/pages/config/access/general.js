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
					autoDaylight: false,
					synchronizeNTP: true,
					datetime: new Date(),
					timezone: '',
					primaryNTPSrv: 'time1.aliyun.com',
					secondaryNTPSrv: 'time2.aliyun.com',
				},
				schema: {
					groups: [{
						legend: 'Configure local and remote access settings',
						fields: [{
							type: 'select',
							label: 'Access Method',
							model: 'timezone',
							values: []
						}, {
							type: 'switch',
							label: 'Configuration Reset Button',
							model: 'synchronizeNTP',
							textOn: 'Enabled',
							textOff: 'Disabled',
						}, {
							type: 'select',
							label: 'Local Administrator Account',
							model: 'timezone',
							values: []
						}, {
							type: 'select',
							label: 'Strong Passwords',
							model: 'timezone',
							values: []
						}, {
							type: 'input',
							inputType: "text",
							label: 'CLI Custom Prompt',
							model: 'secondaryNTPSrv',
						}, {
							type: 'input',
							inputType: "text",
							label: 'CLI Session Timeout',
							model: 'secondaryNTPSrv',
							hint: 'minutes'
						}, {
							type: 'input',
							inputType: "text",
							label: 'Web Session Timeout',
							model: 'secondaryNTPSrv',
							hint: 'minutes'
						}, {
							type: 'input',
							inputType: "text",
							label: 'Web Log Entries Per Page',
							model: 'secondaryNTPSrv',
						}, {
							type: 'select',
							label: 'Default Log Order',
							model: 'timezone',
							values: []
						}, {
							type: 'switch',
							label: 'StartUp Stick',
							model: 'synchronizeNTP',
							textOn: 'Enabled',
							textOff: 'Disabled',
						}]
					}]
				},
				formOptions: {
					validateAfterLoad: true,
					validateAfterChanged: true
				}
			};
		},
		mounted:function(){
			this.clearSwitchControlLabel();//消除switch按钮的事件区域过大的问题
		},
		methods: {
			onApplyClick: function () {

			},
			onCancelClick: function () {

			}
		}
	});
});