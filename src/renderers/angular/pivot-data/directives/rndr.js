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
                            'top': '0px',
                            'bottom': '0px',
                            'left': '0px',
                            'right': '0px'
                        });
                        scope.engine.setElement($(element));
                        scope.engine.draw(scope.input);
                    }
                }
            };
        }
    });
