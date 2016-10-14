define([], function() {
    'use strict';

    return function() {
        return {
            restrict: 'E',
            scope: {
                options: '='
            },
            link: function(scope, element, attrs) {
                //initialize the gridster jQuery plugin and set the object on the scope
                var gridster = $(element.find('ul')[0]).gridster(scope.options);
                scope.gridster = gridster.data('gridster');
                if (!scope.options.enableDragging) {
                    scope.gridster.disable();
                }
                if (scope.options.parallax.enabled) {
                    require('bower_components/parallax/deploy/jquery.parallax.min');

                    var parallax = $("<ul><li data-depth='" + scope.options.parallax.dataDepth + "' class='layer'></li></ul>");
                    parallax.parallax();
                    var parallaxLi = parallax.find('li');
                    parallaxLi.append(gridster);
                    element.append(parallax);
                }
            }
        };
    }
});
