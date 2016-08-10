define([], function() {
    'use strict';

    function AcquisitionController(RenderingEngineFactory, RenderingEngineManager, DataSourceUtils, DataSourceManager, DataSourceConfigurationManager, $rootScope, $window) {
        function AcquisitionController() {
        }
        AcquisitionController.prototype = {
            constructor: AcquisitionController,
            init: function() {
                DataSourceManager.create(DataSourceConfigurationManager.create("Untitled"), "Untitled");
                $rootScope.$on('acquiring data', function(){
                    acquisitionController.dataAcquisitionInProgress = true;
                });
                $rootScope.$on('data acquired', function(){
                    acquisitionController.dataAcquisitionInProgress = false;
                });
                $rootScope.$emit('data source configuration wizard init');
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
                $rootScope.$emit('data source configuration wizard save');
            },
            cancel: function() {
                DataSourceManager.delete(DataSourceManager.dataSources[DataSourceConfigurationManager.activeDataSourceConfiguration].dataSourceConfigId);
                DataSourceConfigurationManager.delete(DataSourceConfigurationManager.activeDataSourceConfiguration);
                DataSourceConfigurationManager.activeDataSourceConfiguration = "";
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

    return AcquisitionController;
});