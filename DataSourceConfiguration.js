define([], function() {
    'use strict';

    /**
     * Create a v4 UUID.
     * @return {string} The generated UUID.
     */
    var generateUUID = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })
    };

    return function() {
        /**
         * {@link DataSourceConfiguration} constructor.
         * 
         * @param {string} name       The human readable name for this data source configuration.
         * @param {Object} httpConfig Angular http config: https://docs.angularjs.org/api/ng/service/$http#usage.
         */
        function DataSourceConfiguration(name, httpConfig) {
            this.id = generateUUID();
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
