define([], function() {
    'use strict';

    return function($scope, dialogControllerService, exploreController, aggregators) {
        $scope.dialogControllerService = dialogControllerService;
        $scope.exploreController = exploreController;
        $scope.aggregators = aggregators;
    };
});
