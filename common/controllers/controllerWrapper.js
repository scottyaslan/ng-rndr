define(['$ngRndrAggregators'], function($ngRndrAggregators) {
    'use strict';

    return function($scope, uiControls, dataSources, dataSourceConfigurations, acquisitionController, renderingEngineCollectionTabularUIController, renderingEnginesCollection) {
        $scope.uiControls = uiControls;
        $scope.dataSources = dataSources;
        $scope.dataSourceConfigurations = dataSourceConfigurations;
        $scope.acquisitionController = acquisitionController;
        $scope.renderingEngineCollectionTabularUIController = renderingEngineCollectionTabularUIController;
        $scope.renderingEnginesCollection = renderingEnginesCollection;
        $scope.aggregators = $ngRndrAggregators;
    }
});
