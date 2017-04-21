(function(root, factory) {
    if (root.ngRndr === undefined) {
        root.ngRndr = {};
    }
    if (root.ngRndr.plugins === undefined) {
        root.ngRndr.plugins = {};
    }
    if (root.ngRndr.plugins.formatters === undefined) {
        root.ngRndr.plugins.formatters = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$ngRndrFormatters', ['jquery', '$ngRndrFormatterTemplates'], function($, $ngRndrFormatterTemplates) {
            return (root.ngRndr.plugins.formatters = factory($, $ngRndrFormatterTemplates));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.ngRndr.plugins.formatters = factory(require('jquery'), root.ngRndr.templates.formatters));
    } else {
        root.ngRndr.plugins.formatters = factory(root.$, root.ngRndr.templates.formatters);
    }
}(this, function($, $ngRndrFormatterTemplates) {
    /**
     * A function for formatting a number into a standard US formatted number.
     * 
     * @return {function} A data formatter function for converting to standard US formatted number.
     */
    var usFmt = function() {
        return $ngRndrFormatterTemplates.numberFormat();
    };

    /**
     * A function for formatting a number into a standard US formatted integer.
     * 
     * @return {function} A data formatter function for converting to standard US formatted integer.
     */
    var usFmtInt = function() {
        return $ngRndrFormatterTemplates.numberFormat({
            digitsAfterDecimal: 0
        });
    };

    /**
     * A function for formatting a number into a standard US formatted percentage.
     * 
     * @return {function} A data formatter function for converting to standard US formatted percentage.
     */
    var usFmtPct = function() {
        return $ngRndrFormatterTemplates.numberFormat({
            digitsAfterDecimal: 1,
            scaler: 100,
            suffix: '%'
        });
    };

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

    var formatters = new Formatters();
    formatters['US Standard'] = usFmt();
    formatters['US Standard Integer'] = usFmtInt();
    formatters['US Standard Percentage'] = usFmtPct();
    return formatters;
}));
