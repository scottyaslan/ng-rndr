(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrSorters', [], function() {
            return (root.rndr.plugins.sorters = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.sorters = factory());
    } else {
        root.rndr.plugins.sorters = factory();
    }
}(this, function() {
    /**
     * A dictionary of sorters.
     */
     return new Map();
}));
