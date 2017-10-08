(function(root, factory) {
    define('$rndrRenderers', [], function() {
        return (root.rndr.plugins.renderers = factory());
    });
}(this, function() {
    /**
     * A dictionary of renderer functions.
     */
    return new Map();
}));