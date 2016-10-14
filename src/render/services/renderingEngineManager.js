define([], function() {
    'use strict';

    return function(RenderingEngine, dataSourceConfigurationManager, dataSourceManager, $http) {
        /**
         * {@link RenderingEngineManager} constructor.
         */
        function RenderingEngineManager() {
            this.init();
        }
        RenderingEngineManager.prototype = {
            /**
             * @typedef RenderingEngineManager
             * @type {object}
             * @property {object} renderingEngines - The map of registered {@link RenderingEngine}'s.
             * @property {string} activeRenderingEngine - The UUID of the active {@link RenderingEngine}.
             */
            constructor: RenderingEngineManager,
            /**
             * Initialize the {@link RenderingEngineManager}.
             */
            init: function() {
                var self = this;
                self.renderingEngines = {};
                self.activeRenderingEngine = undefined;
            },
            /**
             * Instantiates a {@link RenderingEngine} and adds it to the manager.
             * 
             * @param  {string} dataSourceConfigurationId The UUID of the {@link DataSourceConfiguration} referenced by the instaniated {@link RenderingEngine}.
             * @param  {string} [renderingEngineId]         The UUID of the {@link RenderingEngine}
             * @param  {string} [title]                     The title of the {@link RenderingEngine}
             * @param  {string} [dataViewName]       The name of the data view plugin.
             * 
             * @return {object}      The {@link DataSource}.
             */
            create: function(dataSourceConfigurationId, renderingEngineId, title, dataViewName) {
                var self = this;
                var renderingEngine = new RenderingEngine(dataSourceConfigurationId, renderingEngineId, title, dataViewName);
                self.add(renderingEngine);
                //There may be an active rendering engine, if so deactivate
                if (self.activeRenderingEngine !== undefined) {
                    self.renderingEngines[self.activeRenderingEngine].active = false;
                }
                self.activeRenderingEngine = renderingEngine.id;
                return renderingEngine;
            },
            /**
             * The size of the manager.
             * 
             * @return {number} The number of {@link RenderingEngine}'s in the manager.
             */
            size: function() {
                return Object.keys(this.renderingEngines).length;
            },
            /**
             * Adds a {@link RenderingEngine} to the manager.
             * 
             * @param {RenderingEngine} dataSource The {@link RenderingEngine} to add.
             */
            add: function(renderingEngine) {
                var self = this;
                self.renderingEngines[renderingEngine.id] = renderingEngine;
            },
            /**
             * Deletes a {@link RenderingEngine} from the manager by `id`.
             * 
             * @param  {string} id The UUID of the {@link RenderingEngine} to remove from the manager.
             */
            delete: function(id) {
                var self = this;
                delete self.renderingEngines[id];
            }
        };

        return new RenderingEngineManager();
    }
});
