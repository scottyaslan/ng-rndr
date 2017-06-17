(function(root, factory) {
    if (root.rndr === undefined) {
        root.rndr = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$rndrRenderingEngine', ['jquery', 'angular', '$rndrFormatters', '$rndrSorters', '$rndrDerivedAttributes', '$rndrAggregators', '$rndrDataViews', '$rndrRenderers'], function($, angular, $rndrFormatters, $rndrSorters, $rndrDerivedAttributes, $rndrAggregators, $rndrDataViews, $rndrRenderers) {
            return (root.rndr.RenderingEngine = factory(root, $, angular, $rndrFormatters, $rndrSorters, $rndrDerivedAttributes, $rndrAggregators, $rndrDataViews, $rndrRenderers));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.RenderingEngine = factory(root, require('jquery'), require('angular'), require('$rndrFormatters'), require('$rndrSorters'), require('$rndrDerivedAttributes'), require('$rndrAggregators'), require('$rndrDataViews'), require('$rndrRenderers')));
    } else {
        root.rndr.RenderingEngine = factory(root, root.$, root.angular, root.rndr.plugins.formatters, root.rndr.plugins.sorters, root.rndr.plugins.derivedAttributes, root.rndr.plugins.aggregators, root.rndr.plugins.dataViews, root.rndr.plugins.renderers);
    }
}(this, function(root, $, angular, $rndrFormatters, $rndrSorters, $rndrDerivedAttributes, $rndrAggregators, $rndrDataViews, $rndrRenderers) {
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
     * @param {object} [sorters] -                  An array of string names of data attributes for which the corresponding $rndrSorters sorting function will be applied.
     * @param {object} element                      The jQuery wrapped DOM element that contains the visualization.
     */
    function RenderingEngine(renderer, id, aggregator, aggInputAttributeName, dv_meta, derivedAttrs, locale, sorters, element, data) {
        if (element !== undefined || element !== '' || element !== null) {
            this.element = element;
        }

        if (data === undefined || data === '' || data === null) {
            data = [];
        }

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
            this.dataView = new $rndrDataViews[$rndrRenderers[this.renderer].dataViewName].view(data, {
                aggregator: this.aggregator,
                derivedAttributes: this.derivedAttributes,
                sorters: this.sorters,
                formatters: $rndrFormatters,
                meta: dv_meta
            });
        } else {
            this.dataView = new $rndrDataViews[$rndrRenderers[this.renderer].dataViewName].view(data, {
                aggregator: this.aggregator,
                derivedAttributes: this.derivedAttributes,
                sorters: this.sorters,
                formatters: $rndrFormatters,
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
        setElement: function(element) {
            if (element !== undefined && element !== '' && element !== null) {
                this.element = element;
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
                        this.derivedAttributes[name] = $rndrDerivedAttributes[name];
                    } catch (_error) {
                        var e = _error;
                        if (typeof console !== 'undefined' && console !== null) {
                            console.log('The \'' + name + '\' derived attribute is not configured with the $rndrDerivedAttributes service. Stack Trace: ' + e.stack);
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
                        this.sorters[name] = $rndrSorters[name];
                    } catch (_error) {
                        var e = _error;
                        if (typeof console !== 'undefined' && console !== null) {
                            console.log('The \'' + name + '\' sorter is not configured with the $rndrSorters service. Stack Trace: ' + e.stack);
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
                        aggregate: $rndrAggregators['Count'].aggregate,
                        aggInputAttributeName: []
                    }
                }
            } catch (_error) {
                var e = _error;
                if (typeof console !== 'undefined' && console !== null) {
                    console.log('The \'Count\' aggregator is not configured with the $rndrAggregators service. Stack Trace: ' + e.stack);
                }
            }

            if (aggregator === undefined || aggregator === '' || aggregator === null) {
                this.aggregator.name = 'Count';
                try {
                    this.aggregator.aggregate = $rndrAggregators['Count'].aggregate;
                } catch (_error) {
                    var e = _error;
                    if (typeof console !== 'undefined' && console !== null) {
                        console.log('The \'Count\' aggregator is not configured with the $rndrAggregators service. Stack Trace: ' + e.stack);
                    }
                }
                this.aggregator.aggInputAttributeName = [];
            } else {
                this.aggregator.name = aggregator;
                try {
                    this.aggregator.aggregate = $rndrAggregators[aggregator].aggregate;
                } catch (_error) {
                    var e = _error;
                    if (typeof console !== 'undefined' && console !== null) {
                        console.log('The \'' + name + '\' aggregator is not configured with the rndr.aggregators module. Stack Trace: ' + e.stack);
                    }
                }
                this.aggregator.aggInputAttributeName = [];
            }

            var numInputs = $rndrAggregators[this.aggregator.name].aggregate([])([]).numInputs;

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
         * @param  {object} data The `data` can be in any format that the configured `DataView` can understand.
         * 
         * @return {Promise}      A promise that resolves once the view is attached to the DOM. 
         */
        draw: function(data) {
            var self = this;

            if (self.element === undefined && self.element === '' && self.element === null) {
                var e = new Error('RenderingEngine draw: cannot draw a RenderingEngine object without an HTML element container defined.');
                if (typeof console !== 'undefined' && console !== null) {
                    console.error(e.stack);
                }
                throw e;
            }

            //remove old viz
            self.element.empty();
            var spinner = $('<div>').addClass('rndr-loader').css({ 'top': (self.element.innerHeight() - 60) / 2, 'left': (self.element.innerWidth() - 60) / 2 }); // .loader css has 60px height and 60 px width
            self.element.append(spinner);
            // using setTimeout starategy ensures containing DOM element is visible so that height and width info is available to renderer
            return setTimeout(function(dataContext) {
                var result;

                var dataView_opts = {
                    aggregator: self.aggregator,
                    derivedAttributes: self.derivedAttributes,
                    sorters: self.sorters,
                    formatters: $rndrFormatters,
                    meta: self.dataView.meta
                };

                var opts = {
                    element: self.element,
                    renderers: $rndrRenderers,
                    dataViews: $rndrDataViews,
                    sorters: $rndrSorters,
                    aggregators: $rndrAggregators,
                    derivedAttributes: $rndrDerivedAttributes,
                    formatters: $rndrFormatters,
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
                    height: self.element.innerHeight(),
                    width: self.element.innerWidth()
                };

                try {
                    self.dataView = new $rndrDataViews[$rndrRenderers[self.renderer].dataViewName].view(data, $.extend(dataView_opts, $rndrDataViews[$rndrRenderers[self.renderer].dataViewName].opts));

                    try {
                        //render and attach new viz
                        result = $rndrRenderers[self.renderer].render(self, $.extend(opts, $rndrRenderers[self.renderer].opts));
                    } catch (_error) {
                        var e = _error;
                        if (typeof console !== 'undefined' && console !== null) {
                            console.log(e.stack);
                        }
                        // remove old viz
                        self.element.empty();
                        // append error message
                        self.element.append($('<span>').html(opts.locales[self.locale].localeStrings.renderError));
                    }
                } catch (_error) {
                    var e = _error;
                    if (typeof console !== 'undefined' && console !== null) {
                        console.log(e.stack);
                    }
                    // remove old viz
                    self.element.empty();
                    // append error messagez
                    self.element.append($('<span>').html(opts.locales[self.locale].localeStrings.computeError));
                }
                self.dirty = false;
                console.log(self.meta());
                return result;
            }, 0, true, { 'data': data });
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

            for(var key in this.derivedAttributes) {
                 meta.derivedAttributes.push(this.derivedAttributes[key]);
            }

            //Only need the names of the sorters since functions do not serialize
            meta.sorters = [];

            for(var key in this.sorters) {
                 meta.sorters.push(this.sorters[key]);
            }

            return meta;
        }
    };
    return RenderingEngine;
}));
