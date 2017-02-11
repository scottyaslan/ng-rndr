(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
  	define(["jquery", "angular"], function($, angular) {
            factory($, angular);
        });
  } else if (typeof exports === 'object' && typeof module === "object") {
    module.exports = factory(require("jquery"), require("angular"));
  } else {
    factory(root.$, root.angular);
  }
}(this, function ($, angular) {/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../node_modules/almond/almond", function(){});

define('directives/rndr',['jquery'],
    function($) {
        'use strict';

        return function() {
            return {
                restrict: 'E',
                scope: {
                    'engine': '=',
                    'input': '='
                },
                link: {
                    pre: function(scope, element, attr) {
                        scope.engine.draw($(element), scope.input);
                    }
                }
            };
        }
    });

define('services/AggregatorsProvider',['jquery'],
    function($) {
        'use strict';

        return function AggregatorsProvider() {
            var aggregators = {};

            /**
             * Adds an aggregator generating function by `name` for fast lookup.
             * 
             * @param {string} name       The lookup name of the aggregate function.
             * @param {function} aggregator The function which *generates* a function that defines how data is aggregated.
             */
            this.add = function(name, aggregator) {
                aggregators[name] = {
                    aggregate: aggregator
                };
            };

            this.$get = [function AggregatorsFactory() {
                /**
                 * A dictionary of functions which *generate* a function that defines how data
                 * is aggregated. Each `aggregator` should take as an argument an array of 
                 * attribute-names and return a function that is appropriate and consumable 
                 * by a `dataView`.
                 */
                function Aggregators(aggregators) {
                    $.extend(this, aggregators);
                }
                Aggregators.prototype = {
                    constructor: Aggregators,
                    /**
                     * Adds an aggregator generating function by `name` for fast lookup.
                     * 
                     * @param {string} name       The lookup name of the aggregate function.
                     * @param {function} aggregator The function which *generates* a function that defines how data is aggregated.
                     */
                    add: function(name, aggregator) {
                        this[name] = {
                            aggregate: aggregator
                        };
                    },
                    /**
                     * Lists the available `aggregator` functions.
                     * 
                     * @return {Array.<string>} The lookup names.
                     */
                    list: function() {
                        return Object.keys(this);
                    }
                };

                return new Aggregators(aggregators);
            }];
        }
    });

define('services/SortersProvider',['jquery'],
    function($) {
        'use strict';

        return function SortersProvider() {
            var sorters = {};

            /**
             * Adds a sorter.
             * 
             * @param {string} name       The lookup name of the sorter.
             * @param {function} sorter The function which sorts data.
             */
            this.add = function(name, sorter) {
                sorters[name] = sorter;
            };

            this.$get = [function SortersFactory() {
                /**
                 * A dictionary of functions which sort data.
                 */
                function Sorters(sorters) {
                    $.extend(this, sorters);
                }
                Sorters.prototype = {
                    constructor: Sorters,
                    /**
                     * Adds an formatter.
                     * 
                     * @param {string} name       The lookup name of the sorting function.
                     * @param {function} sorter The function which *generates* a function that defines how data is aggregated.
                     */
                    add: function(name, sorter) {
                        this[name] = sorter;
                    },
                    /**
                     * Lists the available formatters.
                     * 
                     * @return {Array.<string>} The lookup names.
                     */
                    list: function() {
                        return Object.keys(this);
                    }
                };

                return new Sorters(sorters);
            }];
        }
    });

define('services/DataViewsProvider',['jquery'],
    function($) {
        'use strict';

        return function DataViewsProvider() {
            var dataViews = {};

            /**
             * Adds a data view object factory.
             * 
             * @param {string} name     The lookup name of the `DataView`.
             * @param {DataView} DataView The `DataView` object factory to add.
             */
            this.add = function(name, DataView, opts) {
                dataViews[name] = {
                    view: DataView,
                    opts: opts,
                };
            };

            this.$get = [function DataViewsFactory() {
                /**
                 * A dictionary of data view object factories.
                 */
                function DataViews(dataViews) {
                    $.extend(this, dataViews);
                }
                DataViews.prototype = {
                    constructor: DataViews,
                    /**
                     * Adds a data view object factory.
                     * 
                     * @param {string} name     The lookup name of the `DataView`.
                     * @param {DataView} DataView The `DataView` object factory to add.
                     */
                    add: function(name, DataView, opts) {
                        this[name] = {
                            view: DataView,
                            opts: opts,
                        };
                    },
                    /**
                     * Lists the available data view plugins.
                     * 
                     * @return {Array.<string>} The lookup names.
                     */
                    list: function() {
                        return Object.keys(this);
                    }
                };

                return new DataViews(dataViews);
            }];
        }
    });

define('services/DerivedAttributesProvider',[],
    function() {
        'use strict';

        return function DerivedAttributesProvider() {
            var derivedAttributes = {};

            /*
             * Adds an attribute deriving function.
             */
            this.add = function(name, deriver) {
                derivedAttributes[name] = deriver;
            };

            this.$get = [function DerivedAttributesFactory() {
                /**
                 * A dictionary of attribute deriving functions. The keys
                 * are the names of the new derived attribute, and the 
                 * functions take an existing record and return the value
                 * of the new attribute.
                 */
                function DerivedAttributes(derivedAttributes) {
                    $.extend(this, derivedAttributes);
                }
                DerivedAttributes.prototype = {
                    constructor: DerivedAttributes,
                    /*
                     * Adds an attribute deriving function.
                     */
                    add: function(name, deriver) {
                        this[name] = deriver;
                    },
                    /**
                     * Lists the derived attributes.
                     * 
                     * @return {Array.<string>} The lookup names.
                     */
                    list: function() {
                        return Object.keys(this);
                    }
                };

                return new DerivedAttributes(derivedAttributes);
            }];
        }
    });

define('services/FormattersProvider',['jquery'],
    function($) {
        'use strict';

        return function FormattersProvider() {
            var formatters = {};

            /**
             * Adds a formatter.
             * 
             * @param {string} name       The lookup name of the formatter.
             * @param {function} formatter The function which formats data.
             */
            this.add = function(name, formatter) {
                formatters[name] = formatter;
            };

            this.$get = [function FormattersFactory() {
                /**
                 * A dictionary of functions which format data.
                 */
                function Formatters(aggregators) {
                    $.extend(this, aggregators);
                }
                Formatters.prototype = {
                    constructor: Formatters,
                    /**
                     * Adds an formatter.
                     * 
                     * @param {string} name       The lookup name of the aggregate function.
                     * @param {function} aggregator The function which *generates* a function that defines how data is aggregated.
                     */
                    add: function(name, formatter) {
                        this[name] = formatter;
                    },
                    /**
                     * Lists the available formatters.
                     * 
                     * @return {Array.<string>} The lookup names.
                     */
                    list: function() {
                        return Object.keys(this);
                    }
                };

                return new Formatters(formatters);
            }];
        }
    });

define('services/RenderersProvider',['jquery'],
    function($) {
        'use strict';

        return function RenderersProvider() {
            var renderers = {};

            /**
             * Adds a renderer function.
             * 
             * @param {string} name     The lookup name of the renderer.
             * @param {function} renderer A "data visulization constructing" function.
             * @param {string} dataViewName     The name of the `dataView` used by the `renderer` function.
             * @param {object} opts     Overrides or extends the options for the `renderer`.
             * @param {function} finalize     The post rendering function for the attached and visible DOM ouput of the `renderer`. Allows users to apply other jQuery plugins to the visualization. It takes as parameters:
             *                                Parameter  | Type | Description
             *                                ---------  | ---- | -----------
             *                                `element` | jQuery | The jQuery object of the containing DOM element for the rendered visualization.
             *                                `result` | object | The object returned from the renderer.
             *                                `opts` | object | The `opts` object passed to the render function.
             */
            this.add = function(name, renderer, dataViewName, opts, finalize) {
                if (finalize === undefined || finalize === '' || finalize === null) {
                    finalize = function(element, result, opts) {};
                }
                renderers[name] = {
                    render: renderer,
                    opts: opts,
                    dataViewName: dataViewName,
                    finalize: finalize
                };
            };

            this.$get = [function RenderersFactory() {
                /**
                 * A dictionary of renderer functions.
                 */
                function Renderers(renderers) {
                    $.extend(this, renderers);
                }
                Renderers.prototype = {
                    constructor: Renderers,
                    /**
                     * Adds a renderer function.
                     * 
                     * @param {string} name     The lookup name of the renderer.
                     * @param {function} renderer A "data visulization constructing" function.
                     * @param {string} dataViewName     The name of the `dataView` used by the `renderer` function.
                     * @param {object} opts     Overrides or extends the options for the `renderer`.
                     * @param {function} finalize     The post rendering function for the attached and visible DOM ouput of the `renderer`. Allows users to apply other jQuery plugins to the visualization. It takes as parameters:
                     * Parameter  | Type | Description
                     * ---------  | ---- | -----------
                     * `element` | jQuery | The jQuery object of the containing DOM element for the rendered visualization.
                     * `result` | object | The object returned from the renderer.
                     * `opts` | object | The `opts` object passed to the render function.
                     */
                    add: function(name, renderer, dataViewName, opts, finalize) {
                        if (finalize === undefined || finalize === '' || finalize === null) {
                            finalize = function(element, result, opts) {};
                        }
                        this[name] = {
                            render: renderer,
                            opts: opts,
                            dataViewName: dataViewName,
                            finalize: finalize
                        };
                    },
                    /**
                     * Lists the available renderer plugins.
                     * 
                     * @return {Array.<string>} The lookup names.
                     */
                    list: function() {
                        return Object.keys(this);
                    }
                };

                return new Renderers(renderers);
            }];
        }
    });

define('services/RenderingEngine',['jquery', 'angular'],
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

define('services/RenderingEngines',[],
    function() {
        'use strict';

        return function(RenderingEngine) {
            /**
             * The dictionary of registered {@link RenderingEngine}'s.
             */
            function RenderingEngines() {
                this.init();
            }
            RenderingEngines.prototype = {
                constructor: RenderingEngines,
                /**
                 * Initialize.
                 */
                init: function() {
                    var self = this;
                    self.map = {};
                    // self.activeRenderingEngine = undefined;
                },
                /**
                 * The number of {@link RenderingEngine}'s in this map.
                 * 
                 * @return {number} The number of {@link RenderingEngine}'s in the map.
                 */
                size: function() {
                    return Object.keys(this.map).length;
                },
                /**
                 * Adds a {@link RenderingEngine} to the map.
                 * 
                 * @param {RenderingEngine} dataSource The {@link RenderingEngine} to add.
                 */
                add: function(renderingEngine) {
                    var self = this;
                    self.map[renderingEngine.id] = renderingEngine;
                },
                /**
                 * Deletes a {@link RenderingEngine} from the map by `id`.
                 * 
                 * @param  {string} id The UUID of the {@link RenderingEngine} to remove from the map.
                 */
                delete: function(id) {
                    var self = this;
                    delete self.map[id];
                }
            };

            return RenderingEngines;
        }
    });

define('ng-rndr',['directives/rndr',
        'services/AggregatorsProvider',
        'services/SortersProvider',
        'services/DataViewsProvider',
        'services/DerivedAttributesProvider',
        'services/FormattersProvider',
        'services/RenderersProvider',
        'services/RenderingEngine',
        'services/RenderingEngines'
    ],
    function(rndr,
        AggregatorsProvider,
        SortersProvider,
        DataViewsProvider,
        DerivedAttributesProvider,
        FormattersProvider,
        RenderersProvider,
        RenderingEngine,
        RenderingEngines) {

        // Create module
        var app = angular.module('ngRndr', []);

        // Annotate module dependencies
        rndr.$inject = [];
        AggregatorsProvider.$inject = [];
        SortersProvider.$inject = [];
        DerivedAttributesProvider.$inject = [];
        DataViewsProvider.$inject = [];
        RenderersProvider.$inject = [];
        RenderingEngine.$inject = ['$ngRndrAggregators', '$ngRndrRenderers', '$ngRndrDerivedAttributes', '$ngRndrSorters', '$ngRndrFormatters', '$ngRndrDataViews', '$timeout', '$rootScope'];
        RenderingEngines.$inject = ['$ngRndrRenderingEngine'];

        // Module providers
        app.provider('$ngRndrRenderers', RenderersProvider);
        app.provider('$ngRndrDataViews', DataViewsProvider);
        app.provider('$ngRndrAggregators', AggregatorsProvider);
        app.provider('$ngRndrSorters', SortersProvider);
        app.provider('$ngRndrDerivedAttributes', DerivedAttributesProvider);
        app.provider('$ngRndrFormatters', FormattersProvider);

        // Module directives
        app.directive('rndr', rndr);

        // Module services
        app.service('$ngRndrRenderingEngine', RenderingEngine);
        app.service('$ngRndrRenderingEngines', RenderingEngines);
    });

	
	// Define a 'jquery' model to allow ng-rndr to support a user configured jquery version.
	define('jquery', [], function() {
        'use strict';

        return $;
    });

    // Define an 'angular' model to allow ng-rndr to support a user configured angular version.
    define('angular', [], function() {
        'use strict';

        return angular;
    });

	// Use almond's special top level synchronous require to trigger factory
	// functions, get the final module, and export it as the public api.
	return require('ng-rndr');
}));