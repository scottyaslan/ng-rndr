/**
 * The `PivotData` Object factory
 * 
 * The `PivotData` is one type of `dataView` object factory that ships with rndr 
 * and may be passed into any `PivotData` compatable `renderer` plugin. It 
 * essentially wraps a tree of aggregator objects and provides some accessors to list 
 * all the `rowKey` and `colKey` values in the tree, and some other information useful 
 * to generate views of data.
 */
(function(root, factory) {
    if (root.rndr === undefined) {
        root.rndr = {};
    }
    if (root.rndr.plugins === undefined) {
        root.rndr.plugins = {};
    }
    if (root.rndr.plugins.pivotData === undefined) {
        root.rndr.plugins.pivotData = {};
    }
    if (root.rndr.plugins.pivotData.dataView === undefined) {
        root.rndr.plugins.pivotData.dataView = {};
    }
    if (typeof define === 'function' && define.amd) {
        define(['jquery', '$rndrDataViews'], function($, $rndrDataViews) {
            return (root.rndr.plugins.pivotData.dataView = factory($, $rndrDataViews));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.pivotData.dataView = factory(require('jquery'), require('$rndrDataViews')));
    } else {
        root.rndr.plugins.pivotData.dataView = factory(root.$, root.rndr.plugins.dataViews);
    }
}(this, function($, $rndrDataViews) {
    var naturalSort = function(as, bs) {
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
    };

    function PivotData(data, opts) {
        //Prep the data
        this.data = this.convertToArray(data);

        // set meta from previous state or initialize
        this.meta = opts.meta || {
            rows: [],
            cols: [],
            hiddenAttributes: [],
            attributeFilterExclusions: {}
        };

        // initialize properties
        this.aggregator = opts.aggregator.aggregate(opts.aggregator.aggInputAttributeName);
        this.sorters = opts.sorters;
        this.attributeFilterInclusions = [];
        this.attributesAvailableForRowsAndCols = [];
        this.tree = {};
        this.rowKeys = [];
        this.colKeys = [];
        this.rowTotals = {};
        this.colTotals = {};
        this.axisValues = {};
        this.allTotal = this.aggregator(this, [], []);
        this.colAttrs = this.meta.cols;
        this.rowAttrs = this.meta.rows;
        this.availableAttributes = this.rowAttrs.concat(this.colAttrs);

        //determine the tblCols
        this.tblCols = (function(self) {
            var ref, results;
            ref = self.data[0];
            results = [];
            for (var k in ref) {
                if (!ref.hasOwnProperty(k)) continue;
                results.push(k);
            }
            return results;
        })(this);

        // initialize the axisValues
        for (var l = 0, len1 = this.tblCols.length; l < len1; l++) {
            var x = this.tblCols[l];
            this.axisValues[x] = {};
        }

        // determine showAttributes
        this.shownAttributes = [];
        this.shownAttributes = (function(self) {
            var len2, n, results;
            results = [];
            for (var n = 0, len2 = self.tblCols.length; n < len2; n++) {
                var c = self.tblCols[n];
                if (self.meta.hiddenAttributes.indexOf(c) < 0) {
                    results.push(c);
                }
            }
            return results;
        })(this);

        // store the inactive attributes
        this.attributesAvailableForRowsAndCols = $(this.shownAttributes).not(this.meta.rows).not(this.meta.cols).get();

        // construct axisValues and process records (for shown/non-hidden attributes)
        this.forEachRecord(this.data, opts.derivedAttributes, (function(self) {
            return function(record) {
                var base, results, v;
                results = [];
                for (var k in record) {
                    if (!record.hasOwnProperty(k)) continue;
                    v = record[k];
                    if (v == null) {
                        v = 'null';
                    }
                    if ((base = self.axisValues[k])[v] == null) {
                        base[v] = 0;
                    }
                    results.push(self.axisValues[k][v]++);
                }
                if (self.filter(record)) {
                    self.processRecord(record);
                }
            };
        })(this));

        this.dirty = false;
    }
    PivotData.prototype = {
        constructor: PivotData,
        arrSort: function(attrs) {
            var a, sortersArr;
            sortersArr = (function() {
                var l, len1, results;
                results = [];
                for (l = 0, len1 = attrs.length; l < len1; l++) {
                    a = attrs[l];
                    results.push(this.getSort(this.sorters, a));
                }
                return results;
            }).call(this);
            return function(a, b) {
                var comparison, i, sorter;
                for (i in sortersArr) {
                    sorter = sortersArr[i];
                    comparison = sorter(a[i], b[i]);
                    if (comparison !== 0) {
                        return comparison;
                    }
                }
                return 0;
            };
        },
        sortKeys: function() {
            this.rowKeys.sort(this.arrSort(this.rowAttrs));
            this.colKeys.sort(this.arrSort(this.colAttrs));
        },
        getColKeys: function() {
            this.sortKeys();
            return this.colKeys;
        },
        getRowKeys: function() {
            this.sortKeys();
            return this.rowKeys;
        },
        filter: function(record) {
            var excludedItems, ref7;
            for (var k in this.meta.attributeFilterExclusions) {
                excludedItems = this.meta.attributeFilterExclusions[k];
                if (ref7 = '' + record[k], excludedItems.indexOf(ref7) >= 0) {
                    return false;
                }
            }
            return true;
        },
        processRecord: function(record) {
            var colKey, flatColKey, flatRowKey, l, len1, len2, n, ref, ref1, ref2, ref3, rowKey, x;
            colKey = [];
            rowKey = [];
            ref = this.colAttrs;
            for (l = 0, len1 = ref.length; l < len1; l++) {
                x = ref[l];
                colKey.push((ref1 = record[x]) != null ? ref1 : 'null');
            }
            ref2 = this.rowAttrs;
            for (n = 0, len2 = ref2.length; n < len2; n++) {
                x = ref2[n];
                rowKey.push((ref3 = record[x]) != null ? ref3 : 'null');
            }
            flatRowKey = rowKey.join(String.fromCharCode(0));
            flatColKey = colKey.join(String.fromCharCode(0));
            this.allTotal.push(record);
            if (rowKey.length !== 0) {
                if (!this.rowTotals[flatRowKey]) {
                    this.rowKeys.push(rowKey);
                    this.rowTotals[flatRowKey] = this.aggregator(this, rowKey, []);
                }
                this.rowTotals[flatRowKey].push(record);
            }
            if (colKey.length !== 0) {
                if (!this.colTotals[flatColKey]) {
                    this.colKeys.push(colKey);
                    this.colTotals[flatColKey] = this.aggregator(this, [], colKey);
                }
                this.colTotals[flatColKey].push(record);
            }
            if (colKey.length !== 0 && rowKey.length !== 0) {
                if (!this.tree[flatRowKey]) {
                    this.tree[flatRowKey] = {};
                }
                if (!this.tree[flatRowKey][flatColKey]) {
                    this.tree[flatRowKey][flatColKey] = this.aggregator(this, rowKey, colKey);
                }
                return this.tree[flatRowKey][flatColKey].push(record);
            }
        },
        getAggregator: function(rowKey, colKey) {
            var agg, flatColKey, flatRowKey;
            flatRowKey = rowKey.join(String.fromCharCode(0));
            flatColKey = colKey.join(String.fromCharCode(0));
            if (rowKey.length === 0 && colKey.length === 0) {
                agg = this.allTotal;
            } else if (rowKey.length === 0) {
                agg = this.colTotals[flatColKey];
            } else if (colKey.length === 0) {
                agg = this.rowTotals[flatRowKey];
            } else {
                agg = this.tree[flatRowKey][flatColKey];
            }
            return agg != null ? agg : {
                value: (function() {
                    return null;
                }),
                format: function() {
                    return '';
                }
            };
        },
        addExclusionFilter: function(attributeFilterName, filterByAttributeValue) {
            var self = this;
            if (self.meta.attributeFilterExclusions[attributeFilterName] !== undefined) {
                var index = self.meta.attributeFilterExclusions[attributeFilterName].indexOf(filterByAttributeValue);
                if (index < 0) {
                    self.meta.attributeFilterExclusions[attributeFilterName].push(filterByAttributeValue);
                } else {
                   self.removeExclusionFilter(attributeFilterName, filterByAttributeValue);
                }
            } else {
                self.meta.attributeFilterExclusions[attributeFilterName] = [];
                self.meta.attributeFilterExclusions[attributeFilterName].push(filterByAttributeValue);
            }

            self.dirty = true;
        },
        removeExclusionFilter: function(attributeFilterName, filterByAttributeValue) {
            var self = this;
            if (self.meta.attributeFilterExclusions[attributeFilterName] !== undefined) {
                var index = self.meta.attributeFilterExclusions[attributeFilterName].indexOf(filterByAttributeValue);
                if (index >= 0) {
                    self.meta.attributeFilterExclusions[attributeFilterName].splice(index, 1);
                }
            }

            self.dirty = true;
        },
        resetExclusionFilter: function(attributeFilterName) {
            var self = this;
            if (self.meta.attributeFilterExclusions[attributeFilterName] !== undefined) {
                self.meta.attributeFilterExclusions[attributeFilterName] = [];
            } else {
                self.meta.attributeFilterExclusions = [];
            }

            self.dirty = true;
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
                        if (!input.hasOwnProperty(i)) continue;
                        compactRecord = input[i];
                        if (!(i > 0)) {
                            continue;
                        }
                        record = {};
                        ref = input[0];
                        for (j in ref) {
                            if (!ref.hasOwnProperty(j)) continue;
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
        getSort: function(sorters, attr) {
            var sort;
            if (sorters != null) {
                if ($.isFunction(sorters)) {
                    sort = sorters(attr);
                    if ($.isFunction(sort)) {
                        return sort;
                    }
                } else if (sorters[attr] != null) {
                    return sorters[attr];
                }
            }
            return naturalSort;
        }
    };

    return $rndrDataViews.add('PivotData', PivotData);
}));
