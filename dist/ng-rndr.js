(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'angular'], factory);
  } else if (typeof exports === 'object' && typeof module === "object") {
    module.exports = factory(root.$, root.angular);
  } else {
    root.ngRNDR = factory(root.$, root.angular);
    root.ngRNDR.plugins = {};
  }
}(this, function () {/**
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

define('directives/rndr',[], function() {
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

define('services/aggregators',[], function() {
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

define('services/aggregatorTemplates',[], function() {
    'use strict';

    return function(dataUtils) {
        /**
         * {@link AggregatorTemplates} constructor.
         */
        function AggregatorTemplates() {}
        AggregatorTemplates.prototype = {
            /**
             * @typedef AggregatorTemplates
             * @type {object}
             */
            constructor: AggregatorTemplates,
            count: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmtInt;
                }
                return function() {
                    return function(data, rowKey, colKey) {
                        return {
                            count: 0,
                            push: function() {
                                return this.count++;
                            },
                            value: function() {
                                return this.count;
                            },
                            format: formatter
                        };
                    };
                };
            },
            countUnique: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmtInt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            uniq: [],
                            push: function(record) {
                                var ref;
                                if (ref = record[attr], this.uniq.indexOf(ref) < 0) {
                                    return this.uniq.push(record[attr]);
                                }
                            },
                            value: function() {
                                return this.uniq.length;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            listUnique: function(sep) {
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            uniq: [],
                            push: function(record) {
                                var ref;
                                if (ref = record[attr], this.uniq.indexOf(ref) < 0) {
                                    return this.uniq.push(record[attr]);
                                }
                            },
                            value: function() {
                                return this.uniq.join(sep);
                            },
                            format: function(x) {
                                return x;
                            },
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            sum: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            sum: 0,
                            push: function(record) {
                                if (!isNaN(parseFloat(record[attr]))) {
                                    return this.sum += parseFloat(record[attr]);
                                }
                            },
                            value: function() {
                                return this.sum;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            min: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            val: null,
                            push: function(record) {
                                var ref, x;
                                x = parseFloat(record[attr]);
                                if (!isNaN(x)) {
                                    return this.val = Math.min(x, (ref = this.val) != null ? ref : x);
                                }
                            },
                            value: function() {
                                return this.val;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            max: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            val: null,
                            push: function(record) {
                                var ref, x;
                                x = parseFloat(record[attr]);
                                if (!isNaN(x)) {
                                    return this.val = Math.max(x, (ref = this.val) != null ? ref : x);
                                }
                            },
                            value: function() {
                                return this.val;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            average: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
                }
                return function(arg) {
                    var attr;
                    attr = arg[0];
                    return function(data, rowKey, colKey) {
                        return {
                            sum: 0,
                            len: 0,
                            push: function(record) {
                                if (!isNaN(parseFloat(record[attr]))) {
                                    this.sum += parseFloat(record[attr]);
                                    return this.len++;
                                }
                            },
                            value: function() {
                                return this.sum / this.len;
                            },
                            format: formatter,
                            numInputs: attr != null ? 0 : 1
                        };
                    };
                };
            },
            sumOverSum: function(formatter) {
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
                }
                return function(arg) {
                    var denom, num;
                    num = arg[0], denom = arg[1];
                    return function(data, rowKey, colKey) {
                        return {
                            sumNum: 0,
                            sumDenom: 0,
                            push: function(record) {
                                if (!isNaN(parseFloat(record[num]))) {
                                    this.sumNum += parseFloat(record[num]);
                                }
                                if (!isNaN(parseFloat(record[denom]))) {
                                    return this.sumDenom += parseFloat(record[denom]);
                                }
                            },
                            value: function() {
                                return this.sumNum / this.sumDenom;
                            },
                            format: formatter,
                            numInputs: (num != null) && (denom != null) ? 0 : 2
                        };
                    };
                };
            },
            sumOverSumBound80: function(upper, formatter) {
                if (upper == null) {
                    upper = true;
                }
                if (formatter == null) {
                    formatter = dataUtils.usFmt;
                }
                return function(arg) {
                    var denom, num;
                    num = arg[0], denom = arg[1];
                    return function(data, rowKey, colKey) {
                        return {
                            sumNum: 0,
                            sumDenom: 0,
                            push: function(record) {
                                if (!isNaN(parseFloat(record[num]))) {
                                    this.sumNum += parseFloat(record[num]);
                                }
                                if (!isNaN(parseFloat(record[denom]))) {
                                    return this.sumDenom += parseFloat(record[denom]);
                                }
                            },
                            value: function() {
                                var sign;
                                sign = upper ? 1 : -1;
                                return (0.821187207574908 / this.sumDenom + this.sumNum / this.sumDenom + 1.2815515655446004 * sign * Math.sqrt(0.410593603787454 / (this.sumDenom * this.sumDenom) + (this.sumNum * (1 - this.sumNum / this.sumDenom)) / (this.sumDenom * this.sumDenom))) / (1 + 1.642374415149816 / this.sumDenom);
                            },
                            format: formatter,
                            numInputs: (num != null) && (denom != null) ? 0 : 2
                        };
                    };
                };
            },
            fractionOf: function(wrapped, type, formatter) {
                if (type == null) {
                    type = 'total';
                }
                if (formatter == null) {
                    formatter = dataUtils.usFmtPct;
                }
                return function() {
                    var x;
                    x = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                    return function(data, rowKey, colKey) {
                        return {
                            selector: {
                                total: [
                                    [],
                                    []
                                ],
                                row: [rowKey, []],
                                col: [
                                    [], colKey
                                ]
                            }[type],
                            inner: wrapped.apply(null, x)(data, rowKey, colKey),
                            push: function(record) {
                                return this.inner.push(record);
                            },
                            format: formatter,
                            value: function() {
                                return this.inner.value() / data.getAggregator.apply(data, this.selector).inner.value();
                            },
                            numInputs: wrapped.apply(null, x)().numInputs
                        };
                    };
                };
            },
            /**
             * Adds an aggregatorTemplate function by `name` for fast lookup.
             * 
             * @param {string} name       The lookup name of the aggregateTemplate function.
             * @param {function} aggregator The aggregatorTemplate function.
             */
            add: function(name, aggregatorTemplate) {
                this[name] = aggregatorTemplate;
            },
            /**
             * Lists the available aggregatorTemplate plugins.
             * 
             * @return {Array.<string>} The lookup names.
             */
            list: function() {
                return Object.keys(this);
            }
        };

        return new AggregatorTemplates();
    }
});

