define(['jquery'],
    function($) {
        'use strict';

        return function SortersProvider() {
            var sorters = {};

            /**
             * Adds a sorter.
             * 
             * @param {string} name         The name of the data attribute for which the `sorter` function will be applied.
             * @param {function} sorter     The function which sorts the values of a data attribute.
             */
            this.add = function(name, sorter) {
                sorters[name] = sorter;
            };

            this.$get = [function SortersFactory() {
                /**
                 * A dictionary of functions which sort data. The keys
                 * are the names of the data attribute for which the `sorter`
                 * function will be applied, and the functions take the values
                 * of the data attribute and sorts them.
                 */
                function Sorters(sorters) {
                    $.extend(this, sorters);
                }
                Sorters.prototype = {
                    constructor: Sorters,
                    /**
                     * Adds a sorter.
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

                return new Sorters(sorters);
            }];
        }
    });
