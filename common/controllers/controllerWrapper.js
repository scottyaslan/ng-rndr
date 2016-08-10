define([], function() {
    'use strict';

    function ControllerWrapper($scope, UiControls, DataSourceManager, DataSourceConfigurationManager, AcquisitionController, ExploreController, RenderingEngineManager, Aggregators) {
        $scope.UiControls = UiControls;
        $scope.DataSourceManager = DataSourceManager;
        $scope.DataSourceConfigurationManager = DataSourceConfigurationManager;
        $scope.AcquisitionController = AcquisitionController;
        $scope.ExploreController = ExploreController;
        $scope.RenderingEngineManager = RenderingEngineManager;
        $scope.Aggregators = Aggregators;
    }

    return ControllerWrapper;
});