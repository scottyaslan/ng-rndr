/*   Data Analytics Toolkit: Explore any data avaialable through a REST service 
*    Copyright (C) 2016  Scott Aslan
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.html>.
*/
define(['config',
    '../../acquire/directives/acquisitionDirective',
    '../../acquire/services/acquisitionController',
    '../../acquire/services/dataSourceConfigurationFactory',
    '../../acquire/services/dataSourceConfigurationManager',
    '../../acquire/services/dataSourceFactory',
    '../../acquire/services/dataSourceManager',
    '../../acquire/services/dataSourceUtils',
    '../../common/controllers/controllerWrapper',
    '../../common/directives/gridsterDirective',
    '../../common/services/serviceProvider',
    '../../common/services/uiControls',
    'controllers/DATController',
    'directives/datDirective',
    '../../explore/directives/explorationDirective',
    '../../explore/services/exploreController',
    '../../render/directives/renderingEngineDirective',
    '../../render/services/aggregators',
    '../../render/services/aggregatorTemplates',
    '../../render/services/pivotDataFactory',
    '../../render/services/renderers',
    '../../render/services/renderingEngineFactory',
    '../../render/services/renderingEngineManager',
    '../../render/services/renderingEngineUtils',
    '../../syndicate/directives/dashboardDirective',
    '../../syndicate/services/dashboardFactory'], 
function(config,
    acquisitionDirective,
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
    DATController,
    datDirective,
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
    //Create exploreApp
    var app = angular.module('exploreApp', ['ngResource', 'ngRoute', 'ngMaterial', 'LocalStorageModule', 'ui.sortable', 'angular-contextMenu', 'ui.ace']);
    //Configure exploreApp 
    app.config(config);
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
    app.controller('DATController', DATController);
    app.directive('datDirective', datDirective);
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

    return app;
});