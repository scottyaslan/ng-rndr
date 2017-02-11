define(['jquery'],
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
