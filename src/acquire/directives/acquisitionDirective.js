define([], function() {
    'use strict';

    function acquisitionDirective(AcquisitionController, DataSourceConfigurationManager, DataSourceManager, DataSourceUtils) {
        return {
            restrict: 'E',
            templateUrl:'acquire/views/acquire.html',
            link: function(scope, element, attrs) {
                AcquisitionController.init();
                scope.AcquisitionController = AcquisitionController;
                scope.DataSourceConfigurationManager = DataSourceConfigurationManager;
                scope.DataSourceManager = DataSourceManager;
                scope.DataSourceUtils = DataSourceUtils;
            }
        };
    }

    return acquisitionDirective;
});