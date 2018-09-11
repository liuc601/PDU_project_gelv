define(function (require) {
	var Vue = require('vue');
	var VueFormGenerator = require('vue-form');

	require('components/x-panel');
	require('components/form-action');

	Vue.use(VueFormGenerator);

	return Vue.extend({
		template: require('text!./tacacs+.html'),
		data: function () {
			return {
				model: {

				},
				firstschema: {
					groups: [{
						legend: 'Configure TACACS+ options',
						fields: [{
							type: "label",
							label: "TACACS+",
							model: "radius.radius",
						}, {
							type: 'input',
							inputType: 'text',
							label: 'Primary Host',
							model: 'radius.primary'
						}, {
							type: 'input',
							inputType: 'text',
							label: 'Secondary Host',
							model: 'radius.password'
						}, {
							type: 'input',
							inputType: "text",
							label: 'Port',
							model: 'radius.port',
							hint: '(default1812)'
						}]
					}]
				},
				secondschema: {
					groups: [{
						legend: 'Configure TACACS+ encryption key',
						fields: [{
							type: "label",
							label: "Encryption Key Status",
							model: "radius.radius",
						}, {
							type: 'input',
							inputType: 'text',
							label: 'New Encryption Key',
							model: 'radius.primary'
						}, {
							type: 'input',
							inputType: 'text',
							label: 'Verify New EncryPtion Key',
							model: 'radius.password'
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

			},
			onCancelClick: function () {

			}
		}
	});
});