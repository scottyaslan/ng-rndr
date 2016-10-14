define([], function() {
    'use strict';

    return function(aggregatorTemplates, dataUtils) {
        /**
         * {@link Aggregators} constructor.
         */
        function Aggregators() {
            this.add('Count', aggregatorTemplates.count(dataUtils.usFmtInt()));
            this.add('Count Unique Values', aggregatorTemplates.countUnique(dataUtils.usFmtInt()));
            this.add('List Unique Values', aggregatorTemplates.listUnique(', '));
            this.add('Sum', aggregatorTemplates.sum(dataUtils.usFmt()));
            this.add('Integer Sum', aggregatorTemplates.sum(dataUtils.usFmtInt()));
            this.add('Average', aggregatorTemplates.average(dataUtils.usFmt()));
            this.add('Minimum', aggregatorTemplates.min(dataUtils.usFmt()));
            this.add('Maximum', aggregatorTemplates.max(dataUtils.usFmt()));
            this.add('Sum over Sum', aggregatorTemplates.sumOverSum(dataUtils.usFmt()));
            this.add('80% Upper Bound', aggregatorTemplates.sumOverSumBound80(true, dataUtils.usFmt()));
            this.add('80% Lower Bound', aggregatorTemplates.sumOverSumBound80(false, dataUtils.usFmt()));
            this.add('Sum as Fraction of Total', aggregatorTemplates.fractionOf(aggregatorTemplates.sum(), 'total', dataUtils.usFmtPct()));
            this.add('Sum as Fraction of Rows', aggregatorTemplates.fractionOf(aggregatorTemplates.sum(), 'row', dataUtils.usFmtPct()));
            this.add('Sum as Fraction of Columns', aggregatorTemplates.fractionOf(aggregatorTemplates.sum(), 'col', dataUtils.usFmtPct()));
            this.add('Count as Fraction of Total', aggregatorTemplates.fractionOf(aggregatorTemplates.count(), 'total', dataUtils.usFmtPct()));
            this.add('Count as Fraction of Rows', aggregatorTemplates.fractionOf(aggregatorTemplates.count(), 'row', dataUtils.usFmtPct()));
            this.add('Count as Fraction of Columns', aggregatorTemplates.fractionOf(aggregatorTemplates.count(), 'col', dataUtils.usFmtPct()));
        }
        Aggregators.prototype = {
            /**
             * @typedef Aggregators
             * @type {object}
             */
            constructor: Aggregators,
            /**
             * Adds an aggregator function by `name` for fast lookup.
             * 
             * @param {string} name       The lookup name of the aggregate function.
             * @param {function} aggregator The aggregate function.
             */
            add: function(name, aggregator) {
                this[name] = {
                    aggregate: aggregator
                };
            },
            /**
             * Lists the available aggregator plugins.
             * 
             * @return {Array.<string>} The lookup names.
             */
            list: function() {
                return Object.keys(this);
            }
        };

        return new Aggregators();
    }
});
