(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'rndr'], function($, rndr) {
            return factory(root, $, rndr);
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root, require('jquery'), require('rndr'));
    } else {
        factory(root, root.$, root.rndr);
    }
}(this, function(root, $, rndr) {
    var makeGoogleChart = function(chartType, extraOptions) {
        return function(renderingEngine, opts) {
            var agg, base, base1, colKey, colKeys, dataArray, dataTable, defaults, fullAggName, groupByTitle, h, hAxisTitle, headers, i, j, len, len1, numCharsInHAxis, options, ref, result, returnObject, row, rowKey, rowKeys, title, tree2, vAxisTitle, val, wrapper, x, y;
            defaults = {
                locales: {
                    en: {
                        localeStrings: {
                            vs: 'vs',
                            by: 'by'
                        }
                    }
                },
                gchart: {
                    height: opts.height + opts.heightOffset,
                    width: opts.width + opts.widthOffset
                }
            };
            opts = $.extend(true, defaults, opts);
            if ((base = opts.gchart).width == null) {
                base.width = window.innerWidth / 1.4;
            }
            if ((base1 = opts.gchart).height == null) {
                base1.height = window.innerHeight / 1.4;
            }
            rowKeys = renderingEngine.dataView.getRowKeys();
            if (rowKeys.length === 0) {
                rowKeys.push([]);
            }
            colKeys = renderingEngine.dataView.getColKeys();
            if (colKeys.length === 0) {
                colKeys.push([]);
            }
            fullAggName = renderingEngine.aggregator.name;
            if (renderingEngine.aggregator.aggInputAttributeName.length) {
                fullAggName += '(' + (renderingEngine.aggregator.aggInputAttributeName.join(', ')) + ')';
            }
            headers = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = rowKeys.length; i < len; i++) {
                    h = rowKeys[i];
                    results.push(h.join('-'));
                }
                return results;
            })();
            headers.unshift('');
            numCharsInHAxis = 0;
            if (chartType === 'ScatterChart') {
                dataArray = [];
                ref = renderingEngine.dataView.meta.tree;
                for (y in ref) {
                    tree2 = ref[y];
                    for (x in tree2) {
                        agg = tree2[x];
                        dataArray.push([parseFloat(x), parseFloat(y), fullAggName + ': \n' + agg.format(agg.value())]);
                    }
                }
                dataTable = new google.visualization.DataTable();
                dataTable.addColumn('number', renderingEngine.dataView.colAttrs.join('-'));
                dataTable.addColumn('number', renderingEngine.dataView.rowAttrs.join('-'));
                dataTable.addColumn({
                    type: 'string',
                    role: 'tooltip'
                });
                dataTable.addRows(dataArray);
                hAxisTitle = renderingEngine.dataView.colAttrs.join('-');
                vAxisTitle = renderingEngine.dataView.rowAttrs.join('-');
                title = '';
            } else {
                dataArray = [headers];
                for (i = 0, len = colKeys.length; i < len; i++) {
                    colKey = colKeys[i];
                    row = [colKey.join('-')];
                    numCharsInHAxis += row[0].length;
                    for (j = 0, len1 = rowKeys.length; j < len1; j++) {
                        rowKey = rowKeys[j];
                        agg = renderingEngine.dataView.getAggregator(rowKey, colKey);
                        if (agg.value() != null) {
                            val = agg.value();
                            if ($.isNumeric(val)) {
                                if (val < 1) {
                                    row.push(parseFloat(val.toPrecision(3)));
                                } else {
                                    row.push(parseFloat(val.toFixed(3)));
                                }
                            } else {
                                row.push(val);
                            }
                        } else {
                            row.push(null);
                        }
                    }
                    dataArray.push(row);
                }
                dataTable = google.visualization.arrayToDataTable(dataArray);
                title = vAxisTitle = fullAggName;
                hAxisTitle = renderingEngine.dataView.colAttrs.join('-');
                if (hAxisTitle !== '') {
                    title += ' ' + opts.locales[renderingEngine.locale].localeStrings.vs + ' ' + hAxisTitle;
                }
                groupByTitle = renderingEngine.dataView.rowAttrs.join('-');
                if (groupByTitle !== '') {
                    title += ' ' + opts.locales[renderingEngine.locale].localeStrings.by + ' ' + groupByTitle;
                }
            }
            options = {
                title: title,
                hAxis: {
                    title: hAxisTitle,
                    slantedText: numCharsInHAxis > 50
                },
                vAxis: {
                    title: vAxisTitle
                },
                tooltip: {
                    textStyle: {
                        fontName: 'Arial',
                        fontSize: 12
                    }
                },
                chartArea: {
                    'width': '80%',
                    'height': '80%'
                }
            };
            if (chartType === 'ColumnChart') {
                options.vAxis.minValue = 0;
            }
            if (chartType === 'ScatterChart') {
                options.legend = {
                    position: 'none'
                };
            } else if (dataArray[0].length === 2 && dataArray[0][1] === '') {
                options.legend = {
                    position: 'none'
                };
            }
            $.extend(options, opts.gchart, extraOptions);
            result = $('<div>').css({
                width: opts.gchart.width,
                height: opts.gchart.height
            });
            wrapper = new google.visualization.ChartWrapper({
                dataTable: dataTable,
                chartType: chartType,
                options: options
            });
            wrapper.draw(result[0]);
            result.bind('dblclick', function() {
                var editor;
                editor = new google.visualization.ChartEditor();
                google.visualization.events.addListener(editor, 'ok', function() {
                    return editor.getChartWrapper().draw(result[0]);
                });
                return editor.openDialog(wrapper);
            });
            // remove old viz
            opts.element.empty();
            // append the new viz
            opts.element.append(result);
            return result;
        };
    };
    var gchartRenderers =  {
        'Google - Line Chart': makeGoogleChart('LineChart'),
        'Google - Bar Chart': makeGoogleChart('ColumnChart'),
        'Google - Stacked Bar Chart': makeGoogleChart('ColumnChart', {
            isStacked: true
        }),
        'Google - Area Chart': makeGoogleChart('AreaChart', {
            isStacked: true
        }),
        'Google - Scatter Chart': makeGoogleChart('ScatterChart')
    };

    rndr.plugins.renderers.add('Google - Line Chart',
        gchartRenderers['Google - Line Chart'],
        'PivotData', {
            heightOffset: 0
        });
    rndr.plugins.renderers.add('Google - Bar Chart',
        gchartRenderers['Google - Bar Chart'],
        'PivotData', {
            heightOffset: 0
        });
    rndr.plugins.renderers.add('Google - Stacked Bar Chart',
        gchartRenderers['Google - Stacked Bar Chart'],
        'PivotData', {
            heightOffset: 0
        });
    rndr.plugins.renderers.add('Google - Area Chart',
        gchartRenderers['Google - Area Chart'],
        'PivotData', {
            heightOffset: 0
        });
    rndr.plugins.renderers.add('Google - Scatter Chart',
        gchartRenderers['Google - Scatter Chart'],
        'PivotData', {
            heightOffset: 0
        });
}));
