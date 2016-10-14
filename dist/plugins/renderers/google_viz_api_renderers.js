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
        var makeGoogleChart;
        makeGoogleChart = function(chartType, extraOptions) {
            return function(pivotData, opts) {
                var base, base1, colKeys, dataTable, defaults, fullAggName, h, headers, numCharsInHAxis, options, result, rowKeys, wrapper;
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
                dataTable = opts.gchart.formatData(pivotData, headers, rowKeys, colKeys, fullAggName);
                options = {};
                $.extend(options, opts.gchart, extraOptions);
                result = $("<div>").css({
                    width: "100%",
                    height: "100%"
                });
                wrapper = new google.visualization.ChartWrapper({
                    dataTable: dataTable,
                    chartType: chartType,
                    options: options
                });
                wrapper.draw(result[0]);
                result.bind("dblclick", function() {
                    var editor;
                    editor = new google.visualization.ChartEditor();
                    google.visualization.events.addListener(editor, 'ok', function() {
                        return editor.getChartWrapper().draw(result[0]);
                    });
                    return editor.openDialog(wrapper);
                });
                return result;
            };
        };
        return $.pivotUtilities.gchart_renderers = {
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

//# sourceMappingURL=google_viz_api_renderers.js.map

//# sourceMappingURL=google_viz_api_renderers.js.map
