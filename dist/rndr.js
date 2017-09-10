(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
  	define('rndr', ['jquery'], function($) {
            return factory(root, $);
        });
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory(root, require('jquery'));
  } else {
    return factory(root, root.$);
  }
}(this, function (root, $) {
	root.rndr = {
		templates: {},
		plugins: {}
	};/**
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

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrDataViews', ['jquery'], function($) {
            return (root.rndr.plugins.dataViews = factory(root, $));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.dataViews = factory());
    } else {
        root.rndr.plugins.dataViews = factory();
    }
}(this, function(root, $) {
    /**
     * A dictionary of data view object factories.
     */
    function DataViews() {}
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
            return this[name];
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

    return root.rndr.plugins.dataViews = $.extend(root.rndr.plugins.dataViews, new DataViews());
}));

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrSortersTemplates', [], function() {
            return (root.rndr.templates.sorters = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.templates.sorters = factory());
    } else {
        root.rndr.templates.sorters = factory();
    }
}(this, function() {
    var naturalSort = function(as, bs) {
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
    };

    /**
     * A dictionary of 'data sorting' functions.
     */
    function SortersTemplates() {}
    SortersTemplates.prototype = {
        constructor: SortersTemplates,
        /**
         * Adds a helper function used to create data sorters.
         * 
         * @param {string} name       The lookup name of the helper function.
         * @param {function} helper The helper function used to create data sorters.
         */
        add: function(name, helper) {
            this[name] = helper;
        },
        /**
         * Lists the available helper functions.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        },
        /**
         * A helper function used to generate a function that defines the order of (available) values for a given attribute.
         * 
         * @param  {array} order An array of strings that define the order of the values for an attribute.
         * @return {function}    A data sorting function.
         */
        sortAs: function(order) {
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
                    return naturalSort(a, b);
                }
            };
        },
        /**
         * Ascending sorting function.
         */
        sortAscending: function(a,b) { 
            return a-b; 
        },
        /**
         * Descending sorting function.
         */
        sortDescending: function(a,b) { 
            return b-a; 
        }
    };

    var $rndrSorterTemplates = new SortersTemplates();

    return $rndrSorterTemplates;
}));

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrSorters', ['$rndrSortersTemplates'], function($rndrSorterTemplates) {
            return (root.rndr.plugins.sorters = factory($rndrSorterTemplates));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.sorters = factory(require('$rndrSorterTemplates')));
    } else {
        root.rndr.plugins.sorters = factory(root.rndr.templates.sorters);
    }
}(this, function($rndrSorterTemplates) {
    function Sorters() {}
    Sorters.prototype = {
        constructor: Sorters,
        /**
         * Adds a sorter function.
         * 
         * @param {string} name         The name of the data attribute for which the `sorter` function will be applied.
         * @param {function} sorter     The function which sorts the values of a data attribute.
         */
        add: function(name, sorter) {
            this[name] = sorter;
        },
        /**
         * Lists the available sorters.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        }
    };

    var $rndrSorters = new Sorters();

    return $rndrSorters;
}));

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrDeriverTemplates', [], function() {
            return (root.rndr.templates.derivers = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.templates.derivers = factory());
    } else {
        root.rndr.templates.derivers = factory();
    }
}(this, function() {
    /**
     * Removes padding from a number.
     * 
     * @param  {number} number The number to zero pad.
     * @return {string}        The zero pad string representation of the `number`.
     */
    var zeroPad = function(number) {
        return ('0' + number).substr(-2, 2);
    };

    /**
     * A dictionary of 'deriver generator' functions: the keys are the names of the new attributes, and the functions take an existing record and return the value of the new attribute.
     */
    function DeriverTemplates() {}
    DeriverTemplates.prototype = {
        constructor: DeriverTemplates,
        /**
         * Adds a deriver function.
         * 
         * @param {string} name       The lookup name of the deriver function.
         * @param {function} deriver The function which *derives* an attribute.
         */
        add: function(name, deriver) {
            this[name] = deriver;
        },
        /**
         * Lists the available `attribute deriving` functions.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        },
        /**
         * Generates a function that performs a 'binning' of high-cardinality attributes into a lower-cardinality bucket.
         * @param  {string} col      The column name.
         * @param  {number} binWidth The width of the bin.
         * @return {function}        A function that takes an existing record and returns the value of the new attribute.
         */
        bin: function(col, binWidth) {
            return function(record) {
                return record[col] - record[col] % binWidth;
            };
        },
        /**
         * Generates a function that performs a 'binning' of  date or date-time values by day, hour, minute, week, month etc.
         * 
         * @param  {string} col      The column name.
         * @param  {string} formatString The date format. Interpolates as follows:
         *                               **%y**: date.getFullYear()
         *                               **%m**: zeroPad(date.getMonth()+1)
         *                               **%n**: mthNames[date.getMonth()]
         *                               **%d**: zeroPad(date.getDate())
         *                               **%w**: dayNames[date.getDay()]
         *                               **%x**: date.getDay()
         *                               **%H**: zeroPad(date.getHours())
         *                               **%M**: zeroPad(date.getMinutes())
         *                               **%S**: zeroPad(date.getSeconds())
         * @param  {boolean} utcOutput   Determines whether or not to display the string 'UTC' in the output
         * @param  {object} mthNames     A dictionary of month names (where the string name of the month is the key)
         * @param  {object} dayNames     A dictionary of day name (where the string name of the day is the key)
         * @return {function}            A function that takes an existing record and returns the value of the new attribute.
         */
        dateFormat: function(col, formatString, utcOutput, mthNames, dayNames) {
            var utc;
            if (utcOutput == null) {
                utcOutput = false;
            }
            if (mthNames == null) {
                mthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            }
            if (dayNames == null) {
                dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            }
            utc = utcOutput ? 'UTC' : '';
            return function(record) {
                var date;
                date = new Date(Date.parse(record[col]));
                if (isNaN(date)) {
                    return '';
                }
                return formatString.replace(/%(.)/g, function(m, p) {
                    switch (p) {
                        case 'y':
                            return date['get' + utc + 'FullYear']();
                        case 'm':
                            return zeroPad(date['get' + utc + 'Month']() + 1);
                        case 'n':
                            return mthNames[date['get' + utc + 'Month']()];
                        case 'd':
                            return zeroPad(date['get' + utc + 'Date']());
                        case 'w':
                            return dayNames[date['get' + utc + 'Day']()];
                        case 'x':
                            return date['get' + utc + 'Day']();
                        case 'H':
                            return zeroPad(date['get' + utc + 'Hours']());
                        case 'M':
                            return zeroPad(date['get' + utc + 'Minutes']());
                        case 'S':
                            return zeroPad(date['get' + utc + 'Seconds']());
                        default:
                            return '%' + p;
                    }
                });
            };
        }
    };

    var $rndrDeriverTemplates = new DeriverTemplates();

    return $rndrDeriverTemplates;
}));

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrDerivedAttributes', ['$rndrDeriverTemplates'], function($rndrDeriverTemplates) {
            return (root.rndr.plugins.derivedAttributes = factory($rndrDeriverTemplates));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.derivedAttributes = factory(require('$rndrDeriverTemplates')));
    } else {
        root.rndr.plugins.derivedAttributes = factory(root.rndr.templates.derivers);
    }
}(this, function($rndrDeriverTemplates) {
    function DerivedAttributes() {}
    DerivedAttributes.prototype = {
        constructor: DerivedAttributes,
        /**
         * Adds a data attribute deriving function.
         * 
         * @param {string} name    The 
         * @param {[type]} deriver The name of the new data attribute created by the `deriver` function.
         */
        add: function(name, deriver) {
            this[name] = deriver;
        },
        /**
         * Lists the available attribute deriving functions.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        }
    };

    var $rndrDerivedAttributes = new DerivedAttributes();
    return $rndrDerivedAttributes;
}));

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrFormattersTemplates', ['jquery'], function($) {
            return (root.rndr.templates.formatters = factory($));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.templates.formatters = factory(require('jquery')));
    } else {
        root.rndr.templates.formatters = factory(root.$);
    }
}(this, function($) {
    /**
     * Adds thousands and decimal seperators to a number string.
     * 
     * @param {string} nStr         The number to format.
     * @param {string} thousandsSep The string used for thousands places.
     * @param {string} decimalSep   The string used for decimal points.
     * @return {string}    A thousands and decimal seperatored number string.
     */
    var addSeparators = function(nStr, thousandsSep, decimalSep) {
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
    };

    /**
     * A dictionary of functions for creating 'number formatting' functions.
     */
    function FormattersTemplates() {}
    FormattersTemplates.prototype = {
        constructor: FormattersTemplates,
        /**
         * Adds a helper function used to create data formatters.
         * 
         * @param {string} name       The lookup name of the helper function.
         * @param {function} helper The helper function used to create data formatters.
         */
        add: function(name, helper) {
            this[name] = helper;
        },
        /**
         * Lists the available helper functions.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        },
        /**
         * A helper function used to create data formatters.
         * 
         * @param  {object} opts The formatting options described as follows:
         *                       Key  | Type | Default value | Description
         *                       ---- | ---- | ------------- | -----------
         *                       `digitsAfterDecimal`  | number | 2 | The number of decimal points to display.
         *                       `scaler`  | number | 1 | The scalar multiplier applied to the result.
         *                       `thousandsSep`  | string | ',' | The string used for thousands places.
         *                       `decimalSep`  | string | '.' | The string used for decimal points.
         *                       `prefix`  | string | '' | The prefix string to prepend to the resuls.
         *                       `suffix`  | string | '' | The suffix string to concact to the resuls.
         *                       `showZero`  | boolean | false | Whether or not to display 0 or '' when the result is equal to 0.
         * @return {function}    A data formatting function.
         */
        numberFormat: function(opts) {
            var self = this;
            var defaults;
            defaults = {
                digitsAfterDecimal: 2,
                scaler: 1,
                thousandsSep: ',',
                decimalSep: '.',
                prefix: '',
                suffix: ''
            };
            opts = $.extend(defaults, opts);
            return function(x) {
                var result;
                if (isNaN(x) || !isFinite(x)) {
                    return '';
                }
                result = addSeparators((opts.scaler * x).toFixed(opts.digitsAfterDecimal), opts.thousandsSep, opts.decimalSep);
                return '' + opts.prefix + result + opts.suffix;
            };
        }
    };

    var $rndrFormatterTemplates = new FormattersTemplates();

    return $rndrFormatterTemplates;
}));

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrFormatters', ['$rndrFormattersTemplates'], function($rndrFormatterTemplates) {
            return (root.rndr.plugins.formatters = factory($rndrFormatterTemplates));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.formatters = factory(require('$rndrFormatterTemplates')));
    } else {
        root.rndr.plugins.formatters = factory(root.rndr.templates.formatters);
    }
}(this, function($rndrFormatterTemplates) {

    function Formatters() {}
    Formatters.prototype = {
        constructor: Formatters,
        /**
         * Adds a formatter function.
         * 
         * @param {string} name         The name of the data attribute for which the `sorter` function will be applied.
         * @param {function} sorter     The function which sorts the values of a data attribute.
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

    var $rndrFormatters = new Formatters();

    return $rndrFormatters;
}));

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrAggregatorsTemplates', [], function() {
            return (root.rndr.templates.aggregators = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.templates.aggregators = factory());
    } else {
        root.rndr.templates.aggregators = factory();
    }
}(this, function() {
    /**
     * A dictionary of functions for creating an aggregator-generating function.
     */
    function AggregatorTemplates() {}
    AggregatorTemplates.prototype = {
        constructor: AggregatorTemplates,
        /**
         * Adds a function which *generates* an aggregator-generating function.
         * 
         * @param {string} name       The lookup name of the aggregator-generating function.
         * @param {function} template The function which *generates* an aggregator-generating function.
         */
        add: function(name, template) {
            this[name] = template;
        },
        /**
         * Lists the available `aggregator-generating` functions.
         * 
         * @return {Array.<string>} The lookup names.
         */
        list: function() {
            return Object.keys(this);
        },

        /**
         * Creates an aggregator-generating function.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted count of the number of values observed of the given attribute for records which match the cell.
         */
        count: function(formatter) {
            if (formatter == null) {
                var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
                if (typeof console !== 'undefined' && console !== null) {
                    console.error(e.stack);
                }
                throw e;
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
        /**
         * Creates an aggregator-generating function returns the formatted count of the number of unique values observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted count of the number of unique values observed.
         */
        countUnique: function(formatter) {
            if (formatter == null) {
                var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
                if (typeof console !== 'undefined' && console !== null) {
                    console.error(e.stack);
                }
                throw e;
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
        /**
         * Creates an aggregator-generating function that returns a list of the unique values observed seperated by the `sep` parameter.
         * 
         * @param  {string} sep The string used to seperate the list.
         * @return {function}     An aggregator-generating function which returns a list of the unique values observed seperated by the `sep` parameter.
         */
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
        /**
         * Creates an aggregator-generating function that returns the formatted sum of the values observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted sum of the values observed.
         */
        sum: function(formatter) {
            if (formatter == null) {
                var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
                if (typeof console !== 'undefined' && console !== null) {
                    console.error(e.stack);
                }
                throw e;
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
        /**
         * Creates an aggregator-generating function that returns the formatted minimum value observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted minimum value observed.
         */
        min: function(formatter) {
            if (formatter == null) {
                var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
                if (typeof console !== 'undefined' && console !== null) {
                    console.error(e.stack);
                }
                throw e;
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
        /**
         * Creates an aggregator-generating function that returns the formatted maximum value observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted maximum value observed.
         */
        max: function(formatter) {
            if (formatter == null) {
                var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
                if (typeof console !== 'undefined' && console !== null) {
                    console.error(e.stack);
                }
                throw e;
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
        /**
         * Creates an aggregator-generating function that returns the formatted average of the values observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted average of the values observed.
         */
        average: function(formatter) {
            if (formatter == null) {
                var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
                if (typeof console !== 'undefined' && console !== null) {
                    console.error(e.stack);
                }
                throw e;
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
        /**
         * Creates an aggregator-generating function that returns the formatted quotient of the values observed.
         * 
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted quotient of the values observed.
         */
        sumOverSum: function(formatter) {
            if (formatter == null) {
                var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
                if (typeof console !== 'undefined' && console !== null) {
                    console.error(e.stack);
                }
                throw e;
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
        /**
         * Creates an aggregator-generating function that returns the formatted quotient 'upper' or 'lower' 80 bound of the values observed.
         * 
         * @param  {boolean} upper     A boolean to denote whether to calculate 'upper' or 'lower' 80 bound
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted quotient 'upper' or 'lower' 80 bound of the values observed.
         */
        sumOverSumBound80: function(upper, formatter) {
            if (upper == null) {
                upper = true;
            }
            if (formatter == null) {
                var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
                if (typeof console !== 'undefined' && console !== null) {
                    console.error(e.stack);
                }
                throw e;
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
        /**
         * Creates an aggregator-generating function.
         * 
         * @param  {function} wrapped   An aggregator-generating function.
         * @param  {string} type      The 'comparer' (i.e. 'row', 'col', or 'total') to compare observed values to.
         * @param  {function} formatter A data formatting function.
         * @return {function}           An aggregator-generating function which returns the formatted percentage of the values observed to the 'comparer'.
         */
        fractionOf: function(wrapped, type, formatter) {
            if (type == null) {
                type = 'total';
            }
            if (formatter == null) {
                var e = new Error('Aggregator Templates: cannot generate an aggregator-generating function because the formatter is null.');
                if (typeof console !== 'undefined' && console !== null) {
                    console.error(e.stack);
                }
                throw e;
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
        quantile: function(formatter, q) {
            if (formatter == null) {
                formatter = usFmt;
            }
            return function(arg) {
                var attr;
                attr = arg[0];
                return function(data, rowKey, colKey) {
                    return {
                        vals: [],
                        push: function(record) {
                            var x;
                            x = parseFloat(record[attr]);
                            if (!isNaN(x)) {
                                return this.vals.push(x);
                            }
                        },
                        value: function() {
                            var i;
                            if (this.vals.length === 0) {
                                return null;
                            }
                            this.vals.sort();
                            i = (this.vals.length - 1) * q;
                            return (this.vals[Math.floor(i)] + this.vals[Math.ceil(i)]) / 2.0;
                        },
                        format: formatter,
                        numInputs: attr != null ? 0 : 1
                    };
                };
            };
        },
        runningStat: function(formatter, mode, ddof) {
            if (formatter == null) {
                formatter = usFmt;
            }
            if (mode == null) {
                mode = "var";
            }
            if (ddof == null) {
                ddof = 1;
            }
            return function(arg) {
                var attr;
                attr = arg[0];
                return function(data, rowKey, colKey) {
                    return {
                        n: 0.0,
                        m: 0.0,
                        s: 0.0,
                        push: function(record) {
                            var m_new, x;
                            x = parseFloat(record[attr]);
                            if (isNaN(x)) {
                                return;
                            }
                            this.n += 1.0;
                            if (this.n === 1.0) {
                                return this.m = x;
                            } else {
                                m_new = this.m + (x - this.m) / this.n;
                                this.s = this.s + (x - this.m) * (x - m_new);
                                return this.m = m_new;
                            }
                        },
                        value: function() {
                            if (this.n <= ddof) {
                                return 0;
                            }
                            switch (mode) {
                                case "var":
                                    return this.s / (this.n - ddof);
                                case "stdev":
                                    return Math.sqrt(this.s / (this.n - ddof));
                            }
                        },
                        format: formatter,
                        numInputs: attr != null ? 0 : 1
                    };
                };
            };
        }
    };

    var $rndrAggregatorsTemplates = new AggregatorTemplates();

    return $rndrAggregatorsTemplates;
}));
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrAggregators', ['$rndrAggregatorsTemplates', '$rndrFormatters'], function($rndrAggregatorsTemplates, $rndrFormatters) {
            return (root.rndr.plugins.aggregators = factory($rndrAggregatorsTemplates, $rndrFormatters));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.aggregators = factory(require('$rndrAggregatorsTemplates'), require('$rndrFormatters')));
    } else {
        root.rndr.plugins.aggregators = factory(root.rndr.templates.aggregators, root.rndr.plugins.formatters);
    }
}(this, function($rndrAggregatorsTemplates, $rndrFormatters) {
    /**
     * A dictionary of functions which *generate* a function that defines how data
     * is aggregated. Each `aggregator` should take as an argument an array of 
     * attribute-names and return a function that is appropriate and consumable 
     * by a `dataView`.
     */
    function Aggregators() {}
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

    var $rndrAggregators = new Aggregators();
    
    return $rndrAggregators;
}));

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrRenderers', [], function() {
            return (root.rndr.plugins.renderers = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.renderers = factory());
    } else {
        root.rndr.plugins.renderers = factory();
    }
}(this, function() {
    /**
     * A dictionary of renderer functions.
     */
    function Renderers() {}
    Renderers.prototype = {
        constructor: Renderers,
        /**
         * Adds a renderer function.
         * 
         * @param {string} name     The lookup name of the renderer.
         * @param {function} renderer A "data visulization constructing" function.
         * @param {string} dataViewName     The name of the `dataView` used by the `renderer` function.
         * @param {object} opts     Overrides or extends the options for the `renderer`.
         * @return {object}       The renderer.
        */
        add: function(name, renderer, dataViewName, opts) {
            this[name] = {
                render: renderer,
                opts: opts,
                dataViewName: dataViewName
            };
            return this[name];
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

    var $rndrRenderers = new Renderers();
    return $rndrRenderers;
}));

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrRenderingEngine', ['jquery', '$rndrFormatters', '$rndrSorters', '$rndrDerivedAttributes', '$rndrAggregators', '$rndrDataViews', '$rndrRenderers'], function($, $rndrFormatters, $rndrSorters, $rndrDerivedAttributes, $rndrAggregators, $rndrDataViews, $rndrRenderers) {
            return (root.rndr.RenderingEngine = factory(root, $, $rndrFormatters, $rndrSorters, $rndrDerivedAttributes, $rndrAggregators, $rndrDataViews, $rndrRenderers));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.RenderingEngine = factory(root, require('jquery'), require('$rndrFormatters'), require('$rndrSorters'), require('$rndrDerivedAttributes'), require('$rndrAggregators'), require('$rndrDataViews'), require('$rndrRenderers')));
    } else {
        root.rndr.RenderingEngine = factory(root, root.$, root.rndr.plugins.formatters, root.rndr.plugins.sorters, root.rndr.plugins.derivedAttributes, root.rndr.plugins.aggregators, root.rndr.plugins.dataViews, root.rndr.plugins.renderers);
    }
}(this, function(root, $, $rndrFormatters, $rndrSorters, $rndrDerivedAttributes, $rndrAggregators, $rndrDataViews, $rndrRenderers) {
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
                $.each(attrs, function(name) {
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
                $.each(sorters, function(name) {
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

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrRenderingEngines', [], function() {
            return (root.rndr.RenderingEngines = factory(root));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.RenderingEngines = factory(root));
    } else {
        root.rndr.RenderingEngines = factory(root);
    }
}(this, function(root) {
    'use strict';

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
            this.map = {};
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
            this.map[renderingEngine.id] = renderingEngine;
        },
        /**
         * Deletes a {@link RenderingEngine} from the map by `id`.
         * 
         * @param  {string} id The UUID of the {@link RenderingEngine} to remove from the map.
         */
        delete: function(id) {
            delete this.map[id];
        }
    };

    return RenderingEngines;
}));

(function(root, factory) {
        define('rndr',['$rndrDataViews',
            '$rndrSorters',
            '$rndrDerivedAttributes',
            '$rndrFormattersTemplates',
            '$rndrFormatters',
            '$rndrAggregatorsTemplates',
            '$rndrAggregators',
            '$rndrRenderingEngine',
            '$rndrRenderingEngines'
        ], function($rndrDataViews,
            $rndrSorters,
            $rndrDerivedAttributes,
            $rndrFormattersTemplates,
            $rndrFormatters,
            $rndrAggregatorsTemplates,
            $rndrAggregators,
            $rndrRenderingEngine,
            $rndrRenderingEngines) {
            return factory(root,
                $rndrDataViews,
                $rndrFormattersTemplates,
                $rndrFormatters,
                $rndrAggregatorsTemplates,
                $rndrAggregators,
                $rndrRenderingEngine,
                $rndrRenderingEngines);
        });
}(this, function(root,
    $rndrDataViews,
    $rndrFormattersTemplates,
    $rndrFormatters,
    $rndrAggregatorsTemplates,
    $rndrAggregators,
    $rndrRenderingEngine,
    $rndrRenderingEngines) {
    /**
     * A function for formatting a number into a standard US formatted number.
     * 
     * @return {function} A data formatter function for converting to standard US formatted number.
     */
    var usFmt = function() {
        return $rndrFormattersTemplates.numberFormat();
    };

    /**
     * A function for formatting a number into a standard US formatted integer.
     * 
     * @return {function} A data formatter function for converting to standard US formatted integer.
     */
    var usFmtInt = function() {
        return $rndrFormattersTemplates.numberFormat({
            digitsAfterDecimal: 0
        });
    };

    /**
     * A function for formatting a number into a standard US formatted percentage.
     * 
     * @return {function} A data formatter function for converting to standard US formatted percentage.
     */
    var usFmtPct = function() {
        return $rndrFormattersTemplates.numberFormat({
            digitsAfterDecimal: 1,
            scaler: 100,
            suffix: '%'
        });
    };

    $rndrFormatters.add('US Standard', usFmt());
    $rndrFormatters.add('US Standard Integer', usFmtInt());
    $rndrFormatters.add('US Standard Percentage', usFmtPct());

    /**
     * Configure Aggregators
     * 
     * Count - Takes as an argument an array of attribute-names and returns the US integer formatted count of the number of values observed of the given attribute for records which match the cell.
     * Count Unique Values - Takes as an argument an array of attribute-names and returns the US integer formatted count of the number of unique values observed.
     * List Unique Values - Takes as an argument an array of attribute-names and returns a CSV string listing of the unique values observed.
     * Sum - Takes as an argument an array of attribute-names and returns the US floating formatted sum of the values observed.
     * Integer Sum - Takes as an argument an array of attribute-names and returns the US integer formatted sum of the values observed.
     * Average - Takes as an argument an array of attribute-names and returns the US floating formatted average of the values observed.
     * Minimum - Takes as an argument an array of attribute-names and returns the US floating formatted minimum value of the unique values observed.
     * Maximum - Takes as an argument an array of attribute-names and returns the US floating formatted maximum value of the unique values observed.
     * Sum over Sum - Takes as an argument an array of attribute-names and returns the US floating formatted quotient of the values observed.
     * 80% Upper Bound - Takes as an argument an array of attribute-names and returns the US floating formatted quotient "upper" 80% bound of the values observed.
     * 80% Lower Bound - Takes as an argument an array of attribute-names and returns the US floating formatted quotient "lower" 80% bound of the values observed.
     */
    $rndrAggregators.add('Count', $rndrAggregatorsTemplates.count($rndrFormatters['US Standard Integer']));
    $rndrAggregators.add('Count Unique Values', $rndrAggregatorsTemplates.countUnique($rndrFormatters['US Standard Integer']));
    $rndrAggregators.add('List Unique Values', $rndrAggregatorsTemplates.listUnique(', '));
    $rndrAggregators.add('Sum', $rndrAggregatorsTemplates.sum($rndrFormatters['US Standard']));
    $rndrAggregators.add('Integer Sum', $rndrAggregatorsTemplates.sum($rndrFormatters['US Standard Integer']));
    $rndrAggregators.add('Average', $rndrAggregatorsTemplates.average($rndrFormatters['US Standard']));
    $rndrAggregators.add('Median', $rndrAggregatorsTemplates.quantile($rndrFormatters['US Standard']), 0.5);
    $rndrAggregators.add('Sample Variance', $rndrAggregatorsTemplates.runningStat($rndrFormatters['US Standard']), 'var');
    $rndrAggregators.add('Sample Standard Deviation', $rndrAggregatorsTemplates.runningStat($rndrFormatters['US Standard']), 'stdev');
    $rndrAggregators.add('Minimum', $rndrAggregatorsTemplates.min($rndrFormatters['US Standard']));
    $rndrAggregators.add('Maximum', $rndrAggregatorsTemplates.max($rndrFormatters['US Standard']));
    $rndrAggregators.add('Sum over Sum', $rndrAggregatorsTemplates.sumOverSum($rndrFormatters['US Standard']));
    $rndrAggregators.add('80% Upper Bound', $rndrAggregatorsTemplates.sumOverSumBound80(true, $rndrFormatters['US Standard']));
    $rndrAggregators.add('80% Lower Bound', $rndrAggregatorsTemplates.sumOverSumBound80(false, $rndrFormatters['US Standard']));

    return root.rndr;
}));

	
	// Define a 'jquery' model to allow rndr to support a user configured jquery version.
	define('jquery', [], function() {
        'use strict';

        return $;
    });

	// Use almond's special top level synchronous require to trigger factory
	// functions, get the final module, and export it as the public api.
	return require('rndr');
}));