(function(root, factory) {
    if (root.rndr === undefined) {
        root.rndr = {};
    }
    if (root.rndr.plugins === undefined) {
        root.rndr.plugins = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$rndrFormatters', ['$rndrFormatterTemplates'], function($rndrFormatterTemplates) {
            return (root.rndr.plugins.formatters = factory($rndrFormatterTemplates));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.formatters = factory(require('$rndrFormatterTemplates')));
    } else {
        root.rndr.plugins.formatters = factory(root.rndr.templates.formatters);
    }
}(this, function($rndrFormatterTemplates) {
    /**
     * A function for formatting a number into a standard US formatted number.
     * 
     * @return {function} A data formatter function for converting to standard US formatted number.
     */
    var usFmt = function() {
        return $rndrFormatterTemplates.numberFormat();
    };

    /**
     * A function for formatting a number into a standard US formatted integer.
     * 
     * @return {function} A data formatter function for converting to standard US formatted integer.
     */
    var usFmtInt = function() {
        return $rndrFormatterTemplates.numberFormat({
            digitsAfterDecimal: 0
        });
    };

    /**
     * A function for formatting a number into a standard US formatted percentage.
     * 
     * @return {function} A data formatter function for converting to standard US formatted percentage.
     */
    var usFmtPct = function() {
        return $rndrFormatterTemplates.numberFormat({
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

    var $rndrFormatters = new Formatters();

    $rndrFormatters.add('US Standard', usFmt());
    $rndrFormatters.add('US Standard Integer', usFmtInt());
    $rndrFormatters.add('US Standard Percentage', usFmtPct());

    return $rndrFormatters;
}));
