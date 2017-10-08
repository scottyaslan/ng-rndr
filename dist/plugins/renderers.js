(function(root, factory) {
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
    return new Map();
}));
