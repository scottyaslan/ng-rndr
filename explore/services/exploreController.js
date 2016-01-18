/*   Data Analytics Toolkit: Explore any data avaialable through a REST service 
*    Copyright (C) 2016  Scott Aslan
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.html>.
*/
define(['app', '../../common/services/serviceProvider', '../../common/services/uiControls', '../../render/services/renderingEngineManager', '../../acquire/services/dataSourceManager'], function(app) {
    app.factory('ExploreController', ['ServiceProvider', 'UiControls', 'RenderingEngineManager', 'DataSourceManager', '$window', '$timeout', '$rootScope',
        function(ServiceProvider, UiControls, RenderingEngineManager, DataSourceManager, $window, $timeout, $rootScope) {
            function ExploreController() {
                this.selectedDataSourceConfigId;
                this.dialogContentView;
                this.constants;
            }
            ExploreController.prototype = {
                constructor: ExploreController,
                init: function() {
                    UiControls.init('explore/views/bottomSheetGridTemplate.html', 'explore/views/dialogTemplate.html');
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
                    if(ServiceProvider.ExploreController === undefined){
                        ServiceProvider.add('ExploreController', exploreController);
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
                },
                new: function(){
                    exploreController.dialogContentView = "Data Sources";
                    exploreController.selectedDataSourceConfigId = undefined;
                    UiControls.openDialog('Data Source');
                },
                initiateDataSourceWizard: function(){
                    exploreController.dialogContentView = '';
                    UiControls.hideDialog();
                    $rootScope.$emit('initiate data source configuration wizard');
                }
            };
            var exploreController = new ExploreController();
            return exploreController;
        }
    ]);
});