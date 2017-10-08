(function(root, factory) {
    // if (typeof define === 'function' && define.amd) {
        define('$rndrDerivedAttributes', [], function() {
            return (root.rndr.plugins.derivedAttributes = factory());
        });
    // } else if (typeof module === 'object' && module.exports) {
    //     module.exports = (root.rndr.plugins.derivedAttributes = factory());
    // } else {
    //     root.rndr.plugins.derivedAttributes = factory();
    // }
}(this, function() {
    /**
     * A dictionary of data attribute deriving functions.
     */
    return new Map();
}));
