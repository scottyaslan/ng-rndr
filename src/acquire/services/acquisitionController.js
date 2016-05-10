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
define([], function() {
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