(function() {
    var callWithJQuery;

    callWithJQuery = function(factory) {
        if (typeof exports === "object" && typeof module === "object") {
            return factory(require("jquery"));
        } else if (typeof define === "function" && define.amd) {
            return define(["jquery"], factory);
        } else {
            if (window.ngRNDR === undefined) {
                window.ngRNDR = {};
                if (window.ngRNDR.plugins === undefined) {
                    window.ngRNDR.plugins = {};
                    if (window.ngRNDR.plugins.dataViews === undefined) {
                        window.ngRNDR.plugins.dataViews = {};
                    }
                }
            }
            window.ngRNDR.plugins.dataViews = $.extend({}, window.ngRNDR.plugins.dataViews, factory(jQuery, d3));
            return window.ngRNDR.plugins.dataViews;
        }
    };

    callWithJQuery(function($) {
        function PivotData(data, opts) {
            this.dataUtils = opts.dataUtils;
            this.filter = function(record) {
                var excludedItems, ref7;
                for (var k in this.meta.attributeFilterExclusions) {
                    excludedItems = this.meta.attributeFilterExclusions[k];
                    if (ref7 = "" + record[k], this.dataUtils.indexOf.call(excludedItems, ref7) >= 0) {
                        return false;
                    }
                }
                return true;
            };
            this.sorters = function() {};
            this.axisValues = {};

            this.meta = opts.meta;
            this.meta.colAttrs = opts.meta.cols;
            this.meta.rowAttrs = opts.meta.rows;
            this.meta.valAttrs = opts.meta.vals;
            this.meta.sorters = opts.meta.sorters;
            this.meta.tree = {};
            this.meta.rowKeys = [];
            this.meta.colKeys = [];
            this.meta.rowTotals = {};
            this.meta.colTotals = {};
            this.meta.sorted = false;
            this.meta.aggregatorName = opts.aggregator.name;
            this.meta.aggregator = opts.aggregator.aggregate;
            this.meta.allTotal = this.meta.aggregator(this, [], []);

            var self = this;

            //Prep the data
            data = self.dataUtils.convertToArray(data);

            self.meta.availableAttributes = self.meta.rowAttrs.concat(self.meta.colAttrs);
            self.meta.tblCols = (function() {
                var ref, results;
                ref = data[0];
                results = [];
                for (var k in ref) {
                    if (!self.dataUtils.hasProp.call(ref, k)) continue;
                    results.push(k);
                }
                return results;
            })();
            for (var l = 0, len1 = self.meta.tblCols.length; l < len1; l++) {
                var x = self.meta.tblCols[l];
                self.axisValues[x] = {};
            }
            self.meta.shownAttributes = (function() {
                var len2, n, results;
                results = [];
                for (var n = 0, len2 = self.meta.tblCols.length; n < len2; n++) {
                    var c = self.meta.tblCols[n];
                    if (self.dataUtils.indexOf.call(self.meta.hiddenAttributes, c) < 0) {
                        results.push(c);
                    }
                }
                return results;
            })();
            if (self.meta.attributesAvailableForRowsAndCols.length + self.meta.rows.length + self.meta.cols.length !== self.meta.shownAttributes.length) {
                self.meta.attributesAvailableForRowsAndCols = self.meta.shownAttributes;
            }

            self.dataUtils.forEachRecord(data, self.meta.derivedAttributes, function(record) {
                var base, results, v;
                results = [];
                for (var k in record) {
                    if (!self.dataUtils.hasProp.call(record, k)) continue;
                    v = record[k];
                    if (v == null) {
                        v = "null";
                    }
                    if ((base = self.axisValues[k])[v] == null) {
                        base[v] = 0;
                    }
                    results.push(self.axisValues[k][v]++);
                }
                return results;
            });
            self.dataUtils.forEachRecord(data, self.meta.derivedAttributes, (function(_this) {
                return function(record) {
                    if (_this.filter(record)) {
                        return _this.processRecord(record);
                    }
                };
            })(self));
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
                        results.push(this.dataUtils.getSort(this.sorters, a));
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
                if (!this.meta.sorted) {
                    this.meta.sorted = true;
                    this.meta.rowKeys.sort(this.arrSort(this.meta.rowAttrs));
                    this.meta.colKeys.sort(this.arrSort(this.meta.colAttrs));
                }
            },
            getColKeys: function() {
                this.sortKeys();
                return this.meta.colKeys;
            },
            getRowKeys: function() {
                this.sortKeys();
                return this.meta.rowKeys;
            },
            processRecord: function(record) {
                var colKey, flatColKey, flatRowKey, l, len1, len2, n, ref, ref1, ref2, ref3, rowKey, x;
                colKey = [];
                rowKey = [];
                ref = this.meta.colAttrs;
                for (l = 0, len1 = ref.length; l < len1; l++) {
                    x = ref[l];
                    colKey.push((ref1 = record[x]) != null ? ref1 : "null");
                }
                ref2 = this.meta.rowAttrs;
                for (n = 0, len2 = ref2.length; n < len2; n++) {
                    x = ref2[n];
                    rowKey.push((ref3 = record[x]) != null ? ref3 : "null");
                }
                flatRowKey = rowKey.join(String.fromCharCode(0));
                flatColKey = colKey.join(String.fromCharCode(0));
                this.meta.allTotal.push(record);
                if (rowKey.length !== 0) {
                    if (!this.meta.rowTotals[flatRowKey]) {
                        this.meta.rowKeys.push(rowKey);
                        this.meta.rowTotals[flatRowKey] = this.meta.aggregator(this, rowKey, []);
                    }
                    this.meta.rowTotals[flatRowKey].push(record);
                }
                if (colKey.length !== 0) {
                    if (!this.meta.colTotals[flatColKey]) {
                        this.meta.colKeys.push(colKey);
                        this.meta.colTotals[flatColKey] = this.meta.aggregator(this, [], colKey);
                    }
                    this.meta.colTotals[flatColKey].push(record);
                }
                if (colKey.length !== 0 && rowKey.length !== 0) {
                    if (!this.meta.tree[flatRowKey]) {
                        this.meta.tree[flatRowKey] = {};
                    }
                    if (!this.meta.tree[flatRowKey][flatColKey]) {
                        this.meta.tree[flatRowKey][flatColKey] = this.meta.aggregator(this, rowKey, colKey);
                    }
                    return this.meta.tree[flatRowKey][flatColKey].push(record);
                }
            },
            getAggregator: function(rowKey, colKey) {
                var agg, flatColKey, flatRowKey;
                flatRowKey = rowKey.join(String.fromCharCode(0));
                flatColKey = colKey.join(String.fromCharCode(0));
                if (rowKey.length === 0 && colKey.length === 0) {
                    agg = this.meta.allTotal;
                } else if (rowKey.length === 0) {
                    agg = this.meta.colTotals[flatColKey];
                } else if (colKey.length === 0) {
                    agg = this.meta.rowTotals[flatRowKey];
                } else {
                    agg = this.meta.tree[flatRowKey][flatColKey];
                }
                return agg != null ? agg : {
                    value: (function() {
                        return null;
                    }),
                    format: function() {
                        return "";
                    }
                };
            },
            isExcluded: function(property, key) {
                var self = this;
                if (self.meta.attributeFilterExclusions[property] !== undefined) {
                    if (self.meta.attributeFilterExclusions[property].indexOf(key) >= 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
                return true;
            },
            addExclusionFilter: function(attributeFilterName, filterByAttributeValue) {
                var self = this;
                if (self.meta.attributeFilterExclusions[attributeFilterName] !== undefined) {
                    var index = self.meta.attributeFilterExclusions[attributeFilterName].indexOf(filterByAttributeValue);
                    if (index >= 0) {
                        self.meta.attributeFilterExclusions[attributeFilterName].splice(index, 1);
                    } else {
                        self.meta.attributeFilterExclusions[attributeFilterName].push(filterByAttributeValue);
                    }
                } else {
                    self.meta.attributeFilterExclusions[attributeFilterName] = [];
                    self.meta.attributeFilterExclusions[attributeFilterName].push(filterByAttributeValue);
                }
                self.meta.attributeFilterInclusions[attributeFilterName] = [];
                angular.forEach(self.axisValues[attributeFilterName], function(value, key) {
                    if (self.meta.attributeFilterExclusions[attributeFilterName].indexOf(key) < 0) {
                        self.meta.attributeFilterInclusions[attributeFilterName].push(key);
                    }
                });
            },
            addInclusionFilter: function(attributeFilterName, filterByAttributeValue) {
                var self = this;
                self.meta.attributeFilterInclusions[attributeFilterName] = [];
                self.meta.attributeFilterExclusions[attributeFilterName] = [];
                self.addExclusionFilter(attributeFilterName, filterByAttributeValue);
                var oldAttributeFilterInclusions = self.meta.attributeFilterInclusions[attributeFilterName];
                self.meta.attributeFilterInclusions[attributeFilterName] = self.meta.attributeFilterExclusions[attributeFilterName];
                self.meta.attributeFilterExclusions[attributeFilterName] = oldAttributeFilterInclusions;
            }
        };
        return PivotData;
    });

}).call(this);

//# sourceMappingURL=PivotData.js.map
