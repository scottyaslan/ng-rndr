(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrAggregatorsTemplates', [], function() {
            return (root.rndr.templates.aggregators = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.templates.aggregators = factory());
    } else {
        root.rndr.templates.aggregators = factory();
    }
}(this, function() {
    /**
     * A dictionary of functions for creating an aggregator-generating function.
     */
    var $rndrAggregatorsTemplates = new Map();
    /**
     * Creates an aggregator-generating function.
     * 
     * @param  {function} formatter A data formatting function.
     * @return {function}           An aggregator-generating function which returns the formatted count of the number of values observed of the given attribute for records which match the cell.
     */
    $rndrAggregatorsTemplates.set('count', function(formatter) {
        if (formatter == null) {
            var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
            if (typeof console !== 'undefined' && console !== null) {
                console.error(e.stack);
            }
            throw e;
        }
        return function() {
            return function(data, rowKey, colKey) {
                return {
                    count: 0,
                    push: function() {
                        return this.count++;
                    },
                    value: function() {
                        return this.count;
                    },
                    format: formatter
                };
            };
        };
    });
    /**
     * Creates an aggregator-generating function returns the formatted count of the number of unique values observed.
     * 
     * @param  {function} formatter A data formatting function.
     * @return {function}           An aggregator-generating function which returns the formatted count of the number of unique values observed.
     */
    $rndrAggregatorsTemplates.set('countUnique', function(formatter) {
        if (formatter == null) {
            var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
            if (typeof console !== 'undefined' && console !== null) {
                console.error(e.stack);
            }
            throw e;
        }
        return function(arg) {
            var attr;
            attr = arg[0];
            return function(data, rowKey, colKey) {
                return {
                    uniq: [],
                    push: function(record) {
                        var ref;
                        if (ref = record[attr], this.uniq.indexOf(ref) < 0) {
                            return this.uniq.push(record[attr]);
                        }
                    },
                    value: function() {
                        return this.uniq.length;
                    },
                    format: formatter,
                    numInputs: attr != null ? 0 : 1
                };
            };
        };
    });
    /**
     * Creates an aggregator-generating function that returns a list of the unique values observed seperated by the `sep` parameter.
     * 
     * @param  {string} sep The string used to seperate the list.
     * @return {function}     An aggregator-generating function which returns a list of the unique values observed seperated by the `sep` parameter.
     */
    $rndrAggregatorsTemplates.set('listUnique', function(sep) {
        return function(arg) {
            var attr;
            attr = arg[0];
            return function(data, rowKey, colKey) {
                return {
                    uniq: [],
                    push: function(record) {
                        var ref;
                        if (ref = record[attr], this.uniq.indexOf(ref) < 0) {
                            return this.uniq.push(record[attr]);
                        }
                    },
                    value: function() {
                        return this.uniq.join(sep);
                    },
                    format: function(x) {
                        return x;
                    },
                    numInputs: attr != null ? 0 : 1
                };
            };
        };
    });
    /**
     * Creates an aggregator-generating function that returns the formatted sum of the values observed.
     * 
     * @param  {function} formatter A data formatting function.
     * @return {function}           An aggregator-generating function which returns the formatted sum of the values observed.
     */
    $rndrAggregatorsTemplates.set('sum', function(formatter) {
        if (formatter == null) {
            var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
            if (typeof console !== 'undefined' && console !== null) {
                console.error(e.stack);
            }
            throw e;
        }
        return function(arg) {
            var attr;
            attr = arg[0];
            return function(data, rowKey, colKey) {
                return {
                    sum: 0,
                    push: function(record) {
                        if (!isNaN(parseFloat(record[attr]))) {
                            return this.sum += parseFloat(record[attr]);
                        }
                    },
                    value: function() {
                        return this.sum;
                    },
                    format: formatter,
                    numInputs: attr != null ? 0 : 1
                };
            };
        };
    });
    /**
     * Creates an aggregator-generating function that returns the formatted minimum value observed.
     * 
     * @param  {function} formatter A data formatting function.
     * @return {function}           An aggregator-generating function which returns the formatted minimum value observed.
     */
    $rndrAggregatorsTemplates.set('min', function(formatter) {
        if (formatter == null) {
            var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
            if (typeof console !== 'undefined' && console !== null) {
                console.error(e.stack);
            }
            throw e;
        }
        return function(arg) {
            var attr;
            attr = arg[0];
            return function(data, rowKey, colKey) {
                return {
                    val: null,
                    push: function(record) {
                        var ref, x;
                        x = parseFloat(record[attr]);
                        if (!isNaN(x)) {
                            return this.val = Math.min(x, (ref = this.val) != null ? ref : x);
                        }
                    },
                    value: function() {
                        return this.val;
                    },
                    format: formatter,
                    numInputs: attr != null ? 0 : 1
                };
            };
        };
    });
    /**
     * Creates an aggregator-generating function that returns the formatted maximum value observed.
     * 
     * @param  {function} formatter A data formatting function.
     * @return {function}           An aggregator-generating function which returns the formatted maximum value observed.
     */
    $rndrAggregatorsTemplates.set('max', function(formatter) {
        if (formatter == null) {
            var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
            if (typeof console !== 'undefined' && console !== null) {
                console.error(e.stack);
            }
            throw e;
        }
        return function(arg) {
            var attr;
            attr = arg[0];
            return function(data, rowKey, colKey) {
                return {
                    val: null,
                    push: function(record) {
                        var ref, x;
                        x = parseFloat(record[attr]);
                        if (!isNaN(x)) {
                            return this.val = Math.max(x, (ref = this.val) != null ? ref : x);
                        }
                    },
                    value: function() {
                        return this.val;
                    },
                    format: formatter,
                    numInputs: attr != null ? 0 : 1
                };
            };
        };
    });
    /**
     * Creates an aggregator-generating function that returns the formatted average of the values observed.
     * 
     * @param  {function} formatter A data formatting function.
     * @return {function}           An aggregator-generating function which returns the formatted average of the values observed.
     */
    $rndrAggregatorsTemplates.set('average', function(formatter) {
        if (formatter == null) {
            var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
            if (typeof console !== 'undefined' && console !== null) {
                console.error(e.stack);
            }
            throw e;
        }
        return function(arg) {
            var attr;
            attr = arg[0];
            return function(data, rowKey, colKey) {
                return {
                    sum: 0,
                    len: 0,
                    push: function(record) {
                        if (!isNaN(parseFloat(record[attr]))) {
                            this.sum += parseFloat(record[attr]);
                            return this.len++;
                        }
                    },
                    value: function() {
                        return this.sum / this.len;
                    },
                    format: formatter,
                    numInputs: attr != null ? 0 : 1
                };
            };
        };
    });
    /**
     * Creates an aggregator-generating function that returns the formatted quotient of the values observed.
     * 
     * @param  {function} formatter A data formatting function.
     * @return {function}           An aggregator-generating function which returns the formatted quotient of the values observed.
     */
    $rndrAggregatorsTemplates.set('sumOverSum', function(formatter) {
        if (formatter == null) {
            var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
            if (typeof console !== 'undefined' && console !== null) {
                console.error(e.stack);
            }
            throw e;
        }
        return function(arg) {
            var denom, num;
            num = arg[0], denom = arg[1];
            return function(data, rowKey, colKey) {
                return {
                    sumNum: 0,
                    sumDenom: 0,
                    push: function(record) {
                        if (!isNaN(parseFloat(record[num]))) {
                            this.sumNum += parseFloat(record[num]);
                        }
                        if (!isNaN(parseFloat(record[denom]))) {
                            return this.sumDenom += parseFloat(record[denom]);
                        }
                    },
                    value: function() {
                        return this.sumNum / this.sumDenom;
                    },
                    format: formatter,
                    numInputs: (num != null) && (denom != null) ? 0 : 2
                };
            };
        };
    });
    /**
     * Creates an aggregator-generating function that returns the formatted quotient 'upper' or 'lower' 80 bound of the values observed.
     * 
     * @param  {boolean} upper     A boolean to denote whether to calculate 'upper' or 'lower' 80 bound
     * @param  {function} formatter A data formatting function.
     * @return {function}           An aggregator-generating function which returns the formatted quotient 'upper' or 'lower' 80 bound of the values observed.
     */
    $rndrAggregatorsTemplates.set('sumOverSumBound80', function(upper, formatter) {
        if (upper == null) {
            upper = true;
        }
        if (formatter == null) {
            var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
            if (typeof console !== 'undefined' && console !== null) {
                console.error(e.stack);
            }
            throw e;
        }
        return function(arg) {
            var denom, num;
            num = arg[0], denom = arg[1];
            return function(data, rowKey, colKey) {
                return {
                    sumNum: 0,
                    sumDenom: 0,
                    push: function(record) {
                        if (!isNaN(parseFloat(record[num]))) {
                            this.sumNum += parseFloat(record[num]);
                        }
                        if (!isNaN(parseFloat(record[denom]))) {
                            return this.sumDenom += parseFloat(record[denom]);
                        }
                    },
                    value: function() {
                        var sign;
                        sign = upper ? 1 : -1;
                        return (0.821187207574908 / this.sumDenom + this.sumNum / this.sumDenom + 1.2815515655446004 * sign * Math.sqrt(0.410593603787454 / (this.sumDenom * this.sumDenom) + (this.sumNum * (1 - this.sumNum / this.sumDenom)) / (this.sumDenom * this.sumDenom))) / (1 + 1.642374415149816 / this.sumDenom);
                    },
                    format: formatter,
                    numInputs: (num != null) && (denom != null) ? 0 : 2
                };
            };
        };
    });
    /**
     * Creates an aggregator-generating function.
     * 
     * @param  {function} wrapped   An aggregator-generating function.
     * @param  {string} type      The 'comparer' (i.e. 'row', 'col', or 'total') to compare observed values to.
     * @param  {function} formatter A data formatting function.
     * @return {function}           An aggregator-generating function which returns the formatted percentage of the values observed to the 'comparer'.
     */
    $rndrAggregatorsTemplates.set('fractionOf', function(wrapped, type, formatter) {
        if (type == null) {
            type = 'total';
        }
        if (formatter == null) {
            var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
            if (typeof console !== 'undefined' && console !== null) {
                console.error(e.stack);
            }
            throw e;
        }
        return function() {
            var x;
            x = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return function(data, rowKey, colKey) {
                return {
                    selector: {
                        total: [
                            [],
                            []
                        ],
                        row: [rowKey, []],
                        col: [
                            [], colKey
                        ]
                    }[type],
                    inner: wrapped.apply(null, x)(data, rowKey, colKey),
                    push: function(record) {
                        return this.inner.push(record);
                    },
                    format: formatter,
                    value: function() {
                        return this.inner.value() / data.getAggregator.apply(data, this.selector).inner.value();
                    },
                    numInputs: wrapped.apply(null, x)().numInputs
                };
            };
        };
    });
    $rndrAggregatorsTemplates.set('quantile', function(formatter, q) {
        if (formatter == null) {
            formatter = usFmt;
        }
        return function(arg) {
            var attr;
            attr = arg[0];
            return function(data, rowKey, colKey) {
                return {
                    vals: [],
                    push: function(record) {
                        var x;
                        x = parseFloat(record[attr]);
                        if (!isNaN(x)) {
                            return this.vals.push(x);
                        }
                    },
                    value: function() {
                        var i;
                        if (this.vals.length === 0) {
                            return null;
                        }
                        this.vals.sort();
                        i = (this.vals.length - 1) * q;
                        return (this.vals[Math.floor(i)] + this.vals[Math.ceil(i)]) / 2.0;
                    },
                    format: formatter,
                    numInputs: attr != null ? 0 : 1
                };
            };
        };
    });
    $rndrAggregatorsTemplates.set('runningStat', function(formatter, mode, ddof) {
        if (formatter == null) {
            formatter = usFmt;
        }
        if (mode == null) {
            mode = "var";
        }
        if (ddof == null) {
            ddof = 1;
        }
        return function(arg) {
            var attr;
            attr = arg[0];
            return function(data, rowKey, colKey) {
                return {
                    n: 0.0,
                    m: 0.0,
                    s: 0.0,
                    push: function(record) {
                        var m_new, x;
                        x = parseFloat(record[attr]);
                        if (isNaN(x)) {
                            return;
                        }
                        this.n += 1.0;
                        if (this.n === 1.0) {
                            return this.m = x;
                        } else {
                            m_new = this.m + (x - this.m) / this.n;
                            this.s = this.s + (x - this.m) * (x - m_new);
                            return this.m = m_new;
                        }
                    },
                    value: function() {
                        if (this.n <= ddof) {
                            return 0;
                        }
                        switch (mode) {
                            case "var":
                                return this.s / (this.n - ddof);
                            case "stdev":
                                return Math.sqrt(this.s / (this.n - ddof));
                        }
                    },
                    format: formatter,
                    numInputs: attr != null ? 0 : 1
                };
            };
        };
    });

    return $rndrAggregatorsTemplates;
}));