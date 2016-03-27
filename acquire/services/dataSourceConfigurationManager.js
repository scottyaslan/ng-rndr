/*   Data Analytics Toolkit: Explore any data avaialable through a REST service 
*    Copyright (C) 2016  Scott Aslan
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.html>.
*/
define([], function() {
    'use strict';

    function DataSourceConfigurationManager(ServiceProvider, DataSourceConfigurationFactory) {
        function DataSourceConfigurationManager() {
            this.dataSourceConfigurations = {};
            this.activeDataSourceConfiguration;
        }
        DataSourceConfigurationManager.prototype = {
            constructor: DataSourceConfigurationManager,
            init: function() {
                if(ServiceProvider.DataSourceConfigurationManager === undefined){
                    ServiceProvider.add('DataSourceConfigurationManager', dataSourceConfigurationManager);
                }
            },
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

    DataSourceConfigurationManager.$inject=['ServiceProvider', 'DataSourceConfigurationFactory'];

    return DataSourceConfigurationManager;
});