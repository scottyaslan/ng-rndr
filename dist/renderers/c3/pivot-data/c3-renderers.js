(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'c3', 'rndr'], function($, c3, rndr) {
            return factory(root, $, c3, rndr);
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root, require('jquery'), require('c3'), require('rndr'));
    } else {
        factory(root, root.$, root.c3, root.rndr);
    }
}(this, function(root, $, c3, rndr) {
    var makeC3Chart = function(chartOpts) {
        if (chartOpts == null) {
            chartOpts = {};
        }
        return function(renderingEngine, opts) {
            var agg, base, base1, base2, colKey, colKeys, columns, dataArray, datum, defaults, fullAggName, groupByTitle, h, hAxisTitle, headers, i, j, k, len, len1, len2, numCharsInHAxis, params, ref, renderArea, result, returnObject, rotationAngle, row, rowHeader, rowKey, rowKeys, title, titleText, tree2, vAxisTitle, val, x, y;
            defaults = {
                locales: {
                    en: {
                        localeStrings: {
                            vs: 'vs',
                            by: 'by'
                        }
                    }
                },
                c3: {
                    size: {}
                }
            };
            opts = $.extend(true, defaults, opts);
            opts.c3.size.height = opts.height + opts.heightOffset;
            opts.c3.size.width = opts.width + opts.widthOffset;
            if ((base = opts.c3).size == null) {
                base.size = {};
            }
            if ((base1 = opts.c3.size).width == null) {
                base1.width = window.innerWidth / 1.4;
            }
            if ((base2 = opts.c3.size).height == null) {
                base2.height = window.innerHeight / 1.4 - 50;
            }
            if (chartOpts.type == null) {
                chartOpts.type = 'line';
            }
            rowKeys = renderingEngine.dataView.getRowKeys();
            if (rowKeys.length === 0) {
                rowKeys.push([]);
            }
            colKeys = renderingEngine.dataView.getColKeys();
            if (colKeys.length === 0) {
                colKeys.push([]);
            }
            headers = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = colKeys.length; i < len; i++) {
                    h = colKeys[i];
                    results.push(h.join('-'));
                }
                return results;
            })();
            rotationAngle = 0;
            fullAggName = renderingEngine.aggregator.name;
            if (renderingEngine.aggregator.aggInputAttributeName.length) {
                fullAggName += '(' + (renderingEngine.aggregator.aggInputAttributeName.join(', ')) + ')';
            }
            if (chartOpts.type === 'scatter') {
                dataArray = [];
                hAxisTitle = renderingEngine.dataView.colAttrs.join('-');
                vAxisTitle = renderingEngine.dataView.rowAttrs.join('-');
                ref = renderingEngine.dataView.meta.tree;
                for (y in ref) {
                    tree2 = ref[y];
                    for (x in tree2) {
                        agg = tree2[x];
                        datum = {};
                        datum[hAxisTitle] = parseFloat(x);
                        datum[vAxisTitle] = parseFloat(y);
                        datum['tooltip'] = agg.format(agg.value());
                        dataArray.push(datum);
                    }
                }
            } else {
                numCharsInHAxis = 0;
                for (i = 0, len = headers.length; i < len; i++) {
                    x = headers[i];
                    numCharsInHAxis += x.length;
                }
                if (numCharsInHAxis > 50) {
                    rotationAngle = 45;
                }
                columns = [];
                for (j = 0, len1 = rowKeys.length; j < len1; j++) {
                    rowKey = rowKeys[j];
                    rowHeader = rowKey.join('-');
                    row = [rowHeader === '' ? renderingEngine.aggregator.name : rowHeader];
                    for (k = 0, len2 = colKeys.length; k < len2; k++) {
                        colKey = colKeys[k];
                        val = parseFloat(renderingEngine.dataView.getAggregator(rowKey, colKey).value());
                        if (isFinite(val)) {
                            if (val < 1) {
                                row.push(val.toPrecision(3));
                            } else {
                                row.push(val.toFixed(3));
                            }
                        } else {
                            row.push(null);
                        }
                    }
                    columns.push(row);
                }
                vAxisTitle = renderingEngine.aggregator.name + (renderingEngine.aggregator.aggInputAttributeName.length ? '(' + (renderingEngine.aggregator.aggInputAttributeName.join(', ')) + ')' : '');
                hAxisTitle = renderingEngine.dataView.colAttrs.join('-');
            }
            titleText = fullAggName;
            if (hAxisTitle !== '') {
                titleText += ' ' + opts.locales[renderingEngine.locale].localeStrings.vs + ' ' + hAxisTitle;
            }
            groupByTitle = renderingEngine.dataView.rowAttrs.join('-');
            if (groupByTitle !== '') {
                titleText += ' ' + opts.locales[renderingEngine.locale].localeStrings.by + ' ' + groupByTitle;
            }
            title = $('<p>', {
                style: 'text-align: center; font-weight: bold'
            });
            title.text(titleText);
            params = {
                axis: {
                    y: {
                        label: vAxisTitle
                    },
                    x: {
                        label: hAxisTitle,
                        tick: {
                            rotate: rotationAngle,
                            multiline: false
                        }
                    }
                },
                data: {
                    type: chartOpts.type
                },
                tooltip: {
                    grouped: false
                },
                color: {
                    pattern: ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac']
                }
            };
            $.extend(params, opts.c3);
            if (chartOpts.type === 'scatter') {
                params.data.x = hAxisTitle;
                params.axis.x.tick = {
                    fit: false
                };
                params.data.json = dataArray;
                params.data.keys = {
                    value: [hAxisTitle, vAxisTitle]
                };
                params.legend = {
                    show: false
                };
                params.tooltip.format = {
                    title: function() {
                        return fullAggName;
                    },
                    name: function() {
                        return '';
                    },
                    value: function(a, b, c, d) {
                        return dataArray[d].tooltip;
                    }
                };
            } else {
                params.axis.x.type = 'category';
                params.axis.x.categories = headers;
                params.data.columns = columns;
            }
            if (chartOpts.stacked != null) {
                params.data.groups = [
                    (function() {
                        var l, len3, results;
                        results = [];
                        for (l = 0, len3 = rowKeys.length; l < len3; l++) {
                            x = rowKeys[l];
                            results.push(x.join('-'));
                        }
                        return results;
                    })()
                ];
            }
            renderArea = $('<div>', {
                style: 'display:none;'
            }).appendTo($('body'));
            result = $('<div>').appendTo(renderArea);
            params.bindto = result[0];
            c3.generate(params);
            result.detach();
            renderArea.remove();
            $('<div>').append(title, result);
            // remove old viz
            opts.element.empty();
            // append the new viz
            opts.element.append(result);
            return result;
        };
    };
    var c3Renderers = {
        'C3 - Line Chart': makeC3Chart(),
        'C3 - Bar Chart': makeC3Chart({
            type: 'bar'
        }),
        'C3 - Stacked Bar Chart': makeC3Chart({
            type: 'bar',
            stacked: true
        }),
        'C3 - Area Chart': makeC3Chart({
            type: 'area',
            stacked: true
        }),
        'C3 - Scatter Chart': makeC3Chart({
            type: 'scatter'
        })
    };

    rndr.plugins.renderers.set('C3 - Line Chart', {
        render: c3Renderers['C3 - Line Chart'],
        opts: {
            heightOffset: 0
        },
        dataViewName: 'PivotData'
    });
    rndr.plugins.renderers.set('C3 - Bar Chart', {
        render: c3Renderers['C3 - Bar Chart'],
        opts: {
            heightOffset: 0
        },
        dataViewName: 'PivotData'
    });
    rndr.plugins.renderers.set('C3 - Stacked Bar Chart', {
        render: c3Renderers['C3 - Stacked Bar Chart'],
        opts: {
            heightOffset: 0
        },
        dataViewName: 'PivotData'
    });
    rndr.plugins.renderers.set('C3 - Area Chart', {
        render: c3Renderers['C3 - Area Chart'],
        opts: {
            heightOffset: 0
        },
        dataViewName: 'PivotData'
    });
    rndr.plugins.renderers.set('C3 - Scatter Chart', {
        render: c3Renderers['C3 - Scatter Chart'],
        opts: {
            heightOffset: 0
        },
        dataViewName: 'PivotData'
    });
}));