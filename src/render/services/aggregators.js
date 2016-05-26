define([], function() {
    'use strict';

    function Aggregators(ServiceProvider, AggregatorTemplates, RenderingEngineUtils) {
        function Aggregators() {
            this.availableAggregators;
            this.availableAggregatorNames;
            this.availableAggregatorOptions;
            this.aggregatorTemplates;
        }
        Aggregators.prototype = {
            constructor: Aggregators,
            init: function() {
                var self = this;
                self.availableAggregators = {};
                self.availableAggregatorNames = Object.keys(self.availableAggregators);
                self.aggregatorTemplates = AggregatorTemplates;
                self.addAggregator('Count', self.aggregatorTemplates.count(RenderingEngineUtils.usFmtInt()));
                self.addAggregator('Count Unique Values', self.aggregatorTemplates.countUnique(RenderingEngineUtils.usFmtInt()));
                self.addAggregator('List Unique Values', self.aggregatorTemplates.listUnique(', '));
                self.addAggregator('Sum', self.aggregatorTemplates.sum(RenderingEngineUtils.usFmt()));
                self.addAggregator('Integer Sum', self.aggregatorTemplates.sum(RenderingEngineUtils.usFmtInt()));
                self.addAggregator('Average', self.aggregatorTemplates.average(RenderingEngineUtils.usFmt()));
                self.addAggregator('Minimum', self.aggregatorTemplates.min(RenderingEngineUtils.usFmt()));
                self.addAggregator('Maximum', self.aggregatorTemplates.max(RenderingEngineUtils.usFmt()));
                self.addAggregator('Sum over Sum', self.aggregatorTemplates.sumOverSum(RenderingEngineUtils.usFmt()));
                self.addAggregator('80% Upper Bound', self.aggregatorTemplates.sumOverSumBound80(true, RenderingEngineUtils.usFmt()));
                self.addAggregator('80% Lower Bound', self.aggregatorTemplates.sumOverSumBound80(false, RenderingEngineUtils.usFmt()));
                self.addAggregator('Sum as Fraction of Total', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'total', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Sum as Fraction of Rows', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'row', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Sum as Fraction of Columns', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), 'col', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Total', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'total', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Rows', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'row', RenderingEngineUtils.usFmtPct()));
                self.addAggregator('Count as Fraction of Columns', self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), 'col', RenderingEngineUtils.usFmtPct()));
                if(ServiceProvider.Aggregators === undefined){
                    ServiceProvider.add('Aggregators', aggregators);
                }
            },
            addAggregator: function(AggregatorName, Aggregator){
                var self = this;
                self.availableAggregators[AggregatorName] = Aggregator;
                self.availableAggregatorNames = Object.keys(self.availableAggregators);
            }
        };
        var aggregators = new Aggregators();
        aggregators.init();
        return aggregators;
    }

    Aggregators.$inject=['ServiceProvider', 'AggregatorTemplates', 'RenderingEngineUtils'];

    return Aggregators;
});