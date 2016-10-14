define([], function() {
    'use strict';

    return function($rootScope, $compile, $window, $q, $timeout, dataSourceManager) {
        function Dashboard(element) {
            this.id;
            this.element = element;
        }
        Dashboard.prototype = {
            constructor: Dashboard,
            init: function() {
                var self = this;
                self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            draw: function(scope) {
                var self = this;
                var deferred = $q.defer();
                $timeout(function(scope) {
                    scope.dataSourceManager = dataSourceManager;
                    var ul = document.createElement('ul');
                    ul.setAttribute('class', 'gridster');
                    //Build the grid from the renderingEngineManager
                    var i = 1;
                    angular.forEach(scope.renderingEngineManager.renderingEngines, function(renderingEngine, uuid) {
                        var contextMenu = 'contextMenu' + i;
                        scope[contextMenu] = {
                            callback: function(key, options) {
                                switch (key) {
                                    case "edit":
                                        scope.renderingEngineManager.setActiveRenderingEngine(renderingEngine.id);
                                        $rootScope.$emit('Dashboard:edit');
                                        break;
                                    case "delete":
                                        self.element.isolateScope().gridster.remove_widget(renderingEngine.element.parent().parent());
                                        scope.renderingEngineManager.delete(renderingEngine.id);
                                        var returnToExploration = true;
                                        angular.forEach(scope.renderingEngineManager.renderingEngines, function(renderingEngine, uuid) {
                                            returnToExploration = false;
                                        });
                                        if (returnToExploration) {
                                            $rootScope.$emit('Dashboard:edit');
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
                        li.setAttribute('class', 'md-whiteframe-z5');
                        li.setAttribute('id', uuid);
                        li.setAttribute('data-max-sizex', 5);
                        li.setAttribute('data-max-sizey', 3);
                        li.setAttribute('data-row', renderingEngine.tile.row);
                        li.setAttribute('data-col', renderingEngine.tile.col);
                        li.setAttribute('data-sizex', renderingEngine.tile.size_x);
                        li.setAttribute('data-sizey', renderingEngine.tile.size_y);
                        $(ul).append(li);
                        $(li).append($compile("<header style='cursor:move' class='ui-dialog-titlebar ui-widget-header' context-menu='" + contextMenu + "' context-menu-selector=\"'.context-menu'\"><div class='context-menu box' ><span class='handle ui-icon ui-icon-gear' style='display:inline-block'></span>" + renderingEngine.title + "</div></header>")(scope));
                        var div = document.createElement('div');
                        div.setAttribute('class', 'gridsterWidgetContainer');
                        var renderer = $compile("<rendering-engine-directive input='dataSourceManager.dataSources[renderingEngineManager.renderingEngines[\"" + uuid + "\"].dataSourceConfigId].formattedData' engine='renderingEngineManager.renderingEngines[\"" + uuid + "\"]'></rendering-engine-directive>")(scope);
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
                    if (scope.options.parallax.enabled) {
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
        return Dashboard;
    }
});
