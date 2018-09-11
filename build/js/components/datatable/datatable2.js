define(function (require) {
    var Vue = require('vue');
    var VueTable = require('vue-table');
    var Checkbox = require('components/checkbox/checkbox');
    var TableAction = require('components/datatable/actions');
    var InlineText = require('components/datatable/inline-text');
    var InlineSelect = require('components/datatable/inline-select');
    var InlineCheckbox = require('components/datatable/inline-checkbox');
    var ToolBar = require('components/datatable/toolbar');

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

    //    Vue.use(VueTable);

    return Vue.component('datatable', {
        extends: VueTable.default,
        template: require('text!./datatable.html'),
        props: {
            showFooter: {
                type: Boolean,
                default: false
            },
            showToolbar: {
                type: Boolean,
                default: false
            },
            dataProcess: {
                type: Function
            }
        },
        data: function () {
            return {
                //                        tableData: nil,
                enableDeleteAll: false,
                css: css,
                perPage: 10,
                infoTemplate: 'Display from {from} to {to}, total {total} items,'
            };
        },
        methods: {
            onPaginationData: function (paginationData) {
                if (this.showFooter) {
                    this.$refs.pagination.setPaginationData(paginationData);
                    this.$refs.paginationInfo.setPaginationData(paginationData);
                }
            },
            onChangePage: function (page) {
                this.$refs.vuetable.changePage(page);
            },
            onTableActionEdit: function () {
                console.log('tableAction:edit');
            },
            onTableActionDel: function () {
                console.log('tableAction:delete');
            },
            onInlineEditorChange: function (index, field, value) {
                // console.log('inlineEditor:change, index=' + index + ', field=' + field + ', value=' + value);
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
            onCheckboxToggled: function (checked, item) {
                if (checked) {
                    this.choiseData.push(item);
                } else {
                    this.choiseData.splice(this.choiseData.indexOf(item), 1);
                }
                this.enableDeleteAll = this.$refs.vuetable.selectedTo.length > 0;
            },
            onSelectAllToggled: function (checked) {
                this.enableDeleteAll = checked;
                if (!checked) {
                    this.choiseData.splice(0, this.choiseData.length);
                }
                this.$refs.vuetable.selectedTo.forEach(
                    function(item){
                        var obj = {};
                        obj.id = item;
                        this.choiseData.push(obj);
                    }.bind(this)
                );
            }
        }
    });
    /*
        return function(mixin) {
            return {
                template: require('text!./datatable.html'),
                mixins: [(mixin === undefined) ? {} : mixin],
                props: {
                    showFooter: {
                        type: Boolean,
                        default: false
                    },
                    showToolbar: {
                        type: Boolean,
                        default: false
                    },
                    dataProcess: {
                        type: Function
                    }
                },
                data: function() {
                    return {
                        //                        tableData: nil,
                        enableDeleteAll: false,
                        css: css,
                        perPage: 10,
                        infoTemplate: 'Display from {from} to {to}, total {total} items,'
                    };
                },
                methods: {
                    onPaginationData: function(paginationData) {
                        if (this.showFooter) {
                            this.$refs.pagination.setPaginationData(paginationData);
                            this.$refs.paginationInfo.setPaginationData(paginationData);
                        }
                    },
                    onChangePage: function(page) {
                        this.$refs.vuetable.changePage(page);
                    },
                    onTableActionEdit: function() {
                        console.log('tableAction:edit');
                    },
                    onTableActionDel: function() {
                        console.log('tableAction:delete');
                    },
                    onInlineEditorChange: function(index, field, value) {
                        console.log('inlineEditor:change, index=' + index + ', field=' + field + ', value=' + value);
                    },
                    onDataLoading: function() {
                        console.log('Data loading...');
                    },
                    onDataLoadSuccess: function(response) {
                        console.log('Data load success.');
                        if (this.dataProcess) {
                            this.dataProcess(response);
                        }
                    },
                    onDataLoadError: function() {
                        console.log('Data load error..');
                    },
                    onDataLoadFinished: function() {
                        console.log('Data load finished..');
                    },
                    onToolbarActionAdd: function() {
                        console.log('onToolbarActionAdd');
                    },
                    onToolbarActionDel: function() {
                        console.log('onToolbarActionDel');
                    },
                    onCheckboxToggled: function(checked, item) {
                        this.enableDeleteAll = this.$refs.vuetable.selectedTo.length > 0;
                    },
                    onSelectAllToggled: function(checked) {
                        this.enableDeleteAll = checked;
                    }
                }
            };
        };
        */
    /*
    return function(mixin) {
        return {
            'datatable': datatable
        };
    };
    */
});