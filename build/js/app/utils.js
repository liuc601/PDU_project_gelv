define(['jquery'], function ($) {

    var weekdays = {
            Mon: '星期一',
            Tue: '星期二',
            Wed: '星期三',
            Thu: '星期四',
            Fri: '星期五',
            Sat: '星期六',
            Sun: '星期天'
        },
        months = {
            Jan: '1',
            Feb: '2',
            Mar: '3',
            Apr: '4',
            May: '5',
            Jun: '6',
            Jul: '7',
            Aug: '8',
            Sep: '9',
            Oct: '10',
            Nov: '11',
            Dec: '12'
        };

    function typeIs(obj, type) {
        return (type === "Null" && obj === null) ||
            (type === "Undefined" && obj === void 0) ||
            (type === "Number" && isFinite(obj)) ||
            Object.prototype.toString.call(obj).slice(8, -1) === type;
    }

    return {
        urlParameterGet: function (name, url) {
            if (!url) {
                url = window.location.href;
            }
            var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
            if (!results) {
                return undefined;
            }
            return results[1] || undefined;
        },
        queryStringToObject: function (str) {
            return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
                return n = n.split("="), this[n[0]] = n[1], this
            }.bind({}))[0];
        },
        filterEach: function (filter, handler) {
            if (!filter || typeof handler !== 'function')
                return;

            function _filterEach(filter, depth) {
                if (!filter.filters) {
                    handler('SUB_DETAIL', filter);
                } else {
                    handler('SUB_IN', depth);
                    for (var i = 0; i < filter.filters.length; i++) {
                        handler('SUB_ADD', filter, i);
                        _filterEach(filter.filters[i], depth + 1);
                    }
                    handler('SUB_OUT', depth);
                }
            }

            _filterEach(filter, 0);
        },
        getValueTextPairs: function (pairs, val, defText) {
            defText = defText || '未知';

            for (var i = 0; i < pairs.length; i++) {
                if (pairs[i].value == val) return pairs[i].text;
            }
            return defText;
        },
        classExtend: function (Child, Parent) {
            var F = function () {};

            F.prototype = Parent.prototype;

            Child.prototype = new F();
            Child.prototype.constructor = Child;
            Child.uber = Parent.prototype;
        },
        getInstanceIdentify: function (item, id, addq) {
            if (typeof id === 'string') {
                return item[id];
            } else if (id instanceof Array) {
                var identify = (addq === true) ? '?' : '';

                for (var i = 0; i < id.length; i++) {
                    if (i === 0) {
                        identify += id[i] + '=' + item[id[i]];
                    } else {
                        identify += '&' + id[i] + '=' + item[id[i]];
                    }
                }
                return identify;
            }
        },
        getInstanceIdentifyVoice: function (item, id, addq) {
            if (typeof id === 'string') {
                return id + '=' + item[id];
            } else if (id instanceof Array) {
                var identify = (addq === true) ? '?' : '';

                for (var i = 0; i < id.length; i++) {
                    if (i === 0) {
                        identify += id[i] + '=' + item[id[i]];
                    } else {
                        identify += '&' + id[i] + '=' + item[id[i]];
                    }
                }
                return identify;
            }
        },
        decodeModelInvalidNumber: function (model, paths, invalid) {
            var value;

            invalid = invalid || 65535;

            for (var i = 0; i < paths.length; i++) {
                value = model.get(paths[i]);

                if (value === undefined || value === invalid) {
                    model.set(paths[i], '');
                }
            }
        },
        encodeModelInvalidNumber: function (model, paths, invalid) {
            var value;

            invalid = invalid || 65535;

            for (var i = 0; i < paths.length; i++) {
                value = model.get(paths[i]);

                if (value === undefined || value === null || value === '') {
                    model.set(paths[i], invalid);
                }
            }
        },
        isIPAddr: function (value) {
            var pattern = new RegExp('^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.' +
                '(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$');

            return pattern.test(value);
        },
        isMACAddr: function (value) {
            var pattern = new RegExp('^[A-Fa-f\\d]{2}:[A-Fa-f\\d]{2}:[A-Fa-f\\d]{2}:' +
                '[A-Fa-f\\d]{2}:[A-Fa-f\\d]{2}:[A-Fa-f\\d]{2}$');

            return pattern.test(value);
        },
        typeIs: typeIs,
        copyAndRemove: function (array, value, key) {
            if (typeIs(array, 'Array')) {
                var result = $.extend([], array, true);

                if (key !== undefined) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i][key] === value) {
                            result.splice(i, 1);
                        }
                    }
                    return result;
                }
            }
        },
        isRoleAdmin: function (role) {
            return role === 0;
        },
        roles: [{
                value: 0,
                text: '管理员'
            },
            {
                value: 1000,
                text: '普通用户'
            }
        ],
        XHRServerErrorLoginExpire: function (jqXHR) {
            if (jqXHR && jqXHR.responseText) {
                try {
                    var error = eval('(' + jqXHR.responseText + ')');

                    if (error && error.error === 10403 && error.info === 'User Not Login') {
                        return 'LOGIN_EXPIRE';
                    }
                } catch (error) {

                }
            }
        },
        deviceTimeFormat: function (time) {
            if (typeof time === 'string') {
                var timeFields = time.replace(/\s{2,}/, ' ').split(' ');
                // Thu Sep 8 04:00:32 2016
                if (timeFields && timeFields.length === 5) {
                    timeFields[0] = weekdays[timeFields[0]];
                    timeFields[1] = months[timeFields[1]];
                    time = timeFields[4] + '/' + timeFields[1] + '/' +
                        timeFields[2] + ' ' + timeFields[3] + ' ' + timeFields[0];
                }
            }

            return time;
        },
        extend: function (Child, Parent) {
            var F = function () {};　　　　
            F.prototype = Parent.prototype;　　　　
            Child.prototype = new F();　　　　
            Child.prototype.constructor = Child;　　　　
            Child.uber = Parent.prototype;　　
        }
    }
});