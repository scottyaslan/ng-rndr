(function(root, factory) {
    if (root.ngRndr === undefined) {
        root.ngRndr = {};
    }
    if (root.ngRndr.templates === undefined) {
        root.ngRndr.templates = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$ngRndrFormatterTemplates', ['jquery'], function($) {
            return (root.ngRndr.templates.formatters = factory($));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.ngRndr.templates.formatters = factory(require('jquery')));
    } else {
        root.ngRndr.templates.formatters = factory(root.$);
    }
}(this, function($) {
    /**
     * Adds thousands and decimal seperators to a number string.
     * 
     * @param {string} nStr         The number to format.
     * @param {string} thousandsSep The string used for thousands places.
     * @param {string} decimalSep   The string used for decimal points.
     * @return {string}    A thousands and decimal seperatored number string.
     */
    var addSeparators = function(nStr, thousandsSep, decimalSep) {
        var rgx, x, x1, x2;
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? decimalSep + x[1] : '';
        rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + thousandsSep + '$2');
        }
        return x1 + x2;
    };

    /**
     * A dictionary of functions for creating 'number formatting' functions.
     */
    function FormattersTemplates() {}
    FormattersTemplates.prototype = {
        constructor: FormattersTemplates,
        /**
         * A helper function used to create data formatters.
         * 
         * @param  {object} opts The formatting options described as follows:
         *                       Key  | Type | Default value | Description
         *                       ---- | ---- | ------------- | -----------
         *                       `digitsAfterDecimal`  | number | 2 | The number of decimal points to display.
         *                       `scaler`  | number | 1 | The scalar multiplier applied to the result.
         *                       `thousandsSep`  | string | ',' | The string used for thousands places.
         *                       `decimalSep`  | string | '.' | The string used for decimal points.
         *                       `prefix`  | string | '' | The prefix string to prepend to the resuls.
         *                       `suffix`  | string | '' | The suffix string to concact to the resuls.
         *                       `showZero`  | boolean | false | Whether or not to display 0 or '' when the result is equal to 0.
         * @return {function}    A data formatting function.
         */
        numberFormat: function(opts) {
            var self = this;
            var defaults;
            defaults = {
                digitsAfterDecimal: 2,
                scaler: 1,
                thousandsSep: ',',
                decimalSep: '.',
                prefix: '',
                suffix: '',
                showZero: false
            };
            opts = $.extend(defaults, opts);
            return function(x) {
                var result;
                if (isNaN(x) || !isFinite(x)) {
                    return '';
                }
                if (x === 0 && !opts.showZero) {
                    return '';
                }
                result = addSeparators((opts.scaler * x).toFixed(opts.digitsAfterDecimal), opts.thousandsSep, opts.decimalSep);
                return '' + opts.prefix + result + opts.suffix;
            };
        }
    };

    return new FormattersTemplates();
}));
