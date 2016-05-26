define([], function() {
    'use strict';

    function DataSourceConfigurationFactory() {
        function DataSourceConfigurationFactory(name) {
            this.id;
            this.flattenDataFunctionString;
            this.httpConfig;
            this.name = name;
        }
        DataSourceConfigurationFactory.prototype = {
            constructor: DataSourceConfigurationFactory,
            init: function() {
                var self = this;
                self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
                self.httpConfig = angular.toJson({
                    method: 'GET',
                    url: 'http://nicolas.kruchten.com/pivottable/examples/montreal_2014.csv'
                });
                self.flattenDataFunctionString = 'return data;';
            }
        };
        return DataSourceConfigurationFactory;
    }

    DataSourceConfigurationFactory.$inject=[];

    return DataSourceConfigurationFactory;
});