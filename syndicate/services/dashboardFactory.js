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
define([], function() {
    'use strict';

    function DashboardFactory($rootScope, $compile, $window, ServiceProvider, UiControls, $q, $timeout) {
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
                    scope.ServiceProvider = ServiceProvider;
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
                                scope.renderingEngineManager.renderingEngines[$widget[0].id].draw(ServiceProvider.DataSourceManager.dataSources[scope.renderingEngineManager.renderingEngines[$widget[0].id].dataSourceConfigId].formattedData);
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
                                        $rootScope.$emit('DATController Explore View');
                                        break;
                                    case "delete":
                                        self.element.isolateScope().gridster.remove_widget(RenderingEngine.element.parent().parent());
                                        scope.renderingEngineManager.delete(RenderingEngine.id);
                                        var returnToExploration = true;
                                        angular.forEach(scope.renderingEngineManager.renderingEngines, function(RenderingEngine, uuid) {
                                            returnToExploration = false;
                                        });
                                        if(returnToExploration){
                                            $rootScope.$emit('DATController Explore View');
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
                        var renderer = $compile("<rendering-engine-directive input='ServiceProvider.DataSourceManager.dataSources[renderingEngineManager.renderingEngines[\"" + uuid + "\"].dataSourceConfigId].formattedData' engine='renderingEngineManager.renderingEngines[\"" + uuid + "\"]'></rendering-engine-directive>")(scope);
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

    DashboardFactory.$inject=['$rootScope', '$compile', '$window', 'ServiceProvider', 'UiControls', '$q', '$timeout'];

    return DashboardFactory;
});