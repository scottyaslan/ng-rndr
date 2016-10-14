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
                    if (window.ngRNDR.plugins.renderers === undefined) {
                        window.ngRNDR.plugins.renderers = {};
                    }
                }
            }
            window.ngRNDR.plugins.renderers = $.extend({}, window.ngRNDR.plugins.renderers, factory(jQuery));
            return window.ngRNDR.plugins.renderers;
        }
    };

    callWithJQuery(function($) {
        var makeGoogleChart, ngchart_directive_renderers;
        makeGoogleChart = function(chartType, extraOptions) {
            return function(pivotData, opts) {
                var agg, base, base1, colKey, colKeys, dataArray, dataTable, defaults, fullAggName, groupByTitle, h, hAxisTitle, headers, i, j, len, len1, numCharsInHAxis, options, ref, result, row, rowKey, rowKeys, title, tree2, vAxisTitle, val, x, y;
                defaults = {
                    localeStrings: {
                        vs: "vs",
                        by: "by"
                    },
                    gchart: {}
                };
                opts = $.extend(true, defaults, opts);
                if ((base = opts.gchart).width == null) {
                    base.width = window.innerWidth / 1.4;
                }
                if ((base1 = opts.gchart).height == null) {
                    base1.height = window.innerHeight / 1.4;
                }
                rowKeys = pivotData.getRowKeys();
                if (rowKeys.length === 0) {
                    rowKeys.push([]);
                }
                colKeys = pivotData.getColKeys();
                if (colKeys.length === 0) {
                    colKeys.push([]);
                }
                fullAggName = pivotData.meta.aggregatorName;
                if (pivotData.meta.valAttrs.length) {
                    fullAggName += "(" + (pivotData.meta.valAttrs.join(", ")) + ")";
                }
                headers = (function() {
                    var i, len, results;
                    results = [];
                    for (i = 0, len = rowKeys.length; i < len; i++) {
                        h = rowKeys[i];
                        results.push(h.join("-"));
                    }
                    return results;
                })();
                headers.unshift("");
                numCharsInHAxis = 0;
                if (chartType === "ScatterChart") {
                    dataArray = [];
                    ref = pivotData.meta.tree;
                    for (y in ref) {
                        tree2 = ref[y];
                        for (x in tree2) {
                            agg = tree2[x];
                            dataArray.push([parseFloat(x), parseFloat(y), fullAggName + ": \n" + agg.format(agg.value())]);
                        }
                    }
                    dataTable = new google.visualization.DataTable();
                    dataTable.addColumn('number', pivotData.meta.colAttrs.join("-"));
                    dataTable.addColumn('number', pivotData.meta.rowAttrs.join("-"));
                    dataTable.addColumn({
                        type: "string",
                        role: "tooltip"
                    });
                    dataTable.addRows(dataArray);
                    hAxisTitle = pivotData.meta.colAttrs.join("-");
                    vAxisTitle = pivotData.meta.rowAttrs.join("-");
                    title = "";
                } else {
                    dataArray = [headers];
                    for (i = 0, len = colKeys.length; i < len; i++) {
                        colKey = colKeys[i];
                        row = [colKey.join("-")];
                        numCharsInHAxis += row[0].length;
                        for (j = 0, len1 = rowKeys.length; j < len1; j++) {
                            rowKey = rowKeys[j];
                            agg = pivotData.getAggregator(rowKey, colKey);
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
                    hAxisTitle = pivotData.meta.colAttrs.join("-");
                    if (hAxisTitle !== "") {
                        title += " " + opts.localeStrings.vs + " " + hAxisTitle;
                    }
                    groupByTitle = pivotData.meta.rowAttrs.join("-");
                    if (groupByTitle !== "") {
                        title += " " + opts.localeStrings.by + " " + groupByTitle;
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
                    }
                };
                if (chartType === "ColumnChart") {
                    options.vAxis.minValue = 0;
                }
                if (chartType === "ScatterChart") {
                    options.legend = {
                        position: "none"
                    };
                    options.chartArea = {
                        'width': '80%',
                        'height': '80%'
                    };
                } else if (dataArray[0].length === 2 && dataArray[0][1] === "") {
                    options.legend = {
                        position: "none"
                    };
                }
                $.extend(options, opts.gchart, extraOptions);
                result = {
                    html: '<div google-chart chart=\'chartData\'>',
                    isDirective: true,
                    chart: {
                        data: dataArray,
                        options: options,
                        type: chartType
                    }
                };
                return result;
            };
        };
        return ngchart_directive_renderers = {
            "Line Chart": makeGoogleChart("LineChart"),
            "Bar Chart": makeGoogleChart("ColumnChart"),
            "Stacked Bar Chart": makeGoogleChart("ColumnChart", {
                isStacked: true
            }),
            "Area Chart": makeGoogleChart("AreaChart", {
                isStacked: true
            }),
            "Scatter Chart": makeGoogleChart("ScatterChart")
        };
    });

}).call(this);

//# sourceMappingURL=ngchart_directive_renderers.js.map

//# sourceMappingURL=ngchart_directive_renderers.js.map
