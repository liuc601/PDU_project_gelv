define(function (require) {
    String.prototype.serialize = function()
    {
        var o = this;
        switch(typeof(o))
        {
            case 'object':
                // null
                if( o == null )
                {
                    return 'null';
                }

                // array
                else if( o.length )
                {
                    var i, s = '';

                    for( var i = 0; i < o.length; i++ )
                        s += (s ? ', ' : '') + String.serialize(o[i]);

                    return '[ ' + s + ' ]';
                }

                // object
                else
                {
                    var k, s = '';

                    for( k in o )
                        s += (s ? ', ' : '') + k + ': ' + String.serialize(o[k]);

                    return '{ ' + s + ' }';
                }

                break;

            case 'string':
                // complex string
                if( o.match(/[^a-zA-Z0-9_,.: -]/) )
                    return 'decodeURIComponent("' + encodeURIComponent(o) + '")';

                // simple string
                else
                    return '"' + o + '"';

                break;

            default:
                return o.toString();
        }
    }

    String.prototype.format = function()
    {
        if (!RegExp)
            return;

        var html_esc = [/&/g, '&#38;', /"/g, '&#34;', /'/g, '&#39;', /</g, '&#60;', />/g, '&#62;'];
        var quot_esc = [/"/g, '&#34;', /'/g, '&#39;'];

        function esc(s, r) {
            for( var i = 0; i < r.length; i += 2 )
                s = s.replace(r[i], r[i+1]);
            return s;
        }

        var str = this;
        var out = '';
        var re = /^(([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X|q|h|j|t|m))/;
        var a = b = [], numSubstitutions = 0, numMatches = 0;

        while( a = re.exec(str) )
        {
            var m = a[1];
            var leftpart = a[2], pPad = a[3], pJustify = a[4], pMinLength = a[5];
            var pPrecision = a[6], pType = a[7];

            numMatches++;

            if (pType == '%')
            {
                subst = '%';
            }
            else
            {
                if (numSubstitutions < arguments.length)
                {
                    var param = arguments[numSubstitutions++];

                    var pad = '';
                    if (pPad && pPad.substr(0,1) == "'")
                        pad = leftpart.substr(1,1);
                    else if (pPad)
                        pad = pPad;

                    var justifyRight = true;
                    if (pJustify && pJustify === "-")
                        justifyRight = false;

                    var minLength = -1;
                    if (pMinLength)
                        minLength = parseInt(pMinLength);

                    var precision = -1;
                    if (pPrecision && pType == 'f')
                        precision = parseInt(pPrecision.substring(1));

                    var subst = param;

                    switch(pType)
                    {
                        case 'b':
                            subst = (parseInt(param) || 0).toString(2);
                            break;

                        case 'c':
                            subst = String.fromCharCode(parseInt(param) || 0);
                            break;

                        case 'd':
                            subst = (parseInt(param) || 0);
                            break;

                        case 'u':
                            subst = Math.abs(parseInt(param) || 0);
                            break;

                        case 'f':
                            subst = (precision > -1)
                                ? ((parseFloat(param) || 0.0)).toFixed(precision)
                                : (parseFloat(param) || 0.0);
                            break;

                        case 'o':
                            subst = (parseInt(param) || 0).toString(8);
                            break;

                        case 's':
                            subst = param;
                            break;

                        case 'x':
                            subst = ('' + (parseInt(param) || 0).toString(16)).toLowerCase();
                            break;

                        case 'X':
                            subst = ('' + (parseInt(param) || 0).toString(16)).toUpperCase();
                            break;

                        case 'h':
                            subst = esc(param, html_esc);
                            break;

                        case 'q':
                            subst = esc(param, quot_esc);
                            break;

                        case 'j':
                            subst = String.serialize(param);
                            break;

                        case 't':
                            var td = 0;
                            var th = 0;
                            var tm = 0;
                            var ts = (param || 0);

                            if (ts > 60) {
                                tm = Math.floor(ts / 60);
                                ts = (ts % 60);
                            }

                            if (tm > 60) {
                                th = Math.floor(tm / 60);
                                tm = (tm % 60);
                            }

                            if (th > 24) {
                                td = Math.floor(th / 24);
                                th = (th % 24);
                            }

                            if (td > 0) {
                                subst = String.format('%d天 %d小时 %d分钟 %d秒', td, th, tm, ts);
                            } else if (th > 0) {
                                subst = String.format('%d小时 %d分钟 %d秒', th, tm, ts);
                            } else if (tm > 0) {
                                subst = String.format('%d分钟 %d秒', tm, ts);
                            } else {
                                subst = String.format('%d秒', ts);
                            }
                            break;

                        case 'm':
                            var mf = pMinLength ? parseInt(pMinLength) : 1000;
                            var pr = pPrecision ? Math.floor(10*parseFloat('0'+pPrecision)) : 2;

                            var i = 0;
                            var val = parseFloat(param || 0);
                            var units = [ '', 'K', 'M', 'G', 'T', 'P', 'E' ];

                            for (i = 0; (i < units.length) && (val > mf); i++)
                                val /= mf;

                            subst = val.toFixed(pr) + ' ' + units[i];
                            break;
                    }
                }
            }

            out += leftpart + subst;
            str = str.substr(m.length);
        }

        return out + str;
    };

    String.prototype.nobr = function()
    {
        return this.replace(/[\s\n]+/g, '&#160;');
    };

    String.serialize = function()
    {
        var a = [ ];
        for (var i = 1; i < arguments.length; i++)
            a.push(arguments[i]);
        return ''.serialize.apply(arguments[0], a);
    };

    String.format = function()
    {
        var a = [ ];
        for (var i = 1; i < arguments.length; i++)
            a.push(arguments[i]);
        return ''.format.apply(arguments[0], a);
    };

    String.nobr = function()
    {
        var a = [ ];
        for (var i = 1; i < arguments.length; i++)
            a.push(arguments[i]);
        return ''.nobr.apply(arguments[0], a);
    };
});