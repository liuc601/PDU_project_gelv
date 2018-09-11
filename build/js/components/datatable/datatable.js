define(function (require) {
    var Vue = require('vue');
    var VueTable = require('vue-table');
    var Checkbox = require('components/checkbox/checkbox');
    var TableAction = require('components/datatable/actions');
    var InlineText = require('components/datatable/inline-text');
    var InlineSelect = require('components/datatable/inline-select');
    var InlineCheckbox = require('components/datatable/inline-checkbox');
    var ToolBar = require('components/datatable/toolbar');
    var TdUsage = require('components/datatable/td-usage');

    var css = {
        table: {
            tableClass: 'table table-striped table-bordered',
            ascendingIcon: 'fa fa-sort-asc',
            descendingIcon: 'fa fa-sort-desc',
            noSortingIcon: 'fa fa-sort',
            handleIcon: 'glyphicon glyphicon-menu-hamburger',
            renderIcon: function (classes, options) {
                return '<i class="' + classes.join(' ') + '" style="opacity:1;position:relative;float:right"></i>';
            }
        },
        pagination: {
            wrapperClass: "pull-right",
            activeClass: "pn-btn-active border-transparent",
            disabledClass: "pn-btn disabled",
            pageClass: "pn-btn boder-circle",
            linkClass: "pn-btn boder-circle",
            icons: {
                first: "fa fa-angle-double-left",
                prev: "fa fa-angle-left",
                next: "fa fa-angle-right",
                last: "fa fa-angle-double-right"
            }
        },
        paginationinfo: {
            infoClass: 'pn-info pull-left'
        }
    };

    Vue.use(VueTable);

    return function (mixin) {
        if (mixin.apiMode === undefined) {
            mixin.apiMode = true;
        }

        return {
            template: require('text!./datatable.html'),
            mixins: [(mixin === undefined) ? {} : mixin],
            props: {
                url: {
                    type: String,
                    default: ''
                },
                datas: {
                    type: Array
                },
                dataTotal: 0,
                showFooter: {
                    type: Boolean,
                    default: true
                },
                showToolbar: {
                    type: Boolean,
                    default: true
                },
                dataProcess: {
                    type: Function
                },
                pageChange: {
                    type: Function
                },
                showAddButton: {
                    type: Boolean,
                    default: true,
                },
                showDelButton: {
                    type: Boolean,
                    default: false
                },
                apiMode: {
                    type: Boolean,
                    default: true,
                },
                loadOnStart: {
                    type: Boolean,
                    default: true,
                },
                edit: {
                    type: Array
                },
                editAction: {
                    type: Function
                },
                deleteAction: {
                    type: Function
                },
                choiseData: {
                    type: Array
                },
                cptType: {//可以传进来计算规则，之后根据字符串选择计算规则
                    /* 
                    hl:Hysteresis,Low Alarm,Low Warning,High Warning,High Alarm这种数据形式的计算规则
                    */
                    type: String
                }
            },
            watch: {
                datas: function () {
                    this.loadData();
                }
            },
            data: function () {
                return {
                    //                        tableData: nil,
                    loadStep: 0,
                    enableDeleteAll: false,
                    css: css,
                    perPage: 15,
                    slotFields: [],
                    infoTemplate: 'Display from {from} to {to}, total {total} items,',
                    childrenGroup: [],//对子元素进行引导分组，方便之后同组遍历
                    errDataArr: [],
                };
            },
            updated: function () {
                this.$nextTick(function () {
                    this.childrenGroup=[];
                    this.groupOfChildren();
                }.bind(this));
            },
            created: function () {
                for (var i = 0; i < this.fields.length; i++) {
                    if (this.isSlotField(this.fields[i])) {
                        this.slotFields.push(this.fields[i]);
                    }
                }
            },
            mounted: function () {
                this.loadData();
                console.log("datatable : this.cptType",this.cptType);
            },
            methods: {
                isSlotField: function (field) {
                    return field.name.split(':')[0].trim() === '__slot';
                },
                getSlotName: function (field) {
                    if (field === undefined)
                        return 'actions';

                    return field.name.split(':')[1].trim();
                },
                groupOfChildren: function () {//对当前组件下的子组件根据id进行分组
                    var table = this.$refs.vuetable;
                    var children = table.$children;
                    children.forEach(function (item) {
                        if (item.rowData !== undefined) {
                            if (this.childrenGroup[item.rowData.id] == undefined) {
                                this.childrenGroup[item.rowData.id] = [];
                            }
                            this.childrenGroup[item.rowData.id].push(item);
                        } else {
                            if (this.childrenGroup[0]== undefined) {
                                this.childrenGroup[0] = [];
                            }
                            this.childrenGroup[0].push(item);
                        }
                    }.bind(this));
                    // console.log(this.childrenGroup);
                },
                forEachChildrenUpdataView:function(row/*行id*/,field/*当前发生修改的类型*/){
                    //用子元素发生修改的时候，调用这个方法，这个方法会不断的遍历同行的子元素，
                    //然后调用他们的界面更新函数，及逆行状态判断
                    this.childrenGroup[row].forEach(function(item,index){
                        item.updataView(this.cptType,field);//将计算类型传递给子组件，还有当前修改的类型
                    }.bind(this))
                },
                loadNextData: function (index) {
                    var vm = this;
                    setTimeout(function () {
                        vm.$refs.vuetable.appendData(vm.datas.slice(index, index + 1));
                        if (vm.datas.length > index + 1)
                            vm.loadNextData(index + 1);
                    }, 1);
                },
                loadData: function () {
                    if (Array.isArray(this.datas)) {
                        this.dataTotal = this.datas.length;
                    } else if (this.datas && this.datas.pagination) {
                        this.dataTotal = this.datas.pagination.total;
                    } else {
                        this.dataTotal = 0;
                    }

                    if (this.dataTotal) {
                        this.$refs.vuetable.setData(this.datas);
                    } else {
                        this.$refs.vuetable.resetData();
                        if (this.showFooter) {
                            this.$refs.pagination.resetData();
                            this.$refs.paginationInfo.resetData();
                        }
                    }
                    /*
                                            this.$refs.vuetable.setData(this.datas.slice(0, this.loadStep));

                                            if (this.datas.length > this.loadStep) {
                                                this.loadNextData(this.loadStep);
                                            }
                    */
                },
                onPaginationData: function (paginationData) {
                    if (this.showFooter && paginationData) {
                        this.$refs.pagination.setPaginationData(paginationData);
                        this.$refs.paginationInfo.setPaginationData(paginationData);
                    }
                },
                onDataManager: function (sortOrder, paginationData) {
                    if (this.pageChange)
                        this.pageChange(paginationData.current_page, paginationData.per_page);
                    console.log('onDataManager new page...', paginationData.current_page);

                    return this.datas;
                },
                onChangePage: function (page) {
                    this.$refs.vuetable.changePage(page);
                    console.log('Change Page...', page);
                },
                onTableActionEdit: function (action, index, data) {
                    console.log("是这个正在修改吗？", action, index, data);
                    var vm = this;
                    vm.editAction(index);
                },
                onTableActionDel: function (action, index, data) {
                    var vm = this;
                    vm.deleteAction(index);
                    console.log('tableAction:delete');
                },
                onInlineEditorChange: function (index, field, value) {
                    var vm = this;
                    vm.edit.push({
                        index: index,
                        field: field,
                        value: value
                    })
                },
                onDataLoading: function () {
                    console.log('Data loading...');
                },
                onDataLoadSuccess: function (response) {
                    console.log('Data load success.');
                    if (this.dataProcess) {
                        this.dataProcess(response);
                    }
                },
                onDataLoadError: function () {
                    console.log('Data load error..');
                },
                onDataLoadFinished: function () {
                    console.log('Data load finished..');
                },
                onToolbarActionAdd: function () {
                    console.log('onToolbarActionAdd');
                },
                onToolbarActionDel: function () {
                    console.log('onToolbarActionDel');
                },
                onInlineCheckboxToggled: function (checked, item) {
                    this.enableDeleteAll = this.$refs.vuetable.selectedTo.length > 0;
                },
                onCheckboxToggled: function (checked, item) {
                    //console.log("checkbox的点击事件",checked, this.choiseData.indexOf(item.id), item, this.choiseData);
                    if (checked) {
                        this.choiseData.push(item);
                    } else {
                        //this.choiseData.splice(this.choiseData.indexOf(item.id), 1);
                        for (var i = 0; i < this.choiseData.length; i++) {
                            if (this.choiseData[i].id === item.id) {
                                this.choiseData.splice(i, 1);
                            }
                        }
                    }
                    this.enableDeleteAll = this.$refs.vuetable.selectedTo.length > 0;
                },
                onSelectAllToggled: function (checked) {
                    /* this.$refs.vuetable.selectedTo  可以获取到被选中的状态 */
                    // console.log(this.$refs.vuetable.selectedTo);
                    this.enableDeleteAll = checked;
                    if (!checked) {
                        this.choiseData.splice(0, this.choiseData.length);
                    }
                    this.$refs.vuetable.selectedTo.forEach(
                        function (item) {
                            var obj = {};
                            obj.id = item;
                            this.choiseData.push(obj);
                        }.bind(this)
                    );
                }
            }
        };
    };
    /*
    return function(mixin) {
        return {
            'datatable': datatable
        };
    };
    */
});