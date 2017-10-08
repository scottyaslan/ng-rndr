(function(root, factory) {
    define(['rndr'], function(rndr) {
        return factory(rndr);
    });
}(this, function(rndr) {
    'use strict';

    return function($scope, dialogControllerService, exploreController) {
        $scope.dialogControllerService = dialogControllerService;
        $scope.exploreController = exploreController;
        $scope.aggregators = [];
        rndr.plugins.aggregators.forEach(function(value, key) {
            $scope.aggregators.push(key);
        });
    };
}));