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
    var $rndrAggregators = new Map();

    /**
     * Count - Takes as an argument an array of attribute-names and returns the US integer formatted count of the number of values observed of the given attribute for records which match the cell.
     */
    $rndrAggregators.set('Count', $rndrAggregatorsTemplates.get('count')($rndrFormatters.get('US Standard Integer')));

    /**
     * Count Unique Values - Takes as an argument an array of attribute-names and returns the US integer formatted count of the number of unique values observed.
     */
    $rndrAggregators.set('Count Unique Values', $rndrAggregatorsTemplates.get('countUnique')($rndrFormatters.get('US Standard Integer')));

    /**
     * List Unique Values - Takes as an argument an array of attribute-names and returns a CSV string listing of the unique values observed.
     */
    $rndrAggregators.set('List Unique Values', $rndrAggregatorsTemplates.get('listUnique')(', '));

    /**
     * Sum - Takes as an argument an array of attribute-names and returns the US floating formatted sum of the values observed
     */
    $rndrAggregators.set('Sum', $rndrAggregatorsTemplates.get('sum')($rndrFormatters.get('US Standard')));

    /**
     * Integer Sum - Takes as an argument an array of attribute-names and returns the US integer formatted sum of the values observed.
     */
    $rndrAggregators.set('Integer Sum', $rndrAggregatorsTemplates.get('sum')($rndrFormatters.get('US Standard Integer')));

    /**
     * Average - Takes as an argument an array of attribute-names and returns the US floating formatted average of the values observed.
     */
    $rndrAggregators.set('Average', $rndrAggregatorsTemplates.get('average')($rndrFormatters.get('US Standard')));

    /**
     * Median
     */
    $rndrAggregators.set('Median', $rndrAggregatorsTemplates.get('quantile')($rndrFormatters.get('US Standard')), 0.5);

    /**
     * Sample Variance
     */
    $rndrAggregators.set('Sample Variance', $rndrAggregatorsTemplates.get('runningStat')($rndrFormatters.get('US Standard')), 'var');

    /**
     * Sample Standard Deviation
     */
    $rndrAggregators.set('Sample Standard Deviation', $rndrAggregatorsTemplates.get('runningStat')($rndrFormatters.get('US Standard')), 'stdev');

    /**
     * Minimum - Takes as an argument an array of attribute-names and returns the US floating formatted minimum value of the unique values observed.
     */
    $rndrAggregators.set('Minimum', $rndrAggregatorsTemplates.get('min')($rndrFormatters.get('US Standard')));

    /**
     * Maximum - Takes as an argument an array of attribute-names and returns the US floating formatted maximum value of the unique values observed.
     */
    $rndrAggregators.set('Maximum', $rndrAggregatorsTemplates.get('max')($rndrFormatters.get('US Standard')));

    /**
     * Sum over Sum - Takes as an argument an array of attribute-names and returns the US floating formatted quotient of the values observed.
     */
    $rndrAggregators.set('Sum over Sum', $rndrAggregatorsTemplates.get('sumOverSum')($rndrFormatters.get('US Standard')));

    /**
     * 80% Upper Bound - Takes as an argument an array of attribute-names and returns the US floating formatted quotient "upper" 80% bound of the values observed.
     */
    $rndrAggregators.set('80% Upper Bound', $rndrAggregatorsTemplates.get('sumOverSumBound80')(true, $rndrFormatters.get('US Standard')));

    /**
     * 80% Lower Bound - Takes as an argument an array of attribute-names and returns the US floating formatted quotient "lower" 80% bound of the values observed.
     */
    $rndrAggregators.set('80% Lower Bound', $rndrAggregatorsTemplates.get('sumOverSumBound80')(false, $rndrFormatters.get('US Standard')));

    return $rndrAggregators;
}));