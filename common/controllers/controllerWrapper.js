define([], function() {
    'use strict';

    return function($scope, uiControls, dataSourceManager, dataSourceConfigurationManager, acquisitionController, exploreController, renderingEngineManager, aggregators) {
        $scope.uiControls = uiControls;
        $scope.dataSourceManager = dataSourceManager;
        $scope.dataSourceConfigurationManager = dataSourceConfigurationManager;
        $scope.acquisitionController = acquisitionController;
        $scope.exploreController = exploreController;
        $scope.renderingEngineManager = renderingEngineManager;
        $scope.aggregators = aggregators;
    }
});
