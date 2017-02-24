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

        return function($ngRndrAggregators, $ngRndrRenderers, $ngRndrDerivedAttributes, $ngRndrSorters, $ngRndrFormatters, $ngRndrDataViews) {
            /**
             * {@link RenderingEngine} constructor.
             * 
             * @param {string} renderer                     The name of the renderer plugin.
             * @param {string} [id]                         The UUID.
             * @param {string} [aggregator] -               The name of the aggregator plugin.
             * @param {object} [aggInputAttributeName] -    The array of attribute names to input into the `aggregate`.
             * @param {object} [dv_meta] -                  The meta object used to initialze the .
             * @param {object} [derivedAttrs] -             An array of string names of new data attributes the derived attributes.
             * @param {string} [locale] -                   The name of the locale.
             * @param {object} [sorters] -                  An array of string names of data attributes for which the corresponding $ngRndrSorters sorting function will be applied.
             */
            function RenderingEngine(renderer, id, aggregator, aggInputAttributeName, dv_meta, derivedAttrs, locale, sorters) {
                if (id === undefined || id === '' || id === null) {
                    this.id = generateUUID();
                } else {
                    this.id = id;
                }

                if (renderer !== undefined && renderer !== '' && renderer !== null) {
                    this.renderer = renderer;
                } else {
                    var e = new Error('RenderingEngine constructor: cannot instantiate a RenderingEngine object without a renderer name.');
                    if (typeof console !== 'undefined' && console !== null) {
                        console.error(e.stack);
                    }
                    throw e;
                }

                if (locale !== undefined && locale !== '' && locale !== null) {
                    this.locale = locale;
                } else {
                    this.locale = 'en';
                }

                this.setAggregator(aggregator, aggInputAttributeName);
                this.setDerivedAttributes(derivedAttrs);
                this.setSorters(sorters);

                if (dv_meta !== undefined && dv_meta !== '' && dv_meta !== null) {
                    this.dataView = new $ngRndrDataViews[$ngRndrRenderers[this.renderer].dataViewName].view([], {
                        aggregator: this.aggregator,
                        derivedAttributes: this.derivedAttributes,
                        sorters: this.sorters,
                        formatters: $ngRndrFormatters,
                        meta: dv_meta
                    });
                } else {
                    this.dataView = new $ngRndrDataViews[$ngRndrRenderers[this.renderer].dataViewName].view([], {
                        aggregator: this.aggregator,
                        derivedAttributes: this.derivedAttributes,
                        sorters: this.sorters,
                        formatters: $ngRndrFormatters,
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
                 * @property {string} renderer - The name of the `renderer` plugin.
                 * @property {string} locale - The name of the locale to use with the `renderer` plugin.
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
                setRenderer: function(renderer) {
                    if (renderer !== undefined && renderer !== '' && renderer !== null) {
                        this.renderer = renderer;
                    } else {
                        var e = new Error('Cannot configure a rendering engine without a renderer name.');
                        if (typeof console !== 'undefined' && console !== null) {
                            console.error(e.stack);
                        }
                        throw e;
                    }
                    this.dirty = true;
                },
                setLocale: function(locale) {
                    if (locale !== undefined && locale !== '' && locale !== null) {
                        this.locale = locale;
                    } else {
                        this.locale = 'en';
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
                 * @param  {string} aggregator - The name of the aggregator plugin.
                 */
                setAggregator: function(aggregator, aggInputAttributeName) {
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

                    if (aggregator === undefined || aggregator === '' || aggregator === null) {
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
                        this.aggregator.name = aggregator;
                        try {
                            this.aggregator.aggregate = $ngRndrAggregators[aggregator].aggregate;
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
                    //remove old viz
                    element.empty();
                    var spinner = $('<div>').addClass('rndr-loader').css({'top':(element.parent().innerHeight() - 60)/2, 'left': (element.parent().innerWidth() - 60)/2}); // .loader css has 60px height and 60 px width
                    element.append(spinner);
                    // using setTimeout starategy ensures containing DOM element is visible so that height and width info is available to renderer
                    return setTimeout(function(dataContext) {
                        var result;
                        try {
                            var dataView_opts = {
                                aggregator: self.aggregator,
                                derivedAttributes: self.derivedAttributes,
                                sorters: self.sorters,
                                formatters: $ngRndrFormatters,
                                meta: self.dataView.meta
                            };

                            self.dataView = new $ngRndrDataViews[$ngRndrRenderers[self.renderer].dataViewName].view(data, $.extend(dataView_opts, $ngRndrDataViews[$ngRndrRenderers[self.renderer].dataViewName].opts));

                            var opts = {
                                element: element,
                                renderers: $ngRndrRenderers,
                                dataViews: $ngRndrDataViews,
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
                                height: element.parent().innerHeight(),
                                width: element.parent().innerWidth()
                            };

                            try {
                                //render and attach new viz
                                result = $ngRndrRenderers[self.renderer].render(self, $.extend(opts, $ngRndrRenderers[self.renderer].opts));
                            } catch (_error) {
                                var e = _error;
                                if (typeof console !== 'undefined' && console !== null) {
                                    console.log(e.stack);
                                }
                                // remove old viz
                                element.empty();
                                // append error message
                                element.append($('<span>').html(opts.locales[self.locale].localeStrings.renderError));
                            }
                        } catch (_error) {
                            var e = _error;
                            if (typeof console !== 'undefined' && console !== null) {
                                console.log(e.stack);
                            }
                            // remove old viz
                            element.empty();
                            // append error messagez
                            element.append($('<span>').html(opts.locales[self.locale].localeStrings.computeError));
                        }
                        self.dirty = false;
                        console.log(self.meta());
                        return result;
                    }, 0, true, { 'data': data, 'element': element });
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
                    meta.renderer = this.renderer;
                    meta.id = this.id;
                    meta.locale = this.locale;
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
