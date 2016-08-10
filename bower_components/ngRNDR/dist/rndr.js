define('acquire/directives/acquisitionDirective',[], function() {
    'use strict';

    function acquisitionDirective(AcquisitionController, DataSourceConfigurationManager, DataSourceManager, DataSourceUtils) {
        return {
            restrict: 'E',
            templateUrl:'acquire/views/acquire.html',
            link: function(scope, element, attrs) {
                AcquisitionController.init();
                scope.AcquisitionController = AcquisitionController;
                scope.DataSourceConfigurationManager = DataSourceConfigurationManager;
                scope.DataSourceManager = DataSourceManager;
                scope.DataSourceUtils = DataSourceUtils;
            }
        };
    }

    return acquisitionDirective;
});
define('acquire/services/acquisitionController',[], function() {
    'use strict';

    function AcquisitionController(RenderingEngineFactory, RenderingEngineManager, DataSourceUtils, DataSourceManager, DataSourceConfigurationManager, $rootScope, $window) {
        function AcquisitionController() {
        }
        AcquisitionController.prototype = {
            constructor: AcquisitionController,
            init: function() {
                DataSourceManager.create(DataSourceConfigurationManager.create("Untitled"), "Untitled");
                $rootScope.$on('acquiring data', function(){
                    acquisitionController.dataAcquisitionInProgress = true;
                });
                $rootScope.$on('data acquired', function(){
                    acquisitionController.dataAcquisitionInProgress = false;
                });
                $rootScope.$emit('data source configuration wizard init');
            },
            save: function() {
                var renderingEngine = new RenderingEngineFactory();
                renderingEngine.init(DataSourceConfigurationManager.activeDataSourceConfiguration);
                renderingEngine.active = true;
                RenderingEngineManager.add(renderingEngine);
                //There may be an active rendering engine, if so deactivate
                if(RenderingEngineManager.activeRenderingEngine){
                    RenderingEngineManager.renderingEngines[RenderingEngineManager.activeRenderingEngine].active = false;
                }
                //Set the active rendering engine to this one
                RenderingEngineManager.activeRenderingEngine = renderingEngine.id;
                DataSourceConfigurationManager.activeDataSourceConfiguration = "";
                $rootScope.$emit('data source configuration wizard save');
            },
            cancel: function() {
                DataSourceManager.delete(DataSourceManager.dataSources[DataSourceConfigurationManager.activeDataSourceConfiguration].dataSourceConfigId);
                DataSourceConfigurationManager.delete(DataSourceConfigurationManager.activeDataSourceConfiguration);
                DataSourceConfigurationManager.activeDataSourceConfiguration = "";
                $rootScope.$emit('data source wizard configuration cancel');
            },
            openDocumentation: function(view) {
                $window.open('https://docs.angularjs.org/api/ng/service/$http#usage', '_blank');
            },
            aceLoaded: function(_editor) {
                // Options
                $(_editor.container).height($('#mainContent').height() - 16);
                $(_editor.container).width($('#mainContent').width() - 16);
            },
            aceChanged: function(e) {
                var tmp;
            }
        };
        var acquisitionController = new AcquisitionController();
        return acquisitionController;
    }

    return AcquisitionController;
});
define('acquire/services/dataSourceConfigurationFactory',[], function() {
    'use strict';

    function DataSourceConfigurationFactory() {
        function DataSourceConfigurationFactory(name) {
            this.id;
            this.flattenDataFunctionString;
            this.httpConfig;
            this.name = name;
        }
        DataSourceConfigurationFactory.prototype = {
            constructor: DataSourceConfigurationFactory,
            init: function() {
                var self = this;
                self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
                self.httpConfig = angular.toJson({
                    method: 'GET',
                    url: 'http://nicolas.kruchten.com/pivottable/examples/montreal_2014.csv'
                });
                self.flattenDataFunctionString = 'return data;';
            }
        };
        return DataSourceConfigurationFactory;
    }

    return DataSourceConfigurationFactory;
});
define('acquire/services/dataSourceConfigurationManager',[], function() {
    'use strict';

    function DataSourceConfigurationManager(DataSourceConfigurationFactory) {
        function DataSourceConfigurationManager() {
            this.dataSourceConfigurations = {};
            this.activeDataSourceConfiguration;
        }
        DataSourceConfigurationManager.prototype = {
            constructor: DataSourceConfigurationManager,
            init: function() {},
            create: function(name) {
                var dataSourceConfiguration = new DataSourceConfigurationFactory(name);
                dataSourceConfiguration.init();
                dataSourceConfigurationManager.add(dataSourceConfiguration);
                dataSourceConfigurationManager.activeDataSourceConfiguration = dataSourceConfiguration.id;
                return dataSourceConfiguration.id;
            },
            add: function(dataSourceConfiguration){
                dataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfiguration.id] = dataSourceConfiguration;
            },
            delete: function(id){
                delete dataSourceConfigurationManager.dataSourceConfigurations[id];
            },
            dataSourceConfigurationsDefined: function(){
                return Object.keys(dataSourceConfigurationManager.dataSourceConfigurations).length !== 0;
            }
        };
        var dataSourceConfigurationManager = new DataSourceConfigurationManager();
        dataSourceConfigurationManager.init();
        return dataSourceConfigurationManager;
    }

    return DataSourceConfigurationManager;
});
define('acquire/services/dataSourceFactory',[], function() {
    'use strict';

    function DataSourceFactory() {
        function DataSourceFactory(dataSourceConfigId, name) {
            this.dataSourceConfigId = dataSourceConfigId;
            this.data;
            this.name = name;
            this.formattedData;
        }
        DataSourceFactory.prototype = {
            constructor: DataSourceFactory
        };
        return DataSourceFactory;
    }

    return DataSourceFactory;
});
define('acquire/services/dataSourceManager',[], function() {
    'use strict';

    function DataSourceManager(DataSourceFactory) {
        function DataSourceManager() {
            this.dataSources = {};
        }
        DataSourceManager.prototype = {
            constructor: DataSourceManager,
            init: function(){},
            create: function(dataSourceConfigurationId, name) {
                if(dataSourceConfigurationId !== undefined){
                    var dataSource = new DataSourceFactory(dataSourceConfigurationId, name);
                    dataSourceManager.add(dataSource);
                }
            },
            add: function(dataSource){
                dataSourceManager.dataSources[dataSource.dataSourceConfigId] = dataSource;
            },
            delete: function(dataSourceConfigId){
                delete dataSourceManager.dataSources[dataSourceConfigId];
            }
        };
        var dataSourceManager = new DataSourceManager();
        dataSourceManager.init();
        return dataSourceManager;
    }

    return DataSourceManager;
});
define('acquire/services/dataSourceUtils',[], function() {
    'use strict';

    function DataSourceUtils(DataSourceConfigurationManager, $http, $rootScope) {
        function DataSourceUtils() {
        }
        DataSourceUtils.prototype = {
            constructor: DataSourceUtils,
            init: function(){},
            acquire: function(dataSource) {
                $rootScope.$emit('acquiring data');
                $http(angular.fromJson(DataSourceConfigurationManager.dataSourceConfigurations[dataSource.dataSourceConfigId].httpConfig)).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    if(typeof response.data !== "string"){
                      dataSource.data = JSON.stringify(response.data);
                    } else {
                      dataSource.data = response.data;
                    }
                    $rootScope.$emit('data acquired');
                }, function errorCallback(response) {
                    $rootScope.$emit('data acquired');
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            },
            format: function(dataSource) {
                var flatten = new Function("data", DataSourceConfigurationManager.dataSourceConfigurations[dataSource.dataSourceConfigId].flattenDataFunctionString);
                try{
                    dataSource.formattedData = angular.toJson(flatten(angular.fromJson(dataSource.data)));
                } catch(e){
                    try{
                        dataSource.formattedData = flatten(dataSource.data);
                    } catch(e){
                        //Do nothing
                    }
                }
                try{
                  dataSource.formattedData = angular.fromJson(dataSource.formattedData);
                } catch(e){
                  try{
                    dataSource.formattedData = $.csv.toArrays(dataSource.formattedData);
                  } catch(e){
                    //Do nothing
                  }
                }
            }
        };
        var dataSourceUtils = new DataSourceUtils();
        dataSourceUtils.init();
        return dataSourceUtils;
    }

    return DataSourceUtils;
});
define('explore/directives/explorationDirective',[], function() {

    function explorationDirective(ExploreController, RenderingEngineManager, DataSourceManager) {
        return {
            restrict: 'E',
            templateUrl:'explore/views/explore.html',
            link: function(scope, element, attrs) {
                ExploreController.init();
                scope.ExploreController = ExploreController;
                scope.RenderingEngineManager = RenderingEngineManager;
                scope.DataSourceManager = DataSourceManager;
            }
        };
    }

    return explorationDirective;
});
define('explore/services/exploreController',[], function() {
    'use strict';

    function ExploreController(RenderingEngineManager, DataSourceManager, $window, $timeout, $rootScope) {
        function ExploreController() {
            this.selectedDataSourceConfigId;
            this.dialogContentView;
            this.constants;
        }
        ExploreController.prototype = {
            constructor: ExploreController,
            init: function() {
                exploreController.constants = {
                    sortableOptions: {
                        placeholder: "placeholder",
                        connectWith: ".dropzone",
                        update: function(e, ui) {
                            //TODO: Need a way to provide feedback to the user that the renderer is updating                             
                            //UiControls.showRenderingEngineProgress(); ???
                                                            
                            //TODO: Need to remove any RenderingEngine.attributeFilterInclusions and  RenderingEngine.attributeFilterExclusions
                            //that are not on the row or column
                            
                            //Cannot correctly update renderer until the angular digest completes which updates the RenderingEngine.rows and
                            //RenderingEngine.cols arrays. We must get on the call stack after the that cycle completes 
                            $timeout(function() {
                                RenderingEngineManager.renderingEngines[RenderingEngineManager.activeRenderingEngine].draw(DataSourceManager.dataSources[RenderingEngineManager.renderingEngines[RenderingEngineManager.activeRenderingEngine].dataSourceConfigId].formattedData);
                            }, 0);
                        }
                    },
                    dataExplorationGrid: {
                        namespace: '#DataExploration',
                        enableDragging: false,
                        widget_margins: [10, 10],
                        /*
                         * Determination of the widget dimension is calculated as follows:
                         * 
                         *     (($window.innerWidth - (# of columns +1)*(column margin)*2 margins on either side)/# of columns)
                         *     (($window.innerHeight - (pixel height of toolbars) - (# of rows +1)*(row margin)*2 margins on either side)/# of rows)
                         */
                        widget_base_dimensions: [(($window.innerWidth - 7*(10)*2)/6) , (($window.innerHeight - 88 - 3*(10)*2)/2)],
                        min_cols: 6,
                        resize: {
                            enabled: false,
                            start: function(e, ui, $widget) {
                                console.log('START position: ' + ui.position.top + ' ' + ui.position.left);
                            },
                            resize: function(e, ui, $widget) {
                                console.log('RESIZE offset: ' + ui.pointer.diff_top + ' ' + ui.pointer.diff_left);
                            },
                            stop: function(e, ui, $widget) {
                                console.log('STOP position: ' + ui.position.top + ' ' + ui.position.left);
                            }
                        },
                        draggable: {
                            start: function(e, ui, $widget) {
                                console.log('START position: ' + ui.position.top + ' ' + ui.position.left);
                            },
                            drag: function(e, ui, $widget) {
                                console.log('DRAG offset: ' + ui.pointer.diff_top + ' ' + ui.pointer.diff_left);
                            },
                            stop: function(e, ui, $widget) {
                                console.log('STOP position: ' + ui.position.top + ' ' + ui.position.left);
                            }
                        },
                        parallax: {
                            enabled: false,
                            dataDepth: 0
                        }
                    }
                };
                var requireDataSourceConfigSelection = false;
                angular.forEach(RenderingEngineManager.renderingEngines, function(RenderingEngine, uuid) {
                     requireDataSourceConfigSelection = true;
                });
                if(!requireDataSourceConfigSelection){
                    exploreController.new();
                }
                angular.element($window).on( "rowLabelDrillDownEvent", function(e) {
                    var RenderingEngine = RenderingEngineManager.renderingEngines[e.renderingEngineId];
                    var filterByAttributeValue = $(e.event.currentTarget).html();
                    var attributeFilterName = RenderingEngine.rows[$(e.event.currentTarget).parent().children().index($(e.event.currentTarget))];
                    RenderingEngine.addInclusionFilter(attributeFilterName, filterByAttributeValue);
                    $timeout(function() {
                        RenderingEngine.draw(DataSourceManager.dataSources[RenderingEngine.dataSourceConfigId].formattedData);
                    }, 0);
                });
                angular.element($window).on( "colLabelDrillDownEvent", function(e) {
                    var RenderingEngine = RenderingEngineManager.renderingEngines[e.renderingEngineId];
                    var filterByAttributeValue = $(e.event.currentTarget).html();
                    var attributeFilterName = RenderingEngine.cols[$(e.event.currentTarget).parent().parent().children().index($(e.event.currentTarget).parent())];
                    RenderingEngine.addInclusionFilter(attributeFilterName, filterByAttributeValue);
                    $timeout(function() {
                        RenderingEngine.draw(DataSourceManager.dataSources[RenderingEngine.dataSourceConfigId].formattedData);
                    }, 0);
                });
                $rootScope.$emit('explore:init');
            },
            new: function(){
                exploreController.selectedDataSourceConfigId = undefined;
                $rootScope.$emit('explore:new');
            }
        };
        var exploreController = new ExploreController();
        return exploreController;
    }

    return ExploreController;
});
define('render/directives/renderingEngineDirective',[], function() {
    'use strict';

    function renderingEngineDirective() {
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

    return renderingEngineDirective;
});
define('render/services/aggregators',[], function() {
    'use strict';

    function Aggregators(AggregatorTemplates, RenderingEngineUtils) {
        function Aggregators() {
            this.availableAggregators;
            this.availableAggregatorNames;
            this.availableAggregatorOptions;
            this.aggregatorTemplates;
        }
        Aggregators.prototype = {
            constructor: Aggregators,
            init: function() {
                var self = this;
                self.availableAggregators = {};
                self.availableAggregatorNames = Object.keys(self.availableAggregators);
                self.aggregatorTemplates = AggregatorTemplates;
                self.addAggregator('Count', self.aggregatorTemplates.count(RenderingEngineUtils.usFmtInt()));
                self.addAggregator('Count Unique Values', self.aggregatorTemplates.countUnique(RenderingEngineUtils.usFmtInt()));
                self.addAggregator('List Unique Values', self.aggregatorTemplates.listUnique(', '));
                self.addAggregator('Sum', self.aggregatorTemplates.sum(RenderingEngineUtils.usFmt()));
                self.addAggregator('Integer Sum', self.aggregatorTemplates.sum(RenderingEngineUtils.usFmtInt()));
                self.addAggregator('Average', self.aggregatorTemplates.average(RenderingEngineUtils.usFmt()));
                self.addAggregator('Minimum', self.aggregatorTemplates.min(RenderingEngineUtils.usFmt()));
                self.addAggregator('Maximum', self.aggregatorTemplates.max(RenderingEngineUtils.usFmt()));
                self.addAggregator('Sum over Sum', self.aggregatorTemplates.sumOverSum(RenderingEngineUtils.usFmt()));
                self.addAggregator('80% Upper Bound', self.aggregatorTemplates.sumOverSumBound80(true, RenderingEngineUtils.usFmt()));
                self.addAggregator('80% Lower Bound', self.aggregatorTemplates.sumOverSumBound80(false, RenderingEngineUtils.usFmt()));
                self.addAggregator('Sum as Fraction of Total', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'total', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Sum as Fraction of Rows', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'row', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Sum as Fraction of Columns', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'col', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Total', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'total', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Rows', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'row', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Columns', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'col', RenderingEngineUtils.usFmtPct()));
            },
            addAggregator: function(AggregatorName, Aggregator){
                var self = this;
                self.availableAggregators[AggregatorName] = Aggregator;
                self.availableAggregatorNames = Object.keys(self.availableAggregators);
            }
        };
        var aggregators = new Aggregators();
        aggregators.init();
        return aggregators;
    }

    return Aggregators;
});
define('render/services/aggregatorTemplates',[], function() {
    'use strict';

    function AggregatorTemplates(RenderingEngineUtils) {
        function AggregatorTemplates() {
            this.aggregatorTemplates;
        }
        AggregatorTemplates.prototype = {
            constructor: AggregatorTemplates,
            init: function(){},
            count: function(formatter) {
                if (formatter == null) {
                    formatter = RenderingEngineUtils.usFmtInt;
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
                    formatter = RenderingEngineUtils.usFmtInt;
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
                    formatter = RenderingEngineUtils.usFmt;
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
                    formatter = RenderingEngineUtils.usFmt;
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
                    formatter = RenderingEngineUtils.usFmt;
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
                    formatter = RenderingEngineUtils.usFmt;
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
                    formatter = RenderingEngineUtils.usFmt;
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
                    formatter = RenderingEngineUtils.usFmt;
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
                    formatter = RenderingEngineUtils.usFmtPct;
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
        var agregatorTemplates = new AggregatorTemplates();
        agregatorTemplates.init();
        return agregatorTemplates;
    }

    return AggregatorTemplates;
});
define('render/services/pivotDataFactory',[], function() {
    'use strict';

    function PivotDataFactory(RenderingEngineUtils) {
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
                RenderingEngineUtils.forEachRecord(input, opts.derivedAttributes, (function(_this) {
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
                        results.push(RenderingEngineUtils.getSort(this.sorters, a));
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

    return PivotDataFactory;
});
define('render/services/renderers',[], 
    function() {
    'use strict';

    function Renderers() {
        function Renderers() {
            this.availableRenderers;
            this.availableRendererNames;
            this.availableRendererOptions;
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
        var renderers = new Renderers();
        renderers.init();
        return renderers;
    }

    return Renderers;
});
define('render/services/renderingEngineFactory',[], function() {
    'use strict';

    function RenderingEngineFactory(Aggregators, RenderingEngineUtils, Renderers, PivotDataFactory, $q, $timeout, $window, $rootScope) {
        function RenderingEngineFactory() {
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
        RenderingEngineFactory.prototype = {
            constructor: RenderingEngineFactory,
            init: function(dataSourceConfigId) {
                var self = this;
                self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
                self.dataSourceConfigId = dataSourceConfigId;
                //Does not belong here...This is a flag that the tabs use in the
                //Explore perspective to know which tab is active. We should have
                //some sort of tab manager that tracks this...
                self.disabled = false; 
                self.title = "Untitiled";
                //Does not belong here...This is an objet the dashboardFactory uses in
                //the Dashboard Designer perspective to know location and size of the widget.
                //We should have some sort of dashboard manager that tracks this...
                self.tile = {
                    size_x: 1,
                    size_y: 1,
                    col: 1,
                    row: 1
                };
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
                    numInputs = Aggregators.availableAggregators[self.aggregatorName]([])().numInputs;
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
            //Does not belong here...This is an objet the dashboardFactory uses in
            //the Dashboard Designer perspective to know location and size of the widget.
            //We should have some sort of dashboard manager that tracks this...
            updateTile: function(size_x, size_y, col, row){
                var self = this;
                self.tile = {
                    size_x: size_x,
                    size_y: size_y,
                    col: col,
                    row: row
                };
            },
            /*
             * @param {string} [table]
             *    A plain JSON-serialized string of the data.
             */
            draw: function(data) {
                var self = this;
                var deferred = $q.defer();
                $rootScope.$emit('draw initiated');
                $timeout(function(data) {
                    //Set the RenderingEngine id, # rows, and #cols for access in renderer
                    Renderers.availableRendererOptions['renderingEngineId'] = self.id;
                    Renderers.availableRendererOptions['numRows'] = self.rows.length;
                    Renderers.availableRendererOptions['numCols'] = self.cols.length;
                    //Set the height and width for each renderer option to fit into container
                    angular.forEach(Renderers.availableRendererOptions, function(value, key) {
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
                    data = RenderingEngineUtils.convertToArray(data);
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
                                        if (ref7 = "" + record[k], RenderingEngineUtils.indexOf.call(excludedItems, ref7) >= 0) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                aggregator: Aggregators.availableAggregators[self.aggregatorName](self.aggInputAttributeName),
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
                                    if (!RenderingEngineUtils.hasProp.call(ref, k)) continue;
                                    results.push(k);
                                }
                                return results;
                            })();
                            self.axisValues = {};
                            for (var l = 0, len1 = self.tblCols.length; l < len1; l++) {
                                var x = self.tblCols[l];
                                self.axisValues[x] = {};
                            }
                            RenderingEngineUtils.forEachRecord(data, opts.derivedAttributes, function(record) {
                                var base, results, v;
                                results = [];
                                for (var k in record) {
                                    if (!RenderingEngineUtils.hasProp.call(record, k)) continue;
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
                                    if (RenderingEngineUtils.indexOf.call(opts.hiddenAttributes, c) < 0) {
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
                                    result = Renderers.availableRenderers[self.rendererName](DataView, Renderers.availableRendererOptions);
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
                            $rootScope.$emit('draw complete');
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
        return RenderingEngineFactory;
    }

    return RenderingEngineFactory;
});
define('render/services/renderingEngineManager',[], function() {
    'use strict';

    function RenderingEngineManager(RenderingEngineFactory, DataSourceConfigurationManager, DataSourceManager, DataSourceUtils, $http) {
        function RenderingEngineManager() {
            this.renderingEngines = {};
            this.activeRenderingEngine;
        }
        RenderingEngineManager.prototype = {
            constructor: RenderingEngineManager,
            init: function(){},
            create: function(dataSourceConfigurationId) {
                if(DataSourceManager.dataSources[dataSourceConfigurationId] === undefined){
                    DataSourceManager.create(dataSourceConfigurationId, DataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfigurationId].name);
                    $http(angular.fromJson(DataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfigurationId].httpConfig)).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        DataSourceManager.dataSources[dataSourceConfigurationId].data = $.csv.toArrays(response.data);
                        DataSourceUtils.format(DataSourceManager.dataSources[dataSourceConfigurationId]);
                        var renderingEngine = new RenderingEngineFactory();
                        renderingEngine.init(dataSourceConfigurationId);
                        renderingEngine.active = true;  
                        renderingEngineManager.add(renderingEngine);
                        renderingEngineManager.activeRenderingEngine = renderingEngine.id;
                    }, function errorCallback(response) {
                        var tmp;
                        DataSourceManager.delete(dataSourceConfigurationId);
                    });
                } else{
                    var renderingEngine = new RenderingEngineFactory();
                    renderingEngine.init(dataSourceConfigurationId);
                    renderingEngineManager.add(renderingEngine);
                    renderingEngineManager.activeRenderingEngine = renderingEngine.id;
                }
            },
            add: function(renderingEngine){
                renderingEngineManager.renderingEngines[renderingEngine.id] = renderingEngine;
            },
            delete: function(id){
                delete renderingEngineManager.renderingEngines[id];
            },
            setActiveRenderingEngine: function(id){
                renderingEngineManager.activeRenderingEngine = id;
                angular.forEach(renderingEngineManager.renderingEngines, function(RenderingEngine) {
                    RenderingEngine.active = false;
                    if(RenderingEngine.id === id){
                        RenderingEngine.active = true;
                    }
                });
            },
            updateAllRenderingEngineTileSizeAndPosition: function($widgets){
                angular.forEach($widgets, function($widget){
                    renderingEngineManager.renderingEngines[$widget.id].updateTile($($widget).attr('data-sizex'), $($widget).attr('data-sizey'), $($widget).attr('data-col'), $($widget).attr('data-row'))
                });
            }
        };
        var renderingEngineManager = new RenderingEngineManager();
        renderingEngineManager.init();
        return renderingEngineManager;
    }

    return RenderingEngineManager;
});
define('render/services/renderingEngineUtils',[], function() {
    'use strict';

    function RenderingEngineUtils() {
        function RenderingEngineUtils() {
        }
        RenderingEngineUtils.prototype = {
            constructor: RenderingEngineUtils,
            init: function(){},
            hasProp: {}.hasOwnProperty,
            indexOf: [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
            convertToArray: function(input) {
                var result;
                result = [];
                renderingEngineUtils.forEachRecord(input, {}, function(record) {
                    return result.push(record);
                });
                return result;
            },
            bind: function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
            forEachRecord: function(input, derivedAttributes, f) {
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
                            if (!renderingEngineUtils.hasProp.call(input, i)) continue;
                            compactRecord = input[i];
                            if (!(i > 0)) {
                                continue;
                            }
                            record = {};
                            ref = input[0];
                            for (j in ref) {
                                if (!renderingEngineUtils.hasProp.call(ref, j)) continue;
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
                        return renderingEngineUtils.naturalSort(a, b);
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
                sort = sorters(attr);
                if ($.isFunction(sort)) {
                    return sort;
                } else {
                    return renderingEngineUtils.naturalSort;
                }
            },
            usFmt: function() {
                return renderingEngineUtils.numberFormat();
            },
            usFmtInt: function() {
                return renderingEngineUtils.numberFormat({
                    digitsAfterDecimal: 0
                });
            },
            usFmtPct:  function() {
                return renderingEngineUtils.numberFormat({
                    digitsAfterDecimal: 1,
                    scaler: 100,
                    suffix: '%'
                });
            }
        };
        var renderingEngineUtils = new RenderingEngineUtils();
        renderingEngineUtils.init();
        return renderingEngineUtils;
    }

    return RenderingEngineUtils;
});
define('syndicate/directives/dashboardDirective',[], function() {
    'use strict';

    function dashboardDirective(DashboardFactory, $window) {
        return {
            restrict: 'E',
            scope: {
                'renderingEngineManager': '='
            },
            link: {
                pre: function(scope, element, attrs) {
                //Clean up any existing context menus before we create more    
                $('.context-menu-list').remove();
                scope.DashboardFactory = new DashboardFactory($(element));
                scope.DashboardFactory.draw(scope);
                }
            }
        };
    }

    return dashboardDirective;
});
define('syndicate/services/dashboardFactory',[], function() {
    'use strict';

    function DashboardFactory($rootScope, $compile, $window, $q, $timeout, DataSourceManager) {
        function DashboardFactory(element) {
            this.id;
            this.element = element;
        }
        DashboardFactory.prototype = {
            constructor: DashboardFactory,
            init: function() {
                var self = this;
                self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            },
            draw: function(scope) {
                var self = this;
                var deferred = $q.defer();
                $timeout(function(scope) {
                    scope.DataSourceManager = DataSourceManager;
                    scope.options = {
                        enableDragging: true,
                        //                                 autogrow_cols: true,
                        min_rows: 30,
                        widget_margins: [10, 10],
                        widget_base_dimensions: [($window.innerWidth / 4) - 24, (($window.innerWidth / 4) - 24 - 21 - 20)],
                        min_cols: 4,
                        max_size_x: 4,
                        max_cols: 4,
                        //                                 avoid_overlapped_widgets: false,
                        //                                 autogenerate_stylesheet: true,
                        //                                 widget_margins: [],
                        //                                 widget_base_dimensions: [],
                        resize: {
                            enabled: true,
                            resize: function(e, ui, $widget) {
                            },
                            stop: function(e, ui, $widget) {
                                scope.renderingEngineManager.renderingEngines[$widget[0].id].draw(DataSourceManager.dataSources[scope.renderingEngineManager.renderingEngines[$widget[0].id].dataSourceConfigId].formattedData);
                                scope.renderingEngineManager.updateAllRenderingEngineTileSizeAndPosition(ui.$player.parent().parent().data('gridster').$widgets);
                            }
                        },
                        draggable: {
                            handle: 'div.context-menu.box',
                            stop: function(e, ui, $widget) {
                                scope.renderingEngineManager.updateAllRenderingEngineTileSizeAndPosition(ui.$player.parent().data('gridster').$widgets);
                            }
                        },
                        //http://matthew.wagerfield.com/parallax/
                        parallax: {
                            enabled: true,
                            dataDepth: 0.05
                        }
                    };
                    var ul = document.createElement('ul');
                    ul.setAttribute('class','gridster');
                    //Build the grid from the renderingEngineManager
                    var i = 1;
                    angular.forEach(scope.renderingEngineManager.renderingEngines, function(RenderingEngine, uuid) {
                        var contextMenu = 'contextMenu' + i;
                        scope[contextMenu] = {
                            callback: function(key, options) {
                                switch(key) {
                                    case "edit":
                                        scope.renderingEngineManager.setActiveRenderingEngine(RenderingEngine.id);
                                        $rootScope.$emit('Explore View');
                                        break;
                                    case "delete":
                                        self.element.isolateScope().gridster.remove_widget(RenderingEngine.element.parent().parent());
                                        scope.renderingEngineManager.delete(RenderingEngine.id);
                                        var returnToExploration = true;
                                        angular.forEach(scope.renderingEngineManager.renderingEngines, function(RenderingEngine, uuid) {
                                            returnToExploration = false;
                                        });
                                        if(returnToExploration){
                                            $rootScope.$emit('Explore View');
                                        }
                                        break;
                                    default:
                                        var m = "clicked: " + key;
                                        window.console && console.log(m) || alert(m);
                                }
                            },
                            items: {
                                "edit": {
                                    name: "Edit",
                                    icon: "edit",
                                    chartId: uuid
                                },
                                "delete": {
                                    name: "Delete",
                                    icon: "delete"
                                }
                            }
                        };
                        var li = document.createElement('li');
                        li.setAttribute('class','md-whiteframe-z5');
                        li.setAttribute('id', uuid);
                        li.setAttribute('data-max-sizex', 5);
                        li.setAttribute('data-max-sizey', 3);
                        li.setAttribute('data-row', RenderingEngine.tile.row);
                        li.setAttribute('data-col', RenderingEngine.tile.col);
                        li.setAttribute('data-sizex', RenderingEngine.tile.size_x);
                        li.setAttribute('data-sizey', RenderingEngine.tile.size_y);
                        $(ul).append(li);
                        $(li).append($compile("<header style='cursor:move' class='ui-dialog-titlebar ui-widget-header' context-menu='" + contextMenu + "' context-menu-selector=\"'.context-menu'\"><div class='context-menu box' ><span class='handle ui-icon ui-icon-gear' style='display:inline-block'></span>" + RenderingEngine.title + "</div></header>")(scope));
                        var div = document.createElement('div');
                        div.setAttribute('class','gridsterWidgetContainer');
                        var renderer = $compile("<rendering-engine-directive input='DataSourceManager.dataSources[renderingEngineManager.renderingEngines[\"" + uuid + "\"].dataSourceConfigId].formattedData' engine='renderingEngineManager.renderingEngines[\"" + uuid + "\"]'></rendering-engine-directive>")(scope);
                        $(div).append(renderer[0]);
                        $(li).append(div);
                        i++;
                    });
                    self.element.append(ul);
                    var gridster = $(ul).gridster(scope.options);
                    //squirell this away on the scope so that later (like in the delete context menu) it can be accessed
                    scope.gridster = gridster.data('gridster');
                    if (!scope.options.enableDragging) {
                        scope.gridster.disable();
                    }
                    if(scope.options.parallax.enabled){
                        var parallax = $("<ul><li data-depth='" + scope.options.parallax.dataDepth + "' class='layer'></li></ul>");
                        parallax.parallax();
                        var parallaxLi = parallax.find('li');
                        parallaxLi.append(gridster);
                        self.element.append(parallax);
                    }
                    deferred.resolve();
                }, 500, true, scope);
                return deferred.promise;
            }
        };
        return DashboardFactory;
    }

    return DashboardFactory;
});
define('syndicate/directives/gridsterDirective',[], function() {
    'use strict';

    function gridsterDirective() {
        return {
            restrict: 'E',
            scope: {
                options: '='
            },
            link: function(scope, element, attrs) {
                //initialize the gridster jQuery plugin and set the object on the scope
                var gridster = $(element.find('ul')[0]).gridster(scope.options);
                scope.gridster = gridster.data('gridster');
                if (!scope.options.enableDragging) {
                    scope.gridster.disable();
                }
                if(scope.options.parallax.enabled){
                    require('bower_components/parallax/deploy/jquery.parallax.min');
                    
                    var parallax = $("<ul><li data-depth='" + scope.options.parallax.dataDepth + "' class='layer'></li></ul>");
                    parallax.parallax();
                    var parallaxLi = parallax.find('li');
                    parallaxLi.append(gridster);
                    element.append(parallax);
                }
            }
        };
    }

    return gridsterDirective;
});
define('rndr-angular-module',['acquire/directives/acquisitionDirective',
    'acquire/services/acquisitionController',
    'acquire/services/dataSourceConfigurationFactory',
    'acquire/services/dataSourceConfigurationManager',
    'acquire/services/dataSourceFactory',
    'acquire/services/dataSourceManager',
    'acquire/services/dataSourceUtils',
    'explore/directives/explorationDirective',
    'explore/services/exploreController',
    'render/directives/renderingEngineDirective',
    'render/services/aggregators',
    'render/services/aggregatorTemplates',
    'render/services/pivotDataFactory',
    'render/services/renderers',
    'render/services/renderingEngineFactory',
    'render/services/renderingEngineManager',
    'render/services/renderingEngineUtils',
    'syndicate/directives/dashboardDirective',
    'syndicate/services/dashboardFactory',
    'syndicate/directives/gridsterDirective'], 
function(acquisitionDirective,
    AcquisitionController,
    DataSourceConfigurationFactory,
    DataSourceConfigurationManager,
    DataSourceFactory,
    DataSourceManager,
    DataSourceUtils,
    explorationDirective,
    ExploreController,
    renderingEngineDirective,
    Aggregators,
    AggregatorTemplates,
    PivotDataFactory,
    Renderers,
    RenderingEngineFactory,
    RenderingEngineManager,
    RenderingEngineUtils,
    dashboardDirective,
    DashboardFactory,
    gridsterDirective) {

    // Create module
    var app = angular.module('ngRndr', []);

    // Annotate module dependencies
    acquisitionDirective.$inject=['AcquisitionController', 'DataSourceConfigurationManager', 'DataSourceManager', 'DataSourceUtils'];
    gridsterDirective.$inject=[];
    explorationDirective.$inject=['ExploreController', 'RenderingEngineManager', 'DataSourceManager'];
    dashboardDirective.$inject=['DashboardFactory', '$window'];
    renderingEngineDirective.$inject=[];
    AcquisitionController.$inject=['RenderingEngineFactory', 'RenderingEngineManager', 'DataSourceUtils', 'DataSourceManager', 'DataSourceConfigurationManager', '$rootScope', '$window'];
    DataSourceConfigurationFactory.$inject=[];
    DataSourceConfigurationManager.$inject=['DataSourceConfigurationFactory'];
    DataSourceFactory.$inject=[];
    DataSourceManager.$inject=['DataSourceFactory'];
    DataSourceUtils.$inject=['DataSourceConfigurationManager', '$http', '$rootScope'];
    ExploreController.$inject=['RenderingEngineManager', 'DataSourceManager', '$window', '$timeout', '$rootScope'];
    Aggregators.$inject=['AggregatorTemplates', 'RenderingEngineUtils'];
    AggregatorTemplates.$inject=['RenderingEngineUtils'];
    PivotDataFactory.$inject=['RenderingEngineUtils'];
    Renderers.$inject=[];
    RenderingEngineFactory.$inject=['Aggregators', 'RenderingEngineUtils', 'Renderers', 'PivotDataFactory', '$q', '$timeout', '$window', '$rootScope'];
    RenderingEngineManager.$inject=['RenderingEngineFactory', 'DataSourceConfigurationManager', 'DataSourceManager', 'DataSourceUtils', '$http'];
    RenderingEngineUtils.$inject=[];
    DashboardFactory.$inject=['$rootScope', '$compile', '$window', '$q', '$timeout', 'DataSourceManager'];

    // Module directives
    app.directive('acquisitionDirective', acquisitionDirective);
    app.directive('gridsterDirective', gridsterDirective);
    app.directive('explorationDirective', explorationDirective);
    app.directive('dashboardDirective', dashboardDirective);
    app.directive('renderingEngineDirective', renderingEngineDirective);

    // Module services
    app.service('AcquisitionController', AcquisitionController);
    app.service('DataSourceConfigurationFactory', DataSourceConfigurationFactory);
    app.service('DataSourceConfigurationManager', DataSourceConfigurationManager);
    app.service('DataSourceFactory', DataSourceFactory);
    app.service('DataSourceManager', DataSourceManager);
    app.service('DataSourceUtils', DataSourceUtils);
    app.service('ExploreController', ExploreController);
    app.service('Aggregators', Aggregators);
    app.service('AggregatorTemplates', AggregatorTemplates);
    app.service('PivotDataFactory', PivotDataFactory);
    app.service('Renderers', Renderers);
    app.service('RenderingEngineFactory', RenderingEngineFactory);
    app.service('RenderingEngineManager', RenderingEngineManager);
    app.service('RenderingEngineUtils', RenderingEngineUtils);
    app.service('DashboardFactory', DashboardFactory);
});
