(function(root, factory) {
        define(['$rndrDataViews',
            '$rndrSorters',
            '$rndrDerivedAttributes',
            '$rndrFormattersTemplates',
            '$rndrFormatters',
            '$rndrAggregatorsTemplates',
            '$rndrAggregators',
            '$rndrRenderingEngine',
            '$rndrRenderingEngines'
        ], function($rndrDataViews,
            $rndrSorters,
            $rndrDerivedAttributes,
            $rndrFormattersTemplates,
            $rndrFormatters,
            $rndrAggregatorsTemplates,
            $rndrAggregators,
            $rndrRenderingEngine,
            $rndrRenderingEngines) {
            return factory(root,
                $rndrDataViews,
                $rndrFormattersTemplates,
                $rndrFormatters,
                $rndrAggregatorsTemplates,
                $rndrAggregators,
                $rndrRenderingEngine,
                $rndrRenderingEngines);
        });
}(this, function(root,
    $rndrDataViews,
    $rndrFormattersTemplates,
    $rndrFormatters,
    $rndrAggregatorsTemplates,
    $rndrAggregators,
    $rndrRenderingEngine,
    $rndrRenderingEngines) {
    /**
     * A function for formatting a number into a standard US formatted number.
     * 
     * @return {function} A data formatter function for converting to standard US formatted number.
     */
    var usFmt = function() {
        return $rndrFormattersTemplates.numberFormat();
    };

    /**
     * A function for formatting a number into a standard US formatted integer.
     * 
     * @return {function} A data formatter function for converting to standard US formatted integer.
     */
    var usFmtInt = function() {
        return $rndrFormattersTemplates.numberFormat({
            digitsAfterDecimal: 0
        });
    };

    /**
     * A function for formatting a number into a standard US formatted percentage.
     * 
     * @return {function} A data formatter function for converting to standard US formatted percentage.
     */
    var usFmtPct = function() {
        return $rndrFormattersTemplates.numberFormat({
            digitsAfterDecimal: 1,
            scaler: 100,
            suffix: '%'
        });
    };

    $rndrFormatters.add('US Standard', usFmt());
    $rndrFormatters.add('US Standard Integer', usFmtInt());
    $rndrFormatters.add('US Standard Percentage', usFmtPct());

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
    $rndrAggregators.add('Median', $rndrAggregatorsTemplates.quantile($rndrFormatters['US Standard']), 0.5);
    $rndrAggregators.add('Sample Variance', $rndrAggregatorsTemplates.runningStat($rndrFormatters['US Standard']), 'var');
    $rndrAggregators.add('Sample Standard Deviation', $rndrAggregatorsTemplates.runningStat($rndrFormatters['US Standard']), 'stdev');
    $rndrAggregators.add('Minimum', $rndrAggregatorsTemplates.min($rndrFormatters['US Standard']));
    $rndrAggregators.add('Maximum', $rndrAggregatorsTemplates.max($rndrFormatters['US Standard']));
    $rndrAggregators.add('Sum over Sum', $rndrAggregatorsTemplates.sumOverSum($rndrFormatters['US Standard']));
    $rndrAggregators.add('80% Upper Bound', $rndrAggregatorsTemplates.sumOverSumBound80(true, $rndrFormatters['US Standard']));
    $rndrAggregators.add('80% Lower Bound', $rndrAggregatorsTemplates.sumOverSumBound80(false, $rndrFormatters['US Standard']));

    return root.rndr;
}));
