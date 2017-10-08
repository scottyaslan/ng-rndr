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
    /**
     * A dictionary of data view object factories.
     */
     var $rndrFormatters = new Map();

    var usFmt = function() {
        return $rndrFormatterTemplates.get('numberFormat')();
    };

    var usFmtInt = function() {
        return $rndrFormatterTemplates.get('numberFormat')({
            digitsAfterDecimal: 0
        });
    };
    
    var usFmtPct = function() {
        return $rndrFormatterTemplates.get('numberFormat')({
            digitsAfterDecimal: 1,
            scaler: 100,
            suffix: '%'
        });
    };

    /**
     * A function for formatting a number into a standard US formatted number.
     */
    $rndrFormatters.set('US Standard', usFmt());

    /**
     * A function for formatting a number into a standard US formatted integer.
     */
    $rndrFormatters.set('US Standard Integer', usFmtInt());

    /**
     * A function for formatting a number into a standard US formatted percentage.
     */
    $rndrFormatters.set('US Standard Percentage', usFmtPct());

    return $rndrFormatters;
}));
