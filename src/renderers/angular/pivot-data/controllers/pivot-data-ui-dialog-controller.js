define(['$ngRndrAggregators'], function($ngRndrAggregators) {
    'use strict';

    return function($scope, dialogControllerService, exploreController) {
        $scope.dialogControllerService = dialogControllerService;
        $scope.exploreController = exploreController;
        $scope.aggregators = $ngRndrAggregators;
    };
});
