(function(root, factory) {
    if (root.rndr === undefined) {
        root.rndr = {};
    }
    if (root.rndr.plugins === undefined) {
        root.rndr.plugins = {};
    }
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

    /**
     * Configure Aggregators
     * 
     * Count - Takes as an argument an array of attribute-names and returns the US integer formatted count of the number of values observed of the given attribute for records which match the cell.
     * Count Unique Values - Takes as an argument an array of attribute-names and returns the US integer formatted count of the number of unique values observed.
     * List Unique Values - Takes as an argument an array of attribute-names and returns a CSV string listing of the unique values observed.
     * Sum - Takes as an argument an array of attribute-names and returns the US floating formatted sum of the values observed.
     * Integer Sum - Takes as an argument an array of attribute-names and returns the US integer formatted sum of the values observed.
     * Average - Takes as an argument an array of attribute-names and returns the US floating formatted average of the values observed.
     * Minimum - Takes as an argument an array of attribute-names and returns the US floating formatted minimum value of the unique values observed.
     * Maximum - Takes as an argument an array of attribute-names and returns the US floating formatted maximum value of the unique values observed.
     * Sum over Sum - Takes as an argument an array of attribute-names and returns the US floating formatted quotient of the values observed.
     * 80% Upper Bound - Takes as an argument an array of attribute-names and returns the US floating formatted quotient "upper" 80% bound of the values observed.
     * 80% Lower Bound - Takes as an argument an array of attribute-names and returns the US floating formatted quotient "lower" 80% bound of the values observed.
     */
    $rndrAggregators.add('Count', $rndrAggregatorsTemplates.count($rndrFormatters['US Standard Integer']));
    $rndrAggregators.add('Count Unique Values', $rndrAggregatorsTemplates.countUnique($rndrFormatters['US Standard Integer']));
    $rndrAggregators.add('List Unique Values', $rndrAggregatorsTemplates.listUnique(', '));
    $rndrAggregators.add('Sum', $rndrAggregatorsTemplates.sum($rndrFormatters['US Standard']));
    $rndrAggregators.add('Integer Sum', $rndrAggregatorsTemplates.sum($rndrFormatters['US Standard Integer']));
    $rndrAggregators.add('Average', $rndrAggregatorsTemplates.average($rndrFormatters['US Standard']));
    $rndrAggregators.add('Minimum', $rndrAggregatorsTemplates.min($rndrFormatters['US Standard']));
    $rndrAggregators.add('Maximum', $rndrAggregatorsTemplates.max($rndrFormatters['US Standard']));
    $rndrAggregators.add('Sum over Sum', $rndrAggregatorsTemplates.sumOverSum($rndrFormatters['US Standard']));
    $rndrAggregators.add('80% Upper Bound', $rndrAggregatorsTemplates.sumOverSumBound80(true, $rndrFormatters['US Standard']));
    $rndrAggregators.add('80% Lower Bound', $rndrAggregatorsTemplates.sumOverSumBound80(false, $rndrFormatters['US Standard']));
    
    return $rndrAggregators;
}));
