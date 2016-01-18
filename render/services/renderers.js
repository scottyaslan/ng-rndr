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
define(['app', '../../common/services/serviceProvider', 'datatablesRenderer', 'gchartRenderer', 'C3Renderer', 'D3Renderer'], function(app, serviceProvider, datatables_renderers, gchart_renderers, c3_renderers, d3_renderers) {
    app.factory('Renderers', ["ServiceProvider",
        function(ServiceProvider) {
            function Renderers() {
                this.availableRenderers;
                this.availableRendererNames;
                this.availableRendererOptions;
            }
            Renderers.prototype = {
                constructor: Renderers,
                init: function() {
                    if(ServiceProvider.Renderers === undefined){
                        ServiceProvider.add('Renderers', renderers);
                    }
                    var self = this;
                    self.availableRenderers = $.extend({}, datatables_renderers, gchart_renderers, c3_renderers, d3_renderers); 
                    self.availableRendererNames = Object.keys(self.availableRenderers);
                    self.availableRendererOptions = {
                        gchart: {},
                        datatables: {
                            class: ["pvtTable", "cell-border", "compact", "hover", "order-column", "row-border", "zebra"], //defaut styling classes http://www.datatables.net/manual/styling/classes
                        },
                        c3: {
                            size: {}
                        },
                        d3: {}
                    };
                },
                addRenderers: function(renderers){
                    var self = this;
                    $.extend(self.availableRenderers, renderers);
                    self.availableRendererNames = Object.keys(self.availableRenderers);
                },
                setRendererOptions: function(properyName, config) {
                    var self = this;
                    self.availableRendererOptions[properyName] = config;
                }
            };
            var renderers = new Renderers();
            renderers.init();
            return renderers;
        }
    ]);
});