define([], 
    function() {
    'use strict';

    function Renderers() {
        function Renderers() {
            this.availableRenderers;
            this.availableRendererNames;
            this.availableRendererOptions;
        }
        Renderers.prototype = {
            constructor: Renderers,
            init: function() {
                var self = this;
                self.availableRenderers = {}; 
                self.availableRendererNames = [];
                self.availableRendererOptions = {};
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

    return Renderers;
});