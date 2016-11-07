define([], function() {
    'use strict';

    return function(RenderingEngine, dataSourceConfigurationManager, dataSourceManager, $http) {
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
             * @property {object} dictionary - The map of registered {@link RenderingEngine}'s.
             * @property {string} activeRenderingEngine - The UUID of the active {@link RenderingEngine}.
             */
            constructor: RenderingEngines,
            /**
             * Initialize the {@link RenderingEngines}.
             */
            init: function() {
                var self = this;
                self.dictionary = {};
                self.activeRenderingEngine = undefined;
            },
            /**
             * Instantiates a {@link RenderingEngine} and adds it to the dictionary.
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
                    self.dictionary[self.activeRenderingEngine].active = false;
                }
                self.activeRenderingEngine = renderingEngine.id;
                return renderingEngine;
            },
            /**
             * The size of the dictionary.
             * 
             * @return {number} The number of {@link RenderingEngine}'s in the dictionary.
             */
            size: function() {
                return Object.keys(this.dictionary).length;
            },
            /**
             * Adds a {@link RenderingEngine} to the dictionary.
             * 
             * @param {RenderingEngine} dataSource The {@link RenderingEngine} to add.
             */
            add: function(renderingEngine) {
                var self = this;
                self.dictionary[renderingEngine.id] = renderingEngine;
            },
            /**
             * Deletes a {@link RenderingEngine} from the dictionary by `id`.
             * 
             * @param  {string} id The UUID of the {@link RenderingEngine} to remove from the dictionary.
             */
            delete: function(id) {
                var self = this;
                delete self.dictionary[id];
            }
        };

        return RenderingEngines;
    }
});
