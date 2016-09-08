define([], function() {
    'use strict';

    return function(dataSourceConfigurationManager, $q, $rootScope, $http) {
        function DataSource(dataSourceConfigId, name) {
            this.dataSourceConfigId = dataSourceConfigId;
            this.data;
            this.name = name;
            this.formattedData;
        }
        DataSource.prototype = {
            constructor: DataSource,
            refresh: function(id){
                var promises = [this.acquire(this)];
                $q.all(promises).then(function() {
                    this.format(this);
                });
            },
            acquire: function() {
                $rootScope.$emit('dataSource:acquire:begin');
                var self = this;
                var deffered = $q.defer();
                $http(angular.fromJson(dataSourceConfigurationManager.dataSourceConfigurations[this.dataSourceConfigId].httpConfig)).then(function successCallback(response) {
                    if(typeof response.data !== "string"){
                      self.data = JSON.stringify(response.data);
                    } else {
                      self.data = response.data;
                    }
                    deffered.resolve();
                    $rootScope.$emit('dataSource:acquire:success');
                }, function errorCallback(response) {
                    deffered.reject();
                    $rootScope.$emit('dataSource:acquire:error');
                });
                return deffered.promise;
            },
            format: function() {
                var flatten = new Function("data", dataSourceConfigurationManager.dataSourceConfigurations[this.dataSourceConfigId].flattenDataFunctionString);
                try{
                    this.formattedData = angular.toJson(flatten(angular.fromJson(this.data)));
                } catch(e){
                    try{
                        this.formattedData = flatten(this.data);
                    } catch(e){
                        //Do nothing
                    }
                }
                try{
                  this.formattedData = angular.fromJson(this.formattedData);
                } catch(e){
                  try{
                    this.formattedData = $.csv.toArrays(this.formattedData);
                  } catch(e){
                    //Do nothing
                  }
                }
            }
        };
        return DataSource;
    }
});