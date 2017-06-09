(function(root, factory) {
    if (root.ngRndr === undefined) {
        root.ngRndr = {};
    }
    if (root.ngRndr.templates === undefined) {
        root.ngRndr.templates = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$ngRndrAggregatorsTemplates', [], function() {
            return (root.ngRndr.templates.aggregators = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.ngRndr.templates.aggregators = factory());
    } else {
        root.ngRndr.templates.aggregators = factory();
    }
}(this, function() {
    /**
     * A dictionary of functions for creating an aggregator-generating function.
     */
    function AggregatorTemplates() {}
    AggregatorTemplates.prototype = {
        constructor: AggregatorTemplates,
        /**
         * Creates an aggregator-generating function.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted count of the number of values observed of the given attribute for records which match the cell.
         */
        count: function(formatter) {
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
        },
        /**
         * Creates an aggregator-generating function returns the formatted count of the number of unique values observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted count of the number of unique values observed.
         */
        countUnique: function(formatter) {
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
        },
        /**
         * Creates an aggregator-generating function that returns a list of the unique values observed seperated by the `sep` parameter.
         * 
         * @param  {string} sep The string used to seperate the list.
         * @return {function}     An aggregator-generating function which returns a list of the unique values observed seperated by the `sep` parameter.
         */
        listUnique: function(sep) {
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
        },
        /**
         * Creates an aggregator-generating function that returns the formatted sum of the values observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted sum of the values observed.
         */
        sum: function(formatter) {
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
        },
        /**
         * Creates an aggregator-generating function that returns the formatted minimum value observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted minimum value observed.
         */
        min: function(formatter) {
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
        },
        /**
         * Creates an aggregator-generating function that returns the formatted maximum value observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted maximum value observed.
         */
        max: function(formatter) {
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
        },
        /**
         * Creates an aggregator-generating function that returns the formatted average of the values observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted average of the values observed.
         */
        average: function(formatter) {
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
        },
        /**
         * Creates an aggregator-generating function that returns the formatted quotient of the values observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted quotient of the values observed.
         */
        sumOverSum: function(formatter) {
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
        },
        /**
         * Creates an aggregator-generating function that returns the formatted quotient 'upper' or 'lower' 80 bound of the values observed.
         * 
         * @param  {boolean} upper     A boolean to denote whether to calculate 'upper' or 'lower' 80 bound
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted quotient 'upper' or 'lower' 80 bound of the values observed.
         */
        sumOverSumBound80: function(upper, formatter) {
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
        },
        /**
         * Creates an aggregator-generating function.
         * 
         * @param  {function} wrapped   An aggregator-generating function.
         * @param  {string} type      The 'comparer' (i.e. 'row', 'col', or 'total') to compare observed values to.
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted percentage of the values observed to the 'comparer'.
         */
        fractionOf: function(wrapped, type, formatter) {
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
        }
    };

    return new AggregatorTemplates();
}));