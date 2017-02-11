define(['jquery', 'angular'],
    function($, angular) {
        'use strict';

        /**
         * Create a v4 UUID.
         * @return {string} The generated UUID.
         */
        var generateUUID = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            })
        };

        return function($ngRndrAggregators, $ngRndrRenderers, $ngRndrDerivedAttributes, $ngRndrSorters, $ngRndrFormatters, $ngRndrDataViews, $timeout, $rootScope) {
            /**
             * {@link RenderingEngine} constructor.
             * 
             * @param {string} rendererName                 The name of the renderer plugin.
             * @param {string} [title]                      The title.
             * @param {string} [renderingEngineId]          The UUID.
             * @param {string} [aggregatorName] -           The name of the aggregator plugin.
             * @param {object} [aggInputAttributeName] -    The array of attribute names to input into the `aggregate`.
             * @param {object} [dataViewMeta] -             The meta object used to initialze the .
             * @param {object} [derivedAttrs] -             An array of string names of the derived attributes.
             * @param {string} [localeName] -               The name of the locale.
             * @param {object} [sorters] -                  An array of string names of the derived attributes.
             */
            function RenderingEngine(rendererName, title, renderingEngineId, aggregatorName, aggInputAttributeName, dataViewMeta, derivedAttrs, localeName, sorters) {
                if (renderingEngineId === undefined || renderingEngineId === '' || renderingEngineId === null) {
                    this.id = generateUUID();
                } else {
                    this.id = renderingEngineId;
                }

                if (title === undefined || title === '' || title === null) {
                    this.title = 'Untitled';
                } else {
                    this.title = title;
                }

                if (rendererName !== undefined && rendererName !== '' && rendererName !== null) {
                    this.rendererName = rendererName;
                } else {
                    var e = new Error('RenderingEngine constructor: cannot instantiate a RenderingEngine object without a renderer name.');
                    if (typeof console !== 'undefined' && console !== null) {
                        console.error(e.stack);
                    }
                    throw e;
                }

                if (localeName !== undefined && localeName !== '' && localeName !== null) {
                    this.localeName = localeName;
                } else {
                    this.localeName = 'en';
                }

                this.setAggregator(aggregatorName, aggInputAttributeName);
                this.setDerivedAttributes(derivedAttrs);
                this.setSorters(sorters);

                if (dataViewMeta !== undefined && dataViewMeta !== '' && dataViewMeta !== null) {
                    this.dataView = new $ngRndrDataViews[$ngRndrRenderers[this.rendererName].dataViewName].view([], {
                        aggregator: this.aggregator,
                        derivedAttributes: this.derivedAttributes,
                        meta: dataViewMeta
                    });
                } else {
                    this.dataView = new $ngRndrDataViews[$ngRndrRenderers[this.rendererName].dataViewName].view([], {
                        aggregator: this.aggregator,
                        derivedAttributes: this.derivedAttributes
                    });
                }
                this.dirty = false;
            }
            RenderingEngine.prototype = {
                /**
                 * @typedef RenderingEngine
                 * @type {object}
                 * @property {string} id - The UUID of this rendering engine.
                 * @property {string} dirty - The state of this rendering engine. True implies that something in this rendering engine's metadata has been changed and a draw() is required to display the latest visualization.
                 * @property {string} title - The title of this rendering engine.
                 * @property {string} rendererName - The name of the `renderer` plugin.
                 * @property {string} localeName - The name of the locale to use with the `renderer` plugin.
                 * @property {string} dataView - The `dataView` to pass to the `renderer` plugin.
                 * @property {string} derivedAttributes - The dictionary of 'attribute generator' functions: the keys are the names of the new attributes, and the functions take an existing record and return the value of the new attribute.
                 * @property {object} aggregator - The meta object for the `aggregator` of this rendering engine described as follows:
                 *                       Key  | Type | Default value | Description
                 *                       ---- | ---- | ------------- | -----------
                 *                       `name`  | string | 'Count' | The name of the aggregator for this rendering engine.
                 *                       `aggregate`  | function | aggregators['Count'].aggregate | The function which *generates* a function that defines how data is aggregated.
                 *                       `aggInputAttributeName`  | array | [] | The array of attribute names to input into the `aggregator.aggregate`.
                 */
                constructor: RenderingEngine,
                setRendererName: function(rendererName) {
                    if (rendererName !== undefined && rendererName !== '' && rendererName !== null) {
                        this.rendererName = rendererName;
                    } else {
                        var e = new Error('Cannot configure a rendering engine without a renderer name.');
                        if (typeof console !== 'undefined' && console !== null) {
                            console.error(e.stack);
                        }
                        throw e;
                    }
                    this.dirty = true;
                },
                setLocaleName: function(localeName) {
                    if (localeName !== undefined && localeName !== '' && localeName !== null) {
                        this.localeName = localeName;
                    } else {
                        this.localeName = 'en';
                    }
                    this.dirty = true;
                },
                setTitle: function(title) {
                    if (title !== undefined && title !== '' && title !== null) {
                        this.title = title;
                    } else {
                        this.title = 'Untitiled';
                    }
                    this.dirty = true;
                },
                /**
                 * [setDerivedAttributes description]
                 * @param {array} derivedAttributes The aray of string names of the derived attributes (Each) 
                 */
                setDerivedAttributes: function(attrs) {
                    this.derivedAttributes = {};
                    if (attrs !== undefined && attrs !== '' && attrs !== null) {
                        angular.forEach(attrs, function(name) {
                            try {
                                this.derivedAttributes[name] = $ngRndrDerivedAttributes[name];
                            } catch (_error) {
                                var e = _error;
                                if (typeof console !== 'undefined' && console !== null) {
                                    console.log('The \'' + name + '\' derived attribute is not configured with the $ngRndrDerivedAttributes service. Stack Trace: ' + e.stack);
                                }
                            }
                        });
                    }
                    this.dirty = true;
                },
                setSorters: function(sorters) {
                    this.sorters = {};
                    if (sorters !== undefined && sorters !== '' && sorters !== null) {
                        angular.forEach(sorters, function(name) {
                            try {
                                this.sorters[name] = $ngRndrSorters[name];
                            } catch (_error) {
                                var e = _error;
                                if (typeof console !== 'undefined' && console !== null) {
                                    console.log('The \'' + name + '\' sorter is not configured with the $ngRndrSorters service. Stack Trace: ' + e.stack);
                                }
                            }
                        });
                    }
                    this.dirty = true;
                },
                /**
                 * Sets the `aggregator`.
                 * 
                 * @param  {string} aggregatorName - The name of the aggregator plugin.
                 */
                setAggregator: function(aggregatorName, aggInputAttributeName) {
                    try {
                        if (this.aggregator === undefined) {
                            this.aggregator = {
                                name: 'Count',
                                aggregate: $ngRndrAggregators['Count'].aggregate,
                                aggInputAttributeName: []
                            }
                        }
                    } catch (_error) {
                        var e = _error;
                        if (typeof console !== 'undefined' && console !== null) {
                            console.log('The \'Count\' aggregator is not configured with the $ngRndrAggregators service. Stack Trace: ' + e.stack);
                        }
                    }

                    if (aggregatorName === undefined || aggregatorName === '' || aggregatorName === null) {
                        this.aggregator.name = 'Count';
                        try {
                            this.aggregator.aggregate = $ngRndrAggregators['Count'].aggregate;
                        } catch (_error) {
                            var e = _error;
                            if (typeof console !== 'undefined' && console !== null) {
                                console.log('The \'Count\' aggregator is not configured with the $ngRndrAggregators service. Stack Trace: ' + e.stack);
                            }
                        }
                        this.aggregator.aggInputAttributeName = [];
                    } else {
                        this.aggregator.name = aggregatorName;
                        try {
                            this.aggregator.aggregate = $ngRndrAggregators[aggregatorName].aggregate;
                        } catch (_error) {
                            var e = _error;
                            if (typeof console !== 'undefined' && console !== null) {
                                console.log('The \'' + name + '\' aggregator is not configured with the ngRndr.aggregators module. Stack Trace: ' + e.stack);
                            }
                        }
                        this.aggregator.aggInputAttributeName = [];
                    }

                    var numInputs = $ngRndrAggregators[this.aggregator.name].aggregate([])([]).numInputs;

                    if (numInputs === undefined) {
                        this.aggregator.aggInputAttributeName = new Array();
                    } else {
                        if (this.aggregator.aggInputAttributeName.length !== numInputs) {
                            this.aggregator.aggInputAttributeName = new Array(numInputs);
                        }
                    }
                    if (aggInputAttributeName !== undefined && aggInputAttributeName !== '' && aggInputAttributeName !== null) {
                        this.aggregator.aggInputAttributeName = aggInputAttributeName;
                    }

                    this.dirty = true;
                },
                /**
                 * Creates configured `DataView` and invokes the configured `renderer` to build the DOM and
                 * attach it to the view.
                 *  
                 * @param  {html} element The jQuery element that will contain the viz.
                 * @param  {object} data The `data` can be in any format that the configured `DataView` can understand.
                 * 
                 * @return {Promise}      A promise that resolves once the view is attached to the DOM. 
                 */
                draw: function(element, data) {
                    var self = this;
                    $rootScope.$emit('RenderingEngine:draw:begin');
                    return $timeout(function(dataContext) {
                        var result;
                        try {
                            var dataView_opts = {
                                aggregator: self.aggregator,
                                derivedAttributes: self.derivedAttributes,
                                sorters: self.sorters,
                                formatters: $ngRndrFormatters,
                                meta: self.dataView.meta
                            };

                            self.dataView = new $ngRndrDataViews[$ngRndrRenderers[self.rendererName].dataViewName].view(dataContext.data, $.extend(dataView_opts, $ngRndrDataViews[$ngRndrRenderers[self.rendererName].dataViewName].opts));

                            var opts = {
                                heightOffset: 0,
                                widthOffset: 0,
                                locales: {
                                    en: {
                                        localeStrings: {
                                            renderError: 'An error occurred rendering the results.',
                                            computeError: 'An error occurred computing the results.'
                                        }
                                    }
                                },
                                height: dataContext.element.parent().innerHeight(),
                                width: dataContext.element.parent().innerWidth()
                            };

                            try {
                                result = $ngRndrRenderers[self.rendererName].render(self, $.extend(opts, $ngRndrRenderers[self.rendererName].opts));
                            } catch (_error) {
                                var e = _error;
                                if (typeof console !== 'undefined' && console !== null) {
                                    console.log(e.stack);
                                }
                                // remove old viz
                                dataContext.element.empty();
                                // append error message
                                dataContext.element.append($('<span>').html(opts.locales[self.localeName].localeStrings.renderError));
                                $rootScope.$emit('RenderingEngine:draw:complete');
                            }
                        } catch (_error) {
                            var e = _error;
                            if (typeof console !== 'undefined' && console !== null) {
                                console.log(e.stack);
                            }
                            // remove old viz
                            dataContext.element.empty();
                            // append error messagez
                            dataContext.element.append($('<span>').html(opts.locales[self.localeName].localeStrings.computeError));
                            $rootScope.$emit('RenderingEngine:draw:complete');
                        }
                        $rootScope.$emit('RenderingEngine:draw:complete');

                        //remove old viz
                        dataContext.element.empty();

                        // append the new viz
                        dataContext.element.append(result.html);

                        $ngRndrRenderers[self.rendererName].finalize(dataContext.element, result, opts);
                        self.dirty = false;
                        console.log(self.meta());
                        return result;
                    }, 1500, true, { 'data': data, 'element': element });
                },
                /**
                 * The state of this rendering engine. True implies that something in this rendering engine's metadata has been changed and a `draw()` is required to display the latest visualization.
                 * @return {Boolean} The state of this rendering engine.
                 */
                isDirty: function() {
                    return (this.dirty || this.dataView.meta.dirty);
                },
                meta: function() {
                    var meta = {};
                    meta.rendererName = this.rendererName;
                    meta.id = this.id;
                    meta.title = this.title;
                    meta.localeName = this.localeName;
                    meta.dataView = {};
                    meta.dataView.meta = this.dataView.meta;
                    meta.aggregator = {
                        name: this.aggregator.name,
                        aggInputAttributeName: this.aggregator.aggInputAttributeName
                    }

                    //Only need the names of the derived attributes since functions do not serialize
                    meta.derivedAttributes = [];

                    angular.forEach(this.derivedAttributes, function(value, key) {
                        meta.derivedAttributes.push(key);
                    });

                    //Only need the names of the sorters since functions do not serialize
                    meta.sorters = [];

                    angular.forEach(this.sorters, function(value, key) {
                        meta.sorters.push(key);
                    });

                    return meta;
                }
            };
            return RenderingEngine;
        }
    });
