(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrDerivedAttributes', ['$rndrDeriverTemplates'], function($rndrDeriverTemplates) {
            return (root.rndr.plugins.derivedAttributes = factory($rndrDeriverTemplates));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.derivedAttributes = factory(require('$rndrDeriverTemplates')));
    } else {
        root.rndr.plugins.derivedAttributes = factory(root.rndr.templates.derivers);
    }
}(this, function($rndrDeriverTemplates) {
    function DerivedAttributes() {}
    DerivedAttributes.prototype = {
        constructor: DerivedAttributes,
        /**
         * Adds a data attribute deriving function.
         * 
         * @param {string} name    The 
         * @param {[type]} deriver The name of the new data attribute created by the `deriver` function.
         */
        add: function(name, deriver) {
            this[name] = deriver;
        },
        /**
         * Lists the available attribute deriving functions.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        }
    };

    var $rndrDerivedAttributes = new DerivedAttributes();
    return $rndrDerivedAttributes;
}));
