(function(root, factory) {
    if (root.ngRndr === undefined) {
        root.ngRndr = {};
    }
    if (root.ngRndr.plugins === undefined) {
        root.ngRndr.plugins = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$ngRndrDerivedAttributes', ['$ngRndrDeriverTemplates'], function($ngRndrDeriverTemplates) {
            return (root.ngRndr.plugins.derivedAttributes = factory($ngRndrDeriverTemplates));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.ngRndr.plugins.derivedAttributes = factory(require('$ngRndrDeriverTemplates')));
    } else {
        root.ngRndr.plugins.derivedAttributes = factory(root.ngRndr.templates.derivers);
    }
}(this, function($ngRndrDeriverTemplates) {
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

    var $ngRndrDerivedAttributes = new DerivedAttributes();
    return $ngRndrDerivedAttributes;
}));
