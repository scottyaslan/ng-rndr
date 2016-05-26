define([], function() {
    'use strict';

    function ControllerWrapper($scope, UiControls, ServiceProvider) {
        $scope.UiControls = UiControls;
        $scope.ServiceProvider = ServiceProvider;
    }

    ControllerWrapper.$inject=['$scope', 'UiControls', 'ServiceProvider'];

    return ControllerWrapper;
});