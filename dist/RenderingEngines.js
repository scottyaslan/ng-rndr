(function(root, factory) {
    if (root.rndr === undefined) {
        root.rndr = {};
    }
    if (root.rndr.plugins === undefined) {
        root.rndr.plugins = {};
    }
    if (root.rndr.plugins.pivotData === undefined) {
        root.rndr.plugins.pivotData = {};
    }
    if (root.rndr.plugins.pivotData.renderers === undefined) {
        root.rndr.plugins.pivotData.renderers = {};
    }
    if (root.rndr.plugins.pivotData.renderers.c3 === undefined) {
        root.rndr.plugins.pivotData.renderers.c3 = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$rndrRenderingEngines', [], function() {
            return (root.rndr.RenderingEngines = factory(root));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.RenderingEngines = factory(root));
    } else {
        root.rndr.RenderingEngines = factory(root);
    }
}(this, function(root) {
    'use strict';

    /**
     * The dictionary of registered {@link RenderingEngine}'s.
     */
    function RenderingEngines() {
        this.init();
    }
    RenderingEngines.prototype = {
        constructor: RenderingEngines,
        /**
         * Initialize.
         */
        init: function() {
            this.map = {};
        },
        /**
         * The number of {@link RenderingEngine}'s in this map.
         * 
         * @return {number} The number of {@link RenderingEngine}'s in the map.
         */
        size: function() {
            return Object.keys(this.map).length;
        },
        /**
         * Adds a {@link RenderingEngine} to the map.
         * 
         * @param {RenderingEngine} dataSource The {@link RenderingEngine} to add.
         */
        add: function(renderingEngine) {
            this.map[renderingEngine.id] = renderingEngine;
        },
        /**
         * Deletes a {@link RenderingEngine} from the map by `id`.
         * 
         * @param  {string} id The UUID of the {@link RenderingEngine} to remove from the map.
         */
        delete: function(id) {
            delete this.map[id];
        }
    };

    return RenderingEngines;
}));
