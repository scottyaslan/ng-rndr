define([], function() {
    'use strict';

    return function() {
        return {
            restrict: 'E',
            scope: {
                'engine': '=',
                'input': '='
            },
            link: {
                pre: function(scope, element, attr) {
                    scope.engine.element = $(element);
                    scope.engine.draw(scope.input);
                }
            }
        };
    }
});
