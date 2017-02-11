define(['jquery'],
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
