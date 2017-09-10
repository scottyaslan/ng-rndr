(function(root, factory) {
    define(['rndr'], function(rndr) {
        return factory(root, rndr);
    });
}(this, function(root, rndr) {
    'use strict';

    return function(exploreController, dialogControllerService, $scope) {
        function AppController() {
            this.init();
        };
        AppController.prototype = {
            constructor: AppController,
            init: function() {
                dialogControllerService.init();
            }
        };

        $scope.renderers = rndr.plugins.renderers;
        $scope.dialogControllerService = dialogControllerService;
        $scope.exploreController = exploreController;

        var controller = new AppController();
        $scope.Controller = controller;
    };
}));