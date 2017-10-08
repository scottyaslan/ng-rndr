(function(root, factory) {
    define('$rndrSorters', [], function() {
        return (root.rndr.plugins.sorters = factory());
    });
}(this, function() {
    /**
     * A dictionary of sorters.
     */
    return new Map();
}));