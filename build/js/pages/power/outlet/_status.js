define(function (require) {
    var Vue = require('vue');
    var Datatable = require('datatable');
    var OLState = require('pages/power/outlet/ol-state');//当前条目的状态
    var VueFormGenerator = require('vue-form');
    var layer = require('layer');

    require('components/x-panel');
    require('components/switch');
    require('components/title-count');
    require('components/form-action');
    require('components/line-chart');
    require('components/status-bar');

    Vue.use(VueFormGenerator);

    var mixin = {
        data: function () {
            return {//表格显示的列表上数据
                fields: [{
                    name: '__checkbox:checkbox',//似乎没有绑定v-mode
                    titleClass: 'text-center',
                    dataClass: 'text-center',
                    default: true,
                    model: 1,
                    // model: 'timezone',//这边就需要做数据绑定，但是还是不知道要跟那个数据进行绑定
                    // model: true,//这边就需要做数据绑定，但是还是不知道要跟那个数据进行绑定
                },
                {
                    name: 'id',
                    title: 'ID',
                },
                {
                    name: 'name',
                    title: 'Outlet Name'
                },
                {
                    name: 'showType',
                    title: 'Socket Type'
                },
                {
                    name: 'current',
                    title: 'Current',
                    callback: 'renderCurrent'
                },
                {
                    name: 'activePower',
                    title: 'Active Power',
                    callback: 'renderActivePower'
                },
                {
                    name: 'powerFactor',
                    title: 'Power Factor',
                    callback: 'renderPowerFactor'
                },
                {
                    /* vue-table的引入方式 */
                    name: '__component:ol-state:state',
                    title: 'State'
                },
                {
                    name: 'status',
                    title: 'Status',
                    callback: 'renderStatus'//回调函数
                },
                {
                    name: '__slot:actions',
                    title: 'Action',
                },
                ]
            };
        },
        methods: {
            renderCurrent: function (value) {
                return "<div class='red'>" + value + ' A</div>';
            },
            renderActivePower: function (value) {
                return value + ' W';
            },
            renderPowerFactor: function (value) {
                return (value === '') ? '--' : value;
            },
            renderStatus: function (value) {
                if (value == 0) {
                    return "<span class='clr-green' style='font'>NORMAL<span>";
                }

                if (value == 1) {
                    return "<span class='clr-green' style='font'>DISABLED<span>";
                }

                if (value == 14) {
                    return "<span class='label label-warning'>LOW ALARM<span>";
                }

                if (value == 15) {
                    return "<span class='label label-danger'>LOW WARNING<span>";
                }

                if (value == 16) {
                    return "<span class='label label-danger'>HIGH WARNING<span>";
                }

                if (value == 17) {
                    return "<span class='label label-danger'>HIGH ALARM<span>";
                }
            }
        }
    };
    function getFieldUnit(row, field) {
        switch (row.id) {
            case 1:
                row.type = "Current";
                return 'A';
            case 2:
                row.type = "Voltage";
                return 'V';
            case 3:
                row.type = "Active Power";
                return 'kW';
            case 4:
                row.type = "Apparent Power";
                return 'kVA';
            case 5:
                row.type = "Power Factor";
                return '%';
            case 6:
                row.type = "Active Energy";
                return 'kWh';
            case 7:
                row.type = "Line Frequency";
                return 'Hz';
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
    var DetailMixin = {
        data: function () {
            return {
                fields: [{
                    name: '__checkbox:checkbox',
                    titleClass: 'text-center',
                    dataClass: 'text-center',
                    /* onChanged(){
                        console.log("onchange");
                    } */
                }, {
                    name: 'id',
                    title: 'ID',
                },
                {
                    name: 'type',
                    title: 'Sensor Type'
                },
                {
                    //name: 'hysteresis',
                    name: '__component:inline-text:hysteresis',
                    title: 'Hysteresis',
                    __normalize: function (obj) {
                        obj.unit = getFieldUnit;
                    }
                },
                {
                    //name: 'lowAlarm',
                    name: '__component:inline-text:lowAlarm',
                    title: 'Low Alarm',
                    __normalize: function (obj) {
                        obj.unit = getFieldUnit;
                    }
                },
                {
                    //name: 'lowWarning',
                    name: '__component:inline-text:lowWarning',
                    title: 'Low Warning',
                    __normalize: function (obj) {
                        obj.unit = getFieldUnit;
                    }
                },
                {
                    //name: 'highWarning',
                    name: '__component:inline-text:highWarning',
                    title: 'High Warning',
                    __normalize: function (obj) {
                        obj.unit = getFieldUnit;
                    }
                },
                {
                    //name: 'highAlarm',
                    name: '__component:inline-text:highAlarm',
                    title: 'High Alarm',
                    __normalize: function (obj) {
                        obj.unit = getFieldUnit;
                    }
                },
                {
                    //name: 'trapNotify',
                    name: '__component:inline-checkbox:trapNotify',
                    title: 'SNMP Trap<br/>Notifications',
                },
                {
                    //name: 'emailNotify',
                    name: '__component:inline-checkbox:emailNotify',
                    title: 'Email<br/>Notifications',
                },
                ]
            };
        },
    }

    var datas = [{
        id: 1,
        name: 'Outlet 01',
        type: 'IEC320 C13',
        current: '0.00',
        activePower: '0',
        powerFactor: '',
        state: true,
        locked: false,
        status: 'normal'
    }]

    return Vue.extend({
        template: require('text!./status.html'),
        components: {
            'datatable': Datatable(mixin),//组件需要的数据？
            'datatable2': Datatable(DetailMixin),
            'line-status': require('pages/power/outlet/line-status')
        },
        data: function () {
            return {
                model: {
                    selectGroup: 'all',
                },
                Groupmodel: {
                    group: ''
                },
                detailModel: {//详情页的数据model
                    locked: false
                },
                chartData: {
                    time: [],
                    value: []
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
                datas: [],
                group: [],
                showDetail: false,
                Detaildatas: [],
                editAction: [],
                editData: [],
                chartModel: {
                    type: 'activePower'
                },
                line: [],
                choiseData: [],
                Detailschema: {
                    groups: [{
                        legend: 'Outlet information',
                        fields: [{
                            type: "switch",
                            label: 'Action',
                            model: 'state',
                            textOn: "On",
                            textOff: "Off",
                            valueOn: "On",
                            valueOff: "Off",
                            /* 当点击开关切换的时候，向后台传输开关状态Action */
                            onChanged: function () {
                                var type=this.model.state.toLowerCase();
                                var layerTime = layer.load(2, {
                                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                                });
                                $.ajax({
                                    type: 'post',
                                    url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=' + type,
                                    data: JSON.stringify([{ id: this.model.id }]),
                                    contentType: 'application/json',
                                    success: function (response) {
                                        layer.close(layerTime);
                                    }
                                })
                            }

                        }, {
                            type: "label",
                            label: 'State',
                            model: 'state',
                        }, {
                            type: "label",
                            label: 'voltage',
                            model: 'voltage',
                        }, {
                            type: "label",
                            label: 'frequency',
                            model: 'frequency',
                        }, {
                            type: "label",
                            label: 'Power Factor',
                            model: 'powerFactor',
                        }, {
                            type: "label",
                            label: 'Active Power',
                            model: 'activeEnergy',
                        }, {
                            type: "label",
                            label: 'Cycle',
                            buttons: [
                                {
                                    classes: "btn-location",
                                    label: "Cycle",
                                    onclick: (model) => {
                                        var layerTime = layer.load(2, {
                                            shade: [0.1, '#fff'] //0.1透明度的白色背景
                                        });
                                        $.ajax({
                                            type: 'post',
                                            url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=cycle',
                                            data: JSON.stringify([{ id: this.model.id }]),
                                            contentType: 'application/json',
                                            success: function (response) {
                                                layer.close(layerTime);
                                            }
                                        })
                                    }
                                }
                            ]
                        }, {
                            type: "label",
                            label: 'Outlet ID',
                            model: 'ocp',
                        }, {
                            type: "label",
                            label: 'Socket Type',
                            model: 'showType',
                        }, {
                            type: "label",
                            label: 'Over current protector',
                            model: 'inlet',
                        }, {
                            type: "label",
                            label: 'Phase',
                            model: 'phase',
                        }, {
                            type: "label",
                            label: 'Inlet',
                            model: 'inlet',
                        }]
                    }, {
                        legend: 'Outlet settings',
                        fields: [{
                            type: "switch",
                            label: 'Locked / No Controll',
                            model: 'locked',
                            textOn: "On",
                            textOff: "Off",
                            valueOn: true,
                            valueOff: false,
                        }, {
                            type: "input",
                            inputType: 'text',
                            label: 'Name',
                            model: 'name',
                        }, {
                            type: "input",
                            inputType: 'text',
                            label: 'Extra On Delay(sec)',
                            model: 'delay',
                        }, {
                            type: 'select',
                            label: 'Wake Up State',
                            model: 'wakeupState',
                            values: [
                                { id: 2, name: 'LAST' },
                                { id: 0, name: 'ON' },
                                { id: 1, name: 'OFF' }
                            ]
                        }]
                    }]
                },
                Groupschema: {
                    fields: [{
                        type: 'input',
                        label: 'Group Name',
                        model: 'group',
                    }]
                },
                /* 暂缓初始化编辑界面用的数据 */
                cacheEditInitData: null,
            };
        },
        computed: {
            schema: function () {
                return {
                    fields: [{
                        type: 'select',
                        label: 'Selected Group',
                        model: 'selectGroup',
                        values: this.group,
                        buttons: [{
                            classes: 'btn btn-primary btn-sm',
                            label: 'Remove',
                            onclick: () => {
                                $.ajax({
                                    url: '/cgi-bin/luci/api/v1/outlet/group?name=' + this.model.selectGroup,
                                    type: 'delete',
                                    contentType: 'application/json',
                                    success: (response) => {
                                        this.model.selectGroup = 'all';
                                        this.initGroupData();
                                        this.init();
                                    }
                                })
                            }
                        }],
                        self: this,
                        onChanged: (model, newVal, oldVal, field) => {
                            this.init();
                        }
                    }]
                }
            },
            chart: function () {
                return {
                    labels: this.chartData.time,
                    datasets: [{
                        label: 'Data One',
                        backgroundColor: '#f87979',
                        data: this.chartData.value
                    }]
                }
            },
            chartSchema: function () {
                return {
                    fields: [{
                        type: 'select',
                        label: 'type',
                        model: 'type',
                        values: [
                            { id: 'activePower', name: 'Active Power' },
                            { id: 'apparentPower', name: 'Apparent Power' },
                            { id: 'current', name: 'Current' },
                            { id: 'voltage', name: 'Voltage' },
                        ],
                        onChanged: () => {
                            $.get('/cgi-bin/luci/api/v1/outlet/history?type=' + this.chartModel.type + '&id=' + this.detailModel.id).success((response) => {
                                this.chartData.time = [];
                                this.chartData.value = [];
                                response.forEach((item) => {
                                    this.chartData.time.push(item.time);
                                    this.chartData.value.push(item.value);
                                })
                            })
                        }
                    }]
                }
            }
        },
        mounted: function () {
            this.clearSwitchControlLabel();//消除switch按钮的事件区域过大的问题
            // this.$watch('model.selectGroup', function () {
            //     delete this.schema.fields[0].buttons;
            // }, { deep: true })
            this.initGroupData();
            this.init();
            this.timer = setInterval(this.init, 3000);
        },
        beforeDestroy:function() {
            clearInterval(this.timer);
        },
        watch: {
            showDetail: function (newVal, oldVal) {
                if (newVal == true) {
                    clearInterval(this.timer);
                    this.timer = setInterval(this.getHistoryData, 3000);
                } else {
                }
            }
        },
        methods: {
            openGroup() {
                if (this.choiseData.length == 0) {//全选的状态下，是没有的
                    alert('please choose a outlet');
                } else {
                    $('.myModal').css({
                        display: 'block',
                        opacity: 1
                    })
                }
            },
            initGroupData() {
                $.get('/cgi-bin/luci/api/v1/outlet/group?name=' + this.model.selectGroup).success((response) => {
                    this.group = [];
                    response.forEach((item) => {
                        this.group.push({
                            name: item.name,
                            id: item.name
                        })
                    })
                });
            },
            itemAction: function (event, props) {
                var type = '';
                var that = this;
                if (event == 'edit') {
                    // this.interval = setInterval(() => {
                    this.editInit(props)
                    // }, 3000)
                } else {
                    if (event == 'turn') {
                        type = props.rowData.state == true ? 'on' : 'off';
                    } else if (event == 'cycle') {
                        type = 'cycle';
                    }
                    var layerTime = layer.load(2, {
                        shade: [0.1, '#fff'] //0.1透明度的白色背景
                    });
                    $.ajax({
                        type: 'post',
                        url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=' + type,
                        data: JSON.stringify([{ id: props.rowData.id }]),
                        contentType: 'application/json',
                        success(response) {
                            props.rowData.state = true;
                            that.clearSelectedCheckeBox();
                            layer.close(layerTime);

                        }
                    })
                }
            },
            init:function() {
                $.get('/cgi-bin/luci/api/v1/outlet/status?group=' + this.model.selectGroup).success((response) => {
                    this.datas = response;
                    /* 初始化的时候，复制数据 */
                    // console.log("这边的数据是首次请求回来的数据", response);
                    this.datas.forEach((item) => {
                        switch (item.type) {
                            case 0:
                                item.showType = 'IEC320 C13'
                                break;
                            case 1:
                                item.showType = 'IEC320 C19'
                                break;
                            case 2:
                                item.showType = 'GB1002/10A'
                                break;
                            case 3:
                                item.showType = 'GB1002/16A'
                                break;
                            case 4:
                                item.showType = 'NEMA5-15R'
                                break;
                            case 5:
                                item.showType = 'NEMA5-20R'
                                break;
                            default:
                                break;
                        }
                        if (item.state == 85) {//进行判断，
                            item.state = false
                            // item.state = true
                        } else {
                            item.state = true
                        }
                    })
                })
            },
            dealAll(type) {//这个按钮是针对被选中的操作，并不是单个的
                //有拿到选中的值
                if (this.choiseData.length == 0) {
                    alert('please choose a outlet');
                    return false;
                }
                var type = type;
                var data = [];
                this.choiseData.forEach((item) => {
                    data.push({
                        id: item.id
                    })
                })
                //将获取到的值传给后台，然后根据后台的值来处理，成功之后调用这个方法
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=' + type,
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: (response) => {
                        this.init();
                        this.choiseData = [];
                        this.clearSelectedCheckeBox();//清除所有选中的状态
                    }
                })
            },
            onCancelClick() {
                this.showDetail = false;
                //              clearInterval(this.interval);
            },
            onApplyClick() {
                var data = {};
                data.delay = parseInt(this.detailModel.delay);
                data.name = this.detailModel.name;
                data.locked = this.detailModel.locked;
                data.wakeupState = this.detailModel.wakeupState;
                if (data.wakeupState.name == 'ON') {
                    data.wakeupState = 1
                }
                if (data.wakeupState.name == 'OFF') {
                    data.wakeupState = 1
                }
                if (data.wakeupState.name == 'LAST') {
                    data.wakeupState = 2
                }
                data.thresholds = [];
                this.editData.forEach((item) => {
                    this.Detaildatas[item.index][item.field] = item.value;
                    this.Detaildatas[item.index].isEdit = true;
                })
                this.Detaildatas.forEach((item) => {
                    if (item.isEdit) {
                        delete item.isEdit;
                        data.thresholds.push(item);
                    }
                    if (item.trapNotify == true && item.emailNotify == true) {
                        item.notify = 3;
                        delete item.trapNotify;
                        delete item.emailNotify;
                    } else if (item.trapNotify == false && item.emailNotify == true) {
                        item.notify = 2;
                        delete item.trapNotify;
                        delete item.emailNotify;
                    } else if (item.trapNotify == true && item.emailNotify == false) {
                        item.notify = 1;
                        delete item.trapNotify;
                        delete item.emailNotify;
                    } else if (item.trapNotify == false && item.emailNotify == false) {
                        item.notify = 0;
                        delete item.trapNotify;
                        delete item.emailNotify;
                    }
                })

                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    url: '/cgi-bin/luci/api/v1/outlet?id=' + this.detailModel.id,
                    contentType: 'application/json',
                    success: (response) => {
                        this.editInit(this.cacheEditInitData);
                    }
                })
            },
            groupCancel() {
                $('.myModal').css({
                    display: 'none',
                    opacity: 0
                })
            },
            groupApply() {
                var id = [];
                this.choiseData.forEach((item) => {
                    id.push({
                        id: item.id
                    })
                })
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/outlet/group?name=' + this.Groupmodel.group,
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify(id),
                    success: (response) => {
                        $('.myModal').css({
                            display: 'none',
                            opacity: 0
                        });
                        this.Groupmodel.group = '';
                        $.get('/cgi-bin/luci/api/v1/outlet/group?name=' + this.model.selectGroup).success((response) => {
                            this.group = [];
                            response.forEach((item) => {
                                this.group.push({
                                    name: item.name,
                                    id: item.name
                                })
                            })
                        });
                        this.init();
                        this.choiseData = [];
                        this.clearSelectedCheckeBox();
                    }
                })
                // $.get('/cgi-bin/luci/api/v1/outlet/status?name=' + this.Groupmodel.group).success((response) => {

                // })
            },
            percent: function () {
                return (this.status.current * 100) / this.status.max;
            },
            percentage: function () {
                return this.percent + '%';
            },
            color: function () {
                if (this.percent > 90)
                    return 'status-bar-red';
                if (this.percent > 60)
                    return 'status-bar-yellow';

                return 'status-bar-green';
            },
            clearSelectedCheckeBox() {
                this.$children[0].$children[1].$refs.vuetable.selectedTo = [];
            },
            editInit(props) {
                this.cacheEditInitData = props;//将编辑页面的数据保存起来，之后用来重新获取数据用
                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });
                $.get('/cgi-bin/luci/api/v1/outlet?id=' + props.rowData.id).success((response) => {
                    // console.log("编辑详情页返回的数据", response);
                    this.showDetail = true;
                    this.detailModel = response;
                    this.detailModel.voltage = response.voltage + ' V';
                    this.detailModel.frequency = response.frequency + ' Hz';
                    this.detailModel.activeEnergy = response.activeEnergy + ' kWh';
                    this.detailModel.state = this.detailModel.state == '85' ? 'Off' : 'On';
                    switch (this.detailModel.type) {
                        case 0:
                            this.detailModel.showType = 'IEC320 C13'
                            break;
                        case 1:
                            this.detailModel.showType = 'IEC320 C19'
                            break;
                        case 2:
                            this.detailModel.showType = 'GB1002/10A'
                            break;
                        case 3:
                            this.detailModel.showType = 'GB1002/16A'
                            break;
                        case 4:
                            this.detailModel.showType = 'NEMA5-15R'
                            break;
                        case 5:
                            this.detailModel.showType = 'NEMA5-20R'
                            break;
                    }
                    response.thresholds.forEach((item) => {
                        switch (item.notify) {
                            case 0:
                                item.trapNotify = false;
                                item.emailNotify = false;
                                break;
                            case 1:
                                item.trapNotify = true;
                                item.emailNotify = false;
                                break;
                            case 2:
                                item.trapNotify = false;
                                item.emailNotify = true;
                                break;
                            case 3:
                                item.trapNotify = true;
                                item.emailNotify = true;
                                break;
                        }
                    })
                    this.Detaildatas = [];
                    setTimeout(() => {
                        this.Detaildatas = response.thresholds;
                        layer.close(layerTime);
                    });
                    this.line[0] = {
                        max: this.detailModel.currentCapacity,
                        current: this.detailModel.current,
                        voltage: this.detailModel.current,
                        prompt: 'Current',
                        hint: 'A',
                        title: 'Capacity'
                    }
                    this.line[1] = {
                        max: this.detailModel.powerCapacity,
                        current: this.detailModel.activePower,
                        voltage: this.detailModel.activePower,
                        prompt: 'Active Power',
                        hint: 'kW',
                        // title: 'PowerCapacity'
                        title: 'Capacity'
                    }
                    this.line[2] = {
                        max: this.detailModel.powerCapacity,
                        current: this.detailModel.apparentPower,
                        voltage: this.detailModel.apparentPower,
                        prompt: 'Apparent Power',
                        hint: 'kVA',
                        title: 'Capacity'
                    }
                });
                this.getHistoryData();
            },
            getHistoryData() {
                var props = this.cacheEditInitData;
                $.get('/cgi-bin/luci/api/v1/outlet/history?type=' + this.chartModel.type + '&id=' + props.rowData.id).success((response) => {
                    this.chartData.time = [];
                    this.chartData.value = [];
                    response.forEach((item) => {
                        this.chartData.time.push(item.time.substring(14, 19));
                        this.chartData.value.push(item.value);
                    })
                })
            }
        }
    });
});