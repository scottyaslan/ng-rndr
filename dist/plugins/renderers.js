(function(root, factory) {
    if (root.rndr === undefined) {
        root.rndr = {};
    }
    if (root.rndr.plugins === undefined) {
        root.rndr.plugins = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$rndrRenderers', [], function() {
            return (root.rndr.plugins.renderers = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.renderers = factory());
    } else {
        root.rndr.plugins.renderers = factory();
    }
}(this, function() {
    /**
     * A dictionary of renderer functions.
     */
    function Renderers() {
    }
    Renderers.prototype = {
        constructor: Renderers,
        /**
         * Adds a renderer function.
         * 
         * @param {string} name     The lookup name of the renderer.
         * @param {function} renderer A "data visulization constructing" function.
         * @param {string} dataViewName     The name of the `dataView` used by the `renderer` function.
         * @param {object} opts     Overrides or extends the options for the `renderer`.
         * @return {object}       The renderer.
        */
        add: function(name, renderer, dataViewName, opts) {
            this[name] = {
                render: renderer,
                opts: opts,
                dataViewName: dataViewName
            };
            return this[name];
        },
        /**
         * Lists the available renderer plugins.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        }
    };

    var $rndrRenderers = new Renderers();
    return $rndrRenderers;
}));
