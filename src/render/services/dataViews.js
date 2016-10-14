define([],
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
                 * @param {function} meta     A function that returns the initial metadata model for the `DataView`. //TODO: figure out how to document this
                 */
                add: function(name, DataView, meta) {
                    this[name] = {
                        view: DataView,
                        meta: meta
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
