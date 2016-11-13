define([], function() {
    'use strict';

    return function(dataSourceConfigurations, $q, $rootScope, $http) {
        /**
         * {@link DataSource} constructor.
         * 
         * @param {string} dataSourceConfigId The UUID of the data source configuration.
         * @param {[type]} name               The human readable name for this data source.
         */
        function DataSource(dataSourceConfigId, name) {
            this.dataSourceConfigId = dataSourceConfigId;
            this.data;
            this.name = name;
            this.formattedData;
        }
        DataSource.prototype = {
            /**
             * @typedef DataSource
             * @type {object}
             * @property {string} dataSourceConfigId - The UUID for this data source configuration.
             * @property {string} data - The raw data returned from the configured REST endpoint.
             * @property {object} formattedData - The transformed data returned from the configured REST endpoint.
             * @property {string} name - The human readable name for this data source.
             */
            constructor: DataSource,
            /**
             * Refreshes the data source.
             */
            refresh: function() {
                var promises = [this.acquire(this)];
                $q.all(promises).then(function() {
                    this.format(this);
                });
            },
            /**
             * Acquires data from the configured REST endpoint.
             */
            acquire: function() {
                $rootScope.$emit('dataSource:acquire:begin');
                var self = this;
                var deffered = $q.defer();
                $http(angular.fromJson(dataSourceConfigurations.map[this.dataSourceConfigId].httpConfig)).then(function successCallback(response) {
                    if (typeof response.data !== "string") {
                        self.data = JSON.stringify(response.data);
                    } else {
                        self.data = response.data;
                    }
                    deffered.resolve();
                    $rootScope.$emit('dataSource:acquire:success');
                }, function errorCallback(response) {
                    deffered.reject();
                    $rootScope.$emit('dataSource:acquire:error');
                });
                return deffered.promise;
            },
            /**
             * Formats the raw data.
             */
            format: function() {
                var flatten = new Function("data", dataSourceConfigurations.map[this.dataSourceConfigId].flattenDataFunctionString);
                try {
                    this.formattedData = angular.toJson(flatten(angular.fromJson(this.data)));
                } catch (e) {
                    try {
                        this.formattedData = flatten(this.data);
                    } catch (_error) {
                        if (typeof console !== "undefined" && console !== null) {
                            console.error(_error.stack);
                        }
                    }
                }
                try {
                    this.formattedData = angular.fromJson(this.formattedData);
                } catch (e) {
                    try {
                        this.formattedData = $.csv.toArrays(this.formattedData);
                    } catch (_error) {
                        if (typeof console !== "undefined" && console !== null) {
                            console.error(_error.stack);
                        }
                    }
                }
            }
        };
        return DataSource;
    }
});
