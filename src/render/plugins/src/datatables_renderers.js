(function() {
  var callWithJQuery,
    hasProp = {}.hasOwnProperty;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    var datatable, datatables_renderers;
    datatable = function(pivotData, opts) {
      var aggregator, c, colAttrs, colKey, colKeys, defaults, i, j, r, result, rowAttrs, rowKey, rowKeys, spanSize, tbody, td, tfoot, th, thead, totalAggregator, tr, txt, val, x;
      defaults = {
        localeStrings: {
          totals: "Totals"
        }
      };
      opts = $.extend(defaults, opts);
      colAttrs = pivotData.colAttrs;
      rowAttrs = pivotData.rowAttrs;
      rowKeys = pivotData.getRowKeys();
      colKeys = pivotData.getColKeys();
      result = document.createElement("table");
      $(result).width(opts.datatables.width);
      result.className = opts.datatables["class"].join(" ");
      thead = document.createElement("thead");
      tbody = document.createElement("tbody");
      tfoot = document.createElement("tfoot");
      spanSize = function(arr, i, j) {
        var k, l, len, noDraw, ref, ref1, stop, x;
        if (i !== 0) {
          noDraw = true;
          for (x = k = 0, ref = j; 0 <= ref ? k <= ref : k >= ref; x = 0 <= ref ? ++k : --k) {
            if (arr[i - 1][x] !== arr[i][x]) {
              noDraw = false;
            }
          }
          if (noDraw) {
            return -1;
          }
        }
        len = 0;
        while (i + len < arr.length) {
          stop = false;
          for (x = l = 0, ref1 = j; 0 <= ref1 ? l <= ref1 : l >= ref1; x = 0 <= ref1 ? ++l : --l) {
            if (arr[i][x] !== arr[i + len][x]) {
              stop = true;
            }
          }
          if (stop) {
            break;
          }
          len++;
        }
        return len;
      };
      for (j in colAttrs) {
        if (!hasProp.call(colAttrs, j)) continue;
        c = colAttrs[j];
        tr = document.createElement("tr");
        if (parseInt(j) === 0 && rowAttrs.length !== 0) {
          th = document.createElement("th");
          th.setAttribute("colspan", rowAttrs.length);
          th.setAttribute("rowspan", colAttrs.length);
          tr.appendChild(th);
        }
        th = document.createElement("th");
        th.className = "pvtAxisLabel";
        $(th).css("white-space", "nowrap");
        th.innerHTML = c;
        tr.appendChild(th);
        for (i in colKeys) {
          if (!hasProp.call(colKeys, i)) continue;
          colKey = colKeys[i];
          x = spanSize(colKeys, parseInt(i), parseInt(j));
          if (x !== -1) {
            th = document.createElement("th");
            $(th).off('dblclick').on('dblclick', function(event) {
              var e;
              e = $.Event("colLabelDrillDownEvent", {
                event: event,
                renderingEngineId: opts.renderingEngineId
              });
              return $(window).trigger(e);
            });
            th.className = "pvtColLabel";
            th.innerHTML = colKey[j];
            th.setAttribute("colspan", x);
            if (parseInt(j) === colAttrs.length - 1 && rowAttrs.length !== 0) {
              th.setAttribute("rowspan", 2);
            }
            tr.appendChild(th);
          }
        }
        if (parseInt(j) === 0) {
          th = document.createElement("th");
          th.className = "pvtTotalLabel";
          th.innerHTML = opts.localeStrings.totals;
          th.setAttribute("rowspan", colAttrs.length + (rowAttrs.length === 0 ? 0 : 1));
          tr.appendChild(th);
        }
        thead.appendChild(tr);
      }
      if (rowAttrs.length !== 0) {
        tr = document.createElement("tr");
        for (i in rowAttrs) {
          if (!hasProp.call(rowAttrs, i)) continue;
          r = rowAttrs[i];
          th = document.createElement("th");
          $(th).css("white-space", "nowrap");
          th.className = "pvtAxisLabel";
          th.innerHTML = r;
          tr.appendChild(th);
        }
        th = document.createElement("th");
        if (colAttrs.length === 0) {
          th.className = "pvtTotalLabel";
          th.innerHTML = opts.localeStrings.totals;
        }
        tr.appendChild(th);
        thead.appendChild(tr);
      }
      for (i in rowKeys) {
        if (!hasProp.call(rowKeys, i)) continue;
        rowKey = rowKeys[i];
        tr = document.createElement("tr");
        for (j in rowKey) {
          if (!hasProp.call(rowKey, j)) continue;
          txt = rowKey[j];
          th = document.createElement('th');
          $(th).css("white-space", "nowrap");
          $(th).off('dblclick').on('dblclick', function(event) {
            var e;
            e = $.Event("rowLabelDrillDownEvent", {
              event: event,
              renderingEngineId: opts.renderingEngineId
            });
            return $(window).trigger(e);
          });
          th.className = 'pvtRowLabel';
          th.innerHTML = txt;
          tr.appendChild(th);
          if (parseInt(j) === rowAttrs.length - 1 && colAttrs.length !== 0) {
            tr.appendChild(document.createElement('th'));
          }
        }
        for (j in colKeys) {
          if (!hasProp.call(colKeys, j)) continue;
          colKey = colKeys[j];
          aggregator = pivotData.getAggregator(rowKey, colKey);
          val = aggregator.value();
          td = document.createElement("td");
          td.className = "pvtVal row" + i + " col" + j;
          td.innerHTML = aggregator.format(val);
          td.setAttribute("data-value", val);
          tr.appendChild(td);
        }
        totalAggregator = pivotData.getAggregator(rowKey, []);
        val = totalAggregator.value();
        td = document.createElement("td");
        td.className = "pvtTotal rowTotal";
        td.innerHTML = totalAggregator.format(val);
        td.setAttribute("data-value", val);
        td.setAttribute("data-for", "row" + i);
        tr.appendChild(td);
        tbody.appendChild(tr);
      }
      tr = document.createElement("tr");
      th = document.createElement("th");
      th.className = "pvtTotalLabel";
      th.innerHTML = opts.localeStrings.totals;
      th.setAttribute("colspan", rowAttrs.length + (colAttrs.length === 0 ? 0 : 1));
      tr.appendChild(th);
      for (j in colKeys) {
        if (!hasProp.call(colKeys, j)) continue;
        colKey = colKeys[j];
        totalAggregator = pivotData.getAggregator([], colKey);
        val = totalAggregator.value();
        td = document.createElement("td");
        td.className = "pvtTotal colTotal";
        td.innerHTML = totalAggregator.format(val);
        td.setAttribute("data-value", val);
        td.setAttribute("data-for", "col" + j);
        tr.appendChild(td);
      }
      totalAggregator = pivotData.getAggregator([], []);
      val = totalAggregator.value();
      td = document.createElement('td');
      td.className = 'pvtGrandTotal';
      td.innerHTML = totalAggregator.format(val);
      td.setAttribute("data-value", val);
      tr.appendChild(td);
      result.appendChild(thead);
      result.appendChild(tbody);
      tfoot.appendChild(tr);
      result.appendChild(tfoot);
      result.setAttribute("data-numrows", rowKeys.length);
      result.setAttribute("data-numcols", colKeys.length);
      return result;
    };
    $.fn.finalize = function(opts) {
      var numCols, numFixedLeftCols, numRows, postRenderOpts, returnObject;
      numRows = opts.numRows;
      numCols = opts.numCols;
      numFixedLeftCols = numRows;
      if (numCols > 0) {
        numFixedLeftCols = numFixedLeftCols + 1;
      }
      postRenderOpts = {
        scrollY: opts['datatables'].height,
        fixedColumns: {
          leftColumns: numFixedLeftCols,
          rightColumns: 1
        },
        scrollX: true,
        scrollCollapse: true,
        paging: false,
        keys: true,
        dom: 'Bfrtip',
        buttons: ['csvHtml5', 'pdfHtml5', 'print']
      };
      if (numRows !== 0 || numCols !== 0) {
        return returnObject = {
          html: this.width('100%'),
          type: 'datatables',
          postRenderOpts: postRenderOpts,
          postRenderFunction: function(html, opts) {
            $(html).DataTable(opts);
          }
        };
      }
      return returnObject = {
        html: this,
        type: 'datatables'
      };
    };

    /*
    Heatmap post-processing
     */
    $.fn.heatmap = function(scope) {
      var colorGen, heatmapper, i, j, k, l, numCols, numRows, ref, ref1;
      if (scope == null) {
        scope = "heatmap";
      }
      numRows = this.data("numrows");
      numCols = this.data("numcols");
      colorGen = function(color, min, max) {
        var hexGen;
        hexGen = (function() {
          switch (color) {
            case "red":
              return function(hex) {
                return "ff" + hex + hex;
              };
            case "green":
              return function(hex) {
                return hex + "ff" + hex;
              };
            case "blue":
              return function(hex) {
                return "" + hex + hex + "ff";
              };
          }
        })();
        return function(x) {
          var hex, intensity;
          intensity = 255 - Math.round(255 * (x - min) / (max - min));
          hex = intensity.toString(16).split(".")[0];
          if (hex.length === 1) {
            hex = 0 + hex;
          }
          return hexGen(hex);
        };
      };
      heatmapper = (function(_this) {
        return function(scope, color) {
          var colorFor, forEachCell, values;
          forEachCell = function(f) {
            return _this.find(scope).each(function() {
              var x;
              x = $(this).data("value");
              if ((x != null) && isFinite(x)) {
                return f(x, $(this));
              }
            });
          };
          values = [];
          forEachCell(function(x) {
            return values.push(x);
          });
          colorFor = colorGen(color, Math.min.apply(Math, values), Math.max.apply(Math, values));
          return forEachCell(function(x, elem) {
            return elem.css("background-color", "#" + colorFor(x));
          });
        };
      })(this);
      switch (scope) {
        case "heatmap":
          heatmapper(".pvtVal", "red");
          break;
        case "rowheatmap":
          for (i = k = 0, ref = numRows; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            heatmapper(".pvtVal.row" + i, "red");
          }
          break;
        case "colheatmap":
          for (j = l = 0, ref1 = numCols; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
            heatmapper(".pvtVal.col" + j, "red");
          }
      }
      heatmapper(".pvtTotal.rowTotal", "red");
      heatmapper(".pvtTotal.colTotal", "red");
      return this;
    };

    /*
    Barchart post-processing
     */
    $.fn.barchart = function() {
      var barcharter, i, k, numCols, numRows, ref;
      numRows = this.data("numrows");
      numCols = this.data("numcols");
      barcharter = (function(_this) {
        return function(scope) {
          var forEachCell, max, scaler, values;
          forEachCell = function(f) {
            return _this.find(scope).each(function() {
              var x;
              x = $(this).data("value");
              if ((x != null) && isFinite(x)) {
                return f(x, $(this));
              }
            });
          };
          values = [];
          forEachCell(function(x) {
            return values.push(x);
          });
          max = Math.max.apply(Math, values);
          scaler = function(x) {
            return 100 * x / (1.4 * max);
          };
          return forEachCell(function(x, elem) {
            var text, wrapper;
            text = elem.text();
            wrapper = $("<div>").css({
              "position": "relative"
            });
            wrapper.append($("<div>").css({
              "position": "absolute",
              "bottom": -2,
              "left": 0,
              "right": 0,
              "height": scaler(x) + "%",
              "background-color": "gray"
            }));
            wrapper.append($("<div>").text(text).css({
              "position": "relative",
              "padding-left": "5px",
              "padding-right": "5px"
            }));
            return elem.css({
              "padding": 0,
              "padding-top": "5px",
              "text-align": "center"
            }).html(wrapper);
          });
        };
      })(this);
      for (i = k = 0, ref = numRows; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        barcharter(".pvtVal.row" + i);
      }
      barcharter(".pvtTotal.colTotal");
      return this;
    };
    return datatables_renderers = {
      "Table": function(pvtData, opts) {
        return $(datatable(pvtData, opts)).finalize(opts);
      },
      "Table Barchart": function(pvtData, opts) {
        return $(datatable(pvtData, opts)).barchart().finalize(opts);
      },
      "Heatmap": function(pvtData, opts) {
        return $(datatable(pvtData, opts)).heatmap().finalize(opts);
      },
      "Row Heatmap": function(pvtData, opts) {
        return $(datatable(pvtData, opts)).heatmap("rowheatmap").finalize(opts);
      },
      "Col Heatmap": function(pvtData, opts) {
        return $(datatable(pvtData, opts)).heatmap("colheatmap").finalize(opts);
      }
    };
  });

}).call(this);

//# sourceMappingURL=datatables_renderers.js.map
