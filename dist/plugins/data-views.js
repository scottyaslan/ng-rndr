(function(root, factory) {
    define('$rndrDataViews', [], function() {
        return (root.rndr.plugins.dataViews = factory());
    });
}(this, function() {
    /**
     * A dictionary of data view object factories.
     */
    return new Map();
}));