define(['../../render/plugins/dist/datatables_renderers.min',
    '../../render/plugins/dist/gchart_renderers.min',
    '../../render/plugins/dist/c3_renderers.min',
    '../../render/plugins/dist/d3_renderers.min'], 
    function(datatables_renderers, 
        gchart_renderers,
        c3_renderers,
        d3_renderers) {
    'use strict';

    function Renderers(ServiceProvider) {
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
                        class: ['pvtTable', 'cell-border', 'compact', 'hover', 'order-column', 'row-border', 'zebra'], //defaut styling classes http://www.datatables.net/manual/styling/classes
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

    Renderers.$inject=['ServiceProvider'];

    return Renderers;
});