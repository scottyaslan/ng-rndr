define([], function() {

    function explorationDirective(ServiceProvider, ExploreController) {
        return {
            restrict: 'E',
            templateUrl:'explore/views/explore.html',
            link: function(scope, element, attrs) {
                ExploreController.init();
                scope.ExploreController = ExploreController;
                scope.ServiceProvider = ServiceProvider;
            }
        };
    }

    explorationDirective.$inject=['ServiceProvider', 'ExploreController'];

    return explorationDirective;
});