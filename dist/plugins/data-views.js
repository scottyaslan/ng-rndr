(function(root, factory) {
    if (root.rndr === undefined) {
        root.rndr = {};
    }
    if (root.rndr.plugins === undefined) {
        root.rndr.plugins = {};
    }
    if (typeof define === 'function' && define.amd) {
        define('$rndrDataViews', [], function() {
            return (root.rndr.plugins.dataViews = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.plugins.dataViews = factory());
    } else {
        root.rndr.plugins.dataViews = factory();
    }
}(this, function() {
    /**
     * A dictionary of data view object factories.
     */
    function DataViews() {
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

    var $rndrDataViews = new DataViews();
    return $rndrDataViews;
}));
