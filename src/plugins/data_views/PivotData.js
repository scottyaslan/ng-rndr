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
            window.ngRNDR.plugins.DataViews['PivotData'] = factory(jQuery, d3);
            return window.ngRNDR.plugins.dataViews;
        }
    };

    callWithJQuery(function($) {
        function PivotData(data, opts) {
            // set meta from rendering engine state
            this.meta = opts.meta;
            this.dataUtils = opts.dataUtils;
            this.aggregator = opts.aggregator;

            //Prep the data
            data = opts.dataUtils.convertToArray(data);

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
            this.sorted = false; //TODO: move this to the PivotData.meta once the sorters have been refactored (like the derivedAttributes???)...right now though we need to sort each time
            this.sorters = function() {};
            this.axisValues = {};
            this.shownAttributes = [];
            this.attributeFilterInclusions = [];
            this.attributesAvailableForRowsAndCols = [];
            this.tree = {};
            this.rowKeys = [];
            this.colKeys = [];
            this.rowTotals = {};
            this.colTotals = {};
            this.allTotal = this.aggregator(this, [], []);

            this.colAttrs = this.meta.cols;
            this.rowAttrs = this.meta.rows;
            this.availableAttributes = this.rowAttrs.concat(this.colAttrs);
            this.tblCols = (function(self) {
                var ref, results;
                ref = data[0];
                results = [];
                for (var k in ref) {
                    if (!self.dataUtils.hasProp.call(ref, k)) continue;
                    results.push(k);
                }
                return results;
            })(this);

            for (var l = 0, len1 = this.tblCols.length; l < len1; l++) {
                var x = this.tblCols[l];
                this.axisValues[x] = {};
            }

            this.shownAttributes = (function(self) {
                var len2, n, results;
                results = [];
                for (var n = 0, len2 = self.tblCols.length; n < len2; n++) {
                    var c = self.tblCols[n];
                    if (self.dataUtils.indexOf.call(self.meta.hiddenAttributes, c) < 0) {
                        results.push(c);
                    }
                }
                return results;
            })(this);

            if (this.attributesAvailableForRowsAndCols.length + this.meta.rows.length + this.meta.cols.length !== this.shownAttributes.length) {
                this.attributesAvailableForRowsAndCols = this.shownAttributes;
            }

            this.dataUtils.forEachRecord(data, opts.derivedAttributes, (function(self) {
                return function(record) {
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
                };
            })(this));
            this.dataUtils.forEachRecord(data, opts.derivedAttributes, (function(self) {
                return function(record) {
                    if (self.filter(record)) {
                        return self.processRecord(record);
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
                if (!this.sorted) {
                    this.sorted = true;
                    this.rowKeys.sort(this.arrSort(this.rowAttrs));
                    this.colKeys.sort(this.arrSort(this.colAttrs));
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
            processRecord: function(record) {
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
                self.attributeFilterInclusions[attributeFilterName] = [];
                angular.forEach(self.axisValues[attributeFilterName], function(value, key) {
                    if (self.meta.attributeFilterExclusions[attributeFilterName].indexOf(key) < 0) {
                        self.attributeFilterInclusions[attributeFilterName].push(key);
                    }
                });
                self.dirty = true;
            },
            addInclusionFilter: function(attributeFilterName, filterByAttributeValue) {
                var self = this;
                self.attributeFilterInclusions[attributeFilterName] = [];
                self.meta.attributeFilterExclusions[attributeFilterName] = [];
                self.addExclusionFilter(attributeFilterName, filterByAttributeValue);
                var oldAttributeFilterInclusions = self.attributeFilterInclusions[attributeFilterName];
                self.attributeFilterInclusions[attributeFilterName] = self.meta.attributeFilterExclusions[attributeFilterName];
                self.meta.attributeFilterExclusions[attributeFilterName] = oldAttributeFilterInclusions;
                self.dirty = true;
            },
            initializeAggregator: function(aggregator) {
                var numInputs = aggregator.aggregate([])([]).numInputs;
                if (numInputs === undefined) {
                    this.meta.aggInputAttributeName = new Array();
                } else {
                    if (this.meta.aggInputAttributeName.length !== numInputs) {
                        this.meta.aggInputAttributeName = new Array(numInputs);
                    }
                }
                this.dirty = true;
            }
        };
        return PivotData;
    });

}).call(this);

//# sourceMappingURL=PivotData.js.map
