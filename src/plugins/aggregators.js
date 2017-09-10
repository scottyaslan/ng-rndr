(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrAggregators', ['$rndrAggregatorsTemplates', '$rndrFormatters'], function($rndrAggregatorsTemplates, $rndrFormatters) {
            return (root.rndr.plugins.aggregators = factory($rndrAggregatorsTemplates, $rndrFormatters));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.aggregators = factory(require('$rndrAggregatorsTemplates'), require('$rndrFormatters')));
    } else {
        root.rndr.plugins.aggregators = factory(root.rndr.templates.aggregators, root.rndr.plugins.formatters);
    }
}(this, function($rndrAggregatorsTemplates, $rndrFormatters) {
    /**
     * A dictionary of functions which *generate* a function that defines how data
     * is aggregated. Each `aggregator` should take as an argument an array of 
     * attribute-names and return a function that is appropriate and consumable 
     * by a `dataView`.
     */
    function Aggregators() {}
    Aggregators.prototype = {
        constructor: Aggregators,
        /**
         * Adds an aggregator generating function by `name` for fast lookup.
         * 
         * @param {string} name       The lookup name of the aggregate function.
         * @param {function} aggregator The function which *generates* a function that defines how data is aggregated.
         */
        add: function(name, aggregator) {
            this[name] = {
                aggregate: aggregator
            };
        },
        /**
         * Lists the available `aggregator` functions.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        }
    };

    var $rndrAggregators = new Aggregators();
    
    return $rndrAggregators;
}));
