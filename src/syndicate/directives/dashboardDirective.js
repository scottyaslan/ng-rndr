define([], function() {
    'use strict';

    function dashboardDirective(DashboardFactory, ServiceProvider, $window) {
        return {
            restrict: 'E',
            scope: {
                'renderingEngineManager': '='
            },
            link: {
                pre: function(scope, element, attrs) {
                //Clean up any existing context menus before we create more    
                $('.context-menu-list').remove();
                scope.DashboardFactory = new DashboardFactory($(element));
                scope.DashboardFactory.draw(scope);
                }
            }
        };
    }

    dashboardDirective.$inject=['DashboardFactory', 'ServiceProvider', '$window'];

    return dashboardDirective;
});