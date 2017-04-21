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
        define('$ngRndrSorters', ['jquery', '$ngRndrSorterTemplates'], function($, $ngRndrSorterTemplates) {
            return (root.ngRndr.plugins.sorters = factory($, $ngRndrSorterTemplates));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.ngRndr.plugins.sorters = factory(require('jquery'), root.ngRndr.templates.sorters));
    } else {
        root.ngRndr.plugins.sorters = factory(root.$, root.ngRndr.templates.sorters);
    }
}(this, function($, $ngRndrSorterTemplates) {
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

    var sorters = new Sorters();
    return sorters;
}));
