define([], function() {
    'use strict';

    return function(aggregatorTemplates, dataUtils) {
        function Aggregators() {
            this.availableAggregators;
            this.availableAggregatorNames;
            this.availableAggregatorOptions;
            this.aggregatorTemplates;
            this.init();
        }
        Aggregators.prototype = {
            constructor: Aggregators,
            init: function() {
                var self = this;
                self.availableAggregators = {};
                self.availableAggregatorNames = Object.keys(self.availableAggregators);
                self.aggregatorTemplates = aggregatorTemplates;
                self.addAggregator('Count', self.aggregatorTemplates.count(dataUtils.usFmtInt()));
                self.addAggregator('Count Unique Values', self.aggregatorTemplates.countUnique(dataUtils.usFmtInt()));
                self.addAggregator('List Unique Values', self.aggregatorTemplates.listUnique(', '));
                self.addAggregator('Sum', self.aggregatorTemplates.sum(dataUtils.usFmt()));
                self.addAggregator('Integer Sum', self.aggregatorTemplates.sum(dataUtils.usFmtInt()));
                self.addAggregator('Average', self.aggregatorTemplates.average(dataUtils.usFmt()));
                self.addAggregator('Minimum', self.aggregatorTemplates.min(dataUtils.usFmt()));
                self.addAggregator('Maximum', self.aggregatorTemplates.max(dataUtils.usFmt()));
                self.addAggregator('Sum over Sum', self.aggregatorTemplates.sumOverSum(dataUtils.usFmt()));
                self.addAggregator('80% Upper Bound', self.aggregatorTemplates.sumOverSumBound80(true, dataUtils.usFmt()));
                self.addAggregator('80% Lower Bound', self.aggregatorTemplates.sumOverSumBound80(false, dataUtils.usFmt()));
                self.addAggregator('Sum as Fraction of Total', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'total', dataUtils.usFmtPct()));
                self.addAggregator('Sum as Fraction of Rows', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'row', dataUtils.usFmtPct()));
                self.addAggregator('Sum as Fraction of Columns', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'col', dataUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Total', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'total', dataUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Rows', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'row', dataUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Columns', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'col', dataUtils.usFmtPct()));
            },
            addAggregator: function(AggregatorName, Aggregator){
                var self = this;
                self.availableAggregators[AggregatorName] = Aggregator;
                self.availableAggregatorNames = Object.keys(self.availableAggregators);
            }
        };
        
        return new Aggregators();
    }
});