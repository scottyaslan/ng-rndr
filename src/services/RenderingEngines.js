define([], function() {
    'use strict';

    return function(RenderingEngine, dataSourceConfigurations, map, $http) {
        /**
         * {@link RenderingEngines} constructor.
         */
        function RenderingEngines() {
            this.init();
        }
        RenderingEngines.prototype = {
            /**
             * @typedef RenderingEngines
             * @type {object}
             * @property {object} map - The map of registered {@link RenderingEngine}'s.
             * @property {string} activeRenderingEngine - The UUID of the active {@link RenderingEngine}.
             */
            constructor: RenderingEngines,
            /**
             * Initialize the {@link RenderingEngines}.
             */
            init: function() {
                var self = this;
                self.map = {};
                self.activeRenderingEngine = undefined;
            },
            /**
             * Instantiates a {@link RenderingEngine} and adds it to the map.
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
                    self.map[self.activeRenderingEngine].active = false;
                }
                self.activeRenderingEngine = renderingEngine.id;
                return renderingEngine;
            },
            /**
             * The size of the map.
             * 
             * @return {number} The number of {@link RenderingEngine}'s in the map.
             */
            size: function() {
                return Object.keys(this.map).length;
            },
            /**
             * Adds a {@link RenderingEngine} to the map.
             * 
             * @param {RenderingEngine} dataSource The {@link RenderingEngine} to add.
             */
            add: function(renderingEngine) {
                var self = this;
                self.map[renderingEngine.id] = renderingEngine;
            },
            /**
             * Deletes a {@link RenderingEngine} from the map by `id`.
             * 
             * @param  {string} id The UUID of the {@link RenderingEngine} to remove from the map.
             */
            delete: function(id) {
                var self = this;
                delete self.map[id];
            }
        };

        return RenderingEngines;
    }
});
