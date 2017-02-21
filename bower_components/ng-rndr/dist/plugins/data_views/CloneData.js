/**
 * The `CloneData` Object factory
 * 
 * The `CloneData` is one type of `dataView` object factory that ships with ng-rndr
 * and may be passed into any `CloneData` compatable `renderer` plugin. It 
 * essentially wraps any data format/object and makes it available to generate 
 * visualizations of itself within the context of ng-rndr. 
 * 
 * Since it takes in an object any methods available on that object will be
 * available to the renderer that uses it but it is impossible to document these
 * methods as this factory is designed to support an infinite number of possibilities.
 */
(function(root, factory) {
    if (root.ngRndr === undefined) {
        root.ngRndr = {};
    }
    if (root.ngRndr.plugins === undefined) {
        root.ngRndr.plugins = {};
    }
    if (root.ngRndr.plugins.DataViews === undefined) {
        root.ngRndr.plugins.DataViews = {};
    }
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return (root.ngRndr.plugins.DataViews['CloneData'] = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.ngRndr.plugins.DataViews['CloneData'] = factory());
    } else {
        root.ngRndr.plugins.DataViews['CloneData'] = factory();
    }
}(this, function() {
    function CloneData(data, opts) {
        this = data;

        //set meta from previous state or initialize
        this.meta = opts.meta || {};
    }
    CloneData.prototype = {
        constructor: CloneData,
    };
    return CloneData;
}));
