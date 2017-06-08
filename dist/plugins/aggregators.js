(function(root, factory) {
    if (root.ngRndr === undefined) {
        root.ngRndr = {};
    }
    if (root.ngRndr.plugins === undefined) {
        root.ngRndr.plugins = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$ngRndrAggregators', ['$ngRndrAggregatorsTemplates', '$ngRndrFormatters'], function($ngRndrAggregatorsTemplates, $ngRndrFormatters) {
            return (root.ngRndr.plugins.aggregators = factory($ngRndrAggregatorsTemplates, $ngRndrFormatters));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.ngRndr.plugins.aggregators = factory(require('$ngRndrAggregatorsTemplates'), require('$ngRndrFormatters')));
    } else {
        root.ngRndr.plugins.aggregators = factory(root.ngRndr.templates.aggregators, root.ngRndr.plugins.formatters);
    }
}(this, function($ngRndrAggregatorsTemplates, $ngRndrFormatters) {
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

    var $ngRndrAggregators = new Aggregators();

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
    $ngRndrAggregators.add('Count', $ngRndrAggregatorsTemplates.count($ngRndrFormatters['US Standard Integer']));
    $ngRndrAggregators.add('Count Unique Values', $ngRndrAggregatorsTemplates.countUnique($ngRndrFormatters['US Standard Integer']));
    $ngRndrAggregators.add('List Unique Values', $ngRndrAggregatorsTemplates.listUnique(', '));
    $ngRndrAggregators.add('Sum', $ngRndrAggregatorsTemplates.sum($ngRndrFormatters['US Standard']));
    $ngRndrAggregators.add('Integer Sum', $ngRndrAggregatorsTemplates.sum($ngRndrFormatters['US Standard Integer']));
    $ngRndrAggregators.add('Average', $ngRndrAggregatorsTemplates.average($ngRndrFormatters['US Standard']));
    $ngRndrAggregators.add('Minimum', $ngRndrAggregatorsTemplates.min($ngRndrFormatters['US Standard']));
    $ngRndrAggregators.add('Maximum', $ngRndrAggregatorsTemplates.max($ngRndrFormatters['US Standard']));
    $ngRndrAggregators.add('Sum over Sum', $ngRndrAggregatorsTemplates.sumOverSum($ngRndrFormatters['US Standard']));
    $ngRndrAggregators.add('80% Upper Bound', $ngRndrAggregatorsTemplates.sumOverSumBound80(true, $ngRndrFormatters['US Standard']));
    $ngRndrAggregators.add('80% Lower Bound', $ngRndrAggregatorsTemplates.sumOverSumBound80(false, $ngRndrFormatters['US Standard']));
    
    return $ngRndrAggregators;
}));
