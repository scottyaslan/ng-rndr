define([], function() {
    'use strict';

    function RenderingEngineManager(RenderingEngineFactory, DataSourceConfigurationManager, DataSourceManager, DataSourceUtils, $http) {
        function RenderingEngineManager() {
            this.renderingEngines = {};
            this.activeRenderingEngine;
        }
        RenderingEngineManager.prototype = {
            constructor: RenderingEngineManager,
            init: function(){},
            create: function(dataSourceConfigurationId) {
                if(DataSourceManager.dataSources[dataSourceConfigurationId] === undefined){
                    DataSourceManager.create(dataSourceConfigurationId, DataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfigurationId].name);
                    $http(angular.fromJson(DataSourceConfigurationManager.dataSourceConfigurations[dataSourceConfigurationId].httpConfig)).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        DataSourceManager.dataSources[dataSourceConfigurationId].data = $.csv.toArrays(response.data);
                        DataSourceUtils.format(DataSourceManager.dataSources[dataSourceConfigurationId]);
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

    return RenderingEngineManager;
});