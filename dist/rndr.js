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
define('acquire/directives/acquisitionDirective',[], function() {
    'use strict';

    function acquisitionDirective(AcquisitionController) {
        return {
            restrict: 'E',
            templateUrl:'src/acquire/views/acquire.html',
            link: function(scope, element, attrs) {
                AcquisitionController.init();
                scope.AcquisitionController = AcquisitionController;
            }
        };
    }

    acquisitionDirective.$inject=['AcquisitionController'];

    return acquisitionDirective;
});
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
define('acquire/services/acquisitionController',[], function() {
    'use strict';

    function AcquisitionController(ServiceProvider, UiControls, RenderingEngineFactory, RenderingEngineManager, DataSourceUtils, DataSourceManager, DataSourceConfigurationManager, $rootScope, $window) {
        function AcquisitionController() {
            this.restClientContentView;
        }
        AcquisitionController.prototype = {
            constructor: AcquisitionController,
            init: function() {
                DataSourceManager.create(DataSourceConfigurationManager.create("Untitled"), "Untitled");
                UiControls.init('src/acquire/views/bottomSheetGridTemplate.html', 'src/acquire/views/dialogTemplate.html');
                UiControls.openLeftSideNav();
                UiControls.openRightSideNav();
                acquisitionController.restClientContentView = 'HTTP Config';
                if(ServiceProvider.AcquisitionController === undefined){
                    ServiceProvider.add('AcquisitionController', acquisitionController);
                }
                $rootScope.$on('acquiring data', function(){
                    acquisitionController.dataAcquisitionInProgress = true;
                });
                $rootScope.$on('data acquired', function(){
                    acquisitionController.dataAcquisitionInProgress = false;
                    acquisitionController.restClientContentView = 'Acquire Data';
                    UiControls.openLeftSideNav();
                });
            },
            save: function() {
                var renderingEngine = new RenderingEngineFactory();
                renderingEngine.init(DataSourceConfigurationManager.activeDataSourceConfiguration);
                renderingEngine.active = true;
                RenderingEngineManager.add(renderingEngine);
                //There may be an active rendering engine, if so deactivate
                if(RenderingEngineManager.activeRenderingEngine){
                    RenderingEngineManager.renderingEngines[RenderingEngineManager.activeRenderingEngine].active = false;
                }
                //Set the active rendering engine to this one
                RenderingEngineManager.activeRenderingEngine = renderingEngine.id;
                DataSourceConfigurationManager.activeDataSourceConfiguration = "";
                UiControls.hideDialog(); 
                UiControls.closeLeftSideNav();
                UiControls.closeRightSideNav();
                $rootScope.$emit('data source configuration wizard save');
            },
            cancel: function() {
                DataSourceManager.delete(DataSourceManager.dataSources[DataSourceConfigurationManager.activeDataSourceConfiguration].dataSourceConfigId);
                DataSourceConfigurationManager.delete(DataSourceConfigurationManager.activeDataSourceConfiguration);
                DataSourceConfigurationManager.activeDataSourceConfiguration = "";
                UiControls.closeLeftSideNav();
                UiControls.closeRightSideNav();
                $rootScope.$emit('data source wizard configuration cancel');
            },
            openDocumentation: function(view) {
                $window.open('https://docs.angularjs.org/api/ng/service/$http#usage', '_blank');
            },
            aceLoaded: function(_editor) {
                // Options
                $(_editor.container).height($('#mainContent').height() - 16);
                $(_editor.container).width($('#mainContent').width() - 16);
            },
            aceChanged: function(e) {
                var tmp;
            }
        };
        var acquisitionController = new AcquisitionController();
        return acquisitionController;
    }

    AcquisitionController.$inject=['ServiceProvider', 'UiControls', 'RenderingEngineFactory', 'RenderingEngineManager', 'DataSourceUtils', 'DataSourceManager', 'DataSourceConfigurationManager', '$rootScope', '$window'];

    return AcquisitionController;
});
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
define('acquire/services/dataSourceConfigurationFactory',[], function() {
    'use strict';

    function DataSourceConfigurationFactory() {
        function DataSourceConfigurationFactory(name) {
            this.id;
            this.flattenDataFunctionString;
            this.httpConfig;
            this.name = name;
        }
        DataSourceConfigurationFactory.prototype = {
            constructor: DataSourceConfigurationFactory,
            init: function() {
                var self = this;
                self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
                self.httpConfig = angular.toJson({
                    method: 'GET',
                    url: 'http://nicolas.kruchten.com/pivottable/examples/montreal_2014.csv'
                });
                self.flattenDataFunctionString = 'return data;';
            }
        };
        return DataSourceConfigurationFactory;
    }

    DataSourceConfigurationFactory.$inject=[];

    return DataSourceConfigurationFactory;
});
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
define('acquire/services/dataSourceConfigurationManager',[], function() {
    'use strict';

    function DataSourceConfigurationManager(ServiceProvider, DataSourceConfigurationFactory) {
        function DataSourceConfigurationManager() {
            this.dataSourceConfigurations = {};
            this.activeDataSourceConfiguration;
        }
        DataSourceConfigurationManager.prototype = {
            constructor: DataSourceConfigurationManager,
            init: function() {
                if(ServiceProvider.DataSourceConfigurationManager === undefined){
                    ServiceProvider.add('DataSourceConfigurationManager', dataSourceConfigurationManager);
                }
            },
            create: function(name) {
                var dataSourceConfiguration = new DataSourceConfigurationFactory(name);
                dataSourceConfiguration.init();
                dataSourceConfigurationManager.add(dataSourceConfiguration);
                dataSourceConfigurationManager.activeDataSourceConfiguration = dataSourceConfiguration.id;
                return dataSourceConfiguration.id;
            },
            add: function(dataSourceConfiguration){
                dataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfiguration.id] = dataSourceConfiguration;
            },
            delete: function(id){
                delete dataSourceConfigurationManager.dataSourceConfigurations[id];
            },
            dataSourceConfigurationsDefined: function(){
                return Object.keys(dataSourceConfigurationManager.dataSourceConfigurations).length !== 0;
            }
        };
        var dataSourceConfigurationManager = new DataSourceConfigurationManager();
        dataSourceConfigurationManager.init();
        return dataSourceConfigurationManager;
    }

    DataSourceConfigurationManager.$inject=['ServiceProvider', 'DataSourceConfigurationFactory'];

    return DataSourceConfigurationManager;
});
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
define('acquire/services/dataSourceFactory',[], function() {
    'use strict';

    function DataSourceFactory() {
        function DataSourceFactory(dataSourceConfigId, name) {
            this.dataSourceConfigId = dataSourceConfigId;
            this.data;
            this.name = name;
            this.formattedData;
        }
        DataSourceFactory.prototype = {
            constructor: DataSourceFactory
        };
        return DataSourceFactory;
    }

    DataSourceFactory.$inject=[];

    return DataSourceFactory;
});
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
define('acquire/services/dataSourceManager',[], function() {
    'use strict';

    function DataSourceManager(ServiceProvider, DataSourceFactory) {
        function DataSourceManager() {
            this.dataSources = {};
        }
        DataSourceManager.prototype = {
            constructor: DataSourceManager,
            init: function(){
                if(ServiceProvider.DataSourceManager === undefined){
                    ServiceProvider.add('DataSourceManager', dataSourceManager);
                }  
            },
            create: function(dataSourceConfigurationId, name) {
                if(dataSourceConfigurationId !== undefined){
                    var dataSource = new DataSourceFactory(dataSourceConfigurationId, name);
                    dataSourceManager.add(dataSource);
                }
            },
            add: function(dataSource){
                dataSourceManager.dataSources[dataSource.dataSourceConfigId] = dataSource;
            },
            delete: function(dataSourceConfigId){
                delete dataSourceManager.dataSources[dataSourceConfigId];
            }
        };
        var dataSourceManager = new DataSourceManager();
        dataSourceManager.init();
        return dataSourceManager;
    }

    DataSourceManager.$inject=['ServiceProvider', 'DataSourceFactory'];

    return DataSourceManager;
});
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
define('acquire/services/dataSourceUtils',[], function() {
    'use strict';

    function DataSourceUtils(ServiceProvider, DataSourceConfigurationManager, $http, $rootScope) {
        function DataSourceUtils() {
        }
        DataSourceUtils.prototype = {
            constructor: DataSourceUtils,
            init: function(){
                if(ServiceProvider.DataSourceUtils === undefined){
                    ServiceProvider.add('DataSourceUtils', dataSourceUtils);
                }
            },
            acquire: function(dataSource) {
                $rootScope.$emit('acquiring data');
                $http(angular.fromJson(DataSourceConfigurationManager.dataSourceConfigurations[dataSource.dataSourceConfigId].httpConfig)).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    if(typeof response.data !== "string"){
                      dataSource.data = JSON.stringify(response.data);
                    } else {
                      dataSource.data = response.data;
                    }
                    $rootScope.$emit('data acquired');
                }, function errorCallback(response) {
                    $rootScope.$emit('data acquired');
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            },
            format: function(dataSource) {
                var flatten = new Function("data", DataSourceConfigurationManager.dataSourceConfigurations[dataSource.dataSourceConfigId].flattenDataFunctionString);
                try{
                    dataSource.formattedData = angular.toJson(flatten(angular.fromJson(dataSource.data)));
                } catch(e){
                    try{
                        dataSource.formattedData = flatten(dataSource.data);
                    } catch(e){
                        //Do nothing
                    }
                }
                try{
                  dataSource.formattedData = angular.fromJson(dataSource.formattedData);
                } catch(e){
                  try{
                    dataSource.formattedData = $.csv.toArrays(dataSource.formattedData);
                  } catch(e){
                    //Do nothing
                  }
                }
            }
        };
        var dataSourceUtils = new DataSourceUtils();
        dataSourceUtils.init();
        return dataSourceUtils;
    }

    DataSourceUtils.$inject=['ServiceProvider', 'DataSourceConfigurationManager', '$http', '$rootScope'];

    return DataSourceUtils;
});
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
define('common/controllers/controllerWrapper',[], function() {
    'use strict';

    function ControllerWrapper($scope, UiControls, ServiceProvider) {
        $scope.UiControls = UiControls;
        $scope.ServiceProvider = ServiceProvider;
    }

    ControllerWrapper.$inject=['$scope', 'UiControls', 'ServiceProvider'];

    return ControllerWrapper;
});
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
define('common/directives/gridsterDirective',[], function() {
    'use strict';

    function gridsterDirective() {
        return {
            restrict: 'E',
            scope: {
                options: '='
            },
            link: function(scope, element, attrs) {
                //initialize the gridster jQuery plugin and set the object on the scope
                var gridster = $(element.find('ul')[0]).gridster(scope.options);
                scope.gridster = gridster.data('gridster');
                if (!scope.options.enableDragging) {
                    scope.gridster.disable();
                }
                if(scope.options.parallax.enabled){
                    require('bower_components/parallax/deploy/jquery.parallax.min');
                    
                    var parallax = $("<ul><li data-depth='" + scope.options.parallax.dataDepth + "' class='layer'></li></ul>");
                    parallax.parallax();
                    var parallaxLi = parallax.find('li');
                    parallaxLi.append(gridster);
                    element.append(parallax);
                }
            }
        };
    }

    gridsterDirective.$inject=[];

    return gridsterDirective;
});
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
define('common/services/serviceProvider',[], function() {
    'use strict';

    function ServiceProvider() {
        function ServiceProvider() {
        };
        ServiceProvider.prototype = {
            constructor: ServiceProvider,
            add: function(objectName, object) {
                serviceProvider[objectName] = object;
            },
            delete: function(objectName) {
                delete serviceProvider[objectName];
            }
        };
        var serviceProvider = new ServiceProvider();
        return serviceProvider;
    }

    ServiceProvider.$inject=[];

    return ServiceProvider;
});
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
define('common/services/uiControls',[], function() {
    'use strict';

    function UiControls(ServiceProvider, $window, $mdSidenav, $mdUtil, $mdBottomSheet, $mdDialog) {
        function UiControls() {
            this.bottomSheetTemplateUrl;
            this.dialogTemplateUrl;
            this.dialogTitle;
        };
        UiControls.prototype = {
            constructor: UiControls,
            init: function(bottomSheetTemplateUrl, dialogTemplateUrl) {
                if(bottomSheetTemplateUrl){
                    uiControls.bottomSheetTemplateUrl = bottomSheetTemplateUrl;
                }
                if(dialogTemplateUrl){
                    uiControls.dialogTemplateUrl = dialogTemplateUrl;
                }
                if(ServiceProvider.UiControls === undefined){
                    ServiceProvider.add('UiControls', uiControls);
                }
            },
            openMenu: function() {
                $mdOpenMenu();
            },
            openBottomSheet: function() {
                $mdBottomSheet.show({
                    templateUrl: uiControls.bottomSheetTemplateUrl,
                    controller: 'ControllerWrapper'
                }).then(function(clickedItem) {});
            },
            openDialog: function(dialogTitle, ev) {
                uiControls.dialogTitle = dialogTitle;
                $mdDialog.show({
                    controller: 'ControllerWrapper',
                    templateUrl: uiControls.dialogTemplateUrl,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    escapeToClose: false
                }).then(function(answer) {}, function() {});
            },
            showRenderingEngineProgress: function(){
                $("#rendererProgress").show();
                $("#renderer").hide();
            },
            hideRenderingEngineProgress: function(){
                $("#rendererProgress").hide();
                $("#renderer").show();
            },
            hideDialog: function() {
                $mdDialog.hide();
            },
            cancelDialog: function() {
                $mdDialog.cancel();
            },
            answerDialog: function(answer) {
                $mdDialog.hide(answer);
            },
            closeLeftSideNav: function() {
                uiControls.leftSideNavOpen = false;
            },
            openLeftSideNav: function() {
                uiControls.leftSideNavOpen = true;
            },
            closeRightSideNav: function() {
                uiControls.rightSideNavOpen = false;
            },
            openRightSideNav: function() {
                uiControls.rightSideNavOpen = true;
            }
        };
        var uiControls = new UiControls();
        uiControls.init();
        return uiControls;
    }

    UiControls.$inject=['ServiceProvider', '$window', '$mdSidenav', '$mdUtil', '$mdBottomSheet', '$mdDialog'];

    return UiControls;
});
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
define('explore/directives/explorationDirective',[], function() {

    function explorationDirective(ServiceProvider, ExploreController) {
        return {
            restrict: 'E',
            templateUrl:'src/explore/views/explore.html',
            link: function(scope, element, attrs) {
                ExploreController.init();
                scope.ExploreController = ExploreController;
                scope.ServiceProvider = ServiceProvider;
            }
        };
    }

    explorationDirective.$inject=['ServiceProvider', 'ExploreController'];

    return explorationDirective;
});
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
define('explore/services/exploreController',[], function() {
    'use strict';

    function ExploreController(ServiceProvider, UiControls, RenderingEngineManager, DataSourceManager, $window, $timeout, $rootScope) {
        function ExploreController() {
            this.selectedDataSourceConfigId;
            this.dialogContentView;
            this.constants;
        }
        ExploreController.prototype = {
            constructor: ExploreController,
            init: function() {
                UiControls.init('src/explore/views/bottomSheetGridTemplate.html', 'src/explore/views/dialogTemplate.html');
                exploreController.constants = {
                    sortableOptions: {
                        placeholder: "placeholder",
                        connectWith: ".dropzone",
                        update: function(e, ui) {
                            //TODO: Need a way to provide feedback to the user that the renderer is updating                             
                            //UiControls.showRenderingEngineProgress(); ???
                                                            
                            //TODO: Need to remove any RenderingEngine.attributeFilterInclusions and  RenderingEngine.attributeFilterExclusions
                            //that are not on the row or column
                            
                            //Cannot correctly update renderer until the angular digest completes which updates the RenderingEngine.rows and
                            //RenderingEngine.cols arrays. We must get on the call stack after the that cycle completes 
                            $timeout(function() {
                                RenderingEngineManager.renderingEngines[RenderingEngineManager.activeRenderingEngine].draw(DataSourceManager.dataSources[RenderingEngineManager.renderingEngines[RenderingEngineManager.activeRenderingEngine].dataSourceConfigId].formattedData);
                            }, 0);
                        }
                    },
                    dataExplorationGrid: {
                        namespace: '#DataExploration',
                        enableDragging: false,
                        widget_margins: [10, 10],
                        /*
                         * Determination of the widget dimension is calculated as follows:
                         * 
                         *     (($window.innerWidth - (# of columns +1)*(column margin)*2 margins on either side)/# of columns)
                         *     (($window.innerHeight - (pixel height of toolbars) - (# of rows +1)*(row margin)*2 margins on either side)/# of rows)
                         */
                        widget_base_dimensions: [(($window.innerWidth - 7*(10)*2)/6) , (($window.innerHeight - 88 - 3*(10)*2)/2)],
                        min_cols: 6,
                        resize: {
                            enabled: false,
                            start: function(e, ui, $widget) {
                                console.log('START position: ' + ui.position.top + ' ' + ui.position.left);
                            },
                            resize: function(e, ui, $widget) {
                                console.log('RESIZE offset: ' + ui.pointer.diff_top + ' ' + ui.pointer.diff_left);
                            },
                            stop: function(e, ui, $widget) {
                                console.log('STOP position: ' + ui.position.top + ' ' + ui.position.left);
                            }
                        },
                        draggable: {
                            start: function(e, ui, $widget) {
                                console.log('START position: ' + ui.position.top + ' ' + ui.position.left);
                            },
                            drag: function(e, ui, $widget) {
                                console.log('DRAG offset: ' + ui.pointer.diff_top + ' ' + ui.pointer.diff_left);
                            },
                            stop: function(e, ui, $widget) {
                                console.log('STOP position: ' + ui.position.top + ' ' + ui.position.left);
                            }
                        },
                        parallax: {
                            enabled: false,
                            dataDepth: 0
                        }
                    }
                };
                var requireDataSourceConfigSelection = false;
                angular.forEach(RenderingEngineManager.renderingEngines, function(RenderingEngine, uuid) {
                     requireDataSourceConfigSelection = true;
                });
                if(!requireDataSourceConfigSelection){
                    exploreController.new();
                }
                if(ServiceProvider.ExploreController === undefined){
                    ServiceProvider.add('ExploreController', exploreController);
                }
                angular.element($window).on( "rowLabelDrillDownEvent", function(e) {
                    var RenderingEngine = RenderingEngineManager.renderingEngines[e.renderingEngineId];
                    var filterByAttributeValue = $(e.event.currentTarget).html();
                    var attributeFilterName = RenderingEngine.rows[$(e.event.currentTarget).parent().children().index($(e.event.currentTarget))];
                    RenderingEngine.addInclusionFilter(attributeFilterName, filterByAttributeValue);
                    $timeout(function() {
                        RenderingEngine.draw(DataSourceManager.dataSources[RenderingEngine.dataSourceConfigId].formattedData);
                    }, 0);
                });
                angular.element($window).on( "colLabelDrillDownEvent", function(e) {
                    var RenderingEngine = RenderingEngineManager.renderingEngines[e.renderingEngineId];
                    var filterByAttributeValue = $(e.event.currentTarget).html();
                    var attributeFilterName = RenderingEngine.cols[$(e.event.currentTarget).parent().parent().children().index($(e.event.currentTarget).parent())];
                    RenderingEngine.addInclusionFilter(attributeFilterName, filterByAttributeValue);
                    $timeout(function() {
                        RenderingEngine.draw(DataSourceManager.dataSources[RenderingEngine.dataSourceConfigId].formattedData);
                    }, 0);
                });
            },
            new: function(){
                exploreController.dialogContentView = "Data Sources";
                exploreController.selectedDataSourceConfigId = undefined;
                UiControls.openDialog('Data Source');
            },
            initiateDataSourceWizard: function(){
                exploreController.dialogContentView = '';
                UiControls.hideDialog();
                $rootScope.$emit('initiate data source configuration wizard');
            },
            closeDialog: function(){
                UiControls.hideDialog();
                if(Object.keys(RenderingEngineManager.renderingEngines).length === 0){
                    $rootScope.$emit('data source wizard configuration cancel');  
                }
            }
        };
        var exploreController = new ExploreController();
        return exploreController;
    }

    ExploreController.$inject=['ServiceProvider', 'UiControls', 'RenderingEngineManager', 'DataSourceManager', '$window', '$timeout', '$rootScope'];

    return ExploreController;
});
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
define('render/directives/renderingEngineDirective',[], function() {
    'use strict';

    function renderingEngineDirective() {
        return {
            restrict: 'E',
            scope: {
                'engine': '=',
                'input': '='
            },
            link: {
                pre: function(scope, element, attr) {
                    scope.engine.element = $(element);
                    scope.engine.draw(scope.input);
                }
            }
        };
    }

    renderingEngineDirective.$inject=[];

    return renderingEngineDirective;
});
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
define('render/services/aggregators',[], function() {
    'use strict';

    function Aggregators(ServiceProvider, AggregatorTemplates, RenderingEngineUtils) {
        function Aggregators() {
            this.availableAggregators;
            this.availableAggregatorNames;
            this.availableAggregatorOptions;
            this.aggregatorTemplates;
        }
        Aggregators.prototype = {
            constructor: Aggregators,
            init: function() {
                var self = this;
                self.availableAggregators = {};
                self.availableAggregatorNames = Object.keys(self.availableAggregators);
                self.aggregatorTemplates = AggregatorTemplates;
                self.addAggregator('Count', self.aggregatorTemplates.count(RenderingEngineUtils.usFmtInt()));
                self.addAggregator('Count Unique Values', self.aggregatorTemplates.countUnique(RenderingEngineUtils.usFmtInt()));
                self.addAggregator('List Unique Values', self.aggregatorTemplates.listUnique(', '));
                self.addAggregator('Sum', self.aggregatorTemplates.sum(RenderingEngineUtils.usFmt()));
                self.addAggregator('Integer Sum', self.aggregatorTemplates.sum(RenderingEngineUtils.usFmtInt()));
                self.addAggregator('Average', self.aggregatorTemplates.average(RenderingEngineUtils.usFmt()));
                self.addAggregator('Minimum', self.aggregatorTemplates.min(RenderingEngineUtils.usFmt()));
                self.addAggregator('Maximum', self.aggregatorTemplates.max(RenderingEngineUtils.usFmt()));
                self.addAggregator('Sum over Sum', self.aggregatorTemplates.sumOverSum(RenderingEngineUtils.usFmt()));
                self.addAggregator('80% Upper Bound', self.aggregatorTemplates.sumOverSumBound80(true, RenderingEngineUtils.usFmt()));
                self.addAggregator('80% Lower Bound', self.aggregatorTemplates.sumOverSumBound80(false, RenderingEngineUtils.usFmt()));
                self.addAggregator('Sum as Fraction of Total', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'total', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Sum as Fraction of Rows', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'row', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Sum as Fraction of Columns', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'col', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Total', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'total', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Rows', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'row', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Columns', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'col', RenderingEngineUtils.usFmtPct()));
                if(ServiceProvider.Aggregators === undefined){
                    ServiceProvider.add('Aggregators', aggregators);
                }
            },
            addAggregator: function(AggregatorName, Aggregator){
                var self = this;
                self.availableAggregators[AggregatorName] = Aggregator;
                self.availableAggregatorNames = Object.keys(self.availableAggregators);
            }
        };
        var aggregators = new Aggregators();
        aggregators.init();
        return aggregators;
    }

    Aggregators.$inject=['ServiceProvider', 'AggregatorTemplates', 'RenderingEngineUtils'];

    return Aggregators;
});
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
define('render/services/aggregatorTemplates',[], function() {
    'use strict';

    function AggregatorTemplates(ServiceProvider, RenderingEngineUtils) {
        function AggregatorTemplates() {
            this.aggregatorTemplates;
        }
        AggregatorTemplates.prototype = {
            constructor: AggregatorTemplates,
            init: function(){
                if(ServiceProvider.AggregatorTemplates === undefined){
                    ServiceProvider.add('AggregatorTemplates', agregatorTemplates);
                }
            },
            count: function(formatter) {
                if (formatter == null) {
                    formatter = RenderingEngineUtils.usFmtInt;
                }
                return function() {
                    return function(data, rowKey, colKey) {
                        return {
                            count: 0,
                            push: function() {
                                return this.count++;
                            },
                            value: function() {
                                return this.count;
                            },
                            format: formatter
                        };
                    };
                };
            },
            countUnique: function(formatter) {
                if (formatter == null) {
                    formatter = RenderingEngineUtils.usFmtInt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            uniq: [],
                            push: function(record) {
                                var ref;
                                if (ref = record[attr], indexOf.call(this.uniq, ref) < 0) {
                                    return this.uniq.push(record[attr]);
                                }
                            },
                            value: function() {
                                return this.uniq.length;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            listUnique: function(sep) {
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            uniq: [],
                            push: function(record) {
                                var ref;
                                if (ref = record[attr], indexOf.call(this.uniq, ref) < 0) {
                                    return this.uniq.push(record[attr]);
                                }
                            },
                            value: function() {
                                return this.uniq.join(sep);
                            },
                            format: function(x) {
                                return x;
                            },
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            sum: function(formatter) {
                if (formatter == null) {
                    formatter = RenderingEngineUtils.usFmt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            sum: 0,
                            push: function(record) {
                                if (!isNaN(parseFloat(record[attr]))) {
                                    return this.sum += parseFloat(record[attr]);
                                }
                            },
                            value: function() {
                                return this.sum;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            min: function(formatter) {
                if (formatter == null) {
                    formatter = RenderingEngineUtils.usFmt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            val: null,
                            push: function(record) {
                                var ref, x;
                                x = parseFloat(record[attr]);
                                if (!isNaN(x)) {
                                    return this.val = Math.min(x, (ref = this.val) != null ? ref : x);
                                }
                            },
                            value: function() {
                                return this.val;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            max: function(formatter) {
                if (formatter == null) {
                    formatter = RenderingEngineUtils.usFmt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            val: null,
                            push: function(record) {
                                var ref, x;
                                x = parseFloat(record[attr]);
                                if (!isNaN(x)) {
                                    return this.val = Math.max(x, (ref = this.val) != null ? ref : x);
                                }
                            },
                            value: function() {
                                return this.val;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            average: function(formatter) {
                if (formatter == null) {
                    formatter = RenderingEngineUtils.usFmt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            sum: 0,
                            len: 0,
                            push: function(record) {
                                if (!isNaN(parseFloat(record[attr]))) {
                                    this.sum += parseFloat(record[attr]);
                                    return this.len++;
                                }
                            },
                            value: function() {
                                return this.sum / this.len;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            sumOverSum: function(formatter) {
                if (formatter == null) {
                    formatter = RenderingEngineUtils.usFmt;
                }
                return function(arg) {
                    var denom, num;
                    num = arg[0], denom = arg[1];
                    return function(data, rowKey, colKey) {
                        return {
                            sumNum: 0,
                            sumDenom: 0,
                            push: function(record) {
                                if (!isNaN(parseFloat(record[num]))) {
                                    this.sumNum += parseFloat(record[num]);
                                }
                                if (!isNaN(parseFloat(record[denom]))) {
                                    return this.sumDenom += parseFloat(record[denom]);
                                }
                            },
                            value: function() {
                                return this.sumNum / this.sumDenom;
                            },
                            format: formatter,
                            numInputs: (num != null) && (denom != null) ? 0 : 2
                        };
                    };
                };
            },
            sumOverSumBound80: function(upper, formatter) {
                if (upper == null) {
                    upper = true;
                }
                if (formatter == null) {
                    formatter = RenderingEngineUtils.usFmt;
                }
                return function(arg) {
                    var denom, num;
                    num = arg[0], denom = arg[1];
                    return function(data, rowKey, colKey) {
                        return {
                            sumNum: 0,
                            sumDenom: 0,
                            push: function(record) {
                                if (!isNaN(parseFloat(record[num]))) {
                                    this.sumNum += parseFloat(record[num]);
                                }
                                if (!isNaN(parseFloat(record[denom]))) {
                                    return this.sumDenom += parseFloat(record[denom]);
                                }
                            },
                            value: function() {
                                var sign;
                                sign = upper ? 1 : -1;
                                return (0.821187207574908 / this.sumDenom + this.sumNum / this.sumDenom + 1.2815515655446004 * sign * Math.sqrt(0.410593603787454 / (this.sumDenom * this.sumDenom) + (this.sumNum * (1 - this.sumNum / this.sumDenom)) / (this.sumDenom * this.sumDenom))) / (1 + 1.642374415149816 / this.sumDenom);
                            },
                            format: formatter,
                            numInputs: (num != null) && (denom != null) ? 0 : 2
                        };
                    };
                };
            },
            fractionOf: function(wrapped, type, formatter) {
                if (type == null) {
                    type = 'total';
                }
                if (formatter == null) {
                    formatter = RenderingEngineUtils.usFmtPct;
                }
                return function() {
                    var x;
                    x = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                    return function(data, rowKey, colKey) {
                        return {
                            selector: {
                                total: [[], []],
                                row: [rowKey, []],
                                col: [[], colKey]
                            }[type],
                            inner: wrapped.apply(null, x)(data, rowKey, colKey),
                            push: function(record) {
                                return this.inner.push(record);
                            },
                            format: formatter,
                            value: function() {
                                return this.inner.value() / data.getAggregator.apply(data, this.selector).inner.value();
                            },
                            numInputs: wrapped.apply(null, x)().numInputs
                        };
                    };
                };
            }
        };
        var agregatorTemplates = new AggregatorTemplates();
        agregatorTemplates.init();
        return agregatorTemplates;
    }

    AggregatorTemplates.$inject=['ServiceProvider', 'RenderingEngineUtils'];

    return AggregatorTemplates;
});
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
define('render/services/pivotDataFactory',[], function() {
    'use strict';

    function PivotDataFactory(RenderingEngineUtils) {
        function PivotDataFactory() {
            this.colAttrs;
            this.rowAttrs;
            this.valAttrs;
            this.sorters;
            this.tree;
            this.rowKeys;
            this.colKeys;
            this.rowTotals;
            this.colTotals;
            this.allTotal;
            this.sorted;
            this.aggregatorName;
        }
        PivotDataFactory.prototype = {
            constructor: PivotDataFactory,
            init: function(input, opts) {
                var self = this;
                self.aggregatorName = opts.aggregatorName;
                self.colAttrs = opts.cols;
                self.rowAttrs = opts.rows;
                self.valAttrs = opts.vals;
                self.sorters = opts.sorters;
                self.tree = {};
                self.rowKeys = [];
                self.colKeys = [];
                self.rowTotals = {};
                self.colTotals = {};
                self.allTotal = opts.aggregator(self, [], []);
                self.sorted = false;
                RenderingEngineUtils.forEachRecord(input, opts.derivedAttributes, (function(_this) {
                    return function(record) {
                        if (opts.filter(record)) {
                            return _this.processRecord(record, opts);
                        }
                    };
                })(self));
            },
            arrSort: function(attrs) {
                var a, sortersArr;
                sortersArr = (function() {
                    var l, len1, results;
                    results = [];
                    for (l = 0, len1 = attrs.length; l < len1; l++) {
                        a = attrs[l];
                        results.push(RenderingEngineUtils.getSort(this.sorters, a));
                    }
                    return results;
                }).call(this);
                return function(a, b) {
                    var comparison, i, sorter;
                    for (i in sortersArr) {
                        sorter = sortersArr[i];
                        comparison = sorter(a[i], b[i]);
                        if (comparison !== 0) {
                            return comparison;
                        }
                    }
                    return 0;
                };
            },
            sortKeys: function() {
                if (!this.sorted) {
                    this.sorted = true;
                    this.rowKeys.sort(this.arrSort(this.rowAttrs));
                    return this.colKeys.sort(this.arrSort(this.colAttrs));
                }
            },
            getColKeys: function() {
                this.sortKeys();
                return this.colKeys;
            },
            getRowKeys: function() {
                this.sortKeys();
                return this.rowKeys;
            },
            processRecord: function(record, opts) {
                var colKey, flatColKey, flatRowKey, l, len1, len2, n, ref, ref1, ref2, ref3, rowKey, x;
                colKey = [];
                rowKey = [];
                ref = this.colAttrs;
                for (l = 0, len1 = ref.length; l < len1; l++) {
                    x = ref[l];
                    colKey.push((ref1 = record[x]) != null ? ref1 : "null");
                }
                ref2 = this.rowAttrs;
                for (n = 0, len2 = ref2.length; n < len2; n++) {
                    x = ref2[n];
                    rowKey.push((ref3 = record[x]) != null ? ref3 : "null");
                }
                flatRowKey = rowKey.join(String.fromCharCode(0));
                flatColKey = colKey.join(String.fromCharCode(0));
                this.allTotal.push(record);
                if (rowKey.length !== 0) {
                    if (!this.rowTotals[flatRowKey]) {
                        this.rowKeys.push(rowKey);
                        this.rowTotals[flatRowKey] = opts.aggregator(this, rowKey, []);
                    }
                    this.rowTotals[flatRowKey].push(record);
                }
                if (colKey.length !== 0) {
                    if (!this.colTotals[flatColKey]) {
                        this.colKeys.push(colKey);
                        this.colTotals[flatColKey] = opts.aggregator(this, [], colKey);
                    }
                    this.colTotals[flatColKey].push(record);
                }
                if (colKey.length !== 0 && rowKey.length !== 0) {
                    if (!this.tree[flatRowKey]) {
                        this.tree[flatRowKey] = {};
                    }
                    if (!this.tree[flatRowKey][flatColKey]) {
                        this.tree[flatRowKey][flatColKey] = opts.aggregator(this, rowKey, colKey);
                    }
                    return this.tree[flatRowKey][flatColKey].push(record);
                }
            },
            getAggregator: function(rowKey, colKey) {
                var agg, flatColKey, flatRowKey;
                flatRowKey = rowKey.join(String.fromCharCode(0));
                flatColKey = colKey.join(String.fromCharCode(0));
                if (rowKey.length === 0 && colKey.length === 0) {
                    agg = this.allTotal;
                } else if (rowKey.length === 0) {
                    agg = this.colTotals[flatColKey];
                } else if (colKey.length === 0) {
                    agg = this.rowTotals[flatRowKey];
                } else {
                    agg = this.tree[flatRowKey][flatColKey];
                }
                return agg != null ? agg : {
                    value: (function() {
                        return null;
                    }),
                    format: function() {
                        return "";
                    }
                };
            }
        };
        return PivotDataFactory;
    }

    PivotDataFactory.$inject=['RenderingEngineUtils'];

    return PivotDataFactory;
});
(function(){var t,e={}.hasOwnProperty;(t=function(t){return"object"==typeof exports&&"object"==typeof module?t(require("jquery")):"function"==typeof define&&define.amd?define('render/plugins/dist/datatables_renderers.min',["jquery"],t):t(jQuery)})(function(t){var n,a;return n=function(n,a){var r,l,o,i,c,s,u,d,p,h,f,m,g,v,b,w,E,T,C,A,L,M,y,H;s={localeStrings:{totals:"Totals"}},a=t.extend(s,a),o=n.colAttrs,f=n.rowAttrs,g=n.getRowKeys(),c=n.getColKeys(),h=document.createElement("table"),t(h).width(a.datatables.width),h.className=a.datatables["class"].join(" "),C=document.createElement("thead"),b=document.createElement("tbody"),E=document.createElement("tfoot"),v=function(t,e,n){var a,r,l,o,i,c,s,u;if(0!==e){for(o=!0,u=a=0,i=n;i>=0?i>=a:a>=i;u=i>=0?++a:--a)t[e-1][u]!==t[e][u]&&(o=!1);if(o)return-1}for(l=0;e+l<t.length;){for(s=!1,u=r=0,c=n;c>=0?c>=r:r>=c;u=c>=0?++r:--r)t[e][u]!==t[e+l][u]&&(s=!0);if(s)break;l++}return l};for(d in o)if(e.call(o,d)){l=o[d],L=document.createElement("tr"),0===parseInt(d)&&0!==f.length&&(T=document.createElement("th"),T.setAttribute("colspan",f.length),T.setAttribute("rowspan",o.length),L.appendChild(T)),T=document.createElement("th"),T.className="pvtAxisLabel",t(T).css("white-space","nowrap"),T.innerHTML=l,L.appendChild(T);for(u in c)e.call(c,u)&&(i=c[u],H=v(c,parseInt(u),parseInt(d)),-1!==H&&(T=document.createElement("th"),t(T).off("dblclick").on("dblclick",function(e){var n;return n=t.Event("colLabelDrillDownEvent",{event:e,renderingEngineId:a.renderingEngineId}),t(window).trigger(n)}),T.className="pvtColLabel",T.innerHTML=i[d],T.setAttribute("colspan",H),parseInt(d)===o.length-1&&0!==f.length&&T.setAttribute("rowspan",2),L.appendChild(T)));0===parseInt(d)&&(T=document.createElement("th"),T.className="pvtTotalLabel",T.innerHTML=a.localeStrings.totals,T.setAttribute("rowspan",o.length+(0===f.length?0:1)),L.appendChild(T)),C.appendChild(L)}if(0!==f.length){L=document.createElement("tr");for(u in f)e.call(f,u)&&(p=f[u],T=document.createElement("th"),t(T).css("white-space","nowrap"),T.className="pvtAxisLabel",T.innerHTML=p,L.appendChild(T));T=document.createElement("th"),0===o.length&&(T.className="pvtTotalLabel",T.innerHTML=a.localeStrings.totals),L.appendChild(T),C.appendChild(L)}for(u in g)if(e.call(g,u)){m=g[u],L=document.createElement("tr");for(d in m)e.call(m,d)&&(M=m[d],T=document.createElement("th"),t(T).css("white-space","nowrap"),t(T).off("dblclick").on("dblclick",function(e){var n;return n=t.Event("rowLabelDrillDownEvent",{event:e,renderingEngineId:a.renderingEngineId}),t(window).trigger(n)}),T.className="pvtRowLabel",T.innerHTML=M,L.appendChild(T),parseInt(d)===f.length-1&&0!==o.length&&L.appendChild(document.createElement("th")));for(d in c)e.call(c,d)&&(i=c[d],r=n.getAggregator(m,i),y=r.value(),w=document.createElement("td"),w.className="pvtVal row"+u+" col"+d,w.innerHTML=r.format(y),w.setAttribute("data-value",y),L.appendChild(w));A=n.getAggregator(m,[]),y=A.value(),w=document.createElement("td"),w.className="pvtTotal rowTotal",w.innerHTML=A.format(y),w.setAttribute("data-value",y),w.setAttribute("data-for","row"+u),L.appendChild(w),b.appendChild(L)}L=document.createElement("tr"),T=document.createElement("th"),T.className="pvtTotalLabel",T.innerHTML=a.localeStrings.totals,T.setAttribute("colspan",f.length+(0===o.length?0:1)),L.appendChild(T);for(d in c)e.call(c,d)&&(i=c[d],A=n.getAggregator([],i),y=A.value(),w=document.createElement("td"),w.className="pvtTotal colTotal",w.innerHTML=A.format(y),w.setAttribute("data-value",y),w.setAttribute("data-for","col"+d),L.appendChild(w));return A=n.getAggregator([],[]),y=A.value(),w=document.createElement("td"),w.className="pvtGrandTotal",w.innerHTML=A.format(y),w.setAttribute("data-value",y),L.appendChild(w),h.appendChild(C),h.appendChild(b),E.appendChild(L),h.appendChild(E),h.setAttribute("data-numrows",g.length),h.setAttribute("data-numcols",c.length),h},t.fn.finalize=function(e){var n,a,r,l,o;return r=e.numRows,n=e.numCols,a=r,n>0&&(a+=1),l={scrollY:e.datatables.height,fixedColumns:{leftColumns:a,rightColumns:1},scrollX:!0,scrollCollapse:!0,paging:!1,keys:!0,dom:"Bfrtip",buttons:["csvHtml5","pdfHtml5","print"]},o=0!==r||0!==n?{html:this.width("100%"),type:"datatables",postRenderOpts:l,postRenderFunction:function(e,n){t(e).DataTable(n)}}:{html:this,type:"datatables"}},t.fn.heatmap=function(e){var n,a,r,l,o,i,c,s,u,d;switch(null==e&&(e="heatmap"),s=this.data("numrows"),c=this.data("numcols"),n=function(t,e,n){var a;return a=function(){switch(t){case"red":return function(t){return"ff"+t+t};case"green":return function(t){return t+"ff"+t};case"blue":return function(t){return""+t+t+"ff"}}}(),function(t){var r,l;return l=255-Math.round(255*(t-e)/(n-e)),r=l.toString(16).split(".")[0],1===r.length&&(r=0+r),a(r)}},a=function(e){return function(a,r){var l,o,i;return o=function(n){return e.find(a).each(function(){var e;return e=t(this).data("value"),null!=e&&isFinite(e)?n(e,t(this)):void 0})},i=[],o(function(t){return i.push(t)}),l=n(r,Math.min.apply(Math,i),Math.max.apply(Math,i)),o(function(t,e){return e.css("background-color","#"+l(t))})}}(this),e){case"heatmap":a(".pvtVal","red");break;case"rowheatmap":for(r=o=0,u=s;u>=0?u>o:o>u;r=u>=0?++o:--o)a(".pvtVal.row"+r,"red");break;case"colheatmap":for(l=i=0,d=c;d>=0?d>i:i>d;l=d>=0?++i:--i)a(".pvtVal.col"+l,"red")}return a(".pvtTotal.rowTotal","red"),a(".pvtTotal.colTotal","red"),this},t.fn.barchart=function(){var e,n,a,r,l,o;for(l=this.data("numrows"),r=this.data("numcols"),e=function(e){return function(n){var a,r,l,o;return a=function(a){return e.find(n).each(function(){var e;return e=t(this).data("value"),null!=e&&isFinite(e)?a(e,t(this)):void 0})},o=[],a(function(t){return o.push(t)}),r=Math.max.apply(Math,o),l=function(t){return 100*t/(1.4*r)},a(function(e,n){var a,r;return a=n.text(),r=t("<div>").css({position:"relative"}),r.append(t("<div>").css({position:"absolute",bottom:-2,left:0,right:0,height:l(e)+"%","background-color":"gray"})),r.append(t("<div>").text(a).css({position:"relative","padding-left":"5px","padding-right":"5px"})),n.css({padding:0,"padding-top":"5px","text-align":"center"}).html(r)})}}(this),n=a=0,o=l;o>=0?o>a:a>o;n=o>=0?++a:--a)e(".pvtVal.row"+n);return e(".pvtTotal.colTotal"),this},a={Table:function(e,a){return t(n(e,a)).finalize(a)},"Table Barchart":function(e,a){return t(n(e,a)).barchart().finalize(a)},Heatmap:function(e,a){return t(n(e,a)).heatmap().finalize(a)},"Row Heatmap":function(e,a){return t(n(e,a)).heatmap("rowheatmap").finalize(a)},"Col Heatmap":function(e,a){return t(n(e,a)).heatmap("colheatmap").finalize(a)}}})}).call(this);
//# sourceMappingURL=datatables_renderers.min.js.map
;
(function(){var t;(t=function(t){return"object"==typeof exports&&"object"==typeof module?t(require("jquery")):"function"==typeof define&&define.amd?define('render/plugins/dist/gchart_renderers.min',["jquery"],t):t(jQuery)})(function(t){var e,r;return r=function(e,r){return function(n,a){var o,i,l,h,s,u,g,d,c,p,f,C,v,w,m,A,y,j,b,S,x,z,T,k,F,q,D,L,N,W,B,K;if(d={localeStrings:{vs:"vs",by:"by"},gchart:{}},a=t.extend(!0,d,a),null==(i=a.gchart).width&&(i.width=window.innerWidth/1.4),null==(l=a.gchart).height&&(l.height=window.innerHeight/1.4),F=n.getRowKeys(),0===F.length&&F.push([]),s=n.getColKeys(),0===s.length&&s.push([]),c=n.aggregatorName,n.valAttrs.length&&(c+="("+n.valAttrs.join(", ")+")"),v=function(){var t,e,r;for(r=[],t=0,e=F.length;e>t;t++)f=F[t],r.push(f.join("-"));return r}(),v.unshift(""),j=0,"ScatterChart"===e){u=[],S=n.tree;for(K in S){D=S[K];for(B in D)o=D[B],u.push([parseFloat(B),parseFloat(K),c+": \n"+o.format(o.value())])}g=new google.visualization.DataTable,g.addColumn("number",n.colAttrs.join("-")),g.addColumn("number",n.rowAttrs.join("-")),g.addColumn({type:"string",role:"tooltip"}),g.addRows(u),C=n.colAttrs.join("-"),L=n.rowAttrs.join("-"),q=""}else{for(u=[v],w=0,A=s.length;A>w;w++){for(h=s[w],T=[h.join("-")],j+=T[0].length,m=0,y=F.length;y>m;m++)k=F[m],o=n.getAggregator(k,h),null!=o.value()?(N=o.value(),t.isNumeric(N)?1>N?T.push(parseFloat(N.toPrecision(3))):T.push(parseFloat(N.toFixed(3))):T.push(N)):T.push(null);u.push(T)}g=google.visualization.arrayToDataTable(u),q=L=c,C=n.colAttrs.join("-"),""!==C&&(q+=" "+a.localeStrings.vs+" "+C),p=n.rowAttrs.join("-"),""!==p&&(q+=" "+a.localeStrings.by+" "+p)}return b={title:q,hAxis:{title:C,slantedText:j>50},vAxis:{title:L},tooltip:{textStyle:{fontName:"Arial",fontSize:12}},chartArea:{width:"80%",height:"80%"}},"ColumnChart"===e&&(b.vAxis.minValue=0),"ScatterChart"===e?b.legend={position:"none"}:2===u[0].length&&""===u[0][1]&&(b.legend={position:"none"}),t.extend(b,a.gchart,r),x=t("<div>").css({width:a.gchart.width,height:a.gchart.height}),W=new google.visualization.ChartWrapper({dataTable:g,chartType:e,options:b}),W.draw(x[0]),x.bind("dblclick",function(){var t;return t=new google.visualization.ChartEditor,google.visualization.events.addListener(t,"ok",function(){return t.getChartWrapper().draw(x[0])}),t.openDialog(W)}),z={html:x}}},e={"Line Chart":r("LineChart"),"Bar Chart":r("ColumnChart"),"Stacked Bar Chart":r("ColumnChart",{isStacked:!0}),"Area Chart":r("AreaChart",{isStacked:!0}),"Scatter Chart":r("ScatterChart")}})}).call(this);
//# sourceMappingURL=gchart_renderers.min.js.map
;
(function(){var t;(t=function(t){return"object"==typeof exports&&"object"==typeof module?t(require("jquery"),require("c3")):"function"==typeof define&&define.amd?define('render/plugins/dist/c3_renderers.min',["jquery","c3"],t):t(jQuery,c3)})(function(t,e){var a,n;return n=function(a){return null==a&&(a={}),function(n,r){var o,i,l,s,c,u,p,d,g,h,f,y,v,b,j,x,m,w,C,A,k,F,S,q,z,N,B,K,T,H,L,P,Q,R,W,D,E,G,I;if(h={localeStrings:{vs:"vs",by:"by"},c3:{}},r=t.extend(!0,h,r),null==(i=r.c3).size&&(i.size={}),null==(l=r.c3.size).width&&(l.width=window.innerWidth/1.4),null==(s=r.c3.size).height&&(s.height=window.innerHeight/1.4-50),null==a.type&&(a.type="line"),P=n.getRowKeys(),0===P.length&&P.push([]),u=n.getColKeys(),0===u.length&&u.push([]),j=function(){var t,e,a;for(a=[],t=0,e=u.length;e>t;t++)v=u[t],a.push(v.join("-"));return a}(),K=0,f=n.aggregatorName,n.valAttrs.length&&(f+="("+n.valAttrs.join(", ")+")"),"scatter"===a.type){d=[],b=n.colAttrs.join("-"),D=n.rowAttrs.join("-"),q=n.tree;for(I in q){W=q[I];for(G in W)o=W[G],g={},g[b]=parseFloat(G),g[D]=parseFloat(I),g.tooltip=o.format(o.value()),d.push(g)}}else{for(F=0,x=0,C=j.length;C>x;x++)G=j[x],F+=G.length;for(F>50&&(K=45),p=[],m=0,A=P.length;A>m;m++){for(L=P[m],H=L.join("-"),T=[""===H?n.aggregatorName:H],w=0,k=u.length;k>w;w++)c=u[w],E=parseFloat(n.getAggregator(L,c).value()),isFinite(E)?1>E?T.push(E.toPrecision(3)):T.push(E.toFixed(3)):T.push(null);p.push(T)}D=n.aggregatorName+(n.valAttrs.length?"("+n.valAttrs.join(", ")+")":""),b=n.colAttrs.join("-")}return R=f,""!==b&&(R+=" "+r.localeStrings.vs+" "+b),y=n.rowAttrs.join("-"),""!==y&&(R+=" "+r.localeStrings.by+" "+y),Q=t("<p>",{style:"text-align: center; font-weight: bold"}),Q.text(R),S={axis:{y:{label:D},x:{label:b,tick:{rotate:K,multiline:!1}}},data:{type:a.type},tooltip:{grouped:!1},color:{pattern:["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac"]}},t.extend(S,r.c3),"scatter"===a.type?(S.data.x=b,S.axis.x.tick={fit:!1},S.data.json=d,S.data.keys={value:[b,D]},S.legend={show:!1},S.tooltip.format={title:function(){return f},name:function(){return""},value:function(t,e,a,n){return d[n].tooltip}}):(S.axis.x.type="category",S.axis.x.categories=j,S.data.columns=p),null!=a.stacked&&(S.data.groups=[function(){var t,e,a;for(a=[],t=0,e=P.length;e>t;t++)G=P[t],a.push(G.join("-"));return a}()]),z=t("<div>",{style:"display:none;"}).appendTo(t("body")),N=t("<div>").appendTo(z),S.bindto=N[0],e.generate(S),N.detach(),z.remove(),t("<div>").append(Q,N),B={html:N}}},a={"C3 - Line Chart":n(),"C3 - Bar Chart":n({type:"bar"}),"C3 - Stacked Bar Chart":n({type:"bar",stacked:!0}),"C3 - Area Chart":n({type:"area",stacked:!0}),"C3 - Scatter Chart":n({type:"scatter"})}})}).call(this);
//# sourceMappingURL=c3_renderers.min.js.map
;
(function(){var e;(e=function(e){return"object"==typeof exports&&"object"==typeof module?e(require("jquery"),require("d3")):"function"==typeof define&&define.amd?define('render/plugins/dist/d3_renderers.min',["jquery","d3"],e):e(jQuery,d3)})(function(e,t){var n;return n={Treemap:function(n,i){var r,u,l,d,o,a,h,c,f,s,g,y,p,v;for(l={localeStrings:{},d3:{width:function(){return e(window).width()/1.4},height:function(){return e(window).height()/1.4}}},i=e.extend(l,i),c=e("<div>").css({width:i.d3.width(),height:i.d3.height()}),g={name:"All",children:[]},r=function(e,t,n){var i,u,l,d,o,a;if(0===t.length)return void(e.value=n);for(null==e.children&&(e.children=[]),a=t.shift(),o=e.children,u=0,l=o.length;l>u;u++)if(i=o[u],i.name===a)return void r(i,t,n);return d={name:a},r(d,t,n),e.children.push(d)},h=n.getRowKeys(),o=0,a=h.length;a>o;o++)s=h[o],p=n.getAggregator(s,[]).value(),null!=p&&r(g,s,p);return u=t.scale.category10(),v=i.d3.width(),d=i.d3.height(),y=t.layout.treemap().size([v,d]).sticky(!0).value(function(e){return e.size}),t.select(c[0]).append("div").style("position","relative").style("width",v+"px").style("height",d+"px").datum(g).selectAll(".node").data(y.padding([15,0,0,0]).value(function(e){return e.value}).nodes).enter().append("div").attr("class","node").style("background",function(e){return null!=e.children?"lightgrey":u(e.name)}).text(function(e){return e.name}).call(function(){this.style("left",function(e){return e.x+"px"}).style("top",function(e){return e.y+"px"}).style("width",function(e){return Math.max(0,e.dx-1)+"px"}).style("height",function(e){return Math.max(0,e.dy-1)+"px"})}),f={html:c}}}})}).call(this);
//# sourceMappingURL=d3_renderers.min.js.map
;
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
define('render/services/renderers',['../../render/plugins/dist/datatables_renderers.min',
    '../../render/plugins/dist/gchart_renderers.min',
    '../../render/plugins/dist/c3_renderers.min',
    '../../render/plugins/dist/d3_renderers.min'], 
    function(datatables_renderers, 
        gchart_renderers,
        c3_renderers,
        d3_renderers) {
    'use strict';

    function Renderers(ServiceProvider) {
        function Renderers() {
            this.availableRenderers;
            this.availableRendererNames;
            this.availableRendererOptions;
        }
        Renderers.prototype = {
            constructor: Renderers,
            init: function() {
                if(ServiceProvider.Renderers === undefined){
                    ServiceProvider.add('Renderers', renderers);
                }
                var self = this;
                self.availableRenderers = $.extend({}, datatables_renderers, gchart_renderers, c3_renderers, d3_renderers); 
                self.availableRendererNames = Object.keys(self.availableRenderers);
                self.availableRendererOptions = {
                    gchart: {},
                    datatables: {
                        class: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
                    },
                    c3: {
                        size: {}
                    },
                    d3: {}
                };
            },
            addRenderers: function(renderers){
                var self = this;
                $.extend(self.availableRenderers, renderers);
                self.availableRendererNames = Object.keys(self.availableRenderers);
            },
            setRendererOptions: function(properyName, config) {
                var self = this;
                self.availableRendererOptions[properyName] = config;
            }
        };
        var renderers = new Renderers();
        renderers.init();
        return renderers;
    }

    Renderers.$inject=['ServiceProvider'];

    return Renderers;
});
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
define('render/services/renderingEngineFactory',[], function() {
    'use strict';

    function RenderingEngineFactory(Aggregators, RenderingEngineUtils, Renderers, PivotDataFactory, $q, $timeout, $window, $rootScope) {
        function RenderingEngineFactory() {
            this.id;
            this.element;
            this.disabled;
            this.title;
            this.rendererName;
            this.aggregatorName;
            this.aggInputAttributeName;
            this.numInputsToProcess;
            this.axisValues;
            this.shownAttributes;
            this.availableAttributes;
            this.tblCols;
            this.cols;
            this.rows;
            this.attributesAvailableForRowsAndCols;
            this.attributeFilterExclusions;
            this.attributeFilterInclusions;
            this.tile;
        }
        RenderingEngineFactory.prototype = {
            constructor: RenderingEngineFactory,
            init: function(dataSourceConfigId) {
                var self = this;
                self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
                self.dataSourceConfigId = dataSourceConfigId;
                //Does not belong here...This is a flag that the tabs use in the
                //Explore perspective to know which tab is active. We should have
                //some sort of tab manager that tracks this...
                self.disabled = false; 
                self.title = "Untitiled";
                //Does not belong here...This is an objet the dashboardFactory uses in
                //the Dashboard Designer perspective to know location and size of the widget.
                //We should have some sort of dashboard manager that tracks this...
                self.tile = {
                    size_x: 1,
                    size_y: 1,
                    col: 1,
                    row: 1
                };
                self.rendererName = "Table";
                self.aggregatorName = "Count";
                self.aggInputAttributeName = [];
                self.numInputsToProcess = [];
                self.axisValues = {};
                self.shownAttributes = [];
                self.availableAttributes = [];
                self.tblCols = [];
                self.cols = [];
                self.rows = [];
                self.attributesAvailableForRowsAndCols = [];
                self.attributeFilterExclusions = {};
                self.attributeFilterInclusions = {};
            },
            setRendererName: function(rendererName, data) {
                var self = this;
                self.rendererName = rendererName;
                self.draw(data);
            },
            setNumberOfAggregateInputs: function (){
                var self = this;
                var numInputs;
                try {
                    numInputs = Aggregators.availableAggregators[self.aggregatorName]([])().numInputs;
                } catch(_error) {
                    //Log error and do nothing...we just needed to know how many inputs we need to collect
                    e = _error;
                    if (typeof console !== "undefined" && console !== null) {
                        console.error(e.stack);
                    }
                }
                if(numInputs === undefined) {
                    self.numInputsToProcess = new Array();
                    self.aggInputAttributeName = new Array();
                } else {
                    self.numInputsToProcess = new Array(numInputs);
                    if(self.aggInputAttributeName.length !== numInputs) {
                        self.aggInputAttributeName = new Array(numInputs);
                    }
                }
            },
            setAggregatorName: function(aggregatorName) {
                var self = this;
                self.aggregatorName = aggregatorName;
            },
            isExcluded: function(property, key) {
                var self = this;
                if(self.attributeFilterExclusions[property] !== undefined) {
                    if(self.attributeFilterExclusions[property].indexOf(key) >= 0){
                        return false;
                    } else {
                        return true;    
                    }
                }
                return true;
            },
            addExclusionFilter: function(attributeFilterName, filterByAttributeValue) {
                var self = this;
                if(self.attributeFilterExclusions[attributeFilterName] !== undefined) {
                    var index = this.attributeFilterExclusions[attributeFilterName].indexOf(filterByAttributeValue);
                    if(index >= 0) {
                        self.attributeFilterExclusions[attributeFilterName].splice(index, 1);
                    } else {
                        self.attributeFilterExclusions[attributeFilterName].push(filterByAttributeValue);
                    }
                } else {
                    self.attributeFilterExclusions[attributeFilterName] = [];
                    self.attributeFilterExclusions[attributeFilterName].push(filterByAttributeValue);
                } 
                self.attributeFilterInclusions[attributeFilterName] = [];
                angular.forEach(self.axisValues[attributeFilterName], function(value, key) {
                    if(self.attributeFilterExclusions[attributeFilterName].indexOf(key) < 0) {
                        self.attributeFilterInclusions[attributeFilterName].push(key);
                    }
                });
            },
            addInclusionFilter: function(attributeFilterName, filterByAttributeValue) {
                var self = this;
                self.attributeFilterInclusions[attributeFilterName] = [];
                self.attributeFilterExclusions[attributeFilterName] = [];
                self.addExclusionFilter(attributeFilterName, filterByAttributeValue);
                var oldAttributeFilterInclusions = self.attributeFilterInclusions[attributeFilterName];
                self.attributeFilterInclusions[attributeFilterName] = self.attributeFilterExclusions[attributeFilterName];
                self.attributeFilterExclusions[attributeFilterName] = oldAttributeFilterInclusions;
            },
            //Does not belong here...This is an objet the dashboardFactory uses in
            //the Dashboard Designer perspective to know location and size of the widget.
            //We should have some sort of dashboard manager that tracks this...
            updateTile: function(size_x, size_y, col, row){
                var self = this;
                self.tile = {
                    size_x: size_x,
                    size_y: size_y,
                    col: col,
                    row: row
                };
            },
            /*
             * @param {string} [table]
             *    A plain JSON-serialized string of the data.
             */
            draw: function(data) {
                var self = this;
                var deferred = $q.defer();
                $rootScope.$emit('draw initiated');
                $timeout(function(data) {
                    //Set the RenderingEngine id, # rows, and #cols for access in renderer
                    Renderers.availableRendererOptions['renderingEngineId'] = self.id;
                    Renderers.availableRendererOptions['numRows'] = self.rows.length;
                    Renderers.availableRendererOptions['numCols'] = self.cols.length;
                    //Set the height and width for each renderer option to fit into container
                    angular.forEach(Renderers.availableRendererOptions, function(value, key) {
                        switch (key){
                            case "datatables":
                                value.height = (self.element.parent().parent().innerHeight() - 24 - 40 - 31 - 31 - 22 - ((self.cols.length + 1)*30)) + 'px'; //height - header - buttons - table head - table foot - bottom message - # of cols
                                value.width = self.element.parent().parent().innerWidth();
                                break;
                            case "gchart":
                                value.height = self.element.parent().parent().innerHeight() - 24 - 10;//height - header - title?
                                value.width = self.element.parent().parent().innerWidth();
                                break;
                            case "c3":
                                value.size.height = self.element.parent().parent().innerHeight() - 24 - 10;//height - header - title?
                                value.size.width = self.element.parent().parent().innerWidth();
                                break;
                            case "d3":
                                value.height = function(){ return self.element.parent().parent().innerHeight();};//height is ignored for d3???
                                value.width = function(){ return self.element.parent().parent().innerWidth() - 16;};//d3 draws a little too wide???
                                break;
                            default:
                                //do nothing
                        }
                                
                    });
                    data = RenderingEngineUtils.convertToArray(data);
                    if(data !== undefined){
                        if(data.length > 0){
                            self.availableAttributes = self.rows.concat(self.cols);
                            var opts = {
                                cols: self.cols,
                                rows: self.rows,
                                vals: self.aggInputAttributeName,
                                hiddenAttributes: [],
                                filter: function(record) {
                                    var excludedItems, ref7;
                                    for (var k in self.attributeFilterExclusions) {
                                        excludedItems = self.attributeFilterExclusions[k];
                                        if (ref7 = "" + record[k], RenderingEngineUtils.indexOf.call(excludedItems, ref7) >= 0) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                aggregator: Aggregators.availableAggregators[self.aggregatorName](self.aggInputAttributeName),
                                aggregatorName: self.aggregatorName,
                                sorters: function() {},
                                derivedAttributes: {}
                            };
                            self.tblCols = [];
                            self.tblCols = (function() {
                                var ref, results;
                                ref = data[0];
                                results = [];
                                for (var k in ref) {
                                    if (!RenderingEngineUtils.hasProp.call(ref, k)) continue;
                                    results.push(k);
                                }
                                return results;
                            })();
                            self.axisValues = {};
                            for (var l = 0, len1 = self.tblCols.length; l < len1; l++) {
                                var x = self.tblCols[l];
                                self.axisValues[x] = {};
                            }
                            RenderingEngineUtils.forEachRecord(data, opts.derivedAttributes, function(record) {
                                var base, results, v;
                                results = [];
                                for (var k in record) {
                                    if (!RenderingEngineUtils.hasProp.call(record, k)) continue;
                                    v = record[k];
                                    if (v == null) {
                                        v = "null";
                                    }
                                    if ((base = self.axisValues[k])[v] == null) {
                                        base[v] = 0;
                                    }
                                    results.push(self.axisValues[k][v]++);
                                }
                                return results;
                            });
                            self.shownAttributes = [];
                            self.shownAttributes = (function() {
                                var len2, n, results;
                                results = [];
                                for (var n = 0, len2 = self.tblCols.length; n < len2; n++) {
                                    var c = self.tblCols[n];
                                    if (RenderingEngineUtils.indexOf.call(opts.hiddenAttributes, c) < 0) {
                                        results.push(c);
                                    }
                                }
                                return results;
                            })();
                            if(self.attributesAvailableForRowsAndCols.length + self.rows.length + self.cols.length !== self.shownAttributes.length) {
                                self.attributesAvailableForRowsAndCols = self.shownAttributes;
                            }
                            var result = null;
                            var DataView = null;
                            try {
                                DataView = new PivotDataFactory();
                                DataView.init(data, opts);
                                try {
                                    result = Renderers.availableRenderers[self.rendererName](DataView, Renderers.availableRendererOptions);
                                } catch (_error) {
                                    e = _error;
                                    if (typeof console !== "undefined" && console !== null) {
                                        console.error(e.stack);
                                    }
                                    result = $("<span>").html(opts.localeStrings.renderError);
                                }
                            } catch (_error) {
                                e = _error;
                                if (typeof console !== "undefined" && console !== null) {
                                    console.error(e.stack);
                                }
                                result = $("<span>").html(opts.localeStrings.computeError);
                            }
                            //Remove old viz
                            self.element.empty();
                            //append the new viz
                            self.element.append(result.html);
                            $rootScope.$emit('draw complete');
                            //run any post render functions defined by visual
                            if(result.postRenderFunction){
                                result.postRenderFunction(result.html, result.postRenderOpts);
                            }
                            //clean up
                            // delete DataView;
                            // delete data;
                            // delete result;
                        }
                    }
                    deferred.resolve();
                }, 1500, true, data);
                return deferred.promise;
            }
        };
        return RenderingEngineFactory;
    }

    RenderingEngineFactory.$inject=['Aggregators', 'RenderingEngineUtils', 'Renderers', 'PivotDataFactory', '$q', '$timeout', '$window', '$rootScope'];

    return RenderingEngineFactory;
});
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
define('render/services/renderingEngineManager',[], function() {
    'use strict';

    function RenderingEngineManager(UiControls, ServiceProvider, RenderingEngineFactory, DataSourceConfigurationManager, DataSourceManager, DataSourceUtils, $http) {
        function RenderingEngineManager() {
            this.renderingEngines = {};
            this.activeRenderingEngine;
        }
        RenderingEngineManager.prototype = {
            constructor: RenderingEngineManager,
            init: function(){
                if(ServiceProvider.RenderingEngineManager === undefined){
                    ServiceProvider.add('RenderingEngineManager', renderingEngineManager);
                }
            },
            create: function(dataSourceConfigurationId) {
                if(DataSourceManager.dataSources[dataSourceConfigurationId] === undefined){
                    DataSourceManager.create(dataSourceConfigurationId, DataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfigurationId].name);
                    $http(angular.fromJson(DataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfigurationId].httpConfig)).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        DataSourceManager.dataSources[dataSourceConfigurationId].data = $.csv.toArrays(response.data);
                        DataSourceUtils.format(DataSourceManager.dataSources[dataSourceConfigurationId]);
                        UiControls.hideDialog();
                        var renderingEngine = new RenderingEngineFactory();
                        renderingEngine.init(dataSourceConfigurationId);
                        renderingEngine.active = true;  
                        renderingEngineManager.add(renderingEngine);
                        renderingEngineManager.activeRenderingEngine = renderingEngine.id;
                    }, function errorCallback(response) {
                        var tmp;
                        DataSourceManager.delete(dataSourceConfigurationId);
                    });
                } else{
                    UiControls.hideDialog();
                    var renderingEngine = new RenderingEngineFactory();
                    renderingEngine.init(dataSourceConfigurationId);
                    renderingEngineManager.add(renderingEngine);
                    renderingEngineManager.activeRenderingEngine = renderingEngine.id;
                }
            },
            add: function(renderingEngine){
                renderingEngineManager.renderingEngines[renderingEngine.id] = renderingEngine;
            },
            delete: function(id){
                delete renderingEngineManager.renderingEngines[id];
            },
            setActiveRenderingEngine: function(id){
                renderingEngineManager.activeRenderingEngine = id;
                angular.forEach(renderingEngineManager.renderingEngines, function(RenderingEngine) {
                    RenderingEngine.active = false;
                    if(RenderingEngine.id === id){
                        RenderingEngine.active = true;
                    }
                });
            },
            updateAllRenderingEngineTileSizeAndPosition: function($widgets){
                angular.forEach($widgets, function($widget){
                    renderingEngineManager.renderingEngines[$widget.id].updateTile($($widget).attr('data-sizex'), $($widget).attr('data-sizey'), $($widget).attr('data-col'), $($widget).attr('data-row'))
                });
            }
        };
        var renderingEngineManager = new RenderingEngineManager();
        renderingEngineManager.init();
        return renderingEngineManager;
    }

    RenderingEngineManager.$inject=['UiControls', 'ServiceProvider', 'RenderingEngineFactory', 'DataSourceConfigurationManager', 'DataSourceManager', 'DataSourceUtils', '$http'];

    return RenderingEngineManager;
});
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
define('render/services/renderingEngineUtils',[], function() {
    'use strict';

    function RenderingEngineUtils(ServiceProvider) {
        function RenderingEngineUtils() {
        }
        RenderingEngineUtils.prototype = {
            constructor: RenderingEngineUtils,
            init: function(){
                if(ServiceProvider.RenderingEngineUtils === undefined){
                    ServiceProvider.add('RenderingEngineUtils', renderingEngineUtils);
                }
            },
            hasProp: {}.hasOwnProperty,
            indexOf: [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
            convertToArray: function(input) {
                var result;
                result = [];
                renderingEngineUtils.forEachRecord(input, {}, function(record) {
                    return result.push(record);
                });
                return result;
            },
            bind: function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
            forEachRecord: function(input, derivedAttributes, f) {
                var addRecord, compactRecord, i, j, k, l, len1, record, ref, results, results1, tblCols;
                if ($.isEmptyObject(derivedAttributes)) {
                    addRecord = f;
                } else {
                    addRecord = function(record) {
                        var k, ref, v;
                        for (k in derivedAttributes) {
                            v = derivedAttributes[k];
                            record[k] = (ref = v(record)) != null ? ref : record[k];
                        }
                        return f(record);
                    };
                }
                if ($.isFunction(input)) {
                    return input(addRecord);
                } else if ($.isArray(input)) {
                    if ($.isArray(input[0])) {
                        results = [];
                        for (i in input) {
                            if (!renderingEngineUtils.hasProp.call(input, i)) continue;
                            compactRecord = input[i];
                            if (!(i > 0)) {
                                continue;
                            }
                            record = {};
                            ref = input[0];
                            for (j in ref) {
                                if (!renderingEngineUtils.hasProp.call(ref, j)) continue;
                                k = ref[j];
                                record[k] = compactRecord[j];
                            }
                            results.push(addRecord(record));
                        }
                        return results;
                    } else {
                        results1 = [];
                        for (l = 0, len1 = input.length; l < len1; l++) {
                            record = input[l];
                            results1.push(addRecord(record));
                        }
                        return results1;
                    }
                } else if (input instanceof jQuery) {
                    tblCols = [];
                    $('thead > tr > th', input).each(function(i) {
                        return tblCols.push($(this).text());
                    });
                    return $('tbody > tr', input).each(function(i) {
                        record = {};
                        $('td', this).each(function(j) {
                            return record[tblCols[j]] = $(this).html();
                        });
                        return addRecord(record);
                    });
                } else {
                    throw new Error('unknown input format');
                }
            },
            addSeparators: function(nStr, thousandsSep, decimalSep) {
                var rgx, x, x1, x2;
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? decimalSep + x[1] : '';
                rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + thousandsSep + '$2');
                }
                return x1 + x2;
            },
            numberFormat: function(opts) {
                var self = this;
                var defaults;
                defaults = {
                    digitsAfterDecimal: 2,
                    scaler: 1,
                    thousandsSep: ',',
                    decimalSep: '.',
                    prefix: '',
                    suffix: '',
                    showZero: false
                };
                opts = $.extend(defaults, opts);
                return function(x) {
                    var result;
                    if (isNaN(x) || !isFinite(x)) {
                        return '';
                    }
                    if (x === 0 && !opts.showZero) {
                        return '';
                    }
                    result = self.addSeparators((opts.scaler * x).toFixed(opts.digitsAfterDecimal), opts.thousandsSep, opts.decimalSep);
                    return '' + opts.prefix + result + opts.suffix;
                };
            },
            sortAs: function(order) {
                var i, mapping, x;
                mapping = {};
                for (i in order) {
                    x = order[i];
                    mapping[x] = i;
                }
                return function(a, b) {
                    if ((mapping[a] != null) && (mapping[b] != null)) {
                        return mapping[a] - mapping[b];
                    } else if (mapping[a] != null) {
                        return -1;
                    } else if (mapping[b] != null) {
                        return 1;
                    } else {
                        return renderingEngineUtils.naturalSort(a, b);
                    }
                };
            },
            naturalSort: function(as, bs) {
                var a, a1, b, b1, rd, rx, rz;
                rx = /(\d+)|(\D+)/g;
                rd = /\d/;
                rz = /^0/;
                if (typeof as === 'number' || typeof bs === 'number') {
                    if (isNaN(as)) {
                        return 1;
                    }
                    if (isNaN(bs)) {
                        return -1;
                    }
                    return as - bs;
                }
                a = String(as).toLowerCase();
                b = String(bs).toLowerCase();
                if (a === b) {
                    return 0;
                }
                if (!(rd.test(a) && rd.test(b))) {
                    return (a > b ? 1 : -1);
                }
                a = a.match(rx);
                b = b.match(rx);
                while (a.length && b.length) {
                    a1 = a.shift();
                    b1 = b.shift();
                    if (a1 !== b1) {
                        if (rd.test(a1) && rd.test(b1)) {
                            return a1.replace(rz, '.0') - b1.replace(rz, '.0');
                        } else {
                            return (a1 > b1 ? 1 : -1);
                        }
                    }
                }
                return a.length - b.length;
            },
            getSort: function(sorters, attr) {
                var sort;
                sort = sorters(attr);
                if ($.isFunction(sort)) {
                    return sort;
                } else {
                    return renderingEngineUtils.naturalSort;
                }
            },
            usFmt: function() {
                return renderingEngineUtils.numberFormat();
            },
            usFmtInt: function() {
                return renderingEngineUtils.numberFormat({
                    digitsAfterDecimal: 0
                });
            },
            usFmtPct:  function() {
                return renderingEngineUtils.numberFormat({
                    digitsAfterDecimal: 1,
                    scaler: 100,
                    suffix: '%'
                });
            }
        };
        var renderingEngineUtils = new RenderingEngineUtils();
        renderingEngineUtils.init();
        return renderingEngineUtils;
    }

    RenderingEngineUtils.$inject=['ServiceProvider'];

    return RenderingEngineUtils;
});
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
define('syndicate/directives/dashboardDirective',[], function() {
    'use strict';

    function dashboardDirective(DashboardFactory, ServiceProvider, $window) {
        return {
            restrict: 'E',
            scope: {
                'renderingEngineManager': '='
            },
            link: {
                pre: function(scope, element, attrs) {
                //Clean up any existing context menus before we create more    
                $('.context-menu-list').remove();
                scope.DashboardFactory = new DashboardFactory($(element));
                scope.DashboardFactory.draw(scope);
                }
            }
        };
    }

    dashboardDirective.$inject=['DashboardFactory', 'ServiceProvider', '$window'];

    return dashboardDirective;
});
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
define('syndicate/services/dashboardFactory',[], function() {
    'use strict';

    function DashboardFactory($rootScope, $compile, $window, ServiceProvider, UiControls, $q, $timeout) {
        function DashboardFactory(element) {
            this.id;
            this.element = element;
        }
        DashboardFactory.prototype = {
            constructor: DashboardFactory,
            init: function() {
                var self = this;
                self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            },
            draw: function(scope) {
                var self = this;
                var deferred = $q.defer();
                $timeout(function(scope) {
                    scope.ServiceProvider = ServiceProvider;
                    scope.options = {
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
                            resize: function(e, ui, $widget) {
                            },
                            stop: function(e, ui, $widget) {
                                scope.renderingEngineManager.renderingEngines[$widget[0].id].draw(ServiceProvider.DataSourceManager.dataSources[scope.renderingEngineManager.renderingEngines[$widget[0].id].dataSourceConfigId].formattedData);
                                scope.renderingEngineManager.updateAllRenderingEngineTileSizeAndPosition(ui.$player.parent().parent().data('gridster').$widgets);
                            }
                        },
                        draggable: {
                            handle: 'div.context-menu.box',
                            stop: function(e, ui, $widget) {
                                scope.renderingEngineManager.updateAllRenderingEngineTileSizeAndPosition(ui.$player.parent().data('gridster').$widgets);
                            }
                        },
                        //http://matthew.wagerfield.com/parallax/
                        parallax: {
                            enabled: true,
                            dataDepth: 0.05
                        }
                    };
                    var ul = document.createElement('ul');
                    ul.setAttribute('class','gridster');
                    //Build the grid from the renderingEngineManager
                    var i = 1;
                    angular.forEach(scope.renderingEngineManager.renderingEngines, function(RenderingEngine, uuid) {
                        var contextMenu = 'contextMenu' + i;
                        scope[contextMenu] = {
                            callback: function(key, options) {
                                switch(key) {
                                    case "edit":
                                        scope.renderingEngineManager.setActiveRenderingEngine(RenderingEngine.id);
                                        $rootScope.$emit('Explore View');
                                        break;
                                    case "delete":
                                        self.element.isolateScope().gridster.remove_widget(RenderingEngine.element.parent().parent());
                                        scope.renderingEngineManager.delete(RenderingEngine.id);
                                        var returnToExploration = true;
                                        angular.forEach(scope.renderingEngineManager.renderingEngines, function(RenderingEngine, uuid) {
                                            returnToExploration = false;
                                        });
                                        if(returnToExploration){
                                            $rootScope.$emit('Explore View');
                                        }
                                        break;
                                    default:
                                        var m = "clicked: " + key;
                                        window.console && console.log(m) || alert(m);
                                }
                            },
                            items: {
                                "edit": {
                                    name: "Edit",
                                    icon: "edit",
                                    chartId: uuid
                                },
                                "delete": {
                                    name: "Delete",
                                    icon: "delete"
                                }
                            }
                        };
                        var li = document.createElement('li');
                        li.setAttribute('class','md-whiteframe-z5');
                        li.setAttribute('id', uuid);
                        li.setAttribute('data-max-sizex', 5);
                        li.setAttribute('data-max-sizey', 3);
                        li.setAttribute('data-row', RenderingEngine.tile.row);
                        li.setAttribute('data-col', RenderingEngine.tile.col);
                        li.setAttribute('data-sizex', RenderingEngine.tile.size_x);
                        li.setAttribute('data-sizey', RenderingEngine.tile.size_y);
                        $(ul).append(li);
                        $(li).append($compile("<header style='cursor:move' class='ui-dialog-titlebar ui-widget-header' context-menu='" + contextMenu + "' context-menu-selector=\"'.context-menu'\"><div class='context-menu box' ><span class='handle ui-icon ui-icon-gear' style='display:inline-block'></span>" + RenderingEngine.title + "</div></header>")(scope));
                        var div = document.createElement('div');
                        div.setAttribute('class','gridsterWidgetContainer');
                        var renderer = $compile("<rendering-engine-directive input='ServiceProvider.DataSourceManager.dataSources[renderingEngineManager.renderingEngines[\"" + uuid + "\"].dataSourceConfigId].formattedData' engine='renderingEngineManager.renderingEngines[\"" + uuid + "\"]'></rendering-engine-directive>")(scope);
                        $(div).append(renderer[0]);
                        $(li).append(div);
                        i++;
                    });
                    self.element.append(ul);
                    var gridster = $(ul).gridster(scope.options);
                    //squirell this away on the scope so that later (like in the delete context menu) it can be accessed
                    scope.gridster = gridster.data('gridster');
                    if (!scope.options.enableDragging) {
                        scope.gridster.disable();
                    }
                    if(scope.options.parallax.enabled){
                        var parallax = $("<ul><li data-depth='" + scope.options.parallax.dataDepth + "' class='layer'></li></ul>");
                        parallax.parallax();
                        var parallaxLi = parallax.find('li');
                        parallaxLi.append(gridster);
                        self.element.append(parallax);
                    }
                    deferred.resolve();
                }, 500, true, scope);
                return deferred.promise;
            }
        };
        return DashboardFactory;
    }

    DashboardFactory.$inject=['$rootScope', '$compile', '$window', 'ServiceProvider', 'UiControls', '$q', '$timeout'];

    return DashboardFactory;
});
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
define('rndr-angular-module',['acquire/directives/acquisitionDirective',
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
