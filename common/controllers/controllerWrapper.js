define([], function() {
    'use strict';

    return function($scope, uiControls, dataSources, dataSourceConfigurations, acquisitionController, exploreController, renderingEnginesCollection, aggregators) {
        $scope.uiControls = uiControls;
        $scope.dataSources = dataSources;
        $scope.dataSourceConfigurations = dataSourceConfigurations;
        $scope.acquisitionController = acquisitionController;
        $scope.exploreController = exploreController;
        $scope.renderingEnginesCollection = renderingEnginesCollection;
        $scope.aggregators = aggregators;
    }
});
