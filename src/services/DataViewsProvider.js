define(['jquery'],
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
