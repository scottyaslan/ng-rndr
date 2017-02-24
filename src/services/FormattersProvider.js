define(['jquery'],
    function($) {
        'use strict';

        return function FormattersProvider() {
            var formatters = {};

            /**
             * Adds a formatter.
             * 
             * @param {string} name         The lookup name of the formatter.
             * @param {function} formatter  The function which formats data.
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
                     * @param {string} name             The lookup name of the formatter function.
                     * @param {function} aggregator     The function which formats data.
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
