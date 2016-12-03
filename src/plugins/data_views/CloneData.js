(function() {
    var callWithJQuery;

    callWithJQuery = function(factory) {
        if (typeof exports === "object" && typeof module === "object") {
            return factory(require("jquery"));
        } else if (typeof define === "function" && define.amd) {
            return define(["jquery"], factory);
        } else {
            if (window.ngRNDR === undefined) {
                window.ngRNDR = {};
                if (window.ngRNDR.plugins === undefined) {
                    window.ngRNDR.plugins = {};
                    if (window.ngRNDR.plugins.dataViews === undefined) {
                        window.ngRNDR.plugins.dataViews = {};
                    }
                }
            }
            window.ngRNDR.plugins.DataViews['CloneData'] = factory(jQuery, d3);
            return window.ngRNDR.plugins.dataViews;
        }
    };

    callWithJQuery(function($) {
        function CloneData(data, opts) {
            // set meta from rendering engine state
            this.meta = opts.meta;
            this.dataUtils = opts.dataUtils;
            this.aggregator = opts.aggregator;

            this.data = data;
        }
        CloneData.prototype = {
            constructor: CloneData,
        };
        return CloneData;
    });

}).call(this);

//# sourceMappingURL=CloneData.js.map
