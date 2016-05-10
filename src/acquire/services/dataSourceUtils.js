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

    function DataSourceUtils(ServiceProvider, DataSourceConfigurationManager, $http, $rootScope) {
        function DataSourceUtils() {
        }
        DataSourceUtils.prototype = {
            constructor: DataSourceUtils,
            init: function(){
                if(ServiceProvider.DataSourceUtils === undefined){
                    ServiceProvider.add('DataSourceUtils', dataSourceUtils);
                }
            },
            acquire: function(dataSource) {
                $rootScope.$emit('acquiring data');
                $http(angular.fromJson(DataSourceConfigurationManager.dataSourceConfigurations[dataSource.dataSourceConfigId].httpConfig)).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    if(typeof response.data !== "string"){
                      dataSource.data = JSON.stringify(response.data);
                    } else {
                      dataSource.data = response.data;
                    }
                    $rootScope.$emit('data acquired');
                }, function errorCallback(response) {
                    $rootScope.$emit('data acquired');
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            },
            format: function(dataSource) {
                var flatten = new Function("data", DataSourceConfigurationManager.dataSourceConfigurations[dataSource.dataSourceConfigId].flattenDataFunctionString);
                try{
                    dataSource.formattedData = angular.toJson(flatten(angular.fromJson(dataSource.data)));
                } catch(e){
                    try{
                        dataSource.formattedData = flatten(dataSource.data);
                    } catch(e){
                        //Do nothing
                    }
                }
                try{
                  dataSource.formattedData = angular.fromJson(dataSource.formattedData);
                } catch(e){
                  try{
                    dataSource.formattedData = $.csv.toArrays(dataSource.formattedData);
                  } catch(e){
                    //Do nothing
                  }
                }
            }
        };
        var dataSourceUtils = new DataSourceUtils();
        dataSourceUtils.init();
        return dataSourceUtils;
    }

    DataSourceUtils.$inject=['ServiceProvider', 'DataSourceConfigurationManager', '$http', '$rootScope'];

    return DataSourceUtils;
});