define('render/directives/renderingEngineDirective',[], function() {
    'use strict';

    return function() {
        return {
            restrict: 'E',
            scope: {
                'engine': '=',
                'input': '='
            },
            link: {
                pre: function(scope, element, attr) {
                    scope.engine.element = $(element);
                    scope.engine.draw(scope.input);
                }
            }
        };
    }
});
define('render/services/aggregators',[], function() {
    'use strict';

    return function(aggregatorTemplates, dataUtils) {
        function Aggregators() {
            this.availableAggregators;
            this.availableAggregatorNames;
            this.availableAggregatorOptions;
            this.aggregatorTemplates;
            this.init();
        }
        Aggregators.prototype = {
            constructor: Aggregators,
            init: function() {
                var self = this;
                self.availableAggregators = {};
                self.availableAggregatorNames = Object.keys(self.availableAggregators);
                self.aggregatorTemplates = aggregatorTemplates;
                self.addAggregator('Count', self.aggregatorTemplates.count(dataUtils.usFmtInt()));
                self.addAggregator('Count Unique Values', self.aggregatorTemplates.countUnique(dataUtils.usFmtInt()));
                self.addAggregator('List Unique Values', self.aggregatorTemplates.listUnique(', '));
                self.addAggregator('Sum', self.aggregatorTemplates.sum(dataUtils.usFmt()));
                self.addAggregator('Integer Sum', self.aggregatorTemplates.sum(dataUtils.usFmtInt()));
                self.addAggregator('Average', self.aggregatorTemplates.average(dataUtils.usFmt()));
                self.addAggregator('Minimum', self.aggregatorTemplates.min(dataUtils.usFmt()));
                self.addAggregator('Maximum', self.aggregatorTemplates.max(dataUtils.usFmt()));
                self.addAggregator('Sum over Sum', self.aggregatorTemplates.sumOverSum(dataUtils.usFmt()));
                self.addAggregator('80% Upper Bound', self.aggregatorTemplates.sumOverSumBound80(true, dataUtils.usFmt()));
                self.addAggregator('80% Lower Bound', self.aggregatorTemplates.sumOverSumBound80(false, dataUtils.usFmt()));
                self.addAggregator('Sum as Fraction of Total', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'total', dataUtils.usFmtPct()));
                self.addAggregator('Sum as Fraction of Rows', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'row', dataUtils.usFmtPct()));
                self.addAggregator('Sum as Fraction of Columns', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'col', dataUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Total', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'total', dataUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Rows', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'row', dataUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Columns', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'col', dataUtils.usFmtPct()));
            },
            addAggregator: function(AggregatorName, Aggregator){
                var self = this;
                self.availableAggregators[AggregatorName] = Aggregator;
                self.availableAggregatorNames = Object.keys(self.availableAggregators);
            }
        };
        
        return new Aggregators();
    }
});
define('render/services/aggregatorTemplates',[], function() {
    'use strict';

    return function(dataUtils) {
        function AggregatorTemplates() {
        }
        AggregatorTemplates.prototype = {
            constructor: AggregatorTemplates,
            count: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmtInt;
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
            countUnique: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmtInt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            uniq: [],
                            push: function(record) {
                                var ref;
                                if (ref = record[attr], indexOf.call(this.uniq, ref) < 0) {
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
            listUnique: function(sep) {
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            uniq: [],
                            push: function(record) {
                                var ref;
                                if (ref = record[attr], indexOf.call(this.uniq, ref) < 0) {
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
            sum: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
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
            min: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
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
            max: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
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
            average: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
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
            sumOverSum: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
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
            sumOverSumBound80: function(upper, formatter) {
                if (upper == null) {
                    upper = true;
                }
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
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
            fractionOf: function(wrapped, type, formatter) {
                if (type == null) {
                    type = 'total';
                }
                if (formatter == null) {
                    formatter = dataUtils.usFmtPct;
                }
                return function() {
                    var x;
                    x = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                    return function(data, rowKey, colKey) {
                        return {
                            selector: {
                                total: [[], []],
                                row: [rowKey, []],
                                col: [[], colKey]
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
    }
});
define('render/services/PivotDataFactory',[], function() {
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
define('render/services/renderers',[], 
    function() {
    'use strict';

    return function() {
        function Renderers() {
            this.availableRenderers;
            this.availableRendererNames;
            this.availableRendererOptions;
            this.init();
        }
        Renderers.prototype = {
            constructor: Renderers,
            init: function() {
                var self = this;
                self.availableRenderers = {}; 
                self.availableRendererNames = [];
                self.availableRendererOptions = {};
            },
            addRenderers: function(renderers){
                var self = this;
                $.extend(self.availableRenderers, renderers);
                self.availableRendererNames = Object.keys(self.availableRenderers);
            },
            setRendererOptions: function(properyName, config) {
                var self = this;
                self.availableRendererOptions[properyName] = config;
            }
        };
        
        return new Renderers();
    }
});
define('render/services/RenderingEngine',[], function() {
    'use strict';

    return function(aggregators, dataUtils, renderers, PivotDataFactory, $q, $timeout, $window, $rootScope) {
        function RenderingEngine() {
            this.id;
            this.element;
            this.disabled;
            this.title;
            this.rendererName;
            this.aggregatorName;
            this.aggInputAttributeName;
            this.numInputsToProcess;
            this.axisValues;
            this.shownAttributes;
            this.availableAttributes;
            this.tblCols;
            this.cols;
            this.rows;
            this.attributesAvailableForRowsAndCols;
            this.attributeFilterExclusions;
            this.attributeFilterInclusions;
            this.tile;
        }
        RenderingEngine.prototype = {
            constructor: RenderingEngine,
            init: function(dataSourceConfigId, renderingEngineId) {
                var self = this;
                if(renderingEngineId === undefined || renderingEngineId === ''){
                    self.id = dataUtils.generateUUID();
                } else {
                    self.id = renderingEngineId;
                }
                self.dataSourceConfigId = dataSourceConfigId;
                self.title = "Untitiled";
                self.rendererName = "Table";
                self.aggregatorName = "Count";
                self.aggInputAttributeName = [];
                self.numInputsToProcess = [];
                self.axisValues = {};
                self.shownAttributes = [];
                self.availableAttributes = [];
                self.tblCols = [];
                self.cols = [];
                self.rows = [];
                self.attributesAvailableForRowsAndCols = [];
                self.attributeFilterExclusions = {};
                self.attributeFilterInclusions = {};
            },
            setRendererName: function(rendererName, data) {
                var self = this;
                self.rendererName = rendererName;
                self.draw(data);
            },
            setNumberOfAggregateInputs: function (){
                var self = this;
                var numInputs;
                try {
                    numInputs = aggregators.availableAggregators[self.aggregatorName]([])().numInputs;
                } catch(_error) {
                    //Log error and do nothing...we just needed to know how many inputs we need to collect
                    e = _error;
                    if (typeof console !== "undefined" && console !== null) {
                        console.error(e.stack);
                    }
                }
                if(numInputs === undefined) {
                    self.numInputsToProcess = new Array();
                    self.aggInputAttributeName = new Array();
                } else {
                    self.numInputsToProcess = new Array(numInputs);
                    if(self.aggInputAttributeName.length !== numInputs) {
                        self.aggInputAttributeName = new Array(numInputs);
                    }
                }
            },
            setAggregatorName: function(aggregatorName) {
                var self = this;
                self.aggregatorName = aggregatorName;
            },
            isExcluded: function(property, key) {
                var self = this;
                if(self.attributeFilterExclusions[property] !== undefined) {
                    if(self.attributeFilterExclusions[property].indexOf(key) >= 0){
                        return false;
                    } else {
                        return true;    
                    }
                }
                return true;
            },
            addExclusionFilter: function(attributeFilterName, filterByAttributeValue) {
                var self = this;
                if(self.attributeFilterExclusions[attributeFilterName] !== undefined) {
                    var index = this.attributeFilterExclusions[attributeFilterName].indexOf(filterByAttributeValue);
                    if(index >= 0) {
                        self.attributeFilterExclusions[attributeFilterName].splice(index, 1);
                    } else {
                        self.attributeFilterExclusions[attributeFilterName].push(filterByAttributeValue);
                    }
                } else {
                    self.attributeFilterExclusions[attributeFilterName] = [];
                    self.attributeFilterExclusions[attributeFilterName].push(filterByAttributeValue);
                } 
                self.attributeFilterInclusions[attributeFilterName] = [];
                angular.forEach(self.axisValues[attributeFilterName], function(value, key) {
                    if(self.attributeFilterExclusions[attributeFilterName].indexOf(key) < 0) {
                        self.attributeFilterInclusions[attributeFilterName].push(key);
                    }
                });
            },
            addInclusionFilter: function(attributeFilterName, filterByAttributeValue) {
                var self = this;
                self.attributeFilterInclusions[attributeFilterName] = [];
                self.attributeFilterExclusions[attributeFilterName] = [];
                self.addExclusionFilter(attributeFilterName, filterByAttributeValue);
                var oldAttributeFilterInclusions = self.attributeFilterInclusions[attributeFilterName];
                self.attributeFilterInclusions[attributeFilterName] = self.attributeFilterExclusions[attributeFilterName];
                self.attributeFilterExclusions[attributeFilterName] = oldAttributeFilterInclusions;
            },

            /*
             * @param {string} [table]
             *    A plain JSON-serialized string of the data.
             */
            draw: function(data) {
                var self = this;
                var deferred = $q.defer();
                $rootScope.$emit('RenderingEngine:draw:begin');
                $timeout(function(data) {
                    //Set the RenderingEngine id, # rows, and #cols for access in renderer
                    renderers.availableRendererOptions['renderingEngineId'] = self.id;
                    renderers.availableRendererOptions['numRows'] = self.rows.length;
                    renderers.availableRendererOptions['numCols'] = self.cols.length;
                    //Set the height and width for each renderer option to fit into container
                    angular.forEach(renderers.availableRendererOptions, function(value, key) {
                        switch (key){
                            case "datatables":
                                value.height = (self.element.parent().parent().innerHeight() - 24 - 40 - 31 - 31 - 22 - ((self.cols.length + 1)*30)) + 'px'; //height - header - buttons - table head - table foot - bottom message - # of cols
                                value.width = self.element.parent().parent().innerWidth();
                                break;
                            case "gchart":
                                value.height = self.element.parent().parent().innerHeight() - 24 - 10;//height - header - title?
                                value.width = self.element.parent().parent().innerWidth();
                                break;
                            case "c3":
                                value.size.height = self.element.parent().parent().innerHeight() - 24 - 10;//height - header - title?
                                value.size.width = self.element.parent().parent().innerWidth();
                                break;
                            case "d3":
                                value.height = function(){ return self.element.parent().parent().innerHeight();};//height is ignored for d3???
                                value.width = function(){ return self.element.parent().parent().innerWidth() - 16;};//d3 draws a little too wide???
                                break;
                            default:
                                //do nothing
                        }
                                
                    });
                    if(data !== undefined){
                        data = dataUtils.convertToArray(data);
                    } else {
                        data = [];
                    }
                    if(data !== undefined){
                        if(data.length > 0){
                            self.availableAttributes = self.rows.concat(self.cols);
                            var opts = {
                                cols: self.cols,
                                rows: self.rows,
                                vals: self.aggInputAttributeName,
                                hiddenAttributes: [],
                                filter: function(record) {
                                    var excludedItems, ref7;
                                    for (var k in self.attributeFilterExclusions) {
                                        excludedItems = self.attributeFilterExclusions[k];
                                        if (ref7 = "" + record[k], dataUtils.indexOf.call(excludedItems, ref7) >= 0) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                aggregator: aggregators.availableAggregators[self.aggregatorName](self.aggInputAttributeName),
                                aggregatorName: self.aggregatorName,
                                sorters: function() {},
                                derivedAttributes: {}
                            };
                            self.tblCols = [];
                            self.tblCols = (function() {
                                var ref, results;
                                ref = data[0];
                                results = [];
                                for (var k in ref) {
                                    if (!dataUtils.hasProp.call(ref, k)) continue;
                                    results.push(k);
                                }
                                return results;
                            })();
                            self.axisValues = {};
                            for (var l = 0, len1 = self.tblCols.length; l < len1; l++) {
                                var x = self.tblCols[l];
                                self.axisValues[x] = {};
                            }
                            dataUtils.forEachRecord(data, opts.derivedAttributes, function(record) {
                                var base, results, v;
                                results = [];
                                for (var k in record) {
                                    if (!dataUtils.hasProp.call(record, k)) continue;
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
                            self.shownAttributes = [];
                            self.shownAttributes = (function() {
                                var len2, n, results;
                                results = [];
                                for (var n = 0, len2 = self.tblCols.length; n < len2; n++) {
                                    var c = self.tblCols[n];
                                    if (dataUtils.indexOf.call(opts.hiddenAttributes, c) < 0) {
                                        results.push(c);
                                    }
                                }
                                return results;
                            })();
                            if(self.attributesAvailableForRowsAndCols.length + self.rows.length + self.cols.length !== self.shownAttributes.length) {
                                self.attributesAvailableForRowsAndCols = self.shownAttributes;
                            }
                            var result = null;
                            var DataView = null;
                            try {
                                DataView = new PivotDataFactory();
                                DataView.init(data, opts);
                                try {
                                    result = renderers.availableRenderers[self.rendererName](DataView, renderers.availableRendererOptions);
                                } catch (_error) {
                                    e = _error;
                                    if (typeof console !== "undefined" && console !== null) {
                                        console.error(e.stack);
                                    }
                                    result = $("<span>").html(opts.localeStrings.renderError);
                                }
                            } catch (_error) {
                                e = _error;
                                if (typeof console !== "undefined" && console !== null) {
                                    console.error(e.stack);
                                }
                                result = $("<span>").html(opts.localeStrings.computeError);
                            }
                            //Remove old viz
                            self.element.empty();
                            //append the new viz
                            self.element.append(result.html);
                            $rootScope.$emit('RenderingEngine:draw:complete');
                            //run any post render functions defined by visual
                            if(result.postRenderFunction){
                                result.postRenderFunction(result.html, result.postRenderOpts);
                            }
                        }
                    }
                    deferred.resolve();
                }, 1500, true, data);
                return deferred.promise;
            }
        };
        return RenderingEngine;
    }
});
define('render/services/renderingEngineManager',[], function() {
    'use strict';

    return function(RenderingEngine, dataSourceConfigurationManager, dataSourceManager, $http) {
        function RenderingEngineManager() {
            this.init();
        }
        RenderingEngineManager.prototype = {
            constructor: RenderingEngineManager,
            init: function(){
                var self = this;
                self.renderingEngines = {};
                self.activeRenderingEngine = undefined;
            },
            create: function(dataSourceConfigurationId, renderingEngineId) {
                var self = this;
                var renderingEngine = new RenderingEngine();
                renderingEngine.init(dataSourceConfigurationId, renderingEngineId);
                self.add(renderingEngine);
                //There may be an active rendering engine, if so deactivate
                if(self.activeRenderingEngine !== undefined){
                    self.renderingEngines[self.activeRenderingEngine].active = false;
                }
                self.activeRenderingEngine = renderingEngine.id;
                return renderingEngine;
            },
            size: function() {
                return Object.keys(this.renderingEngines).length;
            },
            add: function(renderingEngine){
                var self = this;
                self.renderingEngines[renderingEngine.id] = renderingEngine;
            },
            delete: function(id){
                var self = this;
                delete self.renderingEngines[id];
            },
            setActiveRenderingEngine: function(id){
                var self = this;
                self.activeRenderingEngine = id;
                angular.forEach(self.renderingEngines, function(renderingEngine) {
                    renderingEngine.active = false;
                    if(renderingEngine.id === id){
                        renderingEngine.active = true;
                    }
                });
            },
            updateAllRenderingEngineTileSizeAndPosition: function($widgets){
                var self = this;
                angular.forEach($widgets, function($widget){
                    self.renderingEngines[$widget.id].updateTile($($widget).attr('data-sizex'), $($widget).attr('data-sizey'), $($widget).attr('data-col'), $($widget).attr('data-row'))
                });
            }
        };

        return new RenderingEngineManager();
    }
});
define('render/services/dataUtils',[], function() {
    'use strict';

    return function() {
        function DataUtils() {
        }
        DataUtils.prototype = {
            constructor: DataUtils,
            hasProp: {}.hasOwnProperty,
            indexOf: [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
            generateUUID: function(){
                return  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
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
            bind: function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
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
            usFmtPct:  function() {
                var self = this;
                return self.numberFormat({
                    digitsAfterDecimal: 1,
                    scaler: 100,
                    suffix: '%'
                });
            }
        };

        return new DataUtils();
    }
});
define('render/services/DataSourceConfiguration',[], function() {
    'use strict';

    return function(dataUtils) {
        function DataSourceConfiguration(name) {
            this.id;
            this.flattenDataFunctionString;
            this.httpConfig;
            this.name = name;
        }
        DataSourceConfiguration.prototype = {
            constructor: DataSourceConfiguration,
            init: function() {
                var self = this;
                self.id = dataUtils.generateUUID();
                self.httpConfig = angular.toJson({
                    method: 'GET',
                    url: 'http://nicolas.kruchten.com/pivottable/examples/montreal_2014.csv'
                });
                self.flattenDataFunctionString = 'return data;';
            }
        };
        return DataSourceConfiguration;
    }
});
define('render/services/dataSourceConfigurationManager',[], function() {
    'use strict';

    return function(DataSourceConfiguration) {
        function DataSourceConfigurationManager() {
            this.init();
        }
        DataSourceConfigurationManager.prototype = {
            constructor: DataSourceConfigurationManager,
            init: function() {
                var self = this;
                self.dataSourceConfigurations = {};
                self.activeDataSourceConfiguration = undefined;
            },
            create: function(name) {
                var self = this;
                var dataSourceConfiguration = new DataSourceConfiguration(name);
                dataSourceConfiguration.init();
                self.add(dataSourceConfiguration);
                self.activeDataSourceConfiguration = dataSourceConfiguration.id;
                return dataSourceConfiguration.id;
            },
            add: function(dataSourceConfiguration){
                var self = this;
                self.dataSourceConfigurations[dataSourceConfiguration.id] = dataSourceConfiguration;
            },
            delete: function(id){
                var self = this;
                delete self.dataSourceConfigurations[id];
            },
            dataSourceConfigurationsDefined: function(){
                var self = this;
                return Object.keys(self.dataSourceConfigurations).length !== 0;
            }
        };

        return new DataSourceConfigurationManager();
    }
});
define('render/services/DataSource',[], function() {
    'use strict';

    return function(dataSourceConfigurationManager, $q, $rootScope, $http) {
        function DataSource(dataSourceConfigId, name) {
            this.dataSourceConfigId = dataSourceConfigId;
            this.data;
            this.name = name;
            this.formattedData;
        }
        DataSource.prototype = {
            constructor: DataSource,
            refresh: function(id){
                var promises = [this.acquire(this)];
                $q.all(promises).then(function() {
                    this.format(this);
                });
            },
            acquire: function() {
                $rootScope.$emit('dataSource:acquire:begin');
                var self = this;
                var deffered = $q.defer();
                $http(angular.fromJson(dataSourceConfigurationManager.dataSourceConfigurations[this.dataSourceConfigId].httpConfig)).then(function successCallback(response) {
                    if(typeof response.data !== "string"){
                      self.data = JSON.stringify(response.data);
                    } else {
                      self.data = response.data;
                    }
                    deffered.resolve();
                    $rootScope.$emit('dataSource:acquire:success');
                }, function errorCallback(response) {
                    deffered.reject();
                    $rootScope.$emit('dataSource:acquire:error');
                });
                return deffered.promise;
            },
            format: function() {
                var flatten = new Function("data", dataSourceConfigurationManager.dataSourceConfigurations[this.dataSourceConfigId].flattenDataFunctionString);
                try{
                    this.formattedData = angular.toJson(flatten(angular.fromJson(this.data)));
                } catch(e){
                    try{
                        this.formattedData = flatten(this.data);
                    } catch(e){
                        //Do nothing
                    }
                }
                try{
                  this.formattedData = angular.fromJson(this.formattedData);
                } catch(e){
                  try{
                    this.formattedData = $.csv.toArrays(this.formattedData);
                  } catch(e){
                    //Do nothing
                  }
                }
            }
        };
        return DataSource;
    }
});
define('render/services/dataSourceManager',[], function() {
    'use strict';

    return function(DataSource) {
        function DataSourceManager() {
            this.init();
        }
        DataSourceManager.prototype = {
            constructor: DataSourceManager,
            init: function(){
                var self = this;
                self.dataSources = {};
            },
            create: function(dataSourceConfigurationId, name) {
                var self = this;
                if(dataSourceConfigurationId !== undefined){
                    var dataSource = new DataSource(dataSourceConfigurationId, name);
                    self.add(dataSource);
                    return dataSource;
                }
            },
            add: function(dataSource){
                var self = this;
                self.dataSources[dataSource.dataSourceConfigId] = dataSource;
            },
            delete: function(dataSourceConfigId){
                var self = this;
                delete self.dataSources[dataSourceConfigId];
            },
            refresh: function(){
                angular.forEach(this.dataSources, function(dataSource) {
                    dataSource.refresh();
                });
            }
        };

        return new DataSourceManager();
    }
});
define('ng-rndr',['render/directives/renderingEngineDirective',
    'render/services/aggregators',
    'render/services/aggregatorTemplates',
    'render/services/PivotDataFactory',
    'render/services/renderers',
    'render/services/RenderingEngine',
    'render/services/renderingEngineManager',
    'render/services/dataUtils',
    'render/services/DataSourceConfiguration',
    'render/services/dataSourceConfigurationManager',
    'render/services/DataSource',
    'render/services/dataSourceManager'], 
function(renderingEngineDirective,
    aggregators,
    aggregatorTemplates,
    PivotDataFactory,
    renderers,
    RenderingEngine,
    renderingEngineManager,
    dataUtils,
    DataSourceConfiguration,
    dataSourceConfigurationManager,
    DataSource,
    dataSourceManager) {

    // Create module
    var app = angular.module('ngRndr', []);

    // Annotate module dependencies
    renderingEngineDirective.$inject=[];
    DataSourceConfiguration.$inject=['dataUtils'];
    dataSourceConfigurationManager.$inject=['DataSourceConfiguration'];
    DataSource.$inject=['dataSourceConfigurationManager', '$q', '$rootScope', '$http'];
    dataSourceManager.$inject=['DataSource'];
    aggregators.$inject=['aggregatorTemplates', 'dataUtils'];
    aggregatorTemplates.$inject=['dataUtils'];
    PivotDataFactory.$inject=['dataUtils'];
    renderers.$inject=[];
    RenderingEngine.$inject=['aggregators', 'dataUtils', 'renderers', 'PivotDataFactory', '$q', '$timeout', '$window', '$rootScope'];
    renderingEngineManager.$inject=['RenderingEngine', 'dataSourceConfigurationManager', 'dataSourceManager', '$http'];
    dataUtils.$inject=[];

    // Module directives
    app.directive('renderingEngineDirective', renderingEngineDirective);

    // Module services
    app.service('DataSourceConfiguration', DataSourceConfiguration);
    app.service('dataSourceConfigurationManager', dataSourceConfigurationManager);
    app.service('DataSource', DataSource);
    app.service('dataSourceManager', dataSourceManager);
    app.service('aggregators', aggregators);
    app.service('aggregatorTemplates', aggregatorTemplates);
    app.service('PivotDataFactory', PivotDataFactory);
    app.service('renderers', renderers);
    app.service('RenderingEngine', RenderingEngine);
    app.service('renderingEngineManager', renderingEngineManager);
    app.service('dataUtils', dataUtils);
});
