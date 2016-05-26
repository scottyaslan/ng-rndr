define([], function() {
    'use strict';

    function acquisitionDirective(AcquisitionController) {
        return {
            restrict: 'E',
            templateUrl:'acquire/views/acquire.html',
            link: function(scope, element, attrs) {
                AcquisitionController.init();
                scope.AcquisitionController = AcquisitionController;
            }
        };
    }

    acquisitionDirective.$inject=['AcquisitionController'];

    return acquisitionDirective;
});