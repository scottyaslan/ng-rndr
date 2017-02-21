define(['downloadjs',
        'goog!visualization,1,packages:[corechart,geochart]'
    ],
    function(downloadjs) {

        'use strict';

        return function(RenderingEngine,
            dataSources,
            acquisitionController,
            exploreController,
            RenderingEngines,
            renderingEnginesCollection,
            uiControls,
            dataSourceConfigurations,
            renderers,
            $window,
            $rootScope,
            $timeout,
            $http,
            $location,
            $scope,
            $q) {
            function AppController() {
                this.mainContentView;
                this.init();
            };
            AppController.prototype = {
                constructor: AppController,
                init: function() {
                    var self = this;
                    //The Parallax jQuery plugin (sometimes) adds an extra
                    //body tag to the DOM if loaded in the <head></head> as 
                    //RequireJs does
                    var extraBodyTag = document.getElementsByTagName('body')[1];
                    if (extraBodyTag !== undefined) {
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
                        if (self.mainContentView !== "Data Source Configuration Wizard") {
                            var view = self.mainContentView;
                            self.mainContentView = "Loading";
                            // $('body').scope().$apply();
                            self.mainContentView = view;
                        }
                    });
                    $rootScope.$on('exploreController:initiate data source configuration wizard', function() {
                        self.initiateDataSourceConfigurationWizard();
                    });
                    $rootScope.$on('Dashboard:edit', function() {
                        self.initiateDataExploration();
                        $scope.$apply();
                    });
                    $rootScope.$on('RenderingEngine:draw:begin', function() {
                        uiControls.showRenderingEngineProgress();
                    });
                    $rootScope.$on('RenderingEngine:draw:complete', function() {
                        uiControls.hideRenderingEngineProgress();
                    });
                    $rootScope.$on('explore:new', function() {
                        exploreController.dialogContentView = "Data Sources";
                        // uiControls.openDialog('Data Source');
                    });
                    $rootScope.$on('explore:init', function() {
                        uiControls.init('ng-rndr/explore/views/bottomSheetGridTemplate.html', 'ng-rndr/explore/views/dialogTemplate.html');
                    });
                    $rootScope.$on('dataSource:acquire:success', function() {
                        uiControls.openLeftSideNav();
                        acquisitionController.restClientContentView = 'Acquire Data';
                    });
                    $rootScope.$on('acquisitionController:save', function() {
                        self.initiateDataExploration(false);
                        uiControls.hideDialog();
                        uiControls.closeLeftSideNav();
                        uiControls.closeRightSideNav();
                    });
                    $rootScope.$on('acquisitionController:cancel', function() {
                        self.mainContentView = '';
                        uiControls.closeLeftSideNav();
                        uiControls.closeRightSideNav();
                    });
                    if ($location.search().embedded === "true") {
                        self.embedded = true;
                        self.mainContentView = "Loading";
                    }
                    if ($location.search().rdatasets === "true") {
                        //GET sample data
                        $http({ method: 'GET', url: 'http://nicolas.kruchten.com/Rdatasets/datasets.csv' }).then(function successCallback(csvlist) {
                            // this callback will be called asynchronously
                            // when the response is available
                            var csvlist_arr = $.csv.toObjects(csvlist.data);
                            angular.forEach(csvlist_arr, function(dataset) {
                                var dataSourceConfigurationId = dataSourceConfigurations.create(dataset.Title);
                                var url = "http://nicolas.kruchten.com/Rdatasets/csv/" + dataset.Package + "/" + dataset.Item + ".csv";
                                dataSourceConfigurations.map[dataSourceConfigurationId].httpConfig = angular.toJson({ method: 'GET', url: url });
                            });
                        }, function errorCallback(csvlist) {
                            // Do Nothing.
                        });
                    }

                    self.initiateDataExploration();
                },
                hydrate: function(rndr) {
                    var self = this;
                    $rootScope.$emit('controller:hydrate:init');
                    var promises = [];
                    $.extend(dataSourceConfigurations.map, rndr.dataSourceConfigurations);
                    angular.forEach(rndr.dataSourceConfigurations, function(dataSourceConfiguration) {
                        promises.push(dataSources.create(dataSourceConfiguration.id, dataSourceConfiguration.name).acquire());
                    });
                    angular.forEach(rndr.renderingEngines, function(renderingEngine) {
                        var eng = renderingEnginesCollection.create(renderingEngine.renderer, renderingEngine.title, renderingEngine.id, renderingEngine.aggregator.name, renderingEngine.aggregator.aggInputAttributeName, renderingEngine.dataView.meta, renderingEngine.derivedAttributes, renderingEngine.locale);
                        eng.active = renderingEngine.active;
                        eng.tile = renderingEngine.tile;
                        eng.dataSourceConfigId = renderingEngine.dataSourceConfigId;
                    });
                    $q.all(promises).then(function() {
                        angular.forEach(rndr.dataSourceConfigurations, function(dataSourceConfiguration) {
                            dataSources.map[dataSourceConfiguration.id].format();
                        });
                        $rootScope.$emit('controller:hydrate:complete');
                        self.mainContentView = "Explore";
                    });
                },
                open: function(rndr) {
                    var self = this;
                    //TODO: 
                    //add a confimation dialog to allow user to decide to merge or only view contents of .rndr

                    //reinitialize
                    dataSources.init();
                    dataSourceConfigurations.init();
                    renderingEnginesCollection.init();
                    self.hydrate(rndr);

                },
                import: function(rndr) {
                    var self = this;
                    self.hydrate(rndr);
                },
                selectFile: function(action) {
                    var self = this;
                    if (window.File && window.FileReader && window.FileList && window.Blob) {
                        $(document).off();
                        $(document).on('change', '#files', function(e) {
                            self.upload(action);
                            //delete the File from the FileList
                            $("#files")[0].value = ''
                        });
                        $('#files').click();
                    } else {
                        alert('The File APIs are not fully supported in this browser.');
                    }
                },
                upload: function(action) {
                    var self = this;
                    //Retrieve the first (and only!) File from the FileList object
                    var f = $('#files').prop('files')[0];

                    if (f) {
                        var r = new FileReader();
                        r.onload = function(e) {
                            var contents = e.target.result;

                            // alert( "Got the file.n" 
                            //       +"name: " + f.name + "n"
                            //       +"type: " + f.type + "n"
                            //       +"size: " + f.size + " bytesn"
                            //       + "starts with: " + contents.substr(1, contents.indexOf("n"))
                            // );

                            self[action](JSON.retrocycle(JSON.parse(contents)));
                            self.mainContentView = "Loading";
                        }
                        r.readAsText(f);
                    } else {
                        alert("Failed to load file");
                    }
                },
                export: function() {
                    var rndr = {
                        renderingEngines: {},
                        dataSourceConfigurations: dataSourceConfigurations.map
                    }
                    angular.forEach(renderingEnginesCollection.map, function(renderingEngine) {
                        var meta = renderingEngine.meta();
                        meta.active = renderingEngine.active;
                        meta.dataSourceConfigId = renderingEngine.dataSourceConfigId;
                        meta.tile = renderingEngine.tile;
                        rndr.renderingEngines[meta.id] = meta;
                    });
                    downloadjs(JSON.stringify(JSON.decycle(rndr)), 'test.rndr', 'application/json');
                },
                deleteRenderingEngine: function(id) {
                    renderingEnginesCollection.delete(id);
                    if (Object.keys(renderingEnginesCollection.map).length === 0) {
                        $timeout(function() {
                            exploreController.new();
                        }, 0);
                    }
                },
                initiateDataExploration: function(createNew) {
                    var self = this;
                    if (self.mainContentView !== "Explore") {
                        self.mainContentView = "Explore";
                        uiControls.init('ng-rndr/explore/views/bottomSheetGridTemplate.html', 'ng-rndr/explore/views/dialogTemplate.html');
                    }
                    if (createNew) {
                        //Have to get on the call stack after the exploration-directive link function is executed
                        $timeout(function() {
                            exploreController.new();
                            uiControls.openDialog('Data Source', 40);
                        }, 0);
                    }
                },
                initiateDataSourceConfigurationWizard: function() {
                    var self = this;
                    if (self.mainContentView !== "Data Source Configuration Wizard") {
                        self.mainContentView = "Data Source Configuration Wizard";
                        uiControls.init('ng-rndr/acquire/views/bottomSheetGridTemplate.html', 'ng-rndr/acquire/views/dialogTemplate.html');
                        uiControls.openLeftSideNav();
                        uiControls.openRightSideNav();
                    }
                },
                initiateDashboard: function() {
                    var self = this;
                    if (self.mainContentView !== "Dashboard Designer") {
                        self.mainContentView = "Dashboard Designer";
                    }
                },
                sandboxMenusEnabled: function() {
                    return Object.keys(renderingEnginesCollection.map).length === 0;
                },
                hideDialogAndDraw: function(rendererName) {
                    renderingEnginesCollection.map[renderingEnginesCollection.activeRenderingEngine].setRenderer(rendererName);
                    renderingEnginesCollection.map[renderingEnginesCollection.activeRenderingEngine].draw($('#renderer'), dataSources.map[renderingEnginesCollection.map[renderingEnginesCollection.activeRenderingEngine].dataSourceConfigId].formattedData);
                }
            };
            
            $scope.renderers = renderers;

            //Singleton for tracking all renderingEngine objects
            $.extend(renderingEnginesCollection, new RenderingEngines());
            $scope.renderingEnginesCollection = renderingEnginesCollection;

            //Singleton for controlling the UI
            $scope.uiControls = uiControls;

            //Main controller
            var controller = new AppController();
            $scope.Controller = controller;

            //Options for Dashboard gridster
            $scope.options = {
                enableDragging: true,
                //                                 autogrow_cols: true,
                min_rows: 30,
                widget_margins: [10, 10],
                widget_base_dimensions: [($window.innerWidth / 4) - 24, (($window.innerWidth / 4) - 24 - 21 - 20)],
                min_cols: 4,
                max_size_x: 4,
                max_cols: 4,
                //                                 avoid_overlapped_widgets: false,
                //                                 autogenerate_stylesheet: true,
                //                                 widget_margins: [],
                //                                 widget_base_dimensions: [],
                resize: {
                    enabled: true,
                    resize: function(e, ui, $widget) {},
                    stop: function(e, ui, $widget) {
                        renderingEnginesCollection.map[$widget[0].id].draw($($widget[0]).find('.gridsterWidgetContainer'), dataSources.map[renderingEnginesCollection.map[$widget[0].id].dataSourceConfigId].formattedData);
                        renderingEnginesCollection.updateAllRenderingEngineTileSizeAndPosition(ui.$player.parent().parent().data('gridster').$widgets);
                    }
                },
                draggable: {
                    handle: 'div.context-menu.box',
                    stop: function(e, ui, $widget) {
                        renderingEnginesCollection.updateAllRenderingEngineTileSizeAndPosition(ui.$player.parent().data('gridster').$widgets);
                    }
                },
                //http://matthew.wagerfield.com/parallax/
                parallax: {
                    enabled: false,
                    dataDepth: 0.05
                }
            };

            $scope.exploreController = exploreController;

            //Singleton for tracking all dataSources
            $scope.dataSources = dataSources;
        }
    });
