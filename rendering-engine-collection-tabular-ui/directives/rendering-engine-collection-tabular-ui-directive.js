define([], function() {

    return function(renderingEngineCollectionTabularUIController, renderingEnginesCollection, dataSources) {
        return {
            restrict: 'E',
            templateUrl:'ng-rndr/rendering-engine-collection-tabular-ui/views/rendering-engine-collection-tabular-ui-view.html',
            link: function(scope, element, attrs) {
                renderingEngineCollectionTabularUIController.init();
                scope.renderingEngineCollectionTabularUIController = renderingEngineCollectionTabularUIController;
                scope.renderingEnginesCollection = renderingEnginesCollection;
                scope.dataSources = dataSources;
            }
        };
    }
});