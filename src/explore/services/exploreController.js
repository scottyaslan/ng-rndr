define([], function() {
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