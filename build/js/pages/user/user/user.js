define(function (require) {
    var Vue = require('vue');
    var Datatable = require('datatable');
    var VueFormGenerator = require('vue-form');
    require('components/x-panel');
    require('components/form-action');
    Vue.use(VueFormGenerator);
    var mixin = {//用户列表
        data: function () {
            return {
                fields: [{
                    name: 'id',
                    title: 'ID',
                }, {
                    name: 'userName',
                    title: 'User Name',
                }, {
                    name: 'fullName',
                    title: 'Full Name'
                }, {
                    name: 'email',
                    title: 'Email'
                }, {
                    name: 'accessLevel',
                    title: 'Access Level',//这边需要计算数据
                    callback: 'renderAccessLevel'
                }, {
                    name: 'status',
                    title: 'Status',
                    callback: 'renderStatus'
                }, {
                    name: '__component:table-actions',
                    title: 'Action',
                    __normalize: function (obj) {
                        // console.log("__component:table-actions  __normalize");
                    }
                },]
            };
        },
        methods: {
            renderStatus: function (value) {
                var str = value == 0 ? "Disable" : "Enable";
                return str;
            },
            renderAccessLevel: function (value) {
                var str = '';
                switch (value) {//判断帐号等级
                    case 0:
                        str = "Administrator";
                        break;
                    case 1:
                        str = "User";
                        break;
                };
                return str;
            }
        }
    };
    var accessLevelMixin = {//可管理对象列表
        data: function () {
            return {
                fields: [
                    {
                        name: 'type',
                        title: 'Type'
                    }, {
                        name: 'id',
                        title: 'ID',
                    }, {
                        name: 'name',
                        title: 'Name'
                    }, {
                        name: '__component:inline-select:accessType',
                        title: 'Access Type',
                        __normalize: function (obj) {
                            obj.__options = [
                                { value: 0, text: 'No Access' },
                                { value: 1, text: 'View' },
                                { value: 2, text: 'View & Configuration' },
                                { value: 3, text: 'View & Configuration & Control' }
                            ];
                        }
                    }]
            };
        },
    };
    return Vue.extend({
        template: require('text!./user.html'),
        components: {
            'datatable': Datatable(mixin),
            'datatable3': Datatable(accessLevelMixin)
        },
        data: function () {
            return {
                model: {
                },
                editTitle: 'Create a new user',
                userList: [], //用户列表
                accessObjDataList: [],//datatable的用户权限列表数据
                accessObjEditDataList: [],//用户列表的编辑数据
                /* 
                  user add
                */
                showEditTemplate: false,
                showAccessObjList: false,
                isAdd: false,//当前时候为添加用户状态
                isEdit: false,//当前是否为编辑状态

                userModel: { //具体用户的基本信息
                    accessLevel: 1,
                },//用户渲染的数据及绑定的数据model

                /* 用户首选项的数据 */
                userPreferencesModel: {//创建新用户的数据model，或者是编辑用户的数据模版
                    temperatureUnit: '℃',
                    lengthUnit: 'Meter',
                    pressureUnit: 'Pascal',
                },

                /* 用户权限设置数据 */
                accessLevelModel: {//用户权限
                    accessLevel: 'User'
                },

                /* 用户一些配置的选项列表 */
                temperatureList: [
                    { name: "℃", value: 0 },
                    { name: "℉", value: 1 },],

                lengthList: [
                    { name: "Meter", value: 0 },
                    { name: "Feet", value: 1 },],

                pressureList: [
                    { name: "Pascal", value: 0 },
                    { name: "Psi", value: 1 },],

                accessLevelList: [
                    { name: "Administrator", value: 0 },
                    { name: "User", value: 1 },],
                
                formOptions: {
                    validateAfterLoad: true,
                    validateAfterChanged: true
                },
            };
        },
        computed: {
            addUserSchema: function () {
                return {
                    fields: [{
                        type: 'input',
                        inputType: 'text',
                        label: 'User Name',
                        model: 'userName',
                        disabled: (model) => {
                            return (this.isEdit === true)
                        }
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: 'Full Name',
                        model: 'fullName'
                    }, {
                        type: 'input',
                        inputType: 'password',
                        label: 'Password',
                        model: 'password'
                    }, {
                        type: 'input',
                        inputType: 'password',
                        label: 'Verify Password',
                        model: 'verifyPassword'
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: 'Email',
                        model: 'email'
                    }, {
                        type: 'input',
                        inputType: 'text',
                        label: 'Telephone Number',
                        model: 'phoneNo'
                    }, {
                        type: 'switch',
                        label: 'Status',
                        model: 'status',
                        textOn: 'Enabled',
                        textOff: 'Disabled',
                    },]
                }
            },
            userPreferencesSchema: function () {
                return {
                    fields: [
                        {
                            type: 'select',
                            label: 'Temperature Unit',
                            model: 'temperatureUnit',
                            values: this.temperatureList,
                            onChanged: (model) => {
                                this.userModel.tempUnit = model.temperatureUnit.value
                            }
                        }, {
                            type: 'select',
                            label: 'Length Unit',
                            model: 'lengthUnit',
                            values: this.lengthList,
                            onChanged: (model) => {
                                this.userModel.lenUnit = model.lengthUnit.value
                            }
                        }, {
                            type: 'select',
                            label: 'Pressure Unit',
                            model: 'pressureUnit',
                            values: this.pressureList,
                            onChanged: (model) => {
                                this.userModel.pressUnit = model.pressureUnit.value
                            }
                        },]
                }
            },
            accessLevelSchema: function () {
                return {
                    fields: [{
                        type: 'select',
                        label: 'Access Level ',
                        model: 'accessLevel',
                        values: this.accessLevelList,
                        onChanged: (model) => {//当数据变化的时候，向后台请求数据，更新当前的状态
                            if (model.accessLevel == undefined)
                                return;
                            this.userModel.accessLevel = model.accessLevel.value;
                            if(this.userModel.accessLevel == 0)
                                this.showAccessObjList = false;
                            else
                                this.showAccessObjList = true;
                        }
                    }, {
                        type: 'checkbox',
                        label: 'Console',
                        model: 'console',
                        visible: function (model) {
                            return model && (model.accessLevel.value == 1);
                        }
                    }, {
                        type: 'checkbox',
                        label: 'SSH',
                        model: 'ssh',
                        visible: function (model) {
                            return model && (model.accessLevel.value == 1);
                        }
                    }, {
                        type: 'checkbox',
                        label: 'Web',
                        model: 'web',
                        visible: function (model) {
                            return model && (model.accessLevel.value == 1);
                        }
                    }]
                }
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            addNewUser: function () {
                this.userModel = {};//清空数据
                this.accessObjDataList = [];
                this.accessObjEditDataList = [];

                this.isAdd = true;
                this.showEditTemplate = true;
                this.editTitle = "Create a new user";

                this.newUserEdit();
            },
            editAction: function (index) {
                this.userModel = {};//清空数据
                this.accessObjDataList = [];
                this.accessObjEditDataList = [];
                
                this.isEdit = true;
                this.showEditTemplate = true;
                this.editTitle = "User edit，Set new password, access level, and monitoring rights";

                this.getUserDetail(index.userName);
            },
            deleteAction: function (data) {
                if (data.accessLevel == 0) {
                    layer.msg("Is not allowed to delete");
                    return;
                }
                layer.msg('Confirm delete ?', {
                    time: 0 //不自动关闭
                    , btn: ['yes', 'no']
                    , yes: index => {
                        layer.close(index);
                        this.deleteUser(data, (response) => {
                        }, (response) => {
                            this.init();
                        });
                    }
                });
            },
            onReturn: function () {
                if(this.isEdit === true) {
                    this.init();
                }
                this.isAdd = false;
                this.isEdit = false;
                this.showEditTemplate = false;
            },
            onCancelUserClick: function () {//取消创建新用户
                if(this.isAdd === true) {
                    this.isAdd = false;
                    this.isEdit = false;
                    this.showEditTemplate = false;
                } else if(this.isEdit) {
                    var userName = this.userModel.userName;
                    this.userModel = {};//清空数据
                    this.accessObjDataList = [];
                    this.accessObjEditDataList = [];
                    this.getUserDetail(userName);
                } else {
                    this.isAdd = false;
                    this.isEdit = false;
                    this.showEditTemplate = false;
                    this.init();
                }
            },
            onApplyUserClick: function () {//创建新用户
                this.userModel.console = this.accessLevelModel.console;
                this.userModel.ssh = this.accessLevelModel.ssh;
                this.userModel.web = this.accessLevelModel.web;

                if (this.isAdd) {//当前是创建新用户
                    if (this.userModel.userName == undefined) {
                        layer.msg("Enter the user name");
                        return;
                    }

                    if (this.userModel.userName=="admin") {
                        layer.msg("Invalid user name!");
                        return;
                    }

                    if (this.userModel.verifyPassword != this.userModel.password) {
                        layer.msg("The twice passwords do not match");
                        return;
                    }
                    if (this.userModel.password.length < 6 || this.userModel.password.length > 32) {
                        layer.msg("Password Length of 6 - 32");
                        return;
                    }

                    delete this.userModel.verifyPassword;

                    this.doUserAccessEditData();
                    // console.log("创建的新用户，用户修改的数据是", this.userModel);
                    this.isAdd = false;
                    this.showEditTemplate = false;
                    $.ajax({
                        url: '/cgi-bin/luci/api/v1/user?userName=' + this.userModel.userName,
                        type: "POST",
                        data: JSON.stringify(this.userModel),
                        contentType: 'application/json',
                        dataType: 'json',
                        complete: (response) => {
                            this.init();
                        }
                    })
                } else if (this.isEdit) {
                    if (this.userModel.verifyPassword != this.userModel.password) {
                        layer.msg("The twice passwords do not match");
                        return;
                    }

                    this.doUserAccessEditData();
                    // console.log("修改用户数据", this.userModel);
                    //this.isEdit = false;
                    //this.showEditTemplate = false;

                    var layerTime = layer.load(2, {
                        shade: [0.1, '#fff'] //0.1透明度的白色背景
                    });

                    $.ajax({
                        url: '/cgi-bin/luci/api/v1/user?userName=' + this.userModel.userName,
                        type: "PUT",
                        data: JSON.stringify(this.userModel),
                        contentType: 'application/json',
                        dataType: 'json',
                        complete: (response) => {
                            //this.init();
                            layer.close(layerTime);
                        }
                    })
                }
            },
            init: function () {//页面初始化
                this.userList = [];
                this.userModel = [];
                this.accessObjDataList = [];
                this.accessObjEditDataList = [];

                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/user/all',//获取所有的用户列表,包含用户的基本信息
                    type: 'get',
                    dataType: 'json',
                    success: (response) => {
                        console.log("所有用户的数据", response);
                        this.userList = response;
                        layer.close(layerTime);
                    }
                })
            },
            newUserEdit: function () {
                var accessLevel = { name: "User", value: 1 };
                var temperatureUnit = { name: "℃", value: 0 };
                var lengthUnit = { name: "Meter", value: 0 };
                var pressureUnit = { name: "Pascal", value: 0 };

                this.accessLevelModel.accessLevel = accessLevel;
                this.accessLevelModel.console = 1;
                this.accessLevelModel.ssh = 1;
                this.accessLevelModel.web = 1;
                                
                this.userPreferencesModel.temperatureUnit = temperatureUnit;
                this.userPreferencesModel.lengthUnit = lengthUnit;
                this.userPreferencesModel.pressureUnit = pressureUnit;

                //设置给usermodel
                this.userModel.accessLevel = accessLevel.value;
                this.userModel.tempUnit = temperatureUnit.value;
                this.userModel.lenUnit = lengthUnit.value;
                this.userModel.pressUnit = pressureUnit.value;

                this.userModel.status = 1;

                this.showAccessObjList = true;

                //this.userModel.userName = "";
                //this.userModel.fullName = "";

                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/user/access',//获取用户可访问的所有对象列表
                    type: 'get',
                    dataType: 'json',
                    success: (response) => {
                        console.log("Access obj list", response);
                        this.userModel.accessObjList = response.accessObjList;
                        this.accessObjDataList = response.accessObjList;
                        layer.close(layerTime);
                    }
                })
            },            
            getUserDetail: function(userName) {
                //先默认一些下拉框的值
                // this.userPreferencesModel.temperatureUnit = { name: "℃", value: 0 };
                // this.userPreferencesModel.lengthUnit = { name: "Meter", value: 0 };
                // this.userPreferencesModel.pressureUnit = { name: "Pascal", value: 0 };
                // this.accessLevelModel.accessLevel = { name: "User", value: 1 };
                // this.accessLevelModel.console = 1;
                // this.accessLevelModel.ssh = 1;
                // this.accessLevelModel.web = 1;

                var layerTime = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });

                $.ajax({
                    url: '/cgi-bin/luci/api/v1/user?userName=' + userName,//获取用户数据所有配置信息
                    type: 'get',
                    contentType: 'application/json',
                    dataType: 'json',
                    success: (response) => {
                        if (response != undefined) {
                            this.accessLevelModel.accessLevel = this.accessLevelList[response.accessLevel];
                            this.accessLevelModel.console = response.console;
                            this.accessLevelModel.ssh = response.ssh;
                            this.accessLevelModel.web = response.web;

                            this.userPreferencesModel.temperatureUnit = this.temperatureList[response.tempUnit];
                            this.userPreferencesModel.lengthUnit = this.lengthList[response.lenUnit];
                            this.userPreferencesModel.pressureUnit = this.pressureList[response.pressUnit];

                            //设置给usermodel
                            this.userModel = response;
                            this.accessObjDataList = response.accessObjList;

                            if(response.accessLevel == 1)
                                this.showAccessObjList = true;
                            else
                                this.showAccessObjList = false;
                        }
                    },
                    complete: (response) => {
                        layer.close(layerTime);
                    }
                })
            },
            deleteUser(obj, fn1, fn2) {//obj,用户的数据
                $.ajax({
                    url: '/cgi-bin/luci/api/v1/user?userName=' + obj.userName,//获取所有的用户数据
                    type: 'DELETE',
                    data: JSON.stringify(obj),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: (response) => {
                        fn1(response);
                    },
                    complete: (response) => {
                        fn2 && fn2(response);
                    }
                })
            },
            doUserAccessEditData: function() {//处理用户编辑过的数据
                this.accessObjEditDataList.forEach(item => {
                    this.accessObjDataList[item.index][item.field] = item.value;
                });
                this.userModel.accessObjList = [];
                this.userModel.accessObjList = this.accessObjDataList;
            },
        }
    });
});