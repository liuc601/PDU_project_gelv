define(function (require) {
	var Vue = require('vue');
	var Datatable = require('datatable');
	var VueFormGenerator = require('vue-form');

	require('components/x-panel');
	require('components/form-action');

	Vue.use(VueFormGenerator);

	function getFieldUnit(row, field) {
		switch (row.id) {
			case 1:
				return 'kW';
			case 2:
				return 'kVA';
			case 4:
				return 'kWh';
			case 5:
				return 'Hz';
			case 6:
				return '%';
			case 7:
			case 9:
			case 11:
				return 'A';
			case 8:
			case 10:
			case 12:
				return 'V';
		}
		return '';
	}

	var mixin = {
		data: function () {
			return {
				fields: [{
					name: '__checkbox:checkbox',
					titleClass: 'text-center',
					dataClass: 'text-center'
				}, {
					name: 'id',
					title: 'TACACS+ Privilege Level',
				},
				{
					name: 'name',
					title: 'Access Level'
				},
				{
					name: 'type',
					title: 'System Monitor'
				},
				{
					name: 'trapNotify',
					title: 'Access Right',
				},
				{
					name: '__component:table-actions',
					title: 'Action',
					__normalize: function (obj) {
						obj.__com = {};
						obj.__com.showDel = false;

					}
				},
				]
			};
		},
	};

	return Vue.extend({
		template: require('text!./privileges.html'),
		components: {
			'datatable': Datatable(mixin)
		},
		data: function () {
			return {
				model: {
					hysteresis: '1.0',
				},
				datas: [{
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
				}],
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