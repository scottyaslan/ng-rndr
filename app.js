define(['../ng-rndr/AppController',
        '../ng-rndr/DataSourceConfiguration',
        '../ng-rndr/dataSourceConfigurations',
        '../ng-rndr/DataSource',
        '../ng-rndr/dataSources',
        '../ng-rndr/renderingEnginesCollection',
        '../ng-rndr/common/controllers/controllerWrapper',
        '../ng-rndr/common/services/uiControls',
        '../ng-rndr/acquire/services/acquisitionController',
        '../ng-rndr/acquire/directives/acquisitionDirective',
        '../ng-rndr/explore/directives/explorationDirective',
        '../ng-rndr/explore/services/exploreController',
        '../ng-rndr/syndicate/directives/dashboardDirective',
        '../ng-rndr/syndicate/services/Dashboard',
        '../ng-rndr/syndicate/directives/gridsterDirective',
        '../ng-rndr/datDirective',
        '../ng-rndr/config',
        'downloadjs',
        'cyclejs',
        'jquery-csv',
        'ng-rndr',
        'angular-route',
        'angular-material',
        'angular-resource',
        'parallax',
        'angular-contextMenu',
        'datatables.net',
        'gridster',
        'angular-ui-sortable',
        'ui-ace'
    ],
    function(AppController,
        DataSourceConfiguration,
        dataSourceConfigurations,
        DataSource,
        dataSources,
        renderingEnginesCollection,
        controllerWrapper,
        uiControls,
        acquisitionController,
        acquisitionDirective,
        explorationDirective,
        exploreController,
        dashboardDirective,
        Dashboard,
        gridsterDirective,
        datDirective,
        config,
        downloadjs) {

        'use strict';

        function createUUID() {
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            return uuid;
        }

        var app = angular.module('sampleApp', ['ngResource', 'ngRoute', 'ngMaterial', 'ui.sortable', 'angular-contextMenu', 'ui.ace', 'ngRndr']);

        // Annotate module dependencies
        DataSourceConfiguration.$inject = [];
        dataSourceConfigurations.$inject = ['DataSourceConfiguration'];
        DataSource.$inject = ['dataSourceConfigurations', '$q', '$rootScope', '$http'];
        dataSources.$inject = ['DataSource'];
        gridsterDirective.$inject = [];
        renderingEnginesCollection.$inject = [];
        datDirective.$inject = [];
        explorationDirective.$inject = ['exploreController', 'renderingEnginesCollection', 'dataSources'];
        dashboardDirective.$inject = ['Dashboard', '$window'];
        exploreController.$inject = ['renderingEnginesCollection', 'dataSources', 'dataSourceConfigurations', '$ngRndrAggregators', 'uiControls', '$window', '$timeout', '$rootScope', '$http'];
        Dashboard.$inject = ['$rootScope', '$compile', '$window', '$q', '$timeout', 'dataSources'];
        uiControls.$inject = ['$window', '$mdSidenav', '$mdUtil', '$mdBottomSheet', '$mdDialog'];
        acquisitionController.$inject = ['$ngRndrRenderingEngine', 'renderingEnginesCollection', 'dataSources', 'dataSourceConfigurations', '$rootScope', '$window', '$q'];
        AppController.$inject = ['$ngRndrRenderingEngine',
            'dataSources',
            'acquisitionController',
            'exploreController',
            '$ngRndrRenderingEngines',
            'renderingEnginesCollection',
            'uiControls',
            'dataSourceConfigurations',
            '$ngRndrRenderers',
            '$window',
            '$rootScope',
            '$timeout',
            '$http',
            '$location',
            '$scope',
            '$q'
        ];
        controllerWrapper.$inject = ['$scope', 'uiControls', 'dataSources', 'dataSourceConfigurations', 'acquisitionController', 'exploreController', 'renderingEnginesCollection', '$ngRndrAggregators'];
        acquisitionDirective.$inject = ['acquisitionController', 'dataSourceConfigurations', 'dataSources'];

        config.$inject = ['$locationProvider', '$mdThemingProvider', '$provide', '$ngRndrRenderersProvider', '$ngRndrDataViewsProvider', '$ngRndrAggregatorsProvider', '$ngRndrDerivedAttributesProvider', '$ngRndrFormattersProvider'];
        app.config(config);

        // Module controllers
        app.controller('Controller', AppController);
        app.controller('controllerWrapper', controllerWrapper);

        // Module services
        app.service('DataSourceConfiguration', DataSourceConfiguration);
        app.service('dataSourceConfigurations', dataSourceConfigurations);
        app.service('DataSource', DataSource);
        app.service('dataSources', dataSources);
        app.service('renderingEnginesCollection', renderingEnginesCollection);
        app.service('uiControls', uiControls);
        app.service('acquisitionController', acquisitionController);
        app.service('exploreController', exploreController);
        app.service('Dashboard', Dashboard);

        // Module directives
        app.directive('gridsterDirective', gridsterDirective);
        app.directive('datDirective', datDirective);
        app.directive('explorationDirective', explorationDirective);
        app.directive('dashboardDirective', dashboardDirective);
        app.directive('acquisitionDirective', acquisitionDirective);

        angular.bootstrap($('#sampleApp1'), ['sampleApp']);
        $('#sampleApp1').show();

        // angular.bootstrap($('#sampleApp2'), ['sampleApp']);
        // $('#sampleApp2').show();

        //Manual Boostrap App
        // if(document.getElementById('exploreAppById')){
        //     $('#exploreAppById').attr('data-uuid', createUUID());
        //     $('#exploreAppById').attr('data-ng-view', '');
        //     $('#exploreAppById').attr('data-layout', 'column');
        //     angular.bootstrap($('#exploreAppById'), ['sampleApp']);
        // }

        // if($('.exploreAppByClass')){
        //     $('.exploreAppByClass').each(function() {
        //         $(this).attr('data-uuid', createUUID());
        //         $(this).attr('data-ng-view', '');
        //         $(this).attr('data-layout', 'column');
        //         angular.bootstrap(this, ['sampleApp']);
        //     });
        // }
    });
