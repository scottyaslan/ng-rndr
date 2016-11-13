define([], function() {
    'use strict';

    return function(Dashboard, $window) {
        return {
            restrict: 'E',
            scope: {
                'renderingEnginesCollection': '=',
                'options': '='
            },
            link: {
                pre: function(scope, element, attrs) {
                    //Clean up any existing context menus before we create more    
                    $('.context-menu-list').remove();
                    scope.dashboard = new Dashboard($(element));
                    scope.dashboard.draw(scope);
                }
            }
        };
    }
});
