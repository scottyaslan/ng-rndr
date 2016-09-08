define([], function() {
    'use strict';

    return function(dataUtils) {
        function DataSourceConfiguration(name) {
            this.id;
            this.flattenDataFunctionString;
            this.httpConfig;
            this.name = name;
        }
        DataSourceConfiguration.prototype = {
            constructor: DataSourceConfiguration,
            init: function() {
                var self = this;
                self.id = dataUtils.generateUUID();
                self.httpConfig = angular.toJson({
                    method: 'GET',
                    url: 'http://nicolas.kruchten.com/pivottable/examples/montreal_2014.csv'
                });
                self.flattenDataFunctionString = 'return data;';
            }
        };
        return DataSourceConfiguration;
    }
});