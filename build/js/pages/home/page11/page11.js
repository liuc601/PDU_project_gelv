define(function(require) {
    var Vue = require('vue');
    var DataTable = require('datatable');
    var VueFormGenerator = require('vue-form');

    require('pages/page');
    require('components/status-panel');
    require('components/switch');

    var mixin = {
        data: function() {
            return {
                fields: [{
                        name: '__checkbox:checkbox',
                        titleClass: 'text-center',
                        dataClass: 'text-center'
                    }, {
                        name: 'name',
                        title: 'Name',
                    },
                    {
                        name: '__component:inline-text',
                        title: 'Email',
                        sortField: 'email',
                        direction: 'asc'
                    },
                    {
                        name: 'birthdate',
                        title: 'Birthdate',
                    },
                    {
                        name: '__component:inline-select',
                        sortField: 'gender',
                        title: 'Gender',
                        __normalize: function(obj) {
                                obj.__options = [
                                    { value: 'M', text: 'Male' },
                                    { value: 'F', text: 'Female' }
                                ];
                            }
                            //                        callback: 'render',
                    },
                    {
                        name: '__component:inline-checkbox',
                        title: 'VIP',
                        sortField: 'isVip'
                    },
                    {
                        name: '__component:table-actions',
                        title: 'Actions'
                    }
                ]
            };
        },
        methods: {
            render: function(data, type, row) {
                return data == 'M' ?
                    '<span class="label label-info"><i class="glyphicon glyphicon-star"></i> Male</span>' :
                    '<span class="label label-success"><i class="glyphicon glyphicon-heart"></i> Female</span>';
            }
        }
    };

    Vue.use(VueFormGenerator);

    require('components/usage-bar');

    return Vue.extend({
        template: require('text!./page11.html'),
        components: {
            'datatable': DataTable(mixin),
        },
        data: function() {
            return {
                checked: true,
                wt: {
                    data: {
                        labels: ['l1', 'l2', 'l3'],
                        b: [{
                            a: [4, 5, 6],
                            b: 4
                        }]
                    },
                    logs: []
                },
                url: 'https://vuetable.ratiw.net/api/users',
                model: {
                    id: 1,
                    name: "John Doe",
                    password: "J0hnD03!x4",
                    skills: ["Javascript", "VueJS"],
                    email: "john.doe@gmail.com",
                    status: true
                },

                schema: {
                    fields: [{
                        type: "input",
                        inputType: "text",
                        label: "ID",
                        model: "id",
                        readonly: true,
                        disabled: true
                    }, {
                        type: "input",
                        inputType: "text",
                        label: "Name",
                        model: "name",
                        placeholder: "Your name",
                        featured: true,
                        required: true
                    }, {
                        type: "input",
                        inputType: "password",
                        label: "Password",
                        model: "password",
                        min: 6,
                        required: true,
                        hint: "Minimum 6 characters",
                        validator: VueFormGenerator.validators.string
                    }, {
                        type: "select",
                        label: "Skills",
                        model: "skills",
                        values: ["Javascript", "VueJS", "CSS3", "HTML5"]
                    }, {
                        type: "input",
                        inputType: "email",
                        label: "E-mail",
                        model: "email",
                        placeholder: "User's e-mail address"
                    }, {
                        type: "switch",
                        label: "Status",
                        model: "status",
                        textOn: "Active",
                        textOff: "Inactive",
                        default: true
                    }]
                },

                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
                value: '',
                textWidth: '0',
                test1: {
                    value: 30,
                    max: 100,
                    unit: '%',
                    prompt: false,
                    range: [{
                            value: 20,
                            color: 'green'
                        },
                        {
                            value: 40,
                            color: 'blue'
                        },
                        {
                            value: 70,
                            color: 'yellow'
                        },
                        {
                            value: 90,
                            color: 'purple'
                        },
                        {
                            value: 100,
                            color: 'red'
                        }
                    ]
                },
                test2: {
                    status: {
                        current: 5,
                        max: 30,
                        unit: 'A',
                        ranges: [
                            { value: 10, color: 'green' },
                            { value: 15, color: 'blue' },
                            { value: 20, color: 'yellow' },
                            { value: 25, color: 'purple' },
                            { value: 30, color: 'red' },
                        ]
                    },
                    appends: [
                        { title: "xxxxx", value: '11111111' },
                        { title: "xxxxx2", value: '111111112' },
                        { title: "xxxxx3", value: '111111113' },
                    ]
                }
            };
        },
        watch: {
            value: function(nVal, oVal) {
                this.$nextTick(function() {
                    var textWidth = $(this.$refs.widthSpan).width();

                    if (textWidth < 100)
                        this.textWidth = textWidth;
                });
            },
            'wt.data.labels': {
                handler: function(nVal, oVal) {
                    this.wt.logs.push('value labels changed.' + nVal);
                }
            },
            'wt.data': {
                //                deep: true,
                handler: function(nVal, oVal) {
                    this.wt.logs.push('value changed.' + nVal);
                }
            }
        },
        mounted:function(){
            this.clearSwitchControlLabel();//消除switch按钮的事件区域过大的问题
        },
        methods: {
            checkboxToggle: function(pro, event) {
                console.log('checkboxToggle: ' + event.currentTarget.checked);
            },
            buttonClick: function() {
                this.checked = !this.checked;
            },
            dataProcess: function(response) {
                if (!response || !response.data)
                    return;

                var data = response.data;
                if (!Array.isArray(data.data))
                    return;

                for (var i = 0; i < data.data.length; i++) {
                    var item = data.data[i];
                    item.isVip = item.gender === 'F';
                }
            },
            onEditClick: function() {
                console.log('edit click');
            },
            onWTClick: function() {
                //                var v = this.wt.data.labels.shift();
                //                this.wt.data.labels.push(v);

                this.wt.data.labels = [1, 2, 3, 4];
            },
            onToggleClick: function() {
                this.checked = !this.checked;
            }
        }
    });
});