define(function (require) {
    var Vue = require('vue');
    var Datatable = require('datatable');
    var OLState = require('pages/power/outlet/ol-state'); //当前条目的状态
    var VueFormGenerator = require('vue-form');
    var layer = require('layer');
    require('components/x-panel');
    require('components/switch');
    require('components/title-count');
    require('components/form-action');
    require('components/status-bar');

    Vue.use(VueFormGenerator);

    var mixin = {
        data: function () {
            return { //表格显示的列表上数据
                fields: [{
                        name: '__checkbox:checkbox', //似乎没有绑定v-mode
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
                        // name: 'name',
                        // title: 'Outlet Name',
                        name: '__slot:detailLink',
                        title: 'Outlet Name',
                    },
                    {
                        name: 'showType',
                        title: 'Socket Type'
                    },
                    {
                        name: 'current',
                        title: 'Current',
                        callback: 'renderCurrent',
                        __normalize: function (obj) {
                            obj.unit = 'A';
                        },
                    },
                    {
                        name: 'activePower',
                        title: 'Active Power',
                        callback: 'renderActivePower',
                        __normalize: function (obj) {
                            obj.unit = 'KW';
                        },
                    },
                    {
                        name: 'powerFactor',
                        title: 'Power Factor',
                        callback: 'renderPowerFactor',
                        __normalize: function (obj) {
                            obj.unit = 'PF';
                        },
                    },
                    {
                        /* vue-table的引入方式 */
                        name: '__component:ol-state:state',
                        title: 'State'
                    },
                    {
                        name: 'status',
                        title: 'Status',
                        callback: 'renderStatus' //回调函数
                    },
                    {
                        name: '__slot:actions',
                        title: 'Action',
                    },
                ]
            };
        },
        methods: {
            name: function () {},
            renderCurrent: function (value, field, item) {
                return this.getStatusColor(item[field.name + "Status"], this.doValueDigit(field.unit, value, item) + ' A');
            },
            renderActivePower: function (value, field, item) {
                return this.getStatusColor(item[field.name + "Status"], this.doValueDigit(field.unit, value, item) + ' kW');
            },
            renderPowerFactor: function (value, field, item) {
                return this.getStatusColor(item[field.name + "Status"], (value === '') ? '--' : this.doValueDigit(field.unit, value, item));
            },
            renderStatus: function (value) {
                if (value == 0) {
                    return "<span class='clr-green' style='font'>Normal<span>";
                } else if (value == 1) {
                    return "<span class='clr-green' style='font'>Disabled<span>";
                } else if (value == 12) {
                    return "<span class='label label-danger'>Breaker Tripped<span>";
                } else if (value == 14) {
                    return "<span class='label label-danger'>Low Alarm<span>";
                } else if (value == 15) {
                    return "<span class='label label-warning'>Low Warning<span>";
                } else if (value == 16) {
                    return "<span class='label label-warning'>High Warning<span>";
                } else if (value == 17) {
                    return "<span class='label label-danger'>High Alarm<span>";
                }
                /*
                if (value == 0) {
                    return "<span class='clr-green' style='font'>NORMAL<span>";
                }

                if (value == 1) {
                    return "<span class='clr-green' style='font'>DISABLED<span>";
                }

                if (value == 2) {
                    return "<span class='clr-green' style='font'>STARTUP<span>";
                }

                if (value == 5) {
                    return "<span class='label label-warning'>CONFLICT<span>";
                }

                if (value == 3 || value == 6) {
                    return "<span class='label label-warning'>HIGH WARNING<span>";
                }

                if (value == 4 || value == 7) {
                    return "<span class='label label-danger'>HIGH ALARM<span>";
                }*/
            }
        }
    };

    function getFieldUnit(row, field) {
        switch (row.id) {
            case 1:
                return 'A';
            case 2:
                return 'V';
            case 3:
                return 'kW';
            case 4:
                return 'kVA';
            case 5:
                return '%';
            case 6:
                return 'kWh';
            case 7:
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
    return Vue.extend({
        template: require('text!./status.html'),
        components: {
            'datatable': Datatable(mixin), //组件需要的数据？
            'ol-edit': function (resolve) {
                require(['pages/power/outlet/ol-edit'], resolve);
            },
        },
        data: function () {
            return {
                model: {
                    selectGroup: 'all',
                },
                Groupmodel: {
                    group: ''
                },
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
                outletEditor: '',
                outletEditing: null, //每次被点击的时候，将要编辑的传感器数据放在这               
                datas: [],
                group: [],
                editMode: false,
                choiseData: [],
                Groupschema: {
                    fields: [{
                        type: 'input',
                        label: 'Group Name',
                        model: 'group',
                    }]
                },
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
                            onclick: function () {
                                var userDefined = true;
                                var name = this.model.selectGroup;

                                this.group.forEach(function (item) {
                                    if (item.name == name) {
                                        userDefined = item.userDefined;
                                    }
                                }.bind(this))

                                if (!userDefined) {
                                    layer.msg("No permission");
                                    return;
                                }

                                $.ajax({
                                    url: '/cgi-bin/luci/api/v1/outlet/group?name=' + this.model.selectGroup,
                                    type: 'delete',
                                    contentType: 'application/json',
                                    success: function (response) {
                                        this.model.selectGroup = 'all';
                                        this.initGroupData();
                                        clearInterval(this.timer);
                                        this.init();
                                    }.bind(this)
                                })
                            }.bind(this)
                        }],
                        self: this,
                        onChanged: function (model, newVal, oldVal, field) {
                            clearInterval(this.timer);
                            this.init();
                        }.bind(this)
                    }]
                }
            },
        },
        mounted: function () {
            // this.$watch('model.selectGroup', function () {
            //     delete this.schema.fields[0].buttons;
            // }, { deep: true })
            this.initGroupData();
            this.init();
        },
        beforeDestroy: function () {
            clearInterval(this.timer);
        },
        methods: {
            openGroup: function () {
                if (this.choiseData.length == 0) { //全选的状态下，是没有的
                    alert('please choose a outlet');
                } else {
                    $('.myModal').css({
                        display: 'block',
                        opacity: 1
                    })
                }
            },
            initGroupData: function () {
                $.get('/cgi-bin/luci/api/v1/outlet/group?name=' + this.model.selectGroup).success(function (response) {
                    this.group = [];
                    response.forEach(function (item) {
                        this.group.push({
                            name: item.name,
                            id: item.name,
                            userDefined: item.userDefined,
                        })
                    }.bind(this))
                }.bind(this));
            },
            getOutletStatus: function () {
                $.get('/cgi-bin/luci/api/v1/outlet/status?group=' + this.model.selectGroup).success(function (response) {
                    this.datas = response;
                    // console.log(response);
                    /* 初始化的时候，复制数据 */
                    // console.log("这边的数据是首次请求回来的数据", response);
                    this.datas.forEach(function (item) {
                        item.showType = item.type;

                        if (item.state == 85) { //进行判断，
                            item.state = false
                            // item.state = true
                        } else {
                            item.state = true
                        }
                    }.bind(this))
                }.bind(this))
            },
            itemAction: function (domEvent, event, props) { //单个操作
                var domTarget = domEvent.target;
                var type = '';
                var that = this;
                if (event == 'edit') {
                    clearInterval(this.timer);
                    this.outletEditing = props.rowData;
                    this.outletEditor = 'ol-edit';
                    this.editMode = true;
                    // console.log(domEvent, event, props);
                } else {
                    if (props.rowData.locked) { //如果是被锁定的状态，弹出提示窗
                        layer.msg("No permission");
                        if (props.rowData.state == true)
                            props.rowData.state = false;
                        else
                            props.rowData.state = true;
                        return
                    }
                    if (event == 'turn') {
                        var r;
                        type = props.rowData.state == true ? 'on' : 'off';
                        if (type == 'on') {
                            r = confirm("Confirm to On?");
                            if (r != true) {
                                props.rowData.state = false;
                                return;
                            }
                        } else {
                            r = confirm("Confirm to Off?");
                            if (r != true) {
                                props.rowData.state = true;
                                return;
                            }
                        }
                    } else if (event == 'cycle') {
                        var r;

                        type = 'cycle';
                        if (!props.rowData.state) { //如果开关关闭的话，弹出，并且提示
                            layer.msg("Operation not allowed");
                            return;
                        }

                        r = confirm("Confirm to cycle?");
                        if (r != true) {
                            return;
                        }

                        //如果是这边的话，就给予重启状态
                        if (domTarget.nodeName == "I") {
                            domTarget = domTarget.parentNode;
                        }
                        domTarget.setAttribute("name", "recycleing");
                    }
                    var layerTime = layer.load(2, {
                        shade: [0.1, '#fff'] //0.1透明度的白色背景
                    });

                    clearInterval(this.timer);

                    $.ajax({
                        type: 'post',
                        url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=' + type,
                        data: JSON.stringify([{
                            id: props.rowData.id
                        }]),
                        contentType: 'application/json',
                        success: function (response) {
                            //props.rowData.state = true;
                            that.init();

                            layer.close(layerTime);
                            if (type == "cycle") {
                                domTarget.removeAttribute("name");
                            }
                        }
                    })
                }
            },
            init: function () {
                this.clearSelectedCheckeBox();
                this.getOutletStatus();
                this.timer = setInterval(this.getOutletStatus, 3000);
            },
            dealAll: function (type) { //批量操作

                //有拿到选中的值
                if (this.choiseData.length == 0) {
                    alert('Please choose a outlet');
                    return false;
                }
                var type = type;
                var data = [];
                var r;

                this.choiseData.forEach(function (item) {
                    data.push({
                        id: item.id
                    })
                }.bind(this))

                data.sort(function (a, b) {
                    return a.id - b.id;
                });

                for (var j = 0; j < data.length; j++) { //批量操作时，清除被锁定的数据
                    var item = data[j];
                    this.datas.forEach(function (i) {
                        if (item.id == i.id) {
                            if (i.locked) {
                                data.splice(j, 1);
                                j -= 1;
                            }
                        }
                    }.bind(this));
                }

                if (type == "cycle") {
                    r = confirm("Confirm to cycle?");
                    if (r != true) {
                        return;
                    }

                    for (var k = 0; k < data.length; k++) { //批量重启操作时，清除状态为off数据
                        var item = data[k];
                        this.datas.forEach(function (i) {
                            if (item.id == i.id) {
                                if (!i.state) {
                                    data.splice(k, 1);
                                    j -= 1;
                                }
                            }
                        }.bind(this));
                    }
                } else if (type == "on") {
                    r = confirm("Confirm to on?");
                    if (r != true) {
                        return;
                    }
                } else {
                    r = confirm("Confirm to off?");
                    if (r != true) {
                        return;
                    }
                }

                clearInterval(this.timer);
                //将获取到的值传给后台，然后根据后台的值来处理，成功之后调用这个方法
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/outlet/ctrl?action=' + type,
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (response) {
                        this.init();
                    }.bind(this)
                })
            },
            groupCancel: function () {
                $('.myModal').css({
                    display: 'none',
                    opacity: 0
                })
            },
            groupApply: function () {
                var id = [];

                if (this.hasGroupName(this.Groupmodel.group)) { //判断命名是否重复
                    layer.msg("Repeat the naming");
                    return;
                };

                this.choiseData.forEach(function (item) {
                    id.push({
                        id: item.id
                    })
                }.bind(this))

                id.sort(function (a, b) {
                    return a.id - b.id;
                });

                clearInterval(this.timer);
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/outlet/group?name=' + this.Groupmodel.group,
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify(id),
                    success: function (response) {
                        $('.myModal').css({
                            display: 'none',
                            opacity: 0
                        });
                        //this.Groupmodel.group = '';
                        $.get('/cgi-bin/luci/api/v1/outlet/group?name=' + 'all').success(function (response) {
                            this.group = [];
                            response.forEach(function (item) {
                                this.group.push({
                                    name: item.name,
                                    id: item.name,
                                    userDefined: item.userDefined,
                                })
                            }.bind(this))

                            this.model.selectGroup = this.Groupmodel.group;
                            this.Groupmodel.group = '';
                            this.init();
                        }.bind(this));
                        /*
                        this.model.selectGroup = this.Groupmodel.group;
                        this.initGroupData();
                        this.Groupmodel.group = '';
                        this.init();*/
                    }.bind(this)
                })
                // $.get('/cgi-bin/luci/api/v1/outlet/status?name=' + this.Groupmodel.group).success((response) => {

                // })
            },
            hasGroupName: function (names) { //判断明明是否重复
                var flag = false;
                this.group.forEach(function (item) {
                    if (flag) {
                        return
                    }
                    if (item.name == names) {
                        flag = true;
                    }
                }.bind(this));
                return flag;
            },
            clearSelectedCheckeBox: function () {
                this.choiseData = [];

                if (this.$children[0].$children[1] && this.$children[0].$children[1].$refs.vuetable)
                    this.$children[0].$children[1].$refs.vuetable.selectedTo = [];
                else if (this.$children[2] && this.$children[2].$children[1] && this.$children[2].$children[1].$refs.vuetable)
                    this.$children[2].$children[1].$refs.vuetable.selectedTo = [];

                //this.$refs.vuetable.selectedTo = [];
                //this.dataTable.selectedTo = [];
                //this.dataTable.$refs.vuetable.selectedTo = [];
            },
            onEditExit: function () { //退出编辑模式
                this.editMode = false;
                clearInterval(this.timer);
                this.init();
                //this.timer = setInterval(this.init, 3000);                
            },
        }
    });
});