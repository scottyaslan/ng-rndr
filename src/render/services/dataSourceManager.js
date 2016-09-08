define([], function() {
    'use strict';

    return function(DataSource) {
        function DataSourceManager() {
            this.init();
        }
        DataSourceManager.prototype = {
            constructor: DataSourceManager,
            init: function(){
                var self = this;
                self.dataSources = {};
            },
            create: function(dataSourceConfigurationId, name) {
                var self = this;
                if(dataSourceConfigurationId !== undefined){
                    var dataSource = new DataSource(dataSourceConfigurationId, name);
                    self.add(dataSource);
                    return dataSource;
                }
            },
            add: function(dataSource){
                var self = this;
                self.dataSources[dataSource.dataSourceConfigId] = dataSource;
            },
            delete: function(dataSourceConfigId){
                var self = this;
                delete self.dataSources[dataSourceConfigId];
            },
            refresh: function(){
                angular.forEach(this.dataSources, function(dataSource) {
                    dataSource.refresh();
                });
            }
        };

        return new DataSourceManager();
    }
});