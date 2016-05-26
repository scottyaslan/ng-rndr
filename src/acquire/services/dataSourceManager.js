define([], function() {
    'use strict';

    function DataSourceManager(ServiceProvider, DataSourceFactory) {
        function DataSourceManager() {
            this.dataSources = {};
        }
        DataSourceManager.prototype = {
            constructor: DataSourceManager,
            init: function(){
                if(ServiceProvider.DataSourceManager === undefined){
                    ServiceProvider.add('DataSourceManager', dataSourceManager);
                }  
            },
            create: function(dataSourceConfigurationId, name) {
                if(dataSourceConfigurationId !== undefined){
                    var dataSource = new DataSourceFactory(dataSourceConfigurationId, name);
                    dataSourceManager.add(dataSource);
                }
            },
            add: function(dataSource){
                dataSourceManager.dataSources[dataSource.dataSourceConfigId] = dataSource;
            },
            delete: function(dataSourceConfigId){
                delete dataSourceManager.dataSources[dataSourceConfigId];
            }
        };
        var dataSourceManager = new DataSourceManager();
        dataSourceManager.init();
        return dataSourceManager;
    }

    DataSourceManager.$inject=['ServiceProvider', 'DataSourceFactory'];

    return DataSourceManager;
});