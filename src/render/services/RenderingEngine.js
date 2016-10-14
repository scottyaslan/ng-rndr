define([], function() {
    'use strict';

    return function(aggregators, dataUtils, renderers, dataViews, $q, $timeout, $window, $rootScope) {
        /**
         * {@link RenderingEngine} constructor.
         * 
         * @param {string} dataSourceConfigId The UUID of the data source.
         * @param {string} [renderingEngineId]  The UUID of this `renderingEngine`.
         * @param {string} [title]              The title of this  `renderingEngine`.
         * @param {string} [rendererName]       The name of the renderer plugin.
         * @param {string} [aggregatorName]     Then name of the aggregator plugin.
         */
        function RenderingEngine(dataSourceConfigId, renderingEngineId, title, dataViewName, rendererName) {
            this.dataSourceConfigId = dataSourceConfigId;

            if (renderingEngineId === undefined || renderingEngineId === '') {
                this.id = dataUtils.generateUUID();
            } else {
                this.id = renderingEngineId;
            }

            if (title === undefined || title === '') {
                this.title = "Untitiled";
            } else {
                this.title = title;
            }

            if (rendererName === undefined || rendererName === '') {
                this.rendererName = "DT - Table";
            } else {
                this.rendererName = rendererName;
            }

            this.dataView = {
                meta: dataViews[renderers[this.rendererName].opts.dataViewName].meta()
            };
        }
        RenderingEngine.prototype = {
            /**
             * @typedef RenderingEngine
             * @type {object}
             * @property {string} dataSourceConfigId - The UUID of the data source.
             * @property {string} id - The UUID of this rendering engine.
             * @property {string} title - The title of this rendering engine.
             * @property {string} rendererName - The name of the renderer plugin.
             * @property {string} aggregatorName - The name of the aggregator plugin.
             * @property {object} aggregator - The aggregator of this rendering engine.
             * @property {string} aggregator.name - The name of the aggregator for this rendering engine.
             * @property {function} aggregator.aggregate - The name of the aggregator for this rendering engine.
             * @property {Array} aggregator.numInputsToProcess - The number aggregator for this rendering engine.
             * @property {Array} aggregator.aggInputAttributeName - The name of the aggregator for this rendering engine.
             */
            constructor: RenderingEngine,
            /**
             * Intialize the 'renderingEngine''s `aggregator` object.
             */
            initializeAggregator: function() {
                if (this.aggregator === undefined) {
                    this.aggregator = {
                        name: "Count",
                        aggregate: function() {},
                        numInputsToProcess: [],
                        aggInputAttributeName: []
                    }
                }

                var numInputs = aggregators[this.aggregator.name].aggregate([])([]).numInputs;
                if (numInputs === undefined) {
                    this.aggregator.numInputsToProcess = new Array();
                    this.aggregator.aggInputAttributeName = new Array();
                } else {
                    this.aggregator.numInputsToProcess = new Array(numInputs);
                    if (this.aggregator.aggInputAttributeName.length !== numInputs) {
                        this.aggregator.aggInputAttributeName = new Array(numInputs);
                    }
                }

                this.aggregator.aggregate = aggregators[this.aggregator.name].aggregate([this.aggregator.aggInputAttributeName]);
            },
            /**
             * Creates configured `DataView` and invokes the configured `renderer` to build the DOM and
             * attach it to the view.
             *  
             * @param  {object} data The `data` can be in any format that the configured `DataView` can understand.
             * @param  {string} rendererName The name of the renderer to use.
             * 
             * @return {Promise}      A promise that resolves once the view is attached to the DOM. 
             */
            draw: function(data, rendererName) {
                var self = this;

                if (rendererName !== undefined && rendererName !== '') {
                    self.rendererName = rendererName;
                }

                var deferred = $q.defer();
                $rootScope.$emit('RenderingEngine:draw:begin');
                $timeout(function(data) {
                    var result;
                    try {
                        self.initializeAggregator();
                        var opts = {
                            id: self.id,
                            title: self.title,
                            aggregator: self.aggregator,
                            dataUtils: dataUtils,
                            meta: self.dataView.meta
                        };
                        self.dataView = new dataViews[renderers[self.rendererName].opts.dataViewName].view(data, opts);
                        try {
                            renderers[self.rendererName].opts.height = self.element.parent().parent().innerHeight();
                            renderers[self.rendererName].opts.width = self.element.parent().parent().innerWidth();
                            result = renderers[self.rendererName].render(self.dataView, renderers[self.rendererName].opts);
                        } catch (_error) {
                            e = _error;
                            if (typeof console !== "undefined" && console !== null) {
                                console.error(e.stack);
                            }
                            result = $("<span>").html(opts.localeStrings.renderError);
                        }
                    } catch (_error) {
                        e = _error;
                        if (typeof console !== "undefined" && console !== null) {
                            console.error(e.stack);
                        }
                        result = $("<span>").html(opts.localeStrings.computeError);
                    }
                    // remove old viz
                    self.element.empty();
                    // append the new viz
                    self.element.append(result.html);
                    $rootScope.$emit('RenderingEngine:draw:complete');
                    // run any post render functions defined by visual
                    if (result.postRenderFunction) {
                        result.postRenderFunction(result.html, result.postRenderOpts);
                    }
                    deferred.resolve();
                }, 1500, true, data);
                return deferred.promise;
            }
        };
        return RenderingEngine;
    }
});
