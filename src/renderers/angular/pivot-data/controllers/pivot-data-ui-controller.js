(function(root, factory) {
    define(['rndr'], function(rndr) {
        return factory(rndr);
    });
}(this, function(rndr) {
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

        $scope.renderers = [];
        rndr.plugins.renderers.forEach(function(value, key) {
            $scope.renderers.push(key);
        });

        $scope.dialogControllerService = dialogControllerService;
        $scope.exploreController = exploreController;

        var controller = new AppController();
        $scope.Controller = controller;
    };
}));