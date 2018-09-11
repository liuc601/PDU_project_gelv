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
                    name: '__checkbox:checkbox',
                    titleClass: 'text-center',
                    dataClass: 'text-center'
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
                    name: 'SocketType',
                    title: 'Socket Type'
                },
                {
                    name: '__component:inline-text:hysteresis',
                    title: 'Hysteresis'
                },
                {
                    name: '__component:inline-text:lowAlarm',
                    title: 'Low Alarm'
                },
                {
                    name: '__component:inline-text:lowWarning',
                    title: 'Low Warning',
                },
                {
                    name: '__component:inline-text:highWarning',
                    title: 'High Warning',
                },
                {
                    name: '__component:inline-text:highAlarm',
                    title: 'High Alarm'
                },
                ]
            };
        },
        methods: {
            renderActiveEnergy: function (value) {
                return value + ' kWh';
            }
        }
    };

    var datas = [{
        id: 1,
        name: 'Outlet 01',
        type: 'IEC320 C13',
        lowAlarm: '0',
        lowWarning: '0',
        highWarning: '7.0',
        highAlarm: '8.0',
    }]

    return Vue.extend({
        template: require('text!./thresholds.html'),
        components: {
            'datatable': Datatable(mixin)
        },
        data: function () {
            return {
                model: {
                    hysteresis: '1.0',
                    selectedType: 'current',
                    selectGroup: 'all'
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
                datas: [],
                group: [],
                choiseData: [],
                editData: [],
            };
        },
        computed: {
            schema: function () {
                return {
                    fields: [{
                        type: 'select',
                        label: 'Type of Sensors',
                        model: 'selectedType',
                        values: [
                            { id: 'current', name: 'Current(Amp)' },
                            { id: 'voltage', name: 'Voltage(V)' },
                            { id: 'frequency', name: 'Frequency(Hz)' },
                            { id: 'activePower', name: 'Active Power(kW)' },
                            { id: 'apparentPower', name: 'Apparent Power(kVA)' },
                            { id: 'powerFactor', name: 'Power Factor' },
                            { id: 'activeEnergy', name: 'Active Energy(kWh)' },
                        ],
                        onChanged:function (){//当数据改变的时候，发起请求
                            this.init();
                        }.bind(this)
                    }, {
                        type: 'select',
                        label: 'Selected Group',
                        model: 'selectGroup',
                        values: this.group,
                        onChanged: function(model, newVal, oldVal, field) {
                            this.init();
                        }.bind(this)
                    }]
                }
            }
        },
        mounted: function () {
            //进入页面的时候，获取数据依法
            $.get('/cgi-bin/luci/api/v1/outlet/group?name=' + this.model.selectGroup).success(function(response){
                response.forEach(function(item){
                    this.group.push({
                        name: item.name,
                        id: item.name
                    })
                }.bind(this))
            }.bind(this));
            this.init();
        },
        methods: {
            onApplyClick: function () {//用户点击修改数据的时候
                if(this.$refs["powerOutletsThreshold"].errDataArr.length!=0){
                    layer.msg("There are incorrect values in the table");
                    return;
                }
                var data = [];
                this.editData.forEach(function(item){//获取数据，并且将编辑过的数据更新到页面上
                    this.datas[item.index][item.field] = item.value;
                    this.datas[item.index].isEdit = true;
                }.bind(this))
                this.datas.forEach(function(item) {
                    if (item.isEdit) {
                        delete item.isEdit;
                        data.push(item);
                    }
                }.bind(this))
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(data),//传过去应该是修改过的数据
                    contentType: 'application/json',
                    url: '/cgi-bin/luci/api/v1/outlet/threshold?type=' + this.model.selectedType,
                    success: function(response){
                        this.init();//重置
                    }.bind(this)
                })
            },
            onCancelClick: function () {
                this.init();
                this.choiseData = [];
                this.clearSelectedCheckeBox();//清除所有选中的状态
            },
            clearSelectedCheckeBox:function() {
                this.$children[0].$children[1].$refs.vuetable.selectedTo = [];
            },             
            resetThresh:function() {
                if (this.choiseData.length == 0) {
                    alert('please choose a outlet');
                    return false;
                }                

                var r = confirm("Confirm to Reset?");
                if(r != true)
                    return true;

                var type = type;
                var data = [];

                this.choiseData.forEach(function(item){
                    data.push({
                        id: item.id
                    })
                }.bind(this))  

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/outlet/reset?type=th_' + this.model.selectedType,
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response){
                        this.init();
                        this.choiseData = [];
                        this.clearSelectedCheckeBox();//清除所有选中的状态
                    }.bind(this)
                })
            },
            changeDatasShowType:function(data,type){//由于现在是直接获取所有的同一类型数据，于是再rowData里面将showType设置进去，之后根据下拉框动态设置
                data.forEach(function(item){
                    item.showType=type;
                }.bind(this));
            },
            init:function() {//huod
                this.editData = [];
                var layerTime=layer.load(2, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                //获取到Outlet批量阈值
                $.get('/cgi-bin/luci/api/v1/outlet/threshold?group=' + this.model.selectGroup + '&type=' + this.model.selectedType).success(function(response){
                    response.forEach(function(item){
                        item.SocketType = item.type;
                        /*
                        switch (item.type) {
                            case 0:
                                item.showType = 'IEC320 C13 UL';
                                break;
                            case 1:
                                item.showType = 'IEC320 C13 IEC';
                                break;
                            case 2:
                                item.showType = 'IEC320 C19 UL';
                                break;
                            case 3:
                                item.showType = 'IEC320 C19 IEC';
                                break;
                            case 4:
                                item.showType = 'GB1002/10A';
                                break;
                            case 5:
                                item.showType = 'GB1002/16A';
                                break;
                            case 6:
                                item.showType = 'NEMA5-15R';
                                break;
                            case 7:
                                item.showType = 'NEMA5-20R';
                                break;
                        }*/
                    }.bind(this));
                    this.datas = [];
                    setTimeout(function(){
                        this.datas = response;
                        this.changeDatasShowType(this.datas,this.model.selectedType);
                        layer.close(layerTime);
                    }.bind(this));
                }.bind(this))
            }
        }
    });
});