define([], function() {
    'use strict';

    function renderingEngineDirective() {
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

    renderingEngineDirective.$inject=[];

    return renderingEngineDirective;
});