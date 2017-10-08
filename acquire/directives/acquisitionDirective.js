define([], function() {
    'use strict';

    function acquisitionDirective(acquisitionController, dataSourceConfigurations, dataSources) {
        return {
            restrict: 'E',
            templateUrl:'rndr/acquire/views/acquire.html',
            link: function(scope, element, attrs) {
                acquisitionController.init();
                scope.acquisitionController = acquisitionController;
                scope.dataSourceConfigurations = dataSourceConfigurations;
                scope.dataSources = dataSources;
            }
        };
    }

    return acquisitionDirective;
});