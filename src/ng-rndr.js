define(['directives/rndr',
        'services/AggregatorsProvider',
        'services/DataViewsProvider',
        'services/RenderersProvider',
        'services/RenderingEngine',
        'services/RenderingEngines',
        'plugins/pivot-data/renderers/pivot-data-ui/directives/pivot-data-ui-directive',
        'plugins/pivot-data/renderers/pivot-data-ui/services/pivot-data-ui-explore-controller',
        'plugins/pivot-data/renderers/pivot-data-ui/services/pivot-data-ui-dialog-controller-service',
        'plugins/pivot-data/renderers/pivot-data-ui/controllers/pivot-data-ui-controller',
        'plugins/pivot-data/renderers/pivot-data-ui/controllers/pivot-data-ui-dialog-controller'
    ],
    function(rndr,
        AggregatorsProvider,
        DataViewsProvider,
        RenderersProvider,
        RenderingEngine,
        RenderingEngines,
        pivotDataUIDirective,
        pivotDataUIExploreController,
        pivotDataUIDialogControllerService,
        pivotDataUIController,
        pivotDataUIDialogController) {

        // Create module
        var app = angular.module('ngRndr', []);

        // Annotate module dependencies
        rndr.$inject = [];
        AggregatorsProvider.$inject = [];
        DataViewsProvider.$inject = [];
        RenderersProvider.$inject = [];
        RenderingEngine.$inject = ['$ngRndrAggregators', '$ngRndrRenderers', '$ngRndrDataViews'];
        RenderingEngines.$inject = ['$ngRndrRenderingEngine'];
        pivotDataUIDirective.$inject = [];
        pivotDataUIExploreController.$inject = ['$window', '$timeout'];
        pivotDataUIDialogControllerService.$inject = ['$mdDialog'];
        pivotDataUIController.$inject = ['pivotDataUIExploreController',
            'pivotDataUIDialogControllerService',
            '$ngRndrRenderers',
            '$scope'
        ];
        pivotDataUIDialogController.$inject = ['$scope', 'pivotDataUIDialogControllerService', 'pivotDataUIExploreController', '$ngRndrAggregators'];

        // Module controllers
        app.controller('pivotDataUIController', pivotDataUIController);
        app.controller('pivotDataUIDialogController', pivotDataUIDialogController);

        // Module providers
        app.provider('$ngRndrRenderers', RenderersProvider);
        app.provider('$ngRndrDataViews', DataViewsProvider);
        app.provider('$ngRndrAggregators', AggregatorsProvider);

        // Module directives
        app.directive('rndr', rndr);
        app.directive('pivotDataUiDirective', pivotDataUIDirective);

        // Module services
        app.service('$ngRndrRenderingEngine', RenderingEngine);
        app.service('$ngRndrRenderingEngines', RenderingEngines);
        app.service('pivotDataUIDialogControllerService', pivotDataUIDialogControllerService);
        app.service('pivotDataUIExploreController', pivotDataUIExploreController);
    });
