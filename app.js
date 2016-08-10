define(['datatables_renderers',
    'c3_renderers',
    'd3_renderers',
    '../ngRNDR/common/controllers/controllerWrapper',
    '../ngRNDR/common/services/uiControls',
    'rndr-angular-module'], 
function(datatables_renderers,
        c3_renderers,
        d3_renderers,
        ControllerWrapper,
        UiControls) {

    UiControls.$inject=['$window', '$mdSidenav', '$mdUtil', '$mdBottomSheet', '$mdDialog'];
    ControllerWrapper.$inject=['$scope', 'UiControls', 'DataSourceManager', 'DataSourceConfigurationManager', 'AcquisitionController', 'ExploreController', 'RenderingEngineManager', 'Aggregators'];

	var app = angular.module('sampleApp', ['ngResource', 'ngRoute', 'ngMaterial', 'ui.sortable', 'angular-contextMenu', 'ui.ace', 'ngRndr', 'ngRndr-templates'])
	.config(function($locationProvider, $mdThemingProvider) {
        $locationProvider.html5Mode(true);
        //Define app palettes
        var customBluePaletteMap = $mdThemingProvider.extendPalette("grey", {
            "contrastDefaultColor": "light",
            "contrastDarkColors": ["100"], //hues which contrast should be "dark" by default
            "contrastLightColors": ["600"], //hues which contrast should be "light" by default
            "500": "021b2c"
        });
        var customRedPaletteMap = $mdThemingProvider.extendPalette("grey", {
            "contrastDefaultColor": "dark",
            "contrastDarkColors": ["100"], //hues which contrast should be "dark" by default
            "contrastLightColors": ["600"], //hues which contrast should be "light" by default
            "500": "B22234"
        });
        $mdThemingProvider.definePalette("bluePalette", customBluePaletteMap);
        $mdThemingProvider.definePalette("redPalette", customRedPaletteMap);
        $mdThemingProvider.theme("default").primaryPalette("bluePalette", {
            "default": "500",
            "hue-1": "50", // use for the <code>md-hue-1</code> class
            "hue-2": "300", // use for the <code>md-hue-2</code> class
            "hue-3": "600" // use for the <code>md-hue-3</code> class
        }).accentPalette("redPalette", {
            "default": "500",
            "hue-1": "50", // use for the <code>md-hue-1</code> class
            "hue-2": "300", // use for the <code>md-hue-2</code> class
            "hue-3": "600" // use for the <code>md-hue-3</code> class
        });
	}).controller('Controller', ['DataSourceManager', 'AcquisitionController', 'ExploreController', 'RenderingEngineManager', 'UiControls', 'DataSourceConfigurationManager', 'Renderers', '$window', '$rootScope', '$timeout', '$http', '$location', '$scope', function (DataSourceManager, AcquisitionController, ExploreController, RenderingEngineManager, UiControls, DataSourceConfigurationManager, Renderers, $window, $rootScope, $timeout, $http, $location, $scope) {
      function Controller() {
            this.mainContentView;
        };
        Controller.prototype = {
            constructor: Controller,
            init: function() {
                //The Parallax jQuery plugin (sometimes) adds an extra
                //body tag to the DOM if loaded in the <head></head> as 
                //RequireJs does
                var extraBodyTag = document.getElementsByTagName('body')[1];
                if(extraBodyTag !== undefined){
                    extraBodyTag.remove();
                }
                //resize mainContent on window resize 
                angular.element($window).bind('resize', function() {
                    //This is here to force the Explore and Dashboard Designer directives
                    //to re-link which will allow the gridster to draw itself to the appropriate
                    //size. The Data Aquisition Wizard however is a multi step work flow and is built
                    //in a responsive manner...so it resizes itself appropriately on window
                    //resize and thus we dont need or want to cause the directive to re-link since
                    //this will cause it to start over at step 1... 
                    if (controller.mainContentView !== "Data Source Configuration Wizard") {
                        var view = controller.mainContentView;
                        controller.mainContentView = "Loading";
                        // $('body').scope().$apply();
                        controller.mainContentView = view;
                    }
                });
                $rootScope.$on('data source configuration wizard save', function() {
                    controller.initiateDataExploration(false);
                });
                $rootScope.$on('data source wizard configuration cancel', function() {
                    controller.mainContentView = '';
                });
                $rootScope.$on('initiate data source configuration wizard', function() {
                    controller.initiateDataSourceConfigurationWizard();
                });
                $rootScope.$on('Explore View', function() {
                    controller.initiateDataExploration();
                    $scope.$apply();
                });
                $rootScope.$on('draw initiated', function() {
                    UiControls.showRenderingEngineProgress();
                });
                $rootScope.$on('draw complete', function() {
                    UiControls.hideRenderingEngineProgress();
                });
                $rootScope.$on('explore:new', function() {
                    ExploreController.dialogContentView = "Data Sources";
                    UiControls.openDialog('Data Source');
                });
                $rootScope.$on('explore:init', function() {
                    UiControls.init('ngRNDR/explore/views/bottomSheetGridTemplate.html', 'ngRNDR/explore/views/dialogTemplate.html');
                });
                $rootScope.$on('data acquired', function(){
                    UiControls.openLeftSideNav();
                    AcquisitionController.restClientContentView = 'Acquire Data';
                });
                $rootScope.$on('data source configuration wizard init', function(){
                    AcquisitionController.restClientContentView = 'HTTP Config';
                });
                $rootScope.$on('data source configuration wizard save', function(){
                    UiControls.hideDialog(); 
                    UiControls.closeLeftSideNav();
                    UiControls.closeRightSideNav();
                });
                $rootScope.$on('data source configuration wizard cancel', function(){
                    UiControls.closeLeftSideNav();
                    UiControls.closeRightSideNav();
                });
                if($location.search().embedded === "true"){
                    controller.embedded = true;
                    controller.mainContentView = "Loading";
                }
                if($location.search().rdatasets === "true"){
                    //GET sample data
                    $http({method: 'GET', url: 'http://nicolas.kruchten.com/Rdatasets/datasets.csv'}).then(function successCallback(csvlist) {
                        // this callback will be called asynchronously
                        // when the response is available
                        var csvlist_arr = $.csv.toObjects(csvlist.data);
                        angular.forEach(csvlist_arr, function(dataset) {
                            var dataSourceConfigurationId = DataSourceConfigurationManager.create(dataset.Title);
                            var url = "http://nicolas.kruchten.com/Rdatasets/csv/" + dataset.Package + "/" + dataset.Item + ".csv";
                            DataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfigurationId].httpConfig = angular.toJson({method: 'GET', url: url });
                        });
                    }, function errorCallback(csvlist) {
                        // Do Nothing.
                    });
                }
            },
            deleteRenderingEngine: function(id){
                RenderingEngineManager.delete(id);
                if(Object.keys(RenderingEngineManager.renderingEngines).length === 0){
                    $timeout(function() {
                        ExploreController.new();
                    }, 0);
                }
            },
            initiateDataExploration: function(createNew){
                if(controller.mainContentView !== "Explore"){
                   controller.mainContentView = "Explore"; 
                   UiControls.init('ngRNDR/explore/views/bottomSheetGridTemplate.html', 'ngRNDR/explore/views/dialogTemplate.html');
                }
                if(createNew){
                    //Have to get on the call stack after the exploration-directive link function is executed
                    $timeout(function() {
                        ExploreController.new();
                    }, 0);   
                }
            },
            initiateDataSourceConfigurationWizard: function(){
                if(controller.mainContentView !== "Data Source Configuration Wizard"){
                    controller.mainContentView = "Data Source Configuration Wizard";
                    UiControls.init('ngRNDR/acquire/views/bottomSheetGridTemplate.html', 'ngRNDR/acquire/views/dialogTemplate.html');
                    UiControls.openLeftSideNav();
                    UiControls.openRightSideNav();
                }
            },
            initiateDashboard: function(){
                if(controller.mainContentView !== "Dashboard Designer"){
                    controller.mainContentView = "Dashboard Designer";
                }
            },
            sandboxMenusEnabled: function() {
                return Object.keys(RenderingEngineManager.renderingEngines).length === 0;
            }
        };
        Renderers.addRenderers(datatables_renderers);
        Renderers.setRendererOptions('datatables', {
                        class: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    });
        Renderers.addRenderers(c3_renderers);
        Renderers.setRendererOptions('c3', {
                        size: {}
                    });
        Renderers.addRenderers(d3_renderers);
        Renderers.setRendererOptions('d3', {});
        $scope.Renderers = Renderers;
        $scope.RenderingEngineManager = RenderingEngineManager;
        $scope.UiControls = UiControls;
        var controller = new Controller();
        controller.init();
        $scope.Controller = controller;

        //Extend Explore Controller Functionality
        var initiateDataSourceWizard = function(){
            ExploreController.dialogContentView = '';
            UiControls.hideDialog();
            $rootScope.$emit('initiate data source configuration wizard');
        };

        var closeDialog = function(){
            UiControls.hideDialog();
            if(Object.keys(RenderingEngineManager.renderingEngines).length === 0){
                $rootScope.$emit('data source wizard configuration cancel');  
            }
        };
        ExploreController.closeDialog = closeDialog;
        ExploreController.initiateDataSourceWizard = initiateDataSourceWizard;

        $scope.ExploreController = ExploreController;
        $scope.DataSourceManager = DataSourceManager;
    }]);

    // Module controller
    app.controller('ControllerWrapper', ControllerWrapper);

    // Module services
    app.service('UiControls', UiControls);

    angular.bootstrap($('body'), ['sampleApp']);
    $('body').show();
});