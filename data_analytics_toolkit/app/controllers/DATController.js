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
define(['app', '../../../common/services/uiControls', '../../../acquire/services/dataSourceConfigurationManager', '../../../render/services/renderingEngineManager', '../../../render/services/renderers', '../../../render/services/renderingEngineUtils', '../../../acquire/directives/acquisitionDirective', '../../../explore/directives/explorationDirective', '../../../syndicate/directives/dashboardDirective', '../directives/datDirective'], function(app) {
    app.controller('DATController', ['ServiceProvider', 'RenderingEngineManager', 'UiControls', 'DataSourceConfigurationManager', 'Renderers', '$window', '$rootScope', '$timeout', '$http', '$location', '$scope',
        function(ServiceProvider, RenderingEngineManager, UiControls, DataSourceConfigurationManager, Renderers, $window, $rootScope, $timeout, $http, $location, $scope) {
            function DATController() {
                this.mainContentView;
            };
            DATController.prototype = {
                constructor: DATController,
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
                        if (datController.mainContentView !== "Data Source Configuration Wizard") {
                            var view = datController.mainContentView;
                            datController.mainContentView = "Loading";
                            $('body').scope().$apply();
                            datController.mainContentView = view;
                        }
                    });
                    $rootScope.$on('data source configuration wizard save', function() {
                        datController.initiateDataExploration(false);
                    });
                    $rootScope.$on('data source wizard configuration cancel', function() {
                        datController.mainContentView = '';
                    });
                    $rootScope.$on('initiate data source configuration wizard', function() {
                        datController.initiateDataSourceConfigurationWizard();
                    });
                    $rootScope.$on('DATController Explore View', function() {
                        datController.initiateDataExploration();
                        $scope.$apply();
                    });
                    $rootScope.$on('draw initiated', function() {
                        UiControls.showRenderingEngineProgress();
                    });
                    $rootScope.$on('draw complete', function() {
                        UiControls.hideRenderingEngineProgress();
                    });
                    if($location.search().embedded === "true"){
                        datController.embedded = true;
                        datController.mainContentView = "Loading";
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
                    if(datController.mainContentView !== "Explore"){
                       datController.mainContentView = "Explore"; 
                    }
                    if(createNew){
                        //Have to get on the call stack after the exploration-directive link function is executed
                        $timeout(function() {
                            ServiceProvider.ExploreController.new();
                        }, 0);   
                    }
                },
                initiateDataSourceConfigurationWizard: function(){
                    if(datController.mainContentView !== "Data Source Configuration Wizard"){
                        datController.mainContentView = "Data Source Configuration Wizard";
                    }
                },
                initiateDashboard: function(){
                    if(datController.mainContentView !== "Dashboard Designer"){
                        datController.mainContentView = "Dashboard Designer";
                    }
                },
                sandboxMenusEnabled: function() {
                    return Object.keys(RenderingEngineManager.renderingEngines).length === 0;
                }
            };
            $scope.Renderers = Renderers;
            $scope.RenderingEngineManager = RenderingEngineManager;
            $scope.UiControls = UiControls;
            var datController = new DATController();
            datController.init();
            $scope.DATController = datController;
            $scope.ServiceProvider = ServiceProvider;
        }
    ])
});