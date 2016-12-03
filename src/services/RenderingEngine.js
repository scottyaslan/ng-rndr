define([], function() {
    'use strict';

    return function(aggregators, dataUtils, renderers, dataViews, $timeout, $rootScope) {
        /**
         * {@link RenderingEngine} constructor.
         * 
         * @param {string} rendererName - The name of the renderer plugin.
         * @param {string} [title]              The title of this  `renderingEngine`.
         * @param {string} [renderingEngineId]  The UUID of this `renderingEngine`.
         * @param {string} aggregatorName - The name of the aggregator plugin.
         * @param {string} [localeName] - The name of the locale.
         * @param {object} [derivedAttributes] - A dictionary of "deriver generator" functions: the keys are the names of the new attributes, and the functions take an existing record and return the value of the new attribute.
         */
        function RenderingEngine(rendererName, title, renderingEngineId, aggregatorName, localeName, derivedAttributes) {
            if (renderingEngineId === undefined || renderingEngineId === '' || renderingEngineId === null) {
                this.id = dataUtils.generateUUID();
            } else {
                this.id = renderingEngineId;
            }

            if (title === undefined || title === '' || title === null) {
                this.title = "Untitiled";
            } else {
                this.title = title;
            }

            if (rendererName !== undefined && rendererName !== '' && rendererName !== null) {
                this.rendererName = rendererName;
            } else {
                var e = new Error('RenderingEngine constructor: cannot instantiate a RenderingEngine object without a renderer name.');
                if (typeof console !== "undefined" && console !== null) {
                    console.error(e.stack);
                }
                throw e;
            }

            if (localeName !== undefined && localeName !== '' && localeName !== null) {
                this.localeName = localeName;
            } else {
                this.localeName = 'en';
            }

            this.setAggregator(aggregatorName);
            this.setDerivedAttributes(derivedAttributes);

            this.dataView = new dataViews[renderers[this.rendererName].dataViewName].view([], {
                aggregator: aggregators[this.aggregatorName].aggregate(),
                derivedAttributes: this.derivedAttributes,
                dataUtils: dataUtils,
                meta: dataViews[renderers[rendererName].dataViewName].meta()
            });
        }
        RenderingEngine.prototype = {
            /**
             * @typedef RenderingEngine
             * @type {object}
             * @property {string} id - The UUID of this rendering engine.
             * @property {string} title - The title of this rendering engine.
             * @property {string} rendererName - The name of the renderer plugin.
             * @property {string} aggregatorName - The name of the aggregator for this rendering engine.
             */
            constructor: RenderingEngine,
            /**
             * [setDerivedAttributes description]
             * @param {[type]} derivedAttributes [description]
             */
            setDerivedAttributes: function(derivedAttributes) {
                if (derivedAttributes !== undefined && derivedAttributes !== '' && derivedAttributes !== null) {
                    this.derivedAttributes = derivedAttributes;
                } else {
                    this.derivedAttributes = {};
                }
                this.dirty = true;
            },
            /**
             * Intialize the 'renderingEngine''s `aggregator` object.
             * 
             * @param  {string} aggregatorName - The name of the aggregator plugin.
             */
            setAggregator: function(aggregatorName) {
                if (aggregatorName === undefined || aggregatorName === '' || aggregatorName === null) {
                    this.aggregatorName = "Count";
                } else {
                    this.aggregatorName = aggregatorName;
                }
                this.dirty = true;
            },
            /**
             * Creates configured `DataView` and invokes the configured `renderer` to build the DOM and
             * attach it to the view.
             *  
             * @param  {html} element The jQuery element that will contain the viz.
             * @param  {object} data The `data` can be in any format that the configured `DataView` can understand.
             * @param  {string} [rendererName] The name of the renderer to use.
             * @param  {string} [aggregatorName] - The name of the aggregator plugin.
             * @param  {string} [localeName] - The name of the locale.
             * @param  {object} [derivedAttributes] - A dictionary of "deriver generator" functions: the keys are the names of the new attributes, and the functions take an existing record and return the value of the new attribute.
             * 
             * @return {Promise}      A promise that resolves once the view is attached to the DOM. 
             */
            draw: function(element, data, rendererName, aggregatorName, localeName, derivedAttributes) {
                var self = this;

                //if rendererName is set make sure to persist it
                if (rendererName !== undefined && rendererName !== '' && rendererName !== null) {
                    self.rendererName = rendererName;
                }

                //if localeName is set make sure to persist it
                if (localeName !== undefined && localeName !== '' && localeName !== null) {
                    self.localeName = localeName;
                }

                //if element is set make sure to persist it
                if (element !== undefined && element !== '' && element !== null) {
                    self.element = element;
                }

                this.setAggregator(aggregatorName);
                this.setDerivedAttributes(derivedAttributes);

                $rootScope.$emit('RenderingEngine:draw:begin');
                return $timeout(function(dataContext) {
                    var result;
                    try {
                        var dataView_opts = {
                            aggregator: aggregators[self.aggregatorName].aggregate(),
                            derivedAttributes: self.derivedAttributes,
                            dataUtils: dataUtils,
                            meta: self.dataView.meta
                        };

                        self.dataView = new dataViews[renderers[self.rendererName].dataViewName].view(dataContext.data, dataView_opts);

                        self.dirty = false;

                        var opts = {
                            localeStrings: renderers[self.rendererName].opts.locales[self.localeName].localeStrings,
                            renderingEngineRef: self,
                            height: self.element.parent().innerHeight(),
                            width: self.element.parent().innerWidth()
                        };

                        var renderer_opts = $.extend(opts, renderers[self.rendererName].opts);

                        try {
                            result = renderers[self.rendererName].render(self.dataView, renderer_opts);
                        } catch (_error) {
                            var e = _error;
                            if (typeof console !== "undefined" && console !== null) {
                                console.log(e.stack);
                            }
                            // remove old viz
                            self.element.empty();
                            // append the new viz
                            self.element.append($("<span>").html(renderers[self.rendererName].opts.locales[self.localeName].localeStrings.renderError));
                            $rootScope.$emit('RenderingEngine:draw:complete');
                        }
                    } catch (_error) {
                        var e = _error;
                        if (typeof console !== "undefined" && console !== null) {
                            console.log(e.stack);
                        }
                        // remove old viz
                        self.element.empty();
                        // append the new viz
                        self.element.append($("<span>").html(renderers[self.rendererName].opts.locales[self.localeName].localeStrings.computeError));
                        $rootScope.$emit('RenderingEngine:draw:complete');
                    }
                    $rootScope.$emit('RenderingEngine:draw:complete');
                    renderers[self.rendererName].finalize(self.element, result);
                    return result;
                }, 1500, true, { "data": data });
            }
        };
        return RenderingEngine;
    }
});
