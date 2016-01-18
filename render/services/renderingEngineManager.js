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
define(['app', '../../common/services/serviceProvider', '../../render/services/renderingEngineFactory'], function(app) {
    app.factory('RenderingEngineManager', ['ServiceProvider', 'RenderingEngineFactory',
        function(ServiceProvider, RenderingEngineFactory) {
            function RenderingEngineManager() {
                this.renderingEngines = {};
                this.activeRenderingEngine;
            }
            RenderingEngineManager.prototype = {
                constructor: RenderingEngineManager,
                init: function(){
                    if(ServiceProvider.RenderingEngineManager === undefined){
                        ServiceProvider.add('RenderingEngineManager', renderingEngineManager);
                    }
                },
                create: function(dataSourceConfigId) {
                    var renderingEngine = new RenderingEngineFactory();
                    renderingEngine.init(dataSourceConfigId);
                    renderingEngineManager.add(renderingEngine);
                    renderingEngineManager.activeRenderingEngine = renderingEngine.id;
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
    ]);
});