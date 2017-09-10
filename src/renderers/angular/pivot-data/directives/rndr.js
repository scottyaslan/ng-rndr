define(['jquery'],
    function($) {
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
                        $(element).css({
                            'position': 'absolute',
                            'top': '33px',
                            'bottom': '10px',
                            'left': '10px',
                            'right': '10px',
                            'overflow': 'auto'
                        });
                        scope.engine.setElement($(element));
                        scope.engine.draw(scope.input);
                    }
                }
            };
        }
    });
