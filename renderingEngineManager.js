define([], function() {
    'use strict';

    return function() {
        /**
         * {@link RenderingEngineManager} constructor.
         */
        function RenderingEngineManager() {}
        RenderingEngineManager.prototype = {
            /**
             * @typedef RenderingEngineManager
             * @type {object}
             */
            constructor: RenderingEngineManager,
            setActiveRenderingEngine: function(id) {
                var self = this;
                self.activeRenderingEngine = id;
                angular.forEach(self.renderingEngines, function(renderingEngine) {
                    renderingEngine.active = false;
                    if (renderingEngine.id === id) {
                        renderingEngine.active = true;
                    }
                });
            },
            updateAllRenderingEngineTileSizeAndPosition: function($widgets) {
                var self = this;
                angular.forEach($widgets, function($widget) {
                    self.renderingEngines[$widget.id].updateTile($($widget).attr('data-sizex'), $($widget).attr('data-sizey'), $($widget).attr('data-col'), $($widget).attr('data-row'))
                });
            }
        };

        return new RenderingEngineManager();
    }
});
