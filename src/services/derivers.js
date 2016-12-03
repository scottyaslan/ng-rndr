define([], function() {
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
