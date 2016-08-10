define([], function() {
    'use strict';

    function DataSourceConfigurationManager(DataSourceConfigurationFactory) {
        function DataSourceConfigurationManager() {
            this.dataSourceConfigurations = {};
            this.activeDataSourceConfiguration;
        }
        DataSourceConfigurationManager.prototype = {
            constructor: DataSourceConfigurationManager,
            init: function() {},
            create: function(name) {
                var dataSourceConfiguration = new DataSourceConfigurationFactory(name);
                dataSourceConfiguration.init();
                dataSourceConfigurationManager.add(dataSourceConfiguration);
                dataSourceConfigurationManager.activeDataSourceConfiguration = dataSourceConfiguration.id;
                return dataSourceConfiguration.id;
            },
            add: function(dataSourceConfiguration){
                dataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfiguration.id] = dataSourceConfiguration;
            },
            delete: function(id){
                delete dataSourceConfigurationManager.dataSourceConfigurations[id];
            },
            dataSourceConfigurationsDefined: function(){
                return Object.keys(dataSourceConfigurationManager.dataSourceConfigurations).length !== 0;
            }
        };
        var dataSourceConfigurationManager = new DataSourceConfigurationManager();
        dataSourceConfigurationManager.init();
        return dataSourceConfigurationManager;
    }

    return DataSourceConfigurationManager;
});