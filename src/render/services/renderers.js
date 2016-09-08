define([], 
    function() {
    'use strict';

    return function() {
        function Renderers() {
            this.availableRenderers;
            this.availableRendererNames;
            this.availableRendererOptions;
            this.init();
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
        
        return new Renderers();
    }
});