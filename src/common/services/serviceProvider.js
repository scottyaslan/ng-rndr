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

    function ServiceProvider() {
        function ServiceProvider() {
        };
        ServiceProvider.prototype = {
            constructor: ServiceProvider,
            add: function(objectName, object) {
                serviceProvider[objectName] = object;
            },
            delete: function(objectName) {
                delete serviceProvider[objectName];
            }
        };
        var serviceProvider = new ServiceProvider();
        return serviceProvider;
    }

    ServiceProvider.$inject=[];

    return ServiceProvider;
});