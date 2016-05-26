define(['acquire/directives/acquisitionDirective',
    'acquire/services/acquisitionController',
    'acquire/services/dataSourceConfigurationFactory',
    'acquire/services/dataSourceConfigurationManager',
    'acquire/services/dataSourceFactory',
    'acquire/services/dataSourceManager',
    'acquire/services/dataSourceUtils',
    'common/controllers/controllerWrapper',
    'common/directives/gridsterDirective',
    'common/services/serviceProvider',
    'common/services/uiControls',
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
    'syndicate/services/dashboardFactory'], 
function(acquisitionDirective,
    AcquisitionController,
    DataSourceConfigurationFactory,
    DataSourceConfigurationManager,
    DataSourceFactory,
    DataSourceManager,
    DataSourceUtils,
    ControllerWrapper,
    gridsterDirective,
    ServiceProvider,
    UiControls,
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
    DashboardFactory) {
    var app = angular.module('ngRndr', []);
    app.directive('acquisitionDirective', acquisitionDirective);
    app.factory('AcquisitionController', AcquisitionController);
    app.factory('DataSourceConfigurationFactory', DataSourceConfigurationFactory);
    app.factory('DataSourceConfigurationManager', DataSourceConfigurationManager);
    app.factory('DataSourceFactory', DataSourceFactory);
    app.factory('DataSourceManager', DataSourceManager);
    app.factory('DataSourceUtils', DataSourceUtils);
    app.controller('ControllerWrapper', ControllerWrapper);
    app.directive('gridsterDirective', gridsterDirective);
    app.factory('ServiceProvider', ServiceProvider);
    app.factory('UiControls', UiControls);
    app.directive('explorationDirective', explorationDirective);
    app.factory('ExploreController', ExploreController);
    app.directive('renderingEngineDirective', renderingEngineDirective);
    app.factory('Aggregators', Aggregators);
    app.factory('AggregatorTemplates', AggregatorTemplates);
    app.directive('dashboardDirective', dashboardDirective);
    app.factory('DashboardFactory', DashboardFactory);
    app.factory('PivotDataFactory', PivotDataFactory);
    app.factory('Renderers', Renderers);
    app.factory('RenderingEngineFactory', RenderingEngineFactory);
    app.factory('RenderingEngineManager', RenderingEngineManager);
    app.factory('RenderingEngineUtils', RenderingEngineUtils);
});