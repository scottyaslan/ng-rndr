define([], function() {
    'use strict';

    function DataSourceUtils(DataSourceConfigurationManager, $http, $rootScope) {
        function DataSourceUtils() {
        }
        DataSourceUtils.prototype = {
            constructor: DataSourceUtils,
            init: function(){},
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

    return DataSourceUtils;
});