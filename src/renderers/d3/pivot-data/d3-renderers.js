(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'd3', 'rndr'], function($, d3, rndr) {
            return factory(root, $, d3, rndr);
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root, require('jquery'), require('d3'), require('rndr'));
    } else {
        factory(root, root.$, root.d3, root.rndr);
    }
}(this, function(root, $, d3, rndr) {
    var d3Renderers = {
        'D3 - Treemap': function(renderingEngine, opts) {
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
            // remove old viz
            opts.element.empty();
            // append the new viz
            opts.element.append(result);
            return result;
        }
    };

    rndr.plugins.renderers.set('D3 - Treemap', {
        render: d3Renderers['D3 - Treemap'],
        opts: {},
        dataViewName: 'PivotData'
    });
}));