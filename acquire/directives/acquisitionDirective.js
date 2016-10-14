define([], function() {
    'use strict';

    function acquisitionDirective(acquisitionController, dataSourceConfigurationManager, dataSourceManager) {
        return {
            restrict: 'E',
            templateUrl:'ngRNDR/acquire/views/acquire.html',
            link: function(scope, element, attrs) {
                acquisitionController.init();
                scope.acquisitionController = acquisitionController;
                scope.dataSourceConfigurationManager = dataSourceConfigurationManager;
                scope.dataSourceManager = dataSourceManager;
            }
        };
    }

    return acquisitionDirective;
});