define([], function() {

    return function(exploreController, renderingEngineManager, dataSourceManager) {
        return {
            restrict: 'E',
            templateUrl:'ngRNDR/explore/views/explore.html',
            link: function(scope, element, attrs) {
                exploreController.init();
                scope.exploreController = exploreController;
                scope.renderingEngineManager = renderingEngineManager;
                scope.dataSourceManager = dataSourceManager;
            }
        };
    }
});