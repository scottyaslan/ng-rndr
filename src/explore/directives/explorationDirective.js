define([], function() {

    function explorationDirective(ExploreController, RenderingEngineManager, DataSourceManager) {
        return {
            restrict: 'E',
            templateUrl:'explore/views/explore.html',
            link: function(scope, element, attrs) {
                ExploreController.init();
                scope.ExploreController = ExploreController;
                scope.RenderingEngineManager = RenderingEngineManager;
                scope.DataSourceManager = DataSourceManager;
            }
        };
    }

    return explorationDirective;
});