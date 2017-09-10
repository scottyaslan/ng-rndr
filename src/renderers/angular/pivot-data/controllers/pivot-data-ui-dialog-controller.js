(function(root, factory) {
    define(['rndr'], function(rndr) {
        return factory(root, rndr);
    });
}(this, function(root, rndr) {
    'use strict';

    return function($scope, dialogControllerService, exploreController) {
        $scope.dialogControllerService = dialogControllerService;
        $scope.exploreController = exploreController;
        $scope.aggregators = rndr.plugins.aggregators;
    };
}));