define(['rndr-angular-module'], 
function() {
	var app = angular.module('sampleApp', ['ngResource', 'ngRoute', 'ngMaterial', 'ui.sortable', 'angular-contextMenu', 'ui.ace', 'ngRndr', 'ngRndr.templates'])
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
	}).controller('Controller', ['ServiceProvider', 'RenderingEngineManager', 'UiControls', 'DataSourceConfigurationManager', 'Renderers', '$window', '$rootScope', '$timeout', '$http', '$location', '$scope', function (ServiceProvider, RenderingEngineManager, UiControls, DataSourceConfigurationManager, Renderers, $window, $rootScope, $timeout, $http, $location, $scope) {
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
                        ServiceProvider.ExploreController.new();
                    }, 0);
                }
            },
            initiateDataExploration: function(createNew){
                if(controller.mainContentView !== "Explore"){
                   controller.mainContentView = "Explore"; 
                }
                if(createNew){
                    //Have to get on the call stack after the exploration-directive link function is executed
                    $timeout(function() {
                        ServiceProvider.ExploreController.new();
                    }, 0);   
                }
            },
            initiateDataSourceConfigurationWizard: function(){
                if(controller.mainContentView !== "Data Source Configuration Wizard"){
                    controller.mainContentView = "Data Source Configuration Wizard";
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
        $scope.Renderers = Renderers;
        $scope.RenderingEngineManager = RenderingEngineManager;
        $scope.UiControls = UiControls;
        var controller = new Controller();
        controller.init();
        $scope.Controller = controller;
        $scope.ServiceProvider = ServiceProvider;
    }]);

    angular.bootstrap($('body'), ['sampleApp']);
    $('body').show();
});