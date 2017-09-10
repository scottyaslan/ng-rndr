/**
 * The `CloneData` Object factory
 * 
 * The `CloneData` is one type of `dataView` object factory that ships with rndr
 * and may be passed into any `CloneData` compatable `renderer` plugin. It 
 * essentially wraps any data format/object and makes it available to generate 
 * visualizations of itself within the context of rndr. 
 * 
 * Since it takes in an object any methods available on that object will be
 * available to the renderer that uses it but it is impossible to document these
 * methods as this factory is designed to support an infinite number of possibilities.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['rndr'], function(rndr) {
            return factory(rndr);
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('rndr'));
    } else {
        factory(root.rndr);
    }
}(this, function(rndr) {
    function CloneData(data, opts) {
        this = data;

        //set meta from previous state or initialize
        this.meta = opts.meta || {};
    }
    CloneData.prototype = {
        constructor: CloneData,
    };

    rndr.plugins.dataViews.add('CloneData', CloneData);
}));
