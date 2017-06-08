define(['renderers/angular/pivot-data/directives/rndr',
        'renderers/angular/pivot-data/directives/pivot-data-ui-directive',
        'renderers/angular/pivot-data/services/pivot-data-ui-explore-controller',
        'renderers/angular/pivot-data/services/pivot-data-ui-dialog-controller-service',
        'renderers/angular/pivot-data/controllers/pivot-data-ui-controller',
        'renderers/angular/pivot-data/controllers/pivot-data-ui-dialog-controller'
    ],
    function(rndr,
        pivotDataUIDirective,
        pivotDataUIExploreController,
        pivotDataUIDialogControllerService,
        pivotDataUIController,
        pivotDataUIDialogController) {

        // Create module
        var app = angular.module('ngRndr', []);

        // Annotate module dependencies
        rndr.$inject = [];
        pivotDataUIDirective.$inject = [];
        pivotDataUIExploreController.$inject = ['$window', '$timeout'];
        pivotDataUIDialogControllerService.$inject = ['$mdDialog'];
        pivotDataUIController.$inject = ['pivotDataUIExploreController',
            'pivotDataUIDialogControllerService',
            '$scope'
        ];
        pivotDataUIDialogController.$inject = ['$scope', 'pivotDataUIDialogControllerService', 'pivotDataUIExploreController'];

        // Module controllers
        app.controller('pivotDataUIController', pivotDataUIController);
        app.controller('pivotDataUIDialogController', pivotDataUIDialogController);

        // Module directives
        app.directive('rndr', rndr);
        app.directive('pivotDataUiDirective', pivotDataUIDirective);

        // Module services
        app.service('pivotDataUIDialogControllerService', pivotDataUIDialogControllerService);
        app.service('pivotDataUIExploreController', pivotDataUIExploreController);
    });
