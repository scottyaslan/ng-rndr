define([], function() {
    'use strict';

    return function (dataUtils) {
        function PivotDataFactory() {
            this.colAttrs;
            this.rowAttrs;
            this.valAttrs;
            this.sorters;
            this.tree;
            this.rowKeys;
            this.colKeys;
            this.rowTotals;
            this.colTotals;
            this.allTotal;
            this.sorted;
            this.aggregatorName;
        }
        PivotDataFactory.prototype = {
            constructor: PivotDataFactory,
            init: function(input, opts) {
                var self = this;
                self.aggregatorName = opts.aggregatorName;
                self.colAttrs = opts.cols;
                self.rowAttrs = opts.rows;
                self.valAttrs = opts.vals;
                self.sorters = opts.sorters;
                self.tree = {};
                self.rowKeys = [];
                self.colKeys = [];
                self.rowTotals = {};
                self.colTotals = {};
                self.allTotal = opts.aggregator(self, [], []);
                self.sorted = false;
                dataUtils.forEachRecord(input, opts.derivedAttributes, (function(_this) {
                    return function(record) {
                        if (opts.filter(record)) {
                            return _this.processRecord(record, opts);
                        }
                    };
                })(self));
            },
            arrSort: function(attrs) {
                var a, sortersArr;
                sortersArr = (function() {
                    var l, len1, results;
                    results = [];
                    for (l = 0, len1 = attrs.length; l < len1; l++) {
                        a = attrs[l];
                        results.push(dataUtils.getSort(this.sorters, a));
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
                if (!this.sorted) {
                    this.sorted = true;
                    this.rowKeys.sort(this.arrSort(this.rowAttrs));
                    return this.colKeys.sort(this.arrSort(this.colAttrs));
                }
            },
            getColKeys: function() {
                this.sortKeys();
                return this.colKeys;
            },
            getRowKeys: function() {
                this.sortKeys();
                return this.rowKeys;
            },
            processRecord: function(record, opts) {
                var colKey, flatColKey, flatRowKey, l, len1, len2, n, ref, ref1, ref2, ref3, rowKey, x;
                colKey = [];
                rowKey = [];
                ref = this.colAttrs;
                for (l = 0, len1 = ref.length; l < len1; l++) {
                    x = ref[l];
                    colKey.push((ref1 = record[x]) != null ? ref1 : "null");
                }
                ref2 = this.rowAttrs;
                for (n = 0, len2 = ref2.length; n < len2; n++) {
                    x = ref2[n];
                    rowKey.push((ref3 = record[x]) != null ? ref3 : "null");
                }
                flatRowKey = rowKey.join(String.fromCharCode(0));
                flatColKey = colKey.join(String.fromCharCode(0));
                this.allTotal.push(record);
                if (rowKey.length !== 0) {
                    if (!this.rowTotals[flatRowKey]) {
                        this.rowKeys.push(rowKey);
                        this.rowTotals[flatRowKey] = opts.aggregator(this, rowKey, []);
                    }
                    this.rowTotals[flatRowKey].push(record);
                }
                if (colKey.length !== 0) {
                    if (!this.colTotals[flatColKey]) {
                        this.colKeys.push(colKey);
                        this.colTotals[flatColKey] = opts.aggregator(this, [], colKey);
                    }
                    this.colTotals[flatColKey].push(record);
                }
                if (colKey.length !== 0 && rowKey.length !== 0) {
                    if (!this.tree[flatRowKey]) {
                        this.tree[flatRowKey] = {};
                    }
                    if (!this.tree[flatRowKey][flatColKey]) {
                        this.tree[flatRowKey][flatColKey] = opts.aggregator(this, rowKey, colKey);
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
                        return "";
                    }
                };
            }
        };
        return PivotDataFactory;
    }
});