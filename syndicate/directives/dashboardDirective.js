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
define(['app', "../../common/directives/gridsterDirective", "../../render/directives/renderingEngineDirective", '../../syndicate/services/dashboardFactory', '../../common/services/serviceProvider'], function(app) {
    app.directive('dashboardDirective', ['DashboardFactory', 'ServiceProvider', '$window',
        function(DashboardFactory, ServiceProvider, $window) {
            return {
                restrict: 'E',
                scope: {
                    "renderingEngineManager": "="
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
    ]);
});