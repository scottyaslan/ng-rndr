define(['datatables_renderers',
        'c3_renderers',
        'd3_renderers',
        'gchart_renderers',
        'PivotData',
        'downloadjs',
        'goog!visualization,1,packages:[corechart,geochart]'
    ],
    function(datatables_renderers,
        c3_renderers,
        d3_renderers,
        gchart_renderers,
        PivotData,
        downloadjs) {

        'use strict';

        return function(RenderingEngine,
            dataSourceManager,
            acquisitionController,
            exploreController,
            RenderingEngines,
            renderingEngineManager,
            uiControls,
            dataSourceConfigurationManager,
            dataViews,
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
                        uiControls.init('ngRNDR/explore/views/bottomSheetGridTemplate.html', 'ngRNDR/explore/views/dialogTemplate.html');
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
                                var dataSourceConfigurationId = dataSourceConfigurationManager.create(dataset.Title);
                                var url = "http://nicolas.kruchten.com/Rdatasets/csv/" + dataset.Package + "/" + dataset.Item + ".csv";
                                dataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfigurationId].httpConfig = angular.toJson({ method: 'GET', url: url });
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
                    $.extend(dataSourceConfigurationManager.dataSourceConfigurations, rndr.dataSourceConfigurations);
                    angular.forEach(rndr.dataSourceConfigurations, function(dataSourceConfiguration) {
                        promises.push(dataSourceManager.create(dataSourceConfiguration.id, dataSourceConfiguration.name).acquire());
                    });
                    angular.forEach(rndr.renderingEngines, function(renderingEngine) {
                        $.extend(renderingEngineManager.dictionary[renderingEngineManager.create(renderingEngine.dataSourceConfigId, renderingEngine.id, renderingEngine.title).id], renderingEngine);
                    });
                    $q.all(promises).then(function() {
                        angular.forEach(rndr.dataSourceConfigurations, function(dataSourceConfiguration) {
                            dataSourceManager.dataSources[dataSourceConfiguration.id].format();
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
                    dataSourceManager.init();
                    dataSourceConfigurationManager.init();
                    renderingEngineManager.init();
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
                        renderingEngines: renderingEngineManager.dictionary,
                        dataSourceConfigurations: dataSourceConfigurationManager.dataSourceConfigurations
                    }
                    downloadjs(JSON.stringify(JSON.decycle(rndr)), 'test.rndr', 'application/json');
                },
                deleteRenderingEngine: function(id) {
                    renderingEngineManager.delete(id);
                    if (Object.keys(renderingEngineManager.dictionary).length === 0) {
                        $timeout(function() {
                            exploreController.new();
                        }, 0);
                    }
                },
                initiateDataExploration: function(createNew) {
                    var self = this;
                    if (self.mainContentView !== "Explore") {
                        self.mainContentView = "Explore";
                        uiControls.init('ngRNDR/explore/views/bottomSheetGridTemplate.html', 'ngRNDR/explore/views/dialogTemplate.html');
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
                        uiControls.init('ngRNDR/acquire/views/bottomSheetGridTemplate.html', 'ngRNDR/acquire/views/dialogTemplate.html');
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
                    return Object.keys(renderingEngineManager.dictionary).length === 0;
                }
            };

            //Configure Data Views
            dataViews.add('PivotData', PivotData, function() {
                return {
                    attributesAvailableForRowsAndCols: [],
                    availableAttributes: [],
                    aggregatorName: "",
                    colAttrs: [],
                    rowAttrs: [],
                    valAttrs: [],
                    tree: {},
                    rowKeys: [],
                    colKeys: [],
                    rowTotals: {},
                    colTotals: {},
                    aggInputAttributeName: [],
                    sorted: false,
                    numInputsToProcess: [],
                    hiddenAttributes: [],
                    cols: [],
                    rows: [],
                    vals: [],
                    attributeFilterExclusions: {},
                    attributeFilterInclusions: {},
                    shownAttributes: [],
                    tblCols: [],
                    derivedAttributes: {},
                }
            });

            //Configure Renderers
            renderers.add("DT - Table",
                datatables_renderers["Table"], {
                    class: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    heightOffset: -148,
                    widthOffset: 0,
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("DT - Table Barchart",
                datatables_renderers["Table Barchart"], {
                    class: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    heightOffset: -148,
                    widthOffset: 0,
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("DT - Heatmap",
                datatables_renderers["Heatmap"], {
                    class: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    heightOffset: -148,
                    widthOffset: 0,
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("DT - Row Heatmap",
                datatables_renderers["Row Heatmap"], {
                    class: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    heightOffset: -148,
                    widthOffset: 0,
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("DT - Col Heatmap",
                datatables_renderers["Col Heatmap"], {
                    class: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    heightOffset: -148,
                    widthOffset: 0,
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("C3 - Line Chart",
                c3_renderers["C3 - Line Chart"], {
                    heightOffset: -34, //height - header - title?
                    widthOffset: 0,
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("C3 - Bar Chart",
                c3_renderers["C3 - Bar Chart"], {
                    heightOffset: -34, //height - header - title?
                    widthOffset: 0,
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("C3 - Stacked Bar Chart",
                c3_renderers["C3 - Stacked Bar Chart"], {
                    heightOffset: -34, //height - header - title?
                    widthOffset: 0,
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("C3 - Area Chart",
                c3_renderers["C3 - Area Chart"], {
                    heightOffset: -34, //height - header - title?
                    widthOffset: 0,
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("C3 - Scatter Chart",
                c3_renderers["C3 - Scatter Chart"], {
                    heightOffset: -34, //height - header - title?
                    widthOffset: 0,
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("D3 - Treemap",
                d3_renderers["Treemap"], {
                    heightOffset: 0,
                    widthOffset: -16, //d3 draws a little too wide???
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("Google - Line Chart",
                gchart_renderers["Line Chart"], {
                    heightOffset: 0,
                    widthOffset: -16, //d3 draws a little too wide???
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("Google - Bar Chart",
                gchart_renderers["Bar Chart"], {
                    heightOffset: 0,
                    widthOffset: -16, //d3 draws a little too wide???
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("Google - Stacked Bar Chart",
                gchart_renderers["Stacked Bar Chart"], {
                    heightOffset: 0,
                    widthOffset: -16, //d3 draws a little too wide???
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("Google - Area Chart",
                gchart_renderers["Area Chart"], {
                    heightOffset: 0,
                    widthOffset: -16, //d3 draws a little too wide???
                    dataViewName: 'PivotData'
                }
            );
            renderers.add("Google - Scatter Chart",
                gchart_renderers["Scatter Chart"], {
                    heightOffset: 0,
                    widthOffset: -16, //d3 draws a little too wide???
                    dataViewName: 'PivotData'
                }
            );

            $scope.renderers = renderers;

            //Singleton for tracking all renderingEngine objects
            $.extend(renderingEngineManager, new RenderingEngines());
            $scope.renderingEngineManager = renderingEngineManager;

            //Singleton for controlling the UI
            $scope.uiControls = uiControls;

            //Main controller
            var controller = new AppController();
            $scope.Controller = controller;

            //Extend RenderingEngine functionality
            var updateTile = function(size_x, size_y, col, row) {
                var self = this;
                self.tile = {
                    size_x: size_x,
                    size_y: size_y,
                    col: col,
                    row: row
                };
            };

            RenderingEngine.prototype.updateTile = updateTile;

            //Extend exploreController functionality
            var initiateDataSourceWizard = function() {
                exploreController.dialogContentView = '';
                uiControls.hideDialog();
                $rootScope.$emit('exploreController:initiate data source configuration wizard');
            };

            var closeDialog = function() {
                uiControls.hideDialog();
                if (Object.keys(renderingEngineManager.dictionary).length === 0) {
                    //$rootScope.$emit('acquisitionController:cancel');  
                }
            };

            exploreController.closeDialog = closeDialog;
            exploreController.initiateDataSourceWizard = initiateDataSourceWizard;

            //Options for Explore view gridster
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
                        renderingEngineManager.dictionary[$widget[0].id].draw(dataSourceManager.dataSources[renderingEngineManager.dictionary[$widget[0].id].dataSourceConfigId].formattedData);
                        renderingEngineManager.updateAllRenderingEngineTileSizeAndPosition(ui.$player.parent().parent().data('gridster').$widgets);
                    }
                },
                draggable: {
                    handle: 'div.context-menu.box',
                    stop: function(e, ui, $widget) {
                        renderingEngineManager.updateAllRenderingEngineTileSizeAndPosition(ui.$player.parent().data('gridster').$widgets);
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
            $scope.dataSourceManager = dataSourceManager;
        }
    });
