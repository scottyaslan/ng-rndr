(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrFormatters', ['$rndrFormattersTemplates'], function($rndrFormatterTemplates) {
            return (root.rndr.plugins.formatters = factory($rndrFormatterTemplates));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.formatters = factory(require('$rndrFormatterTemplates')));
    } else {
        root.rndr.plugins.formatters = factory(root.rndr.templates.formatters);
    }
}(this, function($rndrFormatterTemplates) {

    function Formatters() {}
    Formatters.prototype = {
        constructor: Formatters,
        /**
         * Adds a formatter function.
         * 
         * @param {string} name         The name of the data attribute for which the `sorter` function will be applied.
         * @param {function} sorter     The function which sorts the values of a data attribute.
         */
        add: function(name, sorter) {
            this[name] = sorter;
        },
        /**
         * Lists the available formatters.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        }
    };

    var $rndrFormatters = new Formatters();

    return $rndrFormatters;
}));
