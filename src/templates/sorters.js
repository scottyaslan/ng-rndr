(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('$rndrSortersTemplates', [], function() {
            return (root.rndr.templates.sorters = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.rndr.templates.sorters = factory());
    } else {
        root.rndr.templates.sorters = factory();
    }
}(this, function() {
    var naturalSort = function(as, bs) {
        var a, a1, b, b1, rd, rx, rz;
        rx = /(\d+)|(\D+)/g;
        rd = /\d/;
        rz = /^0/;
        if (typeof as === 'number' || typeof bs === 'number') {
            if (isNaN(as)) {
                return 1;
            }
            if (isNaN(bs)) {
                return -1;
            }
            return as - bs;
        }
        a = String(as).toLowerCase();
        b = String(bs).toLowerCase();
        if (a === b) {
            return 0;
        }
        if (!(rd.test(a) && rd.test(b))) {
            return (a > b ? 1 : -1);
        }
        a = a.match(rx);
        b = b.match(rx);
        while (a.length && b.length) {
            a1 = a.shift();
            b1 = b.shift();
            if (a1 !== b1) {
                if (rd.test(a1) && rd.test(b1)) {
                    return a1.replace(rz, '.0') - b1.replace(rz, '.0');
                } else {
                    return (a1 > b1 ? 1 : -1);
                }
            }
        }
        return a.length - b.length;
    };

    /**
     * A dictionary of 'data sorting' functions.
     */
    var $rndrSorterTemplates = new Map();

    /**
     * A helper function used to generate a function that defines the order of (available) values for a given attribute.
     * 
     * @param  {array} order An array of strings that define the order of the values for an attribute.
     * @return {function}    A data sorting function.
     */
    $rndrSorterTemplates.set('sortAs', function(order) {
        var i, mapping, x;
        mapping = {};
        for (i in order) {
            x = order[i];
            mapping[x] = i;
        }
        return function(a, b) {
            if ((mapping[a] != null) && (mapping[b] != null)) {
                return mapping[a] - mapping[b];
            } else if (mapping[a] != null) {
                return -1;
            } else if (mapping[b] != null) {
                return 1;
            } else {
                return naturalSort(a, b);
            }
        };
    });

    /**
     * Ascending sorting function.
     */
    $rndrSorterTemplates.set('sortAscending', function(a, b) {
        return a - b;
    });

    /**
     * Descending sorting function.
     */
    $rndrSorterTemplates.set('sortDescending', function(a, b) {
        return b - a;
    });

    return $rndrSorterTemplates;
}));