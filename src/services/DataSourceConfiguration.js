define([], function() {
    'use strict';

    return function(dataUtils) {
        /**
         * {@link DataSourceConfiguration} constructor.
         * 
         * @param {string} name       The human readable name for this data source configuration.
         * @param {Object} httpConfig Angular http config: https://docs.angularjs.org/api/ng/service/$http#usage.
         */
        function DataSourceConfiguration(name, httpConfig) {
            this.id = dataUtils.generateUUID();
            this.flattenDataFunctionString = 'return data;';
            this.httpConfig = httpConfig;
            this.name = name;
        }
        DataSourceConfiguration.prototype = {
            /**
             * @typedef DataSourceConfiguration
             * @type {object}
             * @property {string} id - The UUID for this data source configuration.
             * @property {string} flattenDataFunctionString - The code .
             * @property {object} httpConfig - Angular http config: https://docs.angularjs.org/api/ng/service/$http#usage.
             * @property {string} name - The human readable name for this data source configuration.
             */
            constructor: DataSourceConfiguration
        };
        return DataSourceConfiguration;
    }
});
