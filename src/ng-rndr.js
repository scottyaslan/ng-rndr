define(['directives/rndr',
        'services/AggregatorsProvider',
        'services/SortersProvider',
        'services/DataViewsProvider',
        'services/DerivedAttributesProvider',
        'services/FormattersProvider',
        'services/RenderersProvider',
        'services/RenderingEngine',
        'services/RenderingEngines'
    ],
    function(rndr,
        AggregatorsProvider,
        SortersProvider,
        DataViewsProvider,
        DerivedAttributesProvider,
        FormattersProvider,
        RenderersProvider,
        RenderingEngine,
        RenderingEngines) {

        // Create module
        var app = angular.module('ngRndr', []);

        // Annotate module dependencies
        rndr.$inject = [];
        AggregatorsProvider.$inject = [];
        SortersProvider.$inject = [];
        DerivedAttributesProvider.$inject = [];
        DataViewsProvider.$inject = [];
        RenderersProvider.$inject = [];
        RenderingEngine.$inject = ['$ngRndrAggregators', '$ngRndrRenderers', '$ngRndrDerivedAttributes', '$ngRndrSorters', '$ngRndrFormatters', '$ngRndrDataViews'];
        RenderingEngines.$inject = ['$ngRndrRenderingEngine'];

        // Module providers
        app.provider('$ngRndrRenderers', RenderersProvider);
        app.provider('$ngRndrDataViews', DataViewsProvider);
        app.provider('$ngRndrAggregators', AggregatorsProvider);
        app.provider('$ngRndrSorters', SortersProvider);
        app.provider('$ngRndrDerivedAttributes', DerivedAttributesProvider);
        app.provider('$ngRndrFormatters', FormattersProvider);

        // Module directives
        app.directive('rndr', rndr);

        // Module services
        app.service('$ngRndrRenderingEngine', RenderingEngine);
        app.service('$ngRndrRenderingEngines', RenderingEngines);
    });
