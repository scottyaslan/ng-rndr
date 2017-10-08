(function(root, factory) {
    // if (typeof define === 'function' && define.amd) {
        define('$rndrDataViews', [], function() {
            return (root.rndr.plugins.dataViews = factory());
        });
    // } else if (typeof module === 'object' && module.exports) {
    //     module.exports = (root.rndr.plugins.dataViews = factory());
    // } else {
    //     root.rndr.plugins.dataViews = factory();
    // }
}(this, function() {
    /**
     * A dictionary of data view object factories.
     */
    return new Map();
}));
