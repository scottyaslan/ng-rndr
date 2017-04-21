define([],
    function() {
        'use strict';

        return function(exploreController, dialogControllerService, $ngRndrRenderers, $scope) {
            function AppController() {
                this.init();
            };
            AppController.prototype = {
                constructor: AppController,
                init: function() {
                    dialogControllerService.init();
                }
            };
            
            $scope.renderers = $ngRndrRenderers;
            $scope.dialogControllerService = dialogControllerService;
            $scope.exploreController = exploreController;

            var controller = new AppController();
            $scope.Controller = controller;
        };
    });
