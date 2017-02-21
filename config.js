define(['PivotData',
        'datatables_renderers',
        'pivottables_renderers',
        'c3_renderers',
        'd3_renderers',
        'gchart_renderers',
        'ngRndr.templates.aggregators',
        'ngRndr.templates.derivers',
        'ngRndr.templates.formatters'
    ],
    function(PivotData,
        datatables_renderers,
        pivottables_renderers,
        c3_renderers,
        d3_renderers,
        gchart_renderers,
        aggregatorTemplates,
        deriverTemplates,
        formatterTemplates) {
        'use strict';

        return function($locationProvider, $mdThemingProvider, $provide, $ngRndrRenderersProvider, $ngRndrDataViewsProvider, $ngRndrAggregatorsProvider, $ngRndrDerivedAttributesProvider, $ngRndrFormattersProvider) {
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

            //Extend RenderingEngine functionality
            $provide.decorator('$ngRndrRenderingEngine', [
                '$delegate',
                function renderingEngineDecorator($delegate) {
                    $delegate.prototype.updateTile = function(size_x, size_y, col, row) {
                        this.tile = {
                            size_x: size_x,
                            size_y: size_y,
                            col: col,
                            row: row
                        };
                    };

                    $delegate.prototype.setTitle = function(title) {
                        if (title === undefined || title === '' || title === null) {
                            this.title = 'Untitled';
                        } else {
                            this.title = title;
                        }
                    };

                    var metaDecorator = function (f) {
                        return function() {
                            var meta = f.call(this);
                            meta.title = this.title;
                            return meta;
                        };
                    };

                    $delegate.prototype.meta = metaDecorator($delegate.prototype.meta)

                    return $delegate;
                }
            ]);

            //Extend RenderingEngines functionality
            $provide.decorator('$ngRndrRenderingEngines', [
                '$delegate', '$ngRndrRenderingEngine',
                function renderingEnginesDecorator($delegate, $ngRndrRenderingEngine) {
                    $delegate.prototype.create = function(rendererName, title, renderingEngineId, aggregatorName, aggInputAttributeName, dataViewMeta, derivedAttributes, localeName, sorters) {
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

                    return $delegate;
                }
            ]);

            //DataTables.net enhanced pivot tables
            $ngRndrRenderersProvider.add("DT - Table",
                datatables_renderers["DataTable"],
                'PivotData', {
                    clazz: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    heightOffset: -100
                }
            );
            $ngRndrRenderersProvider.add("DT - Table Barchart",
                datatables_renderers["DataTable Barchart"],
                'PivotData', {
                    clazz: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    heightOffset: -100
                }
            );
            $ngRndrRenderersProvider.add("DT - Heatmap",
                datatables_renderers["DataTable Heatmap"],
                'PivotData', {
                    clazz: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    heightOffset: -100
                }
            );
            $ngRndrRenderersProvider.add("DT - Row Heatmap",
                datatables_renderers["DataTable Row Heatmap"],
                'PivotData', {
                    clazz: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    heightOffset: -100
                }
            );
            $ngRndrRenderersProvider.add("DT - Col Heatmap",
                datatables_renderers["DataTable Col Heatmap"],
                'PivotData', {
                    clazz: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    heightOffset: -100
                }
            );

            // Pivot Tables
            $ngRndrRenderersProvider.add("Pivot Table - Table",
                pivottables_renderers["PivotTable"],
                'PivotData');
            $ngRndrRenderersProvider.add("Pivot Table - Table Barchart",
                pivottables_renderers["PivotTable Barchart"],
                'PivotData');
            $ngRndrRenderersProvider.add("Pivot Table - Heatmap",
                pivottables_renderers["PivotTable Heatmap"],
                'PivotData');
            $ngRndrRenderersProvider.add("Pivot Table - Row Heatmap",
                pivottables_renderers["PivotTable Row Heatmap"],
                'PivotData');
            $ngRndrRenderersProvider.add("Pivot Table - Col Heatmap",
                pivottables_renderers["PivotTable Col Heatmap"],
                'PivotData');

            //C3
            $ngRndrRenderersProvider.add("C3 - Line Chart",
                c3_renderers["C3 - Line Chart"],
                'PivotData');
            $ngRndrRenderersProvider.add("C3 - Bar Chart",
                c3_renderers["C3 - Bar Chart"],
                'PivotData');
            $ngRndrRenderersProvider.add("C3 - Stacked Bar Chart",
                c3_renderers["C3 - Stacked Bar Chart"],
                'PivotData');
            $ngRndrRenderersProvider.add("C3 - Area Chart",
                c3_renderers["C3 - Area Chart"],
                'PivotData');
            $ngRndrRenderersProvider.add("C3 - Scatter Chart",
                c3_renderers["C3 - Scatter Chart"],
                'PivotData');

            //D3
            $ngRndrRenderersProvider.add("D3 - Treemap",
                d3_renderers["Treemap"],
                'PivotData');

            //Google Charts
            $ngRndrRenderersProvider.add("Google - Line Chart",
                gchart_renderers["Line Chart"],
                'PivotData', {
                    heightOffset: -23
                }
            );
            $ngRndrRenderersProvider.add("Google - Bar Chart",
                gchart_renderers["Bar Chart"],
                'PivotData', {
                    heightOffset: -23
                }
            );
            $ngRndrRenderersProvider.add("Google - Stacked Bar Chart",
                gchart_renderers["Stacked Bar Chart"],
                'PivotData', {
                    heightOffset: -23
                }
            );
            $ngRndrRenderersProvider.add("Google - Area Chart",
                gchart_renderers["Area Chart"],
                'PivotData', {
                    heightOffset: -23
                }
            );
            $ngRndrRenderersProvider.add("Google - Scatter Chart",
                gchart_renderers["Scatter Chart"],
                'PivotData', {
                    heightOffset: -23
                }
            );

            /**
             * Configure Data Views.
             */
            $ngRndrDataViewsProvider.add('PivotData', PivotData);

            /**
             * A function for converting to a standard US formatted number.
             * 
             * @return {function} A data formatter function for converting to standard US formatted number.
             */
            var usFmt = function() {
                return formatterTemplates.numberFormat();
            };

            /**
             * A function for converting to a standard US formatted integer.
             * 
             * @return {function} A data formatter function for converting to standard US formatted integer.
             */
            var usFmtInt = function() {
                return formatterTemplates.numberFormat({
                    digitsAfterDecimal: 0
                });
            };

            /**
             * A function for converting to a standard US formatted percentage.
             * 
             * @return {function} A data formatter function for converting to standard US formatted percentage.
             */
            var usFmtPct = function() {
                return formatterTemplates.numberFormat({
                    digitsAfterDecimal: 1,
                    scaler: 100,
                    suffix: '%'
                });
            };

            /**
             * Configure formatters.
             */
            $ngRndrFormattersProvider.add('usFmt', usFmt);
            $ngRndrFormattersProvider.add('usFmtInt', usFmtInt);
            $ngRndrFormattersProvider.add('usFmtPct', usFmtPct);

            /**
             * Configure Aggregators
             * 
             * Count - Takes as an argument an array of attribute-names and returns the US integer formatted count of the number of values observed of the given attribute for records which match the cell.
             * Count Unique Values - Takes as an argument an array of attribute-names and returns the US integer formatted count of the number of unique values observed.
             * List Unique Values - Takes as an argument an array of attribute-names and returns a CSV string listing of the unique values observed.
             * Sum - Takes as an argument an array of attribute-names and returns the US floating formatted sum of the values observed.
             * Integer Sum - Takes as an argument an array of attribute-names and returns the US integer formatted sum of the values observed.
             * Average - Takes as an argument an array of attribute-names and returns the US floating formatted average of the values observed.
             * Minimum - Takes as an argument an array of attribute-names and returns the US floating formatted minimum value of the unique values observed.
             * Maximum - Takes as an argument an array of attribute-names and returns the US floating formatted maximum value of the unique values observed.
             * Sum over Sum - Takes as an argument an array of attribute-names and returns the US floating formatted quotient of the values observed.
             * 80% Upper Bound - Takes as an argument an array of attribute-names and returns the US floating formatted quotient "upper" 80% bound of the values observed.
             * 80% Lower Bound - Takes as an argument an array of attribute-names and returns the US floating formatted quotient "lower" 80% bound of the values observed.
             * Sum as Fraction of Total - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the sum of the values observed to the 'total'.
             * Sum as Fraction of Rows - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the sum of the values observed to the 'row'.
             * Sum as Fraction of Columns - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the sum of the values observed to the 'col'.
             * Count as Fraction of Total - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the count of the values observed to the 'total'.
             * Count as Fraction of Rows - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the count of the values observed to the 'row'.
             * Count as Fraction of Columns - Takes as an argument an array of attribute-names and returns the US percentage formatted quotiant of the count of the values observed to the 'col'.
             */
            $ngRndrAggregatorsProvider.add('Count', aggregatorTemplates.count(usFmtInt()));
            $ngRndrAggregatorsProvider.add('Count Unique Values', aggregatorTemplates.countUnique(usFmtInt()));
            $ngRndrAggregatorsProvider.add('List Unique Values', aggregatorTemplates.listUnique(', '));
            $ngRndrAggregatorsProvider.add('Sum', aggregatorTemplates.sum(usFmt()));
            $ngRndrAggregatorsProvider.add('Integer Sum', aggregatorTemplates.sum(usFmtInt()));
            $ngRndrAggregatorsProvider.add('Average', aggregatorTemplates.average(usFmt()));
            $ngRndrAggregatorsProvider.add('Minimum', aggregatorTemplates.min(usFmt()));
            $ngRndrAggregatorsProvider.add('Maximum', aggregatorTemplates.max(usFmt()));
            $ngRndrAggregatorsProvider.add('Sum over Sum', aggregatorTemplates.sumOverSum(usFmt()));
            $ngRndrAggregatorsProvider.add('80% Upper Bound', aggregatorTemplates.sumOverSumBound80(true, usFmt()));
            $ngRndrAggregatorsProvider.add('80% Lower Bound', aggregatorTemplates.sumOverSumBound80(false, usFmt()));
            $ngRndrAggregatorsProvider.add('Sum as Fraction of Total', aggregatorTemplates.fractionOf(aggregatorTemplates.sum(usFmt()), 'total', usFmtPct()));
            $ngRndrAggregatorsProvider.add('Sum as Fraction of Rows', aggregatorTemplates.fractionOf(aggregatorTemplates.sum(usFmt()), 'row', usFmtPct()));
            $ngRndrAggregatorsProvider.add('Sum as Fraction of Columns', aggregatorTemplates.fractionOf(aggregatorTemplates.sum(usFmt()), 'col', usFmtPct()));
            $ngRndrAggregatorsProvider.add('Count as Fraction of Total', aggregatorTemplates.fractionOf(aggregatorTemplates.count(usFmtInt()), 'total', usFmtPct()));
            $ngRndrAggregatorsProvider.add('Count as Fraction of Rows', aggregatorTemplates.fractionOf(aggregatorTemplates.count(usFmtInt()), 'row', usFmtPct()));
            $ngRndrAggregatorsProvider.add('Count as Fraction of Columns', aggregatorTemplates.fractionOf(aggregatorTemplates.count(usFmtInt()), 'col', usFmtPct()));
        }
    });
