define([], function() {
    'use strict';

    return function(renderingEnginesCollection, dataSources, dataSourceConfigurations, $rootScope, $window, $q) {
        function AcquisitionController() {}
        AcquisitionController.prototype = {
            constructor: AcquisitionController,
            init: function() {
                dataSources.create(dataSourceConfigurations.create("Untitled", angular.toJson({
                    method: 'GET',
                    url: 'http://nicolas.kruchten.com/pivottable/examples/montreal_2014.csv'
                })), "Untitled");
                $rootScope.$on('dataSource:acquire:begin', function() {
                    acquisitionController.dataAcquisitionInProgress = true;
                });
                $rootScope.$on('dataSource:acquire:success', function() {
                    acquisitionController.dataAcquisitionInProgress = false;
                });
                acquisitionController.restClientContentView = 'HTTP Config';
            },
            save: function() {
                var renderingEngine = renderingEnginesCollection.create("DataTable - Table", dataSources.map[dataSourceConfigurations.activeDataSourceConfiguration].name);
                //This is a flag that the tabs use in the Explore perspective to know which tab is active.
                renderingEngine.disabled = false;
                //This is an objet the `dashboard` uses in the Dashboard Designer perspective to know location and size of the widget.
                renderingEngine.tile = {
                    size_x: 1,
                    size_y: 1,
                    col: 1,
                    row: 1
                };
                //This is the dataSourceConfigId used to pass data to the rndr directive
                renderingEngine.dataSourceConfigId = dataSourceConfigurations.activeDataSourceConfiguration;
                //reset the active data source configuration
                dataSourceConfigurations.activeDataSourceConfiguration = undefined;
                $rootScope.$emit('acquisitionController:save');
            },
            cancel: function() {
                dataSources.delete(dataSources.map[dataSourceConfigurations.activeDataSourceConfiguration].dataSourceConfigId);
                dataSourceConfigurations.delete(dataSourceConfigurations.activeDataSourceConfiguration);
                dataSourceConfigurations.activeDataSourceConfiguration = "";
                $rootScope.$emit('acquisitionController:cancel');
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
});
