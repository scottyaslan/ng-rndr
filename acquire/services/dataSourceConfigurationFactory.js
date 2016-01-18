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
define(['app'], function(app) {
    app.factory('DataSourceConfigurationFactory', [
        function() {
            function DataSourceConfigurationFactory() {
                this.id;
                this.flattenDataFunctionString;
                this.httpConfig;
            }
            DataSourceConfigurationFactory.prototype = {
                constructor: DataSourceConfigurationFactory,
                init: function() {
                    var self = this;
                    self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                        return v.toString(16);
                    });
                    self.httpConfig = angular.toJson({
                        method: 'GET',
                        url: 'http://nicolas.kruchten.com/pivottable/examples/montreal_2014.csv'
                    });
                    self.flattenDataFunctionString = 'return data;';
                    self.title = "Untitiled";
                }
            };
            return DataSourceConfigurationFactory;
        }
    ]);
});