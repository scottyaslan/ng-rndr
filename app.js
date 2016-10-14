define(['../ngRNDR/AppController',
        '../ngRNDR/common/controllers/controllerWrapper',
        '../ngRNDR/common/services/uiControls',
        '../ngRNDR/acquire/services/acquisitionController',
        '../ngRNDR/acquire/directives/acquisitionDirective',
        '../ngRNDR/explore/directives/explorationDirective',
        '../ngRNDR/explore/services/exploreController',
        '../ngRNDR/syndicate/directives/dashboardDirective',
        '../ngRNDR/syndicate/services/Dashboard',
        '../ngRNDR/syndicate/directives/gridsterDirective',
        '../ngRNDR/datDirective',
        '../ngRNDR/config',
        'downloadjs',
        'c3',
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
        downloadjs,
        c3) {

        'use strict';

        window.c3 = c3;

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
        gridsterDirective.$inject = [];
        datDirective.$inject = [];
        explorationDirective.$inject = ['exploreController', 'renderingEngineManager', 'dataSourceManager'];
        dashboardDirective.$inject = ['Dashboard', '$window'];
        exploreController.$inject = ['renderingEngineManager', 'dataSourceManager', 'dataSourceConfigurationManager', '$window', '$timeout', '$rootScope', '$http'];
        Dashboard.$inject = ['$rootScope', '$compile', '$window', '$q', '$timeout', 'dataSourceManager'];
        uiControls.$inject = ['$window', '$mdSidenav', '$mdUtil', '$mdBottomSheet', '$mdDialog'];
        acquisitionController.$inject = ['RenderingEngine', 'renderingEngineManager', 'dataSourceManager', 'dataSourceConfigurationManager', '$rootScope', '$window', '$q'];
        AppController.$inject = ['RenderingEngine',
            'dataSourceManager',
            'acquisitionController',
            'exploreController',
            'renderingEngineManager',
            'uiControls',
            'dataSourceConfigurationManager',
            'dataViews',
            'renderers',
            '$window',
            '$rootScope',
            '$timeout',
            '$http',
            '$location',
            '$scope',
            '$q'
        ];
        controllerWrapper.$inject = ['$scope', 'uiControls', 'dataSourceManager', 'dataSourceConfigurationManager', 'acquisitionController', 'exploreController', 'renderingEngineManager', 'aggregators'];
        acquisitionDirective.$inject = ['acquisitionController', 'dataSourceConfigurationManager', 'dataSourceManager'];

        app.config(config);

        // Module controllers
        app.controller('Controller', AppController);
        app.controller('controllerWrapper', controllerWrapper);

        // Module services
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

        angular.bootstrap($('#sampleApp2'), ['sampleApp']);
        $('#sampleApp2').show();

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
