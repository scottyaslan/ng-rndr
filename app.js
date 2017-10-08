define(['../rndr/AppController',
        '../rndr/DataSourceConfiguration',
        '../rndr/dataSourceConfigurations',
        '../rndr/DataSource',
        '../rndr/dataSources',
        '../rndr/renderingEnginesCollection',
        '../rndr/common/controllers/controllerWrapper',
        '../rndr/common/services/uiControls',
        '../rndr/acquire/services/acquisitionController',
        '../rndr/acquire/directives/acquisitionDirective',
        '../rndr/rendering-engine-collection-tabular-ui/directives/rendering-engine-collection-tabular-ui-directive',
        '../rndr/rendering-engine-collection-tabular-ui/services/rendering-engine-collection-tabular-ui-controller',
        '../rndr/syndicate/directives/dashboardDirective',
        '../rndr/syndicate/services/Dashboard',
        '../rndr/syndicate/directives/gridsterDirective',
        '../rndr/datDirective',
        '../rndr/config',
        'downloadjs', 
        'cyclejs',
        'jquery-csv',
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
        renderingEngineCollectionTabularUIDirective,
        renderingEngineCollectionTabularUIController,
        dashboardDirective,
        Dashboard,
        gridsterDirective,
        datDirective,
        config) {

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
        renderingEngineCollectionTabularUIDirective.$inject = ['renderingEngineCollectionTabularUIController', 'renderingEnginesCollection', 'dataSources'];
        dashboardDirective.$inject = ['Dashboard', '$window'];
        renderingEngineCollectionTabularUIController.$inject = ['renderingEnginesCollection', 'dataSources', 'dataSourceConfigurations', 'uiControls', '$window', '$timeout', '$rootScope', '$http'];
        Dashboard.$inject = ['$rootScope', '$compile', '$window', '$q', '$timeout', 'dataSources'];
        uiControls.$inject = ['$window', '$mdSidenav', '$mdUtil', '$mdBottomSheet', '$mdDialog'];
        acquisitionController.$inject = ['renderingEnginesCollection', 'dataSources', 'dataSourceConfigurations', '$rootScope', '$window', '$q'];
        AppController.$inject = ['dataSources',
            'acquisitionController',
            'renderingEngineCollectionTabularUIController',
            'renderingEnginesCollection',
            'uiControls',
            'dataSourceConfigurations',
            '$window',
            '$rootScope',
            '$timeout',
            '$http',
            '$location',
            '$scope',
            '$q'
        ];
        controllerWrapper.$inject = ['$scope', 'uiControls', 'dataSources', 'dataSourceConfigurations', 'acquisitionController', 'renderingEngineCollectionTabularUIController', 'renderingEnginesCollection'];
        acquisitionDirective.$inject = ['acquisitionController', 'dataSourceConfigurations', 'dataSources'];

        config.$inject = ['$locationProvider', '$mdThemingProvider', '$provide'];
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
        app.service('renderingEngineCollectionTabularUIController',renderingEngineCollectionTabularUIController);
        app.service('Dashboard', Dashboard);

        // Module directives
        app.directive('gridsterDirective', gridsterDirective);
        app.directive('datDirective', datDirective);
        app.directive('renderingEngineCollectionTabularUiDirective', renderingEngineCollectionTabularUIDirective);
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
