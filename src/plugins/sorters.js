(function(root, factory) {
    if (root.rndr === undefined) {
        root.rndr = {};
    }
    if (root.rndr.plugins === undefined) {
        root.rndr.plugins = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$rndrSorters', ['$rndrSorterTemplates'], function($rndrSorterTemplates) {
            return (root.rndr.plugins.sorters = factory($rndrSorterTemplates));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.sorters = factory(require('$rndrSorterTemplates')));
    } else {
        root.rndr.plugins.sorters = factory(root.rndr.templates.sorters);
    }
}(this, function($rndrSorterTemplates) {
    function Sorters() {}
    Sorters.prototype = {
        constructor: Sorters,
        /**
         * Adds a sorter function.
         * 
         * @param {string} name         The name of the data attribute for which the `sorter` function will be applied.
         * @param {function} sorter     The function which sorts the values of a data attribute.
         */
        add: function(name, sorter) {
            this[name] = sorter;
        },
        /**
         * Lists the available sorters.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        }
    };

    var $rndrSorters = new Sorters();

    return $rndrSorters;
}));
