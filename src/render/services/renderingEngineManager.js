define([], function() {
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