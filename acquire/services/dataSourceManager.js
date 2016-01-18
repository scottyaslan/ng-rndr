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
define(['app', '../../common/services/serviceProvider', '../../acquire/services/dataSourceFactory'], function(app) {
    app.factory('DataSourceManager', ['ServiceProvider', 'DataSourceFactory',
        function(ServiceProvider, DataSourceFactory) {
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
                },
                dataSourcesDefined: function(){
                    return Object.keys(dataSourceManager.dataSources).length !== 0;
                },
            };
            var dataSourceManager = new DataSourceManager();
            dataSourceManager.init();
            return dataSourceManager;
        }
    ]);
});