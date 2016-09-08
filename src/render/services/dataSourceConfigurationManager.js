define([], function() {
    'use strict';

    return function(DataSourceConfiguration) {
        function DataSourceConfigurationManager() {
            this.init();
        }
        DataSourceConfigurationManager.prototype = {
            constructor: DataSourceConfigurationManager,
            init: function() {
                var self = this;
                self.dataSourceConfigurations = {};
                self.activeDataSourceConfiguration = undefined;
            },
            create: function(name) {
                var self = this;
                var dataSourceConfiguration = new DataSourceConfiguration(name);
                dataSourceConfiguration.init();
                self.add(dataSourceConfiguration);
                self.activeDataSourceConfiguration = dataSourceConfiguration.id;
                return dataSourceConfiguration.id;
            },
            add: function(dataSourceConfiguration){
                var self = this;
                self.dataSourceConfigurations[dataSourceConfiguration.id] = dataSourceConfiguration;
            },
            delete: function(id){
                var self = this;
                delete self.dataSourceConfigurations[id];
            },
            dataSourceConfigurationsDefined: function(){
                var self = this;
                return Object.keys(self.dataSourceConfigurations).length !== 0;
            }
        };

        return new DataSourceConfigurationManager();
    }
});