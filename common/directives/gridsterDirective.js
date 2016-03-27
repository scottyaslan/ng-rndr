/*   Data Analytics Toolkit: Explore any data avaialable through a REST service 
*    Copyright (C) 2016  Scott Aslan
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.html>.
*/
define([], function() {
    'use strict';

    function gridsterDirective() {
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
                if(scope.options.parallax.enabled){
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

    gridsterDirective.$inject=[];

    return gridsterDirective;
});