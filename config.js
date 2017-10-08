define(['../rndr/DataSourceConfiguration',
        '../rndr/dataSourceConfigurations',
        '../rndr/DataSource',
        '../rndr/dataSources',
        '../rndr/renderingEnginesCollection',
        '../rndr/common/controllers/controllerWrapper',
        '../rndr/common/services/uiControls',
        '../rndr/acquire/services/acquisitionController',
        '../rndr/acquire/directives/acquisitionDirective',
        '../rndr/syndicate/directives/dashboardDirective',
        '../rndr/syndicate/services/Dashboard',
        '../rndr/syndicate/directives/gridsterDirective',
        'rndr',
        'PivotData', 
        'c3-renderers',
        'd3-renderers', 
        'gchart-renderers', 
        'pivottables-renderers', 
        'datatables-renderers', 
        'pivot-data-ui-renderer'
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
        rndr) {
        'use strict';

        var config = function($locationProvider, $mdThemingProvider, $provide) {
            $locationProvider.html5Mode(true);
            //Define app palettes
            var customBluePaletteMap = $mdThemingProvider.extendPalette('grey', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': ['100'], //hues which contrast should be 'dark' by default
                'contrastLightColors': ['600'], //hues which contrast should be 'light' by default
                '500': '021b2c'
            });
            var customRedPaletteMap = $mdThemingProvider.extendPalette('grey', {
                'contrastDefaultColor': 'dark',
                'contrastDarkColors': ['100'], //hues which contrast should be 'dark' by default
                'contrastLightColors': ['600'], //hues which contrast should be 'light' by default
                '500': 'B22234'
            });
            $mdThemingProvider.definePalette('bluePalette', customBluePaletteMap);
            $mdThemingProvider.definePalette('redPalette', customRedPaletteMap);
            $mdThemingProvider.theme('default').primaryPalette('bluePalette', {
                'default': '500',
                'hue-1': '50', // use for the <code>md-hue-1</code> class
                'hue-2': '300', // use for the <code>md-hue-2</code> class
                'hue-3': '600' // use for the <code>md-hue-3</code> class
            }).accentPalette('redPalette', {
                'default': '500',
                'hue-1': '50', // use for the <code>md-hue-1</code> class
                'hue-2': '300', // use for the <code>md-hue-2</code> class
                'hue-3': '600' // use for the <code>md-hue-3</code> class
            });

            var metaDecorator = function (f) {
                return function() {
                    var meta = f.call(this);
                    meta.title = this.title;
                    return meta;
                };
            };
            
            rndr.RenderingEngine.prototype.meta = metaDecorator(rndr.RenderingEngine.prototype.meta)


            rndr.RenderingEngine.prototype.updateTile = function(size_x, size_y, col, row) {
                        this.tile = {
                            size_x: size_x,
                            size_y: size_y,
                            col: col,
                            row: row
                        };
                    };

            rndr.RenderingEngine.prototype.setTitle = function(title) {
                        if (title === undefined || title === '' || title === null) {
                            this.title = 'Untitled';
                        } else {
                            this.title = title;
                        }
                    };

            // rndr.RenderingEngines.prototype.create = function(rendererName, title, renderingEngineId, aggregatorName, aggInputAttributeName, dataViewMeta, derivedAttributes, localeName, sorters) {
            //             var self = this;
            //             var renderingEngine = new rndr.RenderingEngine(rendererName, renderingEngineId, aggregatorName, aggInputAttributeName, dataViewMeta, derivedAttributes, localeName, sorters);
            //             renderingEngine.setTitle(title);
            //             self.add(renderingEngine);
            //             //There may be an active rendering engine, if so deactivate
            //             if (self.activeRenderingEngine !== undefined) {
            //                 self.map.get(self.activeRenderingEngine).active = false;
            //             }
            //             self.activeRenderingEngine = renderingEngine.id;
            //             self.map.get(self.activeRenderingEngine).active = false;
            //             return renderingEngine;
            //         };

            // rndr.RenderingEngines.prototype.setActiveRenderingEngine = function(id) {
            //     var self = this;
            //     self.activeRenderingEngine = id;
            //     angular.forEach(self.map, function(renderingEngine) {
            //         renderingEngine.active = false;
            //         if (renderingEngine.id === id) {
            //             renderingEngine.active = true;
            //         }
            //     });
            // };

            // rndr.RenderingEngines.prototype.updateAllRenderingEngineTileSizeAndPosition = function($widgets) {
            //     var self = this;
            //     angular.forEach($widgets, function($widget) {
            //         self.map.get($widget.id).updateTile($($widget).attr('data-sizex'), $($widget).attr('data-sizey'), $($widget).attr('data-col'), $($widget).attr('data-row'));
            //     });
            // }

            /**
             * Update any renderer opts.
             */

            //Pivot tables
            $.extend(rndr.plugins.renderers.get('Pivot Table - Table').opts, {
                    widthOffset: -17
                });

            //DataTables.net enhanced pivot tables
            $.extend(rndr.plugins.renderers.get('DataTable - Table').opts, {
                    heightOffset: -100
                });
            $.extend(rndr.plugins.renderers.get('DataTable - Table Barchart').opts, {
                    heightOffset: -100
                });
            $.extend(rndr.plugins.renderers.get('DataTable - Heatmap').opts, {
                    heightOffset: -100
                });
            $.extend(rndr.plugins.renderers.get('DataTable - Row Heatmap').opts, {
                    heightOffset: -100
                });
            $.extend(rndr.plugins.renderers.get('DataTable - Col Heatmap').opts, {
                    heightOffset: -100
                });

            //C3
            $.extend(rndr.plugins.renderers.get('C3 - Line Chart').opts, {
                    heightOffset: -23
                });
            $.extend(rndr.plugins.renderers.get('C3 - Bar Chart').opts, {
                    heightOffset: -23
                });
            $.extend(rndr.plugins.renderers.get('C3 - Stacked Bar Chart').opts, {
                    heightOffset: -23
                });
            $.extend(rndr.plugins.renderers.get('C3 - Area Chart').opts, {
                    heightOffset: -23
                });
            $.extend(rndr.plugins.renderers.get('C3 - Scatter Chart').opts, {
                    heightOffset: -23
                });

            //Google Charts
            $.extend(rndr.plugins.renderers.get('Google - Line Chart').opts, {
                    heightOffset: -23
                });
            $.extend(rndr.plugins.renderers.get('Google - Bar Chart').opts, {
                    heightOffset: -23
                });
            $.extend(rndr.plugins.renderers.get('Google - Stacked Bar Chart').opts, {
                    heightOffset: -23
                });
            $.extend(rndr.plugins.renderers.get('Google - Area Chart').opts, {
                    heightOffset: -23
                });
            $.extend(rndr.plugins.renderers.get('Google - Scatter Chart').opts, {
                    heightOffset: -23
                });

            /**
             * Configure additional attributes.
             */
            rndr.plugins.derivedAttributes.set('Max Temp (C) Bin', rndr.templates.derivers.get('bin')('Max Temp (C)', 10));

            /**
             * Configure additional sorters.
             */
            rndr.plugins.sorters.set('month name', rndr.templates.sorters.get('sortAs')(['Jan','Feb','Mar','Apr', 'May',
                                'Jun','Jul','Aug','Sep','Oct','Nov','Dec']));

            rndr.plugins.sorters.set('Age', rndr.templates.sorters.get('sortDescending'));

            /**
             * A function for converting to a standard US formatted number.
             * 
             * @return {function} A data formatter function for converting to standard US formatted number.
             */
            var frFmt = rndr.templates.formatters.get('numberFormat')({thousandsSep:' ', decimalSep:','});

            /**
             * Configure additional formatters.
             */
            rndr.plugins.formatters.set('FR Standard', frFmt);

            /**
             * Configure additional plugins.aggregators
             */

            /**
             * FR Sum - Takes as an argument an array of attribute-names and returns the FR standard floating formatted sum of the values observed.
             */
            rndr.plugins.aggregators.set('FR Sum', rndr.templates.aggregators.get('sum')(rndr.plugins.formatters.get('FR Standard')));

            /**
             * FR Average - Takes as an argument an array of attribute-names and returns the FR standard floating formatted average of the values observed.
             */
            rndr.plugins.aggregators.set('FR Average', rndr.templates.aggregators.get('average')(rndr.plugins.formatters.get('FR Standard')));

            /**
             * Sum as Fraction of Total - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the sum of the values observed to the 'total'.
             */
            rndr.plugins.aggregators.set('Sum as Fraction of Total', rndr.templates.aggregators.get('fractionOf')(rndr.templates.aggregators.get('sum')(rndr.plugins.formatters.get('US Standard')), 'total', rndr.plugins.formatters.get('US Standard Percentage')));

            /**
             * Sum as Fraction of Rows - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the sum of the values observed to the 'row'.
             */
            rndr.plugins.aggregators.set('Sum as Fraction of Rows', rndr.templates.aggregators.get('fractionOf')(rndr.templates.aggregators.get('sum')(rndr.plugins.formatters.get('US Standard')), 'row', rndr.plugins.formatters.get('US Standard Percentage')));

            /**
             * Sum as Fraction of Columns - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the sum of the values observed to the 'col'.
             */
            rndr.plugins.aggregators.set('Sum as Fraction of Columns', rndr.templates.aggregators.get('fractionOf')(rndr.templates.aggregators.get('sum')(rndr.plugins.formatters.get('US Standard')), 'col', rndr.plugins.formatters.get('US Standard Percentage')));

            /**
             * Count as Fraction of Total - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the count of the values observed to the 'total'.
             */
            rndr.plugins.aggregators.set('Count as Fraction of Total', rndr.templates.aggregators.get('fractionOf')(rndr.templates.aggregators.get('count')(rndr.plugins.formatters.get('US Standard Integer')), 'total', rndr.plugins.formatters.get('US Standard Percentage')));

            /**
             * Count as Fraction of Rows - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the count of the values observed to the 'row'.
             */
            rndr.plugins.aggregators.set('Count as Fraction of Rows', rndr.templates.aggregators.get('fractionOf')(rndr.templates.aggregators.get('count')(rndr.plugins.formatters.get('US Standard Integer')), 'row', rndr.plugins.formatters.get('US Standard Percentage')));

            /**
             * Count as Fraction of Columns - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the count of the values observed to the 'col'.
             */
            rndr.plugins.aggregators.set('Count as Fraction of Columns', rndr.templates.aggregators.get('fractionOf')(rndr.templates.aggregators.get('count')(rndr.plugins.formatters.get('US Standard Integer')), 'col', rndr.plugins.formatters.get('US Standard Percentage')));
        };

        return config;
    });
