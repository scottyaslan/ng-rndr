define([], function() {
    'use strict';

    return function(renderingEnginesCollection, dataSources, dataSourceConfigurations, uiControls, $window, $timeout, $rootScope, $http) {
        function RenderingEngineCollectionTabularUIController() {
            this.selectedDataSourceConfigId;
            this.dialogContentView;
            this.constants;
        }
        RenderingEngineCollectionTabularUIController.prototype = {
            constructor: RenderingEngineCollectionTabularUIController,
            init: function(constants) {
                var requireDataSourceConfigSelection = false;
                angular.forEach(renderingEnginesCollection.map, function(renderingEngine, uuid) {
                    requireDataSourceConfigSelection = true;
                });
                if (!requireDataSourceConfigSelection) {
                    renderingEngineCollectionTabularUIController.new();
                }
                $rootScope.$emit('renderingEngineCollectionTabularUIController:init');
            },
            new: function() {
                renderingEngineCollectionTabularUIController.selectedDataSourceConfigId = undefined;
                $rootScope.$emit('renderingEngineCollectionTabularUIController:new');
            },
            createRenderingEngine: function() {
                var wrapRenderingEngine = function(renderingEngine, dataSourceConfigurationId) {
                    //This is a flag that the tabs use in the Explore perspective to know which tab is active.
                    renderingEngine.disabled = false;
                    //This is an objet the `dashboard` uses in the Dashboard Designer perspective to know location and size of the widget.
                    renderingEngine.tile = {
                        size_x: 1,
                        size_y: 1,
                        col: 1,
                        row: 1
                    };
                
                    //This is the dataSourceConfigId used to pass data to the rndr directive
                    renderingEngine.dataSourceConfigId = dataSourceConfigurationId;
                };

                var dataSourceConfigurationId = this.selectedDataSourceConfigId;

                if (dataSources.map[dataSourceConfigurationId] === undefined) {
                    dataSources.create(dataSourceConfigurationId, dataSourceConfigurations.map[dataSourceConfigurationId].name);
                    $http(angular.fromJson(dataSourceConfigurations.map[dataSourceConfigurationId].httpConfig)).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        var dataSource = dataSources.map[dataSourceConfigurationId];
                        dataSource.data = $.csv.toArrays(response.data);
                        dataSource.format(dataSources.map[dataSourceConfigurationId]);
                        wrapRenderingEngine(renderingEnginesCollection.create("DT - Table"), dataSourceConfigurationId);
                    }, function errorCallback(response) {
                        var tmp;
                        dataSources.delete(dataSourceConfigurationId);
                    });
                } else {
                    wrapRenderingEngine(renderingEnginesCollection.create("DT - Table"), dataSourceConfigurationId);
                }
            },
            hideDialogAndDraw: function() {
               uiControls.hideDialog(); renderingEnginesCollection.map[renderingEnginesCollection.activeRenderingEngine].draw($('#renderer'), dataSources.map[renderingEnginesCollection.map[renderingEnginesCollection.activeRenderingEngine].dataSourceConfigId].formattedData);
            },
            initiateDataSourceWizard: function() {
                renderingEngineCollectionTabularUIController.dialogContentView = '';
                uiControls.hideDialog();
                $rootScope.$emit('renderingEngineCollectionTabularUIController:initiate data source configuration wizard');
            },
            closeDialog: function() {
                uiControls.hideDialog();
                if (Object.keys(renderingEnginesCollection.map).length === 0) {
                    //$rootScope.$emit('acquisitionController:cancel');  
                }
            }
        };
        var renderingEngineCollectionTabularUIController = new RenderingEngineCollectionTabularUIController();
        return renderingEngineCollectionTabularUIController;
    }
});
