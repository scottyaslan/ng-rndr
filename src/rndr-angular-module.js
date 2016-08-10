define(['acquire/directives/acquisitionDirective',
    'acquire/services/acquisitionController',
    'acquire/services/dataSourceConfigurationFactory',
    'acquire/services/dataSourceConfigurationManager',
    'acquire/services/dataSourceFactory',
    'acquire/services/dataSourceManager',
    'acquire/services/dataSourceUtils',
    'explore/directives/explorationDirective',
    'explore/services/exploreController',
    'render/directives/renderingEngineDirective',
    'render/services/aggregators',
    'render/services/aggregatorTemplates',
    'render/services/pivotDataFactory',
    'render/services/renderers',
    'render/services/renderingEngineFactory',
    'render/services/renderingEngineManager',
    'render/services/renderingEngineUtils',
    'syndicate/directives/dashboardDirective',
    'syndicate/services/dashboardFactory',
    'syndicate/directives/gridsterDirective'], 
function(acquisitionDirective,
    AcquisitionController,
    DataSourceConfigurationFactory,
    DataSourceConfigurationManager,
    DataSourceFactory,
    DataSourceManager,
    DataSourceUtils,
    explorationDirective,
    ExploreController,
    renderingEngineDirective,
    Aggregators,
    AggregatorTemplates,
    PivotDataFactory,
    Renderers,
    RenderingEngineFactory,
    RenderingEngineManager,
    RenderingEngineUtils,
    dashboardDirective,
    DashboardFactory,
    gridsterDirective) {

    // Create module
    var app = angular.module('ngRndr', []);

    // Annotate module dependencies
    acquisitionDirective.$inject=['AcquisitionController', 'DataSourceConfigurationManager', 'DataSourceManager', 'DataSourceUtils'];
    gridsterDirective.$inject=[];
    explorationDirective.$inject=['ExploreController', 'RenderingEngineManager', 'DataSourceManager'];
    dashboardDirective.$inject=['DashboardFactory', '$window'];
    renderingEngineDirective.$inject=[];
    AcquisitionController.$inject=['RenderingEngineFactory', 'RenderingEngineManager', 'DataSourceUtils', 'DataSourceManager', 'DataSourceConfigurationManager', '$rootScope', '$window'];
    DataSourceConfigurationFactory.$inject=[];
    DataSourceConfigurationManager.$inject=['DataSourceConfigurationFactory'];
    DataSourceFactory.$inject=[];
    DataSourceManager.$inject=['DataSourceFactory'];
    DataSourceUtils.$inject=['DataSourceConfigurationManager', '$http', '$rootScope'];
    ExploreController.$inject=['RenderingEngineManager', 'DataSourceManager', '$window', '$timeout', '$rootScope'];
    Aggregators.$inject=['AggregatorTemplates', 'RenderingEngineUtils'];
    AggregatorTemplates.$inject=['RenderingEngineUtils'];
    PivotDataFactory.$inject=['RenderingEngineUtils'];
    Renderers.$inject=[];
    RenderingEngineFactory.$inject=['Aggregators', 'RenderingEngineUtils', 'Renderers', 'PivotDataFactory', '$q', '$timeout', '$window', '$rootScope'];
    RenderingEngineManager.$inject=['RenderingEngineFactory', 'DataSourceConfigurationManager', 'DataSourceManager', 'DataSourceUtils', '$http'];
    RenderingEngineUtils.$inject=[];
    DashboardFactory.$inject=['$rootScope', '$compile', '$window', '$q', '$timeout', 'DataSourceManager'];

    // Module directives
    app.directive('acquisitionDirective', acquisitionDirective);
    app.directive('gridsterDirective', gridsterDirective);
    app.directive('explorationDirective', explorationDirective);
    app.directive('dashboardDirective', dashboardDirective);
    app.directive('renderingEngineDirective', renderingEngineDirective);

    // Module services
    app.service('AcquisitionController', AcquisitionController);
    app.service('DataSourceConfigurationFactory', DataSourceConfigurationFactory);
    app.service('DataSourceConfigurationManager', DataSourceConfigurationManager);
    app.service('DataSourceFactory', DataSourceFactory);
    app.service('DataSourceManager', DataSourceManager);
    app.service('DataSourceUtils', DataSourceUtils);
    app.service('ExploreController', ExploreController);
    app.service('Aggregators', Aggregators);
    app.service('AggregatorTemplates', AggregatorTemplates);
    app.service('PivotDataFactory', PivotDataFactory);
    app.service('Renderers', Renderers);
    app.service('RenderingEngineFactory', RenderingEngineFactory);
    app.service('RenderingEngineManager', RenderingEngineManager);
    app.service('RenderingEngineUtils', RenderingEngineUtils);
    app.service('DashboardFactory', DashboardFactory);
});