define('services/dataViews',[],
    function() {
        'use strict';

        return function() {
            /**
             * {@link DataViews} constructor.
             */
            function DataViews() {}
            DataViews.prototype = {
                /**
                 * @typedef DataViews
                 * @type {object}
                 */
                constructor: DataViews,
                /**
                 * Adds a named `DataView` factory to the `DataViews` singleton with the defined `meta`.
                 * 
                 * @param {string} name     The lookup name of the `DataView`.
                 * @param {DataView} DataView Need to figure out how to document the return type of a {@link DataView}
                 * @param {function} meta     A function that returns the initial metadata model for the `DataView`.
                 */
                add: function(name, DataView, getMeta) {
                    this[name] = {
                        view: DataView,
                        meta: getMeta
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

            return new DataViews();
        }
    });

define('services/derivers',[], function() {
    'use strict';

    return function(dataUtils) {
        /**
         * {@link Derivers} constructor.
         */
        function Derivers() {}
        Derivers.prototype = {
            /**
             * @typedef Derivers
             * @type {object}
             */
            constructor: Derivers,
            bin: function(col, binWidth) {
                return function(record) {
                    return record[col] - record[col] % binWidth;
                };
            },
            dateFormat: function(col, formatString, utcOutput, mthNames, dayNames) {
                var utc;
                if (utcOutput == null) {
                    utcOutput = false;
                }
                if (mthNames == null) {
                    mthNames = dataUtils.mthNamesEn;
                }
                if (dayNames == null) {
                    dayNames = dataUtils.dayNamesEn;
                }
                utc = utcOutput ? "UTC" : "";
                return function(record) {
                    var date;
                    date = new Date(Date.parse(record[col]));
                    if (isNaN(date)) {
                        return "";
                    }
                    return formatString.replace(/%(.)/g, function(m, p) {
                        switch (p) {
                            case "y":
                                return date["get" + utc + "FullYear"]();
                            case "m":
                                return dataUtils.zeroPad(date["get" + utc + "Month"]() + 1);
                            case "n":
                                return mthNames[date["get" + utc + "Month"]()];
                            case "d":
                                return dataUtils.zeroPad(date["get" + utc + "Date"]());
                            case "w":
                                return dayNames[date["get" + utc + "Day"]()];
                            case "x":
                                return date["get" + utc + "Day"]();
                            case "H":
                                return dataUtils.zeroPad(date["get" + utc + "Hours"]());
                            case "M":
                                return dataUtils.zeroPad(date["get" + utc + "Minutes"]());
                            case "S":
                                return dataUtils.zeroPad(date["get" + utc + "Seconds"]());
                            default:
                                return "%" + p;
                        }
                    });
                };
            },
            /**
             * Adds a deriver generator function by `name` for fast lookup.
             * 
             * @param {string} name       The lookup name of the deriver function.
             * @param {function} deriverGenerator The deriver generator function.
             */
            add: function(name, deriverGenerator) {
                this[name] = deriverGenerator;
            },
            /**
             * Lists the available deriver plugins.
             * 
             * @return {Array.<string>} The lookup names.
             */
            list: function() {
                return Object.keys(this);
            }
        };

        return new Derivers();
    }
});

define('services/renderers',[],
    function() {
        'use strict';

        return function() {
            /**
             * Renderers constructor
             * @type {Renderers}
             */
            function Renderers() {}
            Renderers.prototype = {
                /**
                 * @typedef Renderers
                 * @type {object}
                 * @property {string} id - The UUID for this data source configuration.
                 * @property {string} flattenDataFunctionString - The code .
                 * @property {object} httpConfig - Angular http config: https://docs.angularjs.org/api/ng/service/$http#usage.
                 * @property {string} name - The human readable name for this data source configuration.
                 */
                constructor: Renderers,
                /**
                 * Adds a {@link Renderer} function by `name` for fast lookup.
                 * 
                 * @param {string} name     The lookup name of the renderer.
                 * @param {function} renderer A `renderer` is a function that defines what the user will actually see. It takes as parameters a `dataView` object defined by thie `dataViewName` and the `opts` object and returns an object.
                 * @param {string} dataViewName     The name of the `dataView` to be passed to the `renderer` function.
                 * @param {object} opts     The options to be passed to the `renderer` function.
                 * @param {function} finalize     The post rendering function defined for a particular visualization. It takes as parameters a `jQuery` object (which will be the "visualization" and injected into the DOM) and the `results` object returned by the `renderer` function.
                 */
                add: function(name, renderer, dataViewName, opts, finalize) {
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

            return new Renderers();
        }
    });

define('services/RenderingEngine',[], function() {
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

                if (this.dataView !== undefined) {
                    this.draw();
                }
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

                if (this.dataView !== undefined) {
                    this.draw();
                }
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

define('services/RenderingEngines',[], function() {
    'use strict';

    return function(RenderingEngine, dataSourceConfigurations, map, $http) {
        /**
         * {@link RenderingEngines} constructor.
         */
        function RenderingEngines() {
            this.init();
        }
        RenderingEngines.prototype = {
            /**
             * @typedef RenderingEngines
             * @type {object}
             * @property {object} map - The map of registered {@link RenderingEngine}'s.
             * @property {string} activeRenderingEngine - The UUID of the active {@link RenderingEngine}.
             */
            constructor: RenderingEngines,
            /**
             * Initialize the {@link RenderingEngines}.
             */
            init: function() {
                var self = this;
                self.map = {};
                self.activeRenderingEngine = undefined;
            },
            /**
             * Instantiates a {@link RenderingEngine} and adds it to the map.
             * 
             * @param {string} rendererName - The name of the renderer plugin.
             * @param  {string} [renderingEngineId]         The UUID of the {@link RenderingEngine}
             * @param  {string} [title]                     The title of the {@link RenderingEngine}
             * 
             * @return {object}      The {@link DataSource}.
             */
            create: function(rendererName, title, renderingEngineId, aggregatorName) {
                var self = this;
                var renderingEngine = new RenderingEngine(rendererName, title, renderingEngineId, aggregatorName);
                self.add(renderingEngine);
                //There may be an active rendering engine, if so deactivate
                if (self.activeRenderingEngine !== undefined) {
                    self.map[self.activeRenderingEngine].active = false;
                }
                self.activeRenderingEngine = renderingEngine.id;
                return renderingEngine;
            },
            /**
             * The size of the map.
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

define('services/dataUtils',[], function() {
    'use strict';

    return function() {
        /**
         * {@link DataUtils} constructor.
         */
        function DataUtils() {}
        DataUtils.prototype = {
            /**
             * @typedef DataUtils
             * @type {object}
             */
            constructor: DataUtils,
            hasProp: {}.hasOwnProperty,
            indexOf: [].indexOf || function(item) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (i in this && this[i] === item) return i;
                }
                return -1;
            },
            generateUUID: function() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                })
            },
            convertToArray: function(input) {
                var result;
                var self = this;
                result = [];
                self.forEachRecord(input, {}, function(record) {
                    return result.push(record);
                });
                return result;
            },
            bind: function(fn, me) {
                return function() {
                    return fn.apply(me, arguments);
                };
            },
            zeroPad: function(number) {
              return ("0" + number).substr(-2, 2);
            },
            mthNamesEn: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNamesEn: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            forEachRecord: function(input, derivedAttributes, f) {
                var self = this;
                var addRecord, compactRecord, i, j, k, l, len1, record, ref, results, results1, tblCols;
                if ($.isEmptyObject(derivedAttributes)) {
                    addRecord = f;
                } else {
                    addRecord = function(record) {
                        var k, ref, v;
                        for (k in derivedAttributes) {
                            v = derivedAttributes[k];
                            record[k] = (ref = v(record)) != null ? ref : record[k];
                        }
                        return f(record);
                    };
                }
                if ($.isFunction(input)) {
                    return input(addRecord);
                } else if ($.isArray(input)) {
                    if ($.isArray(input[0])) {
                        results = [];
                        for (i in input) {
                            if (!self.hasProp.call(input, i)) continue;
                            compactRecord = input[i];
                            if (!(i > 0)) {
                                continue;
                            }
                            record = {};
                            ref = input[0];
                            for (j in ref) {
                                if (!self.hasProp.call(ref, j)) continue;
                                k = ref[j];
                                record[k] = compactRecord[j];
                            }
                            results.push(addRecord(record));
                        }
                        return results;
                    } else {
                        results1 = [];
                        for (l = 0, len1 = input.length; l < len1; l++) {
                            record = input[l];
                            results1.push(addRecord(record));
                        }
                        return results1;
                    }
                } else if (input instanceof jQuery) {
                    tblCols = [];
                    $('thead > tr > th', input).each(function(i) {
                        return tblCols.push($(this).text());
                    });
                    return $('tbody > tr', input).each(function(i) {
                        record = {};
                        $('td', this).each(function(j) {
                            return record[tblCols[j]] = $(this).html();
                        });
                        return addRecord(record);
                    });
                } else {
                    throw new Error('unknown input format');
                }
            },
            addSeparators: function(nStr, thousandsSep, decimalSep) {
                var rgx, x, x1, x2;
                nStr += '';
                x = nStr.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? decimalSep + x[1] : '';
                rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + thousandsSep + '$2');
                }
                return x1 + x2;
            },
            numberFormat: function(opts) {
                var self = this;
                var defaults;
                defaults = {
                    digitsAfterDecimal: 2,
                    scaler: 1,
                    thousandsSep: ',',
                    decimalSep: '.',
                    prefix: '',
                    suffix: '',
                    showZero: false
                };
                opts = $.extend(defaults, opts);
                return function(x) {
                    var result;
                    if (isNaN(x) || !isFinite(x)) {
                        return '';
                    }
                    if (x === 0 && !opts.showZero) {
                        return '';
                    }
                    result = self.addSeparators((opts.scaler * x).toFixed(opts.digitsAfterDecimal), opts.thousandsSep, opts.decimalSep);
                    return '' + opts.prefix + result + opts.suffix;
                };
            },
            sortAs: function(order) {
                var self = this;
                var i, mapping, x;
                mapping = {};
                for (i in order) {
                    x = order[i];
                    mapping[x] = i;
                }
                return function(a, b) {
                    if ((mapping[a] != null) && (mapping[b] != null)) {
                        return mapping[a] - mapping[b];
                    } else if (mapping[a] != null) {
                        return -1;
                    } else if (mapping[b] != null) {
                        return 1;
                    } else {
                        return self.naturalSort(a, b);
                    }
                };
            },
            naturalSort: function(as, bs) {
                var a, a1, b, b1, rd, rx, rz;
                rx = /(\d+)|(\D+)/g;
                rd = /\d/;
                rz = /^0/;
                if (typeof as === 'number' || typeof bs === 'number') {
                    if (isNaN(as)) {
                        return 1;
                    }
                    if (isNaN(bs)) {
                        return -1;
                    }
                    return as - bs;
                }
                a = String(as).toLowerCase();
                b = String(bs).toLowerCase();
                if (a === b) {
                    return 0;
                }
                if (!(rd.test(a) && rd.test(b))) {
                    return (a > b ? 1 : -1);
                }
                a = a.match(rx);
                b = b.match(rx);
                while (a.length && b.length) {
                    a1 = a.shift();
                    b1 = b.shift();
                    if (a1 !== b1) {
                        if (rd.test(a1) && rd.test(b1)) {
                            return a1.replace(rz, '.0') - b1.replace(rz, '.0');
                        } else {
                            return (a1 > b1 ? 1 : -1);
                        }
                    }
                }
                return a.length - b.length;
            },
            getSort: function(sorters, attr) {
                var sort;
                var self = this;
                sort = sorters(attr);
                if ($.isFunction(sort)) {
                    return sort;
                } else {
                    return self.naturalSort;
                }
            },
            usFmt: function() {
                var self = this;
                return self.numberFormat();
            },
            usFmtInt: function() {
                var self = this;
                return self.numberFormat({
                    digitsAfterDecimal: 0
                });
            },
            usFmtPct: function() {
                var self = this;
                return self.numberFormat({
                    digitsAfterDecimal: 1,
                    scaler: 100,
                    suffix: '%'
                });
            },
            /**
             * Adds a dataUtil function by `name` for fast lookup.
             * 
             * @param {string} name       The lookup name of the dataUtil function.
             * @param {function} dataUtil The dataUtil function.
             */
            add: function(name, dataUtil) {
                this[name] = dataUtil;
            },
            /**
             * Lists the available dataUtil plugins.
             * 
             * @return {Array.<string>} The lookup names.
             */
            list: function() {
                return Object.keys(this);
            }
        };

        return new DataUtils();
    }
});

define('services/DataSourceConfiguration',[], function() {
    'use strict';

    return function(dataUtils) {
        /**
         * {@link DataSourceConfiguration} constructor.
         * 
         * @param {string} name       The human readable name for this data source configuration.
         * @param {Object} httpConfig Angular http config: https://docs.angularjs.org/api/ng/service/$http#usage.
         */
        function DataSourceConfiguration(name, httpConfig) {
            this.id = dataUtils.generateUUID();
            this.flattenDataFunctionString = 'return data;';
            this.httpConfig = httpConfig;
            this.name = name;
        }
        DataSourceConfiguration.prototype = {
            /**
             * @typedef DataSourceConfiguration
             * @type {object}
             * @property {string} id - The UUID for this data source configuration.
             * @property {string} flattenDataFunctionString - The code .
             * @property {object} httpConfig - Angular http config: https://docs.angularjs.org/api/ng/service/$http#usage.
             * @property {string} name - The human readable name for this data source configuration.
             */
            constructor: DataSourceConfiguration
        };
        return DataSourceConfiguration;
    }
});

define('services/dataSourceConfigurations',[], function() {
    'use strict';

    return function(DataSourceConfiguration) {
        /**
         * {@link DataSourceConfigurations} constructor.
         */
        function DataSourceConfigurations() {
            this.init();
        }
        DataSourceConfigurations.prototype = {
            /**
             * @typedef DataSourceConfigurations
             * @type {object}
             * @property {object} map - The map of registered {@link DataSourceConfiguration}'s.
             * @property {string} activeDataSourceConfiguration - The UUID of the active {@link DataSourceConfiguration}.
             */
            constructor: DataSourceConfigurations,
            /**
             * Initialize the {@link DataSourceConfigurations}.
             */
            init: function() {
                var self = this;
                self.map = {};
                self.activeDataSourceConfiguration = undefined;
            },
            /**
             * Instantiates a {@link DataSourceConfiguration} and adds it to the manager by `name` for fast lookups.
             * 
             * @param  {string} name The name of the {@link DataSourceConfiguration}.
             * @param  {Object} httpConfig The configuration for a REST endpoint.
             * 
             * @return {string}      The UUID of the created `DataSourceConfiguration`.
             */
            create: function(name, httpConfig) {
                var self = this;
                var dataSourceConfiguration = new DataSourceConfiguration(name, httpConfig);
                self.add(dataSourceConfiguration);
                self.activeDataSourceConfiguration = dataSourceConfiguration.id;
                return dataSourceConfiguration.id;
            },
            /**
             * The size of the manager.
             * 
             * @return {number} The number of {@link DataSourceConfiguration}'s in the manager.
             */
            size: function() {
                return Object.keys(this.map).length;
            },
            /**
             * Adds a {@link DataSourceConfiguration} to the manager.
             * 
             * @param {DataSourceConfiguration} dataSourceConfiguration The {@link DataSourceConfiguration} to add.
             */
            add: function(dataSourceConfiguration) {
                var self = this;
                self.map[dataSourceConfiguration.id] = dataSourceConfiguration;
            },
            /**
             * Deletes a {@link DataSourceConfiguration} from the manager by `id`.
             * 
             * @param  {string} id The UUID of the {@link DataSourceConfiguration} to remove from the manager.
             */
            delete: function(id) {
                var self = this;
                delete self.map[id];
            }
        };

        return new DataSourceConfigurations();
    }
});

define('services/DataSource',[], function() {
    'use strict';

    return function(dataSourceConfigurations, $q, $rootScope, $http) {
        /**
         * {@link DataSource} constructor.
         * 
         * @param {string} dataSourceConfigId The UUID of the data source configuration.
         * @param {[type]} name               The human readable name for this data source.
         */
        function DataSource(dataSourceConfigId, name) {
            this.dataSourceConfigId = dataSourceConfigId;
            this.data;
            this.name = name;
            this.formattedData;
        }
        DataSource.prototype = {
            /**
             * @typedef DataSource
             * @type {object}
             * @property {string} dataSourceConfigId - The UUID for this data source configuration.
             * @property {string} data - The raw data returned from the configured REST endpoint.
             * @property {object} formattedData - The transformed data returned from the configured REST endpoint.
             * @property {string} name - The human readable name for this data source.
             */
            constructor: DataSource,
            /**
             * Refreshes the data source.
             */
            refresh: function() {
                var promises = [this.acquire(this)];
                $q.all(promises).then(function() {
                    this.format(this);
                });
            },
            /**
             * Acquires data from the configured REST endpoint.
             */
            acquire: function() {
                $rootScope.$emit('dataSource:acquire:begin');
                var self = this;
                var deffered = $q.defer();
                $http(angular.fromJson(dataSourceConfigurations.map[this.dataSourceConfigId].httpConfig)).then(function successCallback(response) {
                    if (typeof response.data !== "string") {
                        self.data = JSON.stringify(response.data);
                    } else {
                        self.data = response.data;
                    }
                    deffered.resolve();
                    $rootScope.$emit('dataSource:acquire:success');
                }, function errorCallback(response) {
                    deffered.reject();
                    $rootScope.$emit('dataSource:acquire:error');
                });
                return deffered.promise;
            },
            /**
             * Formats the raw data.
             */
            format: function() {
                var flatten = new Function("data", dataSourceConfigurations.map[this.dataSourceConfigId].flattenDataFunctionString);
                try {
                    this.formattedData = angular.toJson(flatten(angular.fromJson(this.data)));
                } catch (e) {
                    try {
                        this.formattedData = flatten(this.data);
                    } catch (_error) {
                        if (typeof console !== "undefined" && console !== null) {
                            console.error(_error.stack);
                        }
                    }
                }
                try {
                    this.formattedData = angular.fromJson(this.formattedData);
                } catch (e) {
                    try {
                        this.formattedData = $.csv.toArrays(this.formattedData);
                    } catch (_error) {
                        if (typeof console !== "undefined" && console !== null) {
                            console.error(_error.stack);
                        }
                    }
                }
            }
        };
        return DataSource;
    }
});

define('services/dataSources',[], function() {
    'use strict';

    return function(DataSource) {
        /**
         * {@link DataSources} constructor.
         */
        function DataSources() {
            this.init();
        }
        DataSources.prototype = {
            /**
             * @typedef DataSources
             * @type {object}
             * @property {object} map - The map of registered {@link DataSource}'s.
             */
            constructor: DataSources,
            init: function() {
                var self = this;
                self.map = {};
            },
            /**
             * Instantiates a {@link DataSource} and adds it to the manager by `name` for fast lookups.
             * 
             * @param  {string} dataSourceConfigurationId The UUID of the {@link DataSourceConfiguration} reference by the instaniated {@link DataSource}.
             * @param  {string} name The name of the {@link DataSource}.
             * 
             * @return {object}      The {@link DataSource}.
             */
            create: function(dataSourceConfigurationId, name) {
                var self = this;
                if (dataSourceConfigurationId !== undefined) {
                    var dataSource = new DataSource(dataSourceConfigurationId, name);
                    self.add(dataSource);
                    return dataSource;
                }
            },
            /**
             * Adds a {@link DataSource} to the manager.
             * 
             * @param {DataSource} dataSource The {@link DataSource} to add.
             */
            add: function(dataSource) {
                var self = this;
                self.map[dataSource.dataSourceConfigId] = dataSource;
            },
            /**
             * Deletes a {@link DataSource} from the manager by `id`.
             * 
             * @param  {string} id The UUID of the {@link DataSource} to remove from the manager.
             */
            delete: function(dataSourceConfigId) {
                var self = this;
                delete self.map[dataSourceConfigId];
            },
            /**
             * Refreshes the data.
             */
            refresh: function() {
                angular.forEach(this.map, function(dataSource) {
                    dataSource.refresh();
                });
            }
        };

        return new DataSources();
    }
});

define('ng-rndr',['directives/rndr',
        'services/aggregators',
        'services/aggregatorTemplates',
        'services/dataViews',
        'services/derivers',
        'services/renderers',
        'services/RenderingEngine',
        'services/RenderingEngines',
        'services/dataUtils',
        'services/DataSourceConfiguration',
        'services/dataSourceConfigurations',
        'services/DataSource',
        'services/dataSources'
    ],
    function(rndr,
        aggregators,
        aggregatorTemplates,
        dataViews,
        derivers,
        renderers,
        RenderingEngine,
        RenderingEngines,
        dataUtils,
        DataSourceConfiguration,
        dataSourceConfigurations,
        DataSource,
        dataSources) {

        // Create module
        var app = angular.module('ngRndr', []);

        // Annotate module dependencies
        rndr.$inject = [];
        DataSourceConfiguration.$inject = ['ngRndr.dataUtils'];
        dataSourceConfigurations.$inject = ['ngRndr.DataSourceConfiguration'];
        DataSource.$inject = ['ngRndr.dataSourceConfigurations', '$q', '$rootScope', '$http'];
        dataSources.$inject = ['ngRndr.DataSource'];
        aggregators.$inject = ['ngRndr.aggregatorTemplates', 'ngRndr.dataUtils'];
        derivers.$inject = ['ngRndr.dataUtils'];
        aggregatorTemplates.$inject = ['ngRndr.dataUtils'];
        dataViews.$inject = [];
        renderers.$inject = [];
        RenderingEngine.$inject = ['ngRndr.aggregators', 'ngRndr.dataUtils', 'ngRndr.renderers', 'ngRndr.dataViews', '$timeout', '$rootScope'];
        RenderingEngines.$inject = ['ngRndr.RenderingEngine', 'ngRndr.dataSourceConfigurations', 'ngRndr.dataSources', '$http'];
        dataUtils.$inject = [];

        // Module directives
        app.directive('rndr', rndr);

        // Module services
        app.service('ngRndr.DataSourceConfiguration', DataSourceConfiguration);
        app.service('ngRndr.dataSourceConfigurations', dataSourceConfigurations);
        app.service('ngRndr.DataSource', DataSource);
        app.service('ngRndr.dataSources', dataSources);
        app.service('ngRndr.aggregators', aggregators);
        app.service('ngRndr.aggregatorTemplates', aggregatorTemplates);
        app.service('ngRndr.derivers', derivers);
        app.service('ngRndr.dataViews', dataViews);
        app.service('ngRndr.renderers', renderers);
        app.service('ngRndr.RenderingEngine', RenderingEngine);
        app.service('ngRndr.RenderingEngines', RenderingEngines);
        app.service('ngRndr.dataUtils', dataUtils);
    });

	// Use almond's special top level synchronous require to trigger factory
	// functions, get the final module, and export it as the public api.
	return require('ng-rndr');
}));