(function(root, factory) {
    if (root.ngRndr === undefined) {
        root.ngRndr = {};
    }
    if (root.ngRndr.plugins === undefined) {
        root.ngRndr.plugins = {};
    }
    if (root.ngRndr.plugins.pivotData === undefined) {
        root.ngRndr.plugins.pivotData = {};
    }
    if (root.ngRndr.plugins.pivotData.renderers === undefined) {
        root.ngRndr.plugins.pivotData.renderers = {};
    }
    if (root.ngRndr.plugins.pivotData.renderers.c3 === undefined) {
        root.ngRndr.plugins.pivotData.renderers.c3 = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$ngRndrRenderingEngines', [], function() {
            return (root.ngRndr.RenderingEngines = factory(root));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.ngRndr.RenderingEngines = factory(root));
    } else {
        root.ngRndr.RenderingEngines = factory(root);
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
