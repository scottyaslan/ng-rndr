/*   Data Analytics Toolkit: Explore any data avaialable through a REST service 
*    Copyright (C) 2016  Scott Aslan
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.html>.
*/
define(['app', '../../common/services/serviceProvider', '../../render/services/aggregatorTemplates', '../../render/services/renderingEngineUtils'], function(app) {
    app.factory('Aggregators', ["ServiceProvider", "AggregatorTemplates", "RenderingEngineUtils",
        function(ServiceProvider, AggregatorTemplates, RenderingEngineUtils) {
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
                    self.addAggregator("Count", self.aggregatorTemplates.count(RenderingEngineUtils.usFmtInt()));
                    self.addAggregator("Count Unique Values", self.aggregatorTemplates.countUnique(RenderingEngineUtils.usFmtInt()));
                    self.addAggregator("List Unique Values", self.aggregatorTemplates.listUnique(", "));
                    self.addAggregator("Sum", self.aggregatorTemplates.sum(RenderingEngineUtils.usFmt()));
                    self.addAggregator("Integer Sum", self.aggregatorTemplates.sum(RenderingEngineUtils.usFmtInt()));
                    self.addAggregator("Average", self.aggregatorTemplates.average(RenderingEngineUtils.usFmt()));
                    self.addAggregator("Minimum", self.aggregatorTemplates.min(RenderingEngineUtils.usFmt()));
                    self.addAggregator("Maximum", self.aggregatorTemplates.max(RenderingEngineUtils.usFmt()));
                    self.addAggregator("Sum over Sum", self.aggregatorTemplates.sumOverSum(RenderingEngineUtils.usFmt()));
                    self.addAggregator("80% Upper Bound", self.aggregatorTemplates.sumOverSumBound80(true, RenderingEngineUtils.usFmt()));
                    self.addAggregator("80% Lower Bound", self.aggregatorTemplates.sumOverSumBound80(false, RenderingEngineUtils.usFmt()));
                    self.addAggregator("Sum as Fraction of Total", self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), "total", RenderingEngineUtils.usFmtPct()));
                    self.addAggregator("Sum as Fraction of Rows", self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), "row", RenderingEngineUtils.usFmtPct()));
                    self.addAggregator("Sum as Fraction of Columns", self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.sum(), "col", RenderingEngineUtils.usFmtPct()));
                    self.addAggregator("Count as Fraction of Total", self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), "total", RenderingEngineUtils.usFmtPct()));
                    self.addAggregator("Count as Fraction of Rows", self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), "row", RenderingEngineUtils.usFmtPct()));
                    self.addAggregator("Count as Fraction of Columns", self.aggregatorTemplates.fractionOf(self.aggregatorTemplates.count(), "col", RenderingEngineUtils.usFmtPct()));
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
    ]);
});