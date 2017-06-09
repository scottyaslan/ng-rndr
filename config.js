define(['../ng-rndr/DataSourceConfiguration',
        '../ng-rndr/dataSourceConfigurations',
        '../ng-rndr/DataSource',
        '../ng-rndr/dataSources',
        '../ng-rndr/renderingEnginesCollection',
        '../ng-rndr/common/controllers/controllerWrapper',
        '../ng-rndr/common/services/uiControls',
        '../ng-rndr/acquire/services/acquisitionController',
        '../ng-rndr/acquire/directives/acquisitionDirective',
        '../ng-rndr/syndicate/directives/dashboardDirective',
        '../ng-rndr/syndicate/services/Dashboard',
        '../ng-rndr/syndicate/directives/gridsterDirective',
        '$ngRndrFormatters',
        '$ngRndrSorters',
        '$ngRndrAggregatorsTemplates',
        '$ngRndrDeriverTemplates',
        '$ngRndrFormatterTemplates',
        '$ngRndrSorterTemplates',
        '$ngRndrDerivedAttributes',
        '$ngRndrAggregators',
        '$ngRndrDataViews',
        '$ngRndrRenderers',
        '$ngRndrRenderingEngine',
        '$ngRndrRenderingEngines'
    ],
    function(DataSourceConfiguration,
        dataSourceConfigurations,
        DataSource,
        dataSources,
        renderingEnginesCollection,
        controllerWrapper,
        uiControls,
        acquisitionController,
        acquisitionDirective,
        dashboardDirective,
        Dashboard,
        gridsterDirective,
        $ngRndrFormatters,
        $ngRndrSorters,
        $ngRndrAggregatorsTemplates,
        $ngRndrDeriverTemplates,
        $ngRndrFormatterTemplates,
        $ngRndrSorterTemplates,
        $ngRndrDerivedAttributes,
        $ngRndrAggregators,
        $ngRndrDataViews,
        $ngRndrRenderers,
        $ngRndrRenderingEngine,
        $ngRndrRenderingEngines) {
        'use strict';

        var config = function($locationProvider, $mdThemingProvider, $provide) {
            $locationProvider.html5Mode(true);
            //Define app palettes
            var customBluePaletteMap = $mdThemingProvider.extendPalette("grey", {
                "contrastDefaultColor": "light",
                "contrastDarkColors": ["100"], //hues which contrast should be "dark" by default
                "contrastLightColors": ["600"], //hues which contrast should be "light" by default
                "500": "021b2c"
            });
            var customRedPaletteMap = $mdThemingProvider.extendPalette("grey", {
                "contrastDefaultColor": "dark",
                "contrastDarkColors": ["100"], //hues which contrast should be "dark" by default
                "contrastLightColors": ["600"], //hues which contrast should be "light" by default
                "500": "B22234"
            });
            $mdThemingProvider.definePalette("bluePalette", customBluePaletteMap);
            $mdThemingProvider.definePalette("redPalette", customRedPaletteMap);
            $mdThemingProvider.theme("default").primaryPalette("bluePalette", {
                "default": "500",
                "hue-1": "50", // use for the <code>md-hue-1</code> class
                "hue-2": "300", // use for the <code>md-hue-2</code> class
                "hue-3": "600" // use for the <code>md-hue-3</code> class
            }).accentPalette("redPalette", {
                "default": "500",
                "hue-1": "50", // use for the <code>md-hue-1</code> class
                "hue-2": "300", // use for the <code>md-hue-2</code> class
                "hue-3": "600" // use for the <code>md-hue-3</code> class
            });

            var metaDecorator = function (f) {
                return function() {
                    var meta = f.call(this);
                    meta.title = this.title;
                    return meta;
                };
            };
            
            $ngRndrRenderingEngine.prototype.meta = metaDecorator($ngRndrRenderingEngine.prototype.meta)


            $ngRndrRenderingEngine.prototype.updateTile = function(size_x, size_y, col, row) {
                        this.tile = {
                            size_x: size_x,
                            size_y: size_y,
                            col: col,
                            row: row
                        };
                    };

            $ngRndrRenderingEngine.prototype.setTitle = function(title) {
                        if (title === undefined || title === '' || title === null) {
                            this.title = 'Untitled';
                        } else {
                            this.title = title;
                        }
                    };

            $ngRndrRenderingEngines.prototype.create = function(rendererName, title, renderingEngineId, aggregatorName, aggInputAttributeName, dataViewMeta, derivedAttributes, localeName, sorters) {
                        var self = this;
                        var renderingEngine = new $ngRndrRenderingEngine(rendererName, renderingEngineId, aggregatorName, aggInputAttributeName, dataViewMeta, derivedAttributes, localeName, sorters);
                        renderingEngine.setTitle(title);
                        self.add(renderingEngine);
                        //There may be an active rendering engine, if so deactivate
                        if (self.activeRenderingEngine !== undefined) {
                            self.map[self.activeRenderingEngine].active = false;
                        }
                        self.activeRenderingEngine = renderingEngine.id;
                        self.map[self.activeRenderingEngine].active = false;
                        return renderingEngine;
                    };

            $ngRndrRenderingEngines.prototype.setActiveRenderingEngine = function(id) {
                var self = this;
                self.activeRenderingEngine = id;
                angular.forEach(self.map, function(renderingEngine) {
                    renderingEngine.active = false;
                    if (renderingEngine.id === id) {
                        renderingEngine.active = true;
                    }
                });
            };

            $ngRndrRenderingEngines.prototype.updateAllRenderingEngineTileSizeAndPosition = function($widgets) {
                var self = this;
                angular.forEach($widgets, function($widget) {
                    self.map[$widget.id].updateTile($($widget).attr('data-sizex'), $($widget).attr('data-sizey'), $($widget).attr('data-col'), $($widget).attr('data-row'));
                });
            }

            /**
             * Update any renderer opts.
             */

            //DataTables.net enhanced pivot tables
            $.extend($ngRndrRenderers["DataTable - Table"].opts, {
                    heightOffset: -100
                });
            $.extend($ngRndrRenderers["DataTable - Table Barchart"].opts, {
                    heightOffset: -100
                });
            $.extend($ngRndrRenderers["DataTable - Heatmap"].opts, {
                    heightOffset: -100
                });
            $.extend($ngRndrRenderers["DataTable - Row Heatmap"].opts, {
                    heightOffset: -100
                });
            $.extend($ngRndrRenderers["DataTable - Col Heatmap"].opts, {
                    heightOffset: -100
                });

            //C3
            $.extend($ngRndrRenderers["C3 - Line Chart"].opts, {
                    heightOffset: -23
                });
            $.extend($ngRndrRenderers["C3 - Bar Chart"].opts, {
                    heightOffset: -23
                });
            $.extend($ngRndrRenderers["C3 - Stacked Bar Chart"].opts, {
                    heightOffset: -23
                });
            $.extend($ngRndrRenderers["C3 - Area Chart"].opts, {
                    heightOffset: -23
                });
            $.extend($ngRndrRenderers["C3 - Scatter Chart"].opts, {
                    heightOffset: -23
                });

            //Google Charts
            $.extend($ngRndrRenderers["Google - Line Chart"].opts, {
                    heightOffset: -23
                });
            $.extend($ngRndrRenderers["Google - Bar Chart"].opts, {
                    heightOffset: -23
                });
            $.extend($ngRndrRenderers["Google - Stacked Bar Chart"].opts, {
                    heightOffset: -23
                });
            $.extend($ngRndrRenderers["Google - Area Chart"].opts, {
                    heightOffset: -23
                });
            $.extend($ngRndrRenderers["Google - Scatter Chart"].opts, {
                    heightOffset: -23
                });

            /**
             * Configure additional attributes.
             */
            $ngRndrDerivedAttributes.add('Max Temp (C) Bin', $ngRndrDeriverTemplates.bin('Max Temp (C)', 10));

            /**
             * Configure additional sorters.
             */
            $ngRndrSorters.add('month name', $ngRndrSorterTemplates.sortAs(["Jan","Feb","Mar","Apr", "May",
                                "Jun","Jul","Aug","Sep","Oct","Nov","Dec"]));

            $ngRndrSorters.add('Age', $ngRndrSorterTemplates.sortDescending);

            /**
             * A function for converting to a standard US formatted number.
             * 
             * @return {function} A data formatter function for converting to standard US formatted number.
             */
            var frFmt = $ngRndrFormatterTemplates.numberFormat({thousandsSep:" ", decimalSep:","});

            /**
             * Configure additional formatters.
             */
            $ngRndrFormatters.add('FR Standard', frFmt);

            /**
             * Configure additional Aggregators
             * 
             * FR Sum - Takes as an argument an array of attribute-names and returns the FR standard floating formatted sum of the values observed.
             * FR Average - Takes as an argument an array of attribute-names and returns the FR standard floating formatted average of the values observed.
             * Sum as Fraction of Total - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the sum of the values observed to the 'total'.
             * Sum as Fraction of Rows - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the sum of the values observed to the 'row'.
             * Sum as Fraction of Columns - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the sum of the values observed to the 'col'.
             * Count as Fraction of Total - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the count of the values observed to the 'total'.
             * Count as Fraction of Rows - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the count of the values observed to the 'row'.
             * Count as Fraction of Columns - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the count of the values observed to the 'col'.
             */
            $ngRndrAggregators.add('FR Sum', $ngRndrAggregatorsTemplates.sum($ngRndrFormatters['FR Standard']));
            $ngRndrAggregators.add('FR Average', $ngRndrAggregatorsTemplates.average($ngRndrFormatters['FR Standard']));
            $ngRndrAggregators.add('Sum as Fraction of Total', $ngRndrAggregatorsTemplates.fractionOf($ngRndrAggregatorsTemplates.sum($ngRndrFormatters['US Standard']), 'total', $ngRndrFormatters['US Standard Percentage']));
            $ngRndrAggregators.add('Sum as Fraction of Rows', $ngRndrAggregatorsTemplates.fractionOf($ngRndrAggregatorsTemplates.sum($ngRndrFormatters['US Standard']), 'row', $ngRndrFormatters['US Standard Percentage']));
            $ngRndrAggregators.add('Sum as Fraction of Columns', $ngRndrAggregatorsTemplates.fractionOf($ngRndrAggregatorsTemplates.sum($ngRndrFormatters['US Standard']), 'col', $ngRndrFormatters['US Standard Percentage']));
            $ngRndrAggregators.add('Count as Fraction of Total', $ngRndrAggregatorsTemplates.fractionOf($ngRndrAggregatorsTemplates.count($ngRndrFormatters['US Standard Integer']), 'total', $ngRndrFormatters['US Standard Percentage']));
            $ngRndrAggregators.add('Count as Fraction of Rows', $ngRndrAggregatorsTemplates.fractionOf($ngRndrAggregatorsTemplates.count($ngRndrFormatters['US Standard Integer']), 'row', $ngRndrFormatters['US Standard Percentage']));
            $ngRndrAggregators.add('Count as Fraction of Columns', $ngRndrAggregatorsTemplates.fractionOf($ngRndrAggregatorsTemplates.count($ngRndrFormatters['US Standard Integer']), 'col', $ngRndrFormatters['US Standard Percentage']));
        };

        return config;
    });
