(function(root, factory) {
    if (root.ngRndr === undefined) {
        root.ngRndr = {};
    }
    if (root.ngRndr.plugins === undefined) {
        root.ngRndr.plugins = {};
    }
    if (root.ngRndr.plugins.renderers === undefined) {
        root.ngRndr.plugins.renderers = {};
    }
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'd3'], function($, d3) {
            return (root.ngRndr.plugins.renderers['d3'] = factory($, d3));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.ngRndr.plugins.renderers['d3'] = factory(require('jquery'), require('d3')));
    } else {
        root.ngRndr.plugins.renderers['d3'] = factory(root.$, root.d3);
    }
}(this, function($, d3) {
    return {
        Treemap: function(renderingEngine, opts) {
            var addToTree, color, defaults, height, i, len, ref, result, returnObject, rowKey, tree, treemap, value, width;
            defaults = {
                locales: {
                    en: {
                        localeStrings: {}
                    }
                },
                d3: {
                    width: function() {
                        return opts.height + opts.heightOffset;
                    },
                    height: function() {
                        return opts.width + opts.widthOffset;
                    }
                }
            };
            opts = $.extend(true, defaults, opts);
            result = $('<div>').css({
                width: opts.d3.width(),
                height: opts.d3.height()
            });
            tree = {
                name: 'All',
                children: []
            };
            addToTree = function(tree, path, value) {
                var child, i, len, newChild, ref, x;
                if (path.length === 0) {
                    tree.value = value;
                    return;
                }
                if (tree.children == null) {
                    tree.children = [];
                }
                x = path.shift();
                ref = tree.children;
                for (i = 0, len = ref.length; i < len; i++) {
                    child = ref[i];
                    if (!(child.name === x)) {
                        continue;
                    }
                    addToTree(child, path, value);
                    return;
                }
                newChild = {
                    name: x
                };
                addToTree(newChild, path, value);
                return tree.children.push(newChild);
            };
            ref = renderingEngine.dataView.getRowKeys();
            for (i = 0, len = ref.length; i < len; i++) {
                rowKey = ref[i];
                value = renderingEngine.dataView.getAggregator(rowKey, []).value();
                if (value != null) {
                    addToTree(tree, rowKey, value);
                }
            }
            color = d3.scale.category10();
            width = opts.d3.width();
            height = opts.d3.height();
            treemap = d3.layout.treemap().size([opts.d3.width, opts.d3.height]).sticky(true).value(function(d) {
                return d.size;
            });
            d3.select(result[0]).append('div').style('position', 'relative').style('width', width + 'px').style('height', height + 'px').datum(tree).selectAll('.node').data(treemap.padding([15, 0, 0, 0]).value(function(d) {
                return d.value;
            }).nodes).enter().append('div').attr('class', 'node').style('background', function(d) {
                if (d.children != null) {
                    return 'lightgrey';
                } else {
                    return color(d.name);
                }
            }).text(function(d) {
                return d.name;
            }).call(function() {
                this.style('left', function(d) {
                    return d.x + 'px';
                }).style('top', function(d) {
                    return d.y + 'px';
                }).style('width', function(d) {
                    return Math.max(0, d.dx - 1) + 'px';
                }).style('height', function(d) {
                    return Math.max(0, d.dy - 1) + 'px';
                });
            });
            return returnObject = {
                html: result
            };
        }
    };
}));
