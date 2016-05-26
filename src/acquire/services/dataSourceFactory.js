define([], function() {
    'use strict';

    function DataSourceFactory() {
        function DataSourceFactory(dataSourceConfigId, name) {
            this.dataSourceConfigId = dataSourceConfigId;
            this.data;
            this.name = name;
            this.formattedData;
        }
        DataSourceFactory.prototype = {
            constructor: DataSourceFactory
        };
        return DataSourceFactory;
    }

    DataSourceFactory.$inject=[];

    return DataSourceFactory;
});