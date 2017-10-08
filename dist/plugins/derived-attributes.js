(function(root, factory) {
    define('$rndrDerivedAttributes', [], function() {
        return (root.rndr.plugins.derivedAttributes = factory());
    });
}(this, function() {
    /**
     * A dictionary of data attribute deriving functions.
     */
    return new Map();
}));