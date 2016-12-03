define([], function() {
    'use strict';

    return function() {
        /**
         * {@link DataUtils} constructor.
         */
        function DataUtils() {}
        DataUtils.prototype = {
            /**
             * @typedef DataUtils
             * @type {object}
             */
            constructor: DataUtils,
            hasProp: {}.hasOwnProperty,
            indexOf: [].indexOf || function(item) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (i in this && this[i] === item) return i;
                }
                return -1;
            },
            generateUUID: function() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                })
            },
            convertToArray: function(input) {
                var result;
                var self = this;
                result = [];
                self.forEachRecord(input, {}, function(record) {
                    return result.push(record);
                });
                return result;
            },
            bind: function(fn, me) {
                return function() {
                    return fn.apply(me, arguments);
                };
            },
            zeroPad: function(number) {
              return ("0" + number).substr(-2, 2);
            },
            mthNamesEn: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNamesEn: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            forEachRecord: function(input, derivedAttributes, f) {
                var self = this;
                var addRecord, compactRecord, i, j, k, l, len1, record, ref, results, results1, tblCols;
                if ($.isEmptyObject(derivedAttributes)) {
                    addRecord = f;
                } else {
                    addRecord = function(record) {
                        var k, ref, v;
                        for (k in derivedAttributes) {
                            v = derivedAttributes[k];
                            record[k] = (ref = v(record)) != null ? ref : record[k];
                        }
                        return f(record);
                    };
                }
                if ($.isFunction(input)) {
                    return input(addRecord);
                } else if ($.isArray(input)) {
                    if ($.isArray(input[0])) {
                        results = [];
                        for (i in input) {
                            if (!self.hasProp.call(input, i)) continue;
                            compactRecord = input[i];
                            if (!(i > 0)) {
                                continue;
                            }
                            record = {};
                            ref = input[0];
                            for (j in ref) {
                                if (!self.hasProp.call(ref, j)) continue;
                                k = ref[j];
                                record[k] = compactRecord[j];
                            }
                            results.push(addRecord(record));
                        }
                        return results;
                    } else {
                        results1 = [];
                        for (l = 0, len1 = input.length; l < len1; l++) {
                            record = input[l];
                            results1.push(addRecord(record));
                        }
                        return results1;
                    }
                } else if (input instanceof jQuery) {
                    tblCols = [];
                    $('thead > tr > th', input).each(function(i) {
                        return tblCols.push($(this).text());
                    });
                    return $('tbody > tr', input).each(function(i) {
                        record = {};
                        $('td', this).each(function(j) {
                            return record[tblCols[j]] = $(this).html();
                        });
                        return addRecord(record);
                    });
                } else {
                    throw new Error('unknown input format');
                }
            },
            addSeparators: function(nStr, thousandsSep, decimalSep) {
                var rgx, x, x1, x2;
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? decimalSep + x[1] : '';
                rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + thousandsSep + '$2');
                }
                return x1 + x2;
            },
            numberFormat: function(opts) {
                var self = this;
                var defaults;
                defaults = {
                    digitsAfterDecimal: 2,
                    scaler: 1,
                    thousandsSep: ',',
                    decimalSep: '.',
                    prefix: '',
                    suffix: '',
                    showZero: false
                };
                opts = $.extend(defaults, opts);
                return function(x) {
                    var result;
                    if (isNaN(x) || !isFinite(x)) {
                        return '';
                    }
                    if (x === 0 && !opts.showZero) {
                        return '';
                    }
                    result = self.addSeparators((opts.scaler * x).toFixed(opts.digitsAfterDecimal), opts.thousandsSep, opts.decimalSep);
                    return '' + opts.prefix + result + opts.suffix;
                };
            },
            sortAs: function(order) {
                var self = this;
                var i, mapping, x;
                mapping = {};
                for (i in order) {
                    x = order[i];
                    mapping[x] = i;
                }
                return function(a, b) {
                    if ((mapping[a] != null) && (mapping[b] != null)) {
                        return mapping[a] - mapping[b];
                    } else if (mapping[a] != null) {
                        return -1;
                    } else if (mapping[b] != null) {
                        return 1;
                    } else {
                        return self.naturalSort(a, b);
                    }
                };
            },
            naturalSort: function(as, bs) {
                var a, a1, b, b1, rd, rx, rz;
                rx = /(\d+)|(\D+)/g;
                rd = /\d/;
                rz = /^0/;
                if (typeof as === 'number' || typeof bs === 'number') {
                    if (isNaN(as)) {
                        return 1;
                    }
                    if (isNaN(bs)) {
                        return -1;
                    }
                    return as - bs;
                }
                a = String(as).toLowerCase();
                b = String(bs).toLowerCase();
                if (a === b) {
                    return 0;
                }
                if (!(rd.test(a) && rd.test(b))) {
                    return (a > b ? 1 : -1);
                }
                a = a.match(rx);
                b = b.match(rx);
                while (a.length && b.length) {
                    a1 = a.shift();
                    b1 = b.shift();
                    if (a1 !== b1) {
                        if (rd.test(a1) && rd.test(b1)) {
                            return a1.replace(rz, '.0') - b1.replace(rz, '.0');
                        } else {
                            return (a1 > b1 ? 1 : -1);
                        }
                    }
                }
                return a.length - b.length;
            },
            getSort: function(sorters, attr) {
                var sort;
                var self = this;
                sort = sorters(attr);
                if ($.isFunction(sort)) {
                    return sort;
                } else {
                    return self.naturalSort;
                }
            },
            usFmt: function() {
                var self = this;
                return self.numberFormat();
            },
            usFmtInt: function() {
                var self = this;
                return self.numberFormat({
                    digitsAfterDecimal: 0
                });
            },
            usFmtPct: function() {
                var self = this;
                return self.numberFormat({
                    digitsAfterDecimal: 1,
                    scaler: 100,
                    suffix: '%'
                });
            },
            /**
             * Adds a dataUtil function by `name` for fast lookup.
             * 
             * @param {string} name       The lookup name of the dataUtil function.
             * @param {function} dataUtil The dataUtil function.
             */
            add: function(name, dataUtil) {
                this[name] = dataUtil;
            },
            /**
             * Lists the available dataUtil plugins.
             * 
             * @return {Array.<string>} The lookup names.
             */
            list: function() {
                return Object.keys(this);
            }
        };

        return new DataUtils();
    }
});
