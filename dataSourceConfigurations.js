define([], function() {
    'use strict';

    return function(DataSourceConfiguration) {
        /**
         * {@link DataSourceConfigurations} constructor.
         */
        function DataSourceConfigurations() {
            this.init();
        }
        DataSourceConfigurations.prototype = {
            /**
             * @typedef DataSourceConfigurations
             * @type {object}
             * @property {object} map - The map of registered {@link DataSourceConfiguration}'s.
             * @property {string} activeDataSourceConfiguration - The UUID of the active {@link DataSourceConfiguration}.
             */
            constructor: DataSourceConfigurations,
            /**
             * Initialize the {@link DataSourceConfigurations}.
             */
            init: function() {
                var self = this;
                self.map = {};
                self.activeDataSourceConfiguration = undefined;
            },
            /**
             * Instantiates a {@link DataSourceConfiguration} and adds it to the manager by `name` for fast lookups.
             * 
             * @param  {string} name The name of the {@link DataSourceConfiguration}.
             * @param  {Object} httpConfig The configuration for a REST endpoint.
             * 
             * @return {string}      The UUID of the created `DataSourceConfiguration`.
             */
            create: function(name, httpConfig) {
                var self = this;
                var dataSourceConfiguration = new DataSourceConfiguration(name, httpConfig);
                self.add(dataSourceConfiguration);
                self.activeDataSourceConfiguration = dataSourceConfiguration.id;
                return dataSourceConfiguration.id;
            },
            /**
             * The size of the manager.
             * 
             * @return {number} The number of {@link DataSourceConfiguration}'s in the manager.
             */
            size: function() {
                return Object.keys(this.map).length;
            },
            /**
             * Adds a {@link DataSourceConfiguration} to the manager.
             * 
             * @param {DataSourceConfiguration} dataSourceConfiguration The {@link DataSourceConfiguration} to add.
             */
            add: function(dataSourceConfiguration) {
                var self = this;
                self.map[dataSourceConfiguration.id] = dataSourceConfiguration;
            },
            /**
             * Deletes a {@link DataSourceConfiguration} from the manager by `id`.
             * 
             * @param  {string} id The UUID of the {@link DataSourceConfiguration} to remove from the manager.
             */
            delete: function(id) {
                var self = this;
                delete self.map[id];
            }
        };

        return new DataSourceConfigurations();
    }
});
