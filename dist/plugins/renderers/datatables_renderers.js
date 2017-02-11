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
        define(['jquery'], function($) {
            return (root.ngRndr.plugins.renderers['datatables'] = factory($));
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = (root.ngRndr.plugins.renderers['datatables'] = factory(require('jquery')));
    } else {
        root.ngRndr.plugins.renderers['datatables'] = factory(root.$);
    }
}(this, function($) {
    var datatable = function(renderingEngine, opts) {
        var aggregator, c, colAttrs, colKey, colKeys, defaults, i, j, r, result, rowAttrs, rowKey, rowKeys, spanSize, tbody, td, tfoot, th, thead, totalAggregator, tr, txt, val, x;
        defaults = {
            clazz: ['pvtTable'],
            locales: {
                en: {
                    localeStrings: {
                        totals: 'Totals'
                    }
                }
            }
        };
        opts = $.extend(true, defaults, opts);
        colAttrs = renderingEngine.dataView.colAttrs;
        rowAttrs = renderingEngine.dataView.rowAttrs;
        rowKeys = renderingEngine.dataView.getRowKeys();
        colKeys = renderingEngine.dataView.getColKeys();
        result = document.createElement('table');
        $(result).width(opts.width + opts.widthOffset + 'px');
        $(result).height(opts.height + opts.heightOffset + 'px');
        result.className = opts['clazz'].join(' ');
        thead = document.createElement('thead');
        tbody = document.createElement('tbody');
        tfoot = document.createElement('tfoot');
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
            if (!colAttrs.hasOwnProperty(j)) continue;
            c = colAttrs[j];
            tr = document.createElement('tr');
            if (parseInt(j) === 0 && rowAttrs.length !== 0) {
                th = document.createElement('th');
                th.setAttribute('colspan', rowAttrs.length);
                th.setAttribute('rowspan', colAttrs.length);
                tr.appendChild(th);
            }
            th = document.createElement('th');
            th.className = 'pvtAxisLabel';
            $(th).css('white-space', 'nowrap');
            th.innerHTML = c;
            tr.appendChild(th);
            for (i in colKeys) {
                if (!colKeys.hasOwnProperty(i)) continue;
                colKey = colKeys[i];
                x = spanSize(colKeys, parseInt(i), parseInt(j));
                if (x !== -1) {
                    th = document.createElement('th');
                    $(th).off('dblclick').on('dblclick', function(event) {
                        var e;
                        e = $.Event('colLabelDrillDownEvent', {
                            event: event,
                            renderingEngineId: renderingEngine.id
                        });
                        return $(window).trigger(e);
                    });
                    th.className = 'pvtColLabel';
                    th.innerHTML = colKey[j];
                    th.setAttribute('colspan', x);
                    if (parseInt(j) === colAttrs.length - 1 && rowAttrs.length !== 0) {
                        th.setAttribute('rowspan', 2);
                    }
                    tr.appendChild(th);
                }
            }
            if (parseInt(j) === 0) {
                th = document.createElement('th');
                th.className = 'pvtTotalLabel';
                th.innerHTML = opts.locales[renderingEngine.localeName].localeStrings.totals;
                th.setAttribute('rowspan', colAttrs.length + (rowAttrs.length === 0 ? 0 : 1));
                tr.appendChild(th);
            }
            thead.appendChild(tr);
        }
        if (rowAttrs.length !== 0) {
            tr = document.createElement('tr');
            for (i in rowAttrs) {
                if (!rowAttrs.hasOwnProperty(i)) continue;
                r = rowAttrs[i];
                th = document.createElement('th');
                $(th).css('white-space', 'nowrap');
                th.className = 'pvtAxisLabel';
                th.innerHTML = r;
                tr.appendChild(th);
            }
            th = document.createElement('th');
            if (colAttrs.length === 0) {
                th.className = 'pvtTotalLabel';
                th.innerHTML = opts.locales[renderingEngine.localeName].localeStrings.totals;
            }
            tr.appendChild(th);
            thead.appendChild(tr);
        }
        for (i in rowKeys) {
            if (!rowKeys.hasOwnProperty(i)) continue;
            rowKey = rowKeys[i];
            tr = document.createElement('tr');
            for (j in rowKey) {
                if (!rowKey.hasOwnProperty(j)) continue;
                txt = rowKey[j];
                th = document.createElement('th');
                $(th).css('white-space', 'nowrap');
                $(th).off('dblclick').on('dblclick', function(event) {
                    var e;
                    e = $.Event('rowLabelDrillDownEvent', {
                        event: event,
                        renderingEngineId: renderingEngine.id
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
                if (!colKeys.hasOwnProperty(j)) continue;
                colKey = colKeys[j];
                aggregator = renderingEngine.dataView.getAggregator(rowKey, colKey);
                val = aggregator.value();
                td = document.createElement('td');
                td.className = 'pvtVal row' + i + ' col' + j;
                td.innerHTML = aggregator.format(val);
                td.setAttribute('data-value', val);
                $(td).off('dblclick').on('dblclick', function(event) {
                    var e;
                    e = $.Event('pvtValueDrillDownEvent', {
                        event: event,
                        renderingEngineId: renderingEngine.id
                    });
                    return $(window).trigger(e);
                });
                tr.appendChild(td);
            }
            totalAggregator = renderingEngine.dataView.getAggregator(rowKey, []);
            val = totalAggregator.value();
            td = document.createElement('td');
            td.className = 'pvtTotal rowTotal';
            td.innerHTML = totalAggregator.format(val);
            td.setAttribute('data-value', val);
            td.setAttribute('data-for', 'row' + i);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
        tr = document.createElement('tr');
        th = document.createElement('th');
        th.className = 'pvtTotalLabel';
        th.innerHTML = opts.locales[renderingEngine.localeName].localeStrings.totals;
        th.setAttribute('colspan', rowAttrs.length + (colAttrs.length === 0 ? 0 : 1));
        tr.appendChild(th);
        for (j in colKeys) {
            if (!colKeys.hasOwnProperty(j)) continue;
            colKey = colKeys[j];
            totalAggregator = renderingEngine.dataView.getAggregator([], colKey);
            val = totalAggregator.value();
            td = document.createElement('td');
            td.className = 'pvtTotal colTotal';
            td.innerHTML = totalAggregator.format(val);
            td.setAttribute('data-value', val);
            td.setAttribute('data-for', 'col' + j);
            tr.appendChild(td);
        }
        totalAggregator = renderingEngine.dataView.getAggregator([], []);
        val = totalAggregator.value();
        td = document.createElement('td');
        td.className = 'pvtGrandTotal';
        td.innerHTML = totalAggregator.format(val);
        td.setAttribute('data-value', val);
        tr.appendChild(td);
        result.appendChild(thead);
        result.appendChild(tbody);
        tfoot.appendChild(tr);
        result.appendChild(tfoot);
        result.setAttribute('data-numrows', rowKeys.length);
        result.setAttribute('data-numcols', colKeys.length);
        result.setAttribute('data-numcolattrs', colAttrs.length);
        result.setAttribute('data-numrowattrs', rowAttrs.length);

        return result;
    };
    $.fn.finalize = function(opts) {
        return {
            html: this,
        };
    };

    /*
    Heatmap post-processing
     */
    $.fn.heatmap = function(scope, opts) {
        var colorScaleGenerator, heatmapper, i, j, l, n, numCols, numRows, ref, ref1, ref2;
        if (scope == null) {
            scope = 'heatmap';
        }
        numRows = this.data('numrows');
        numCols = this.data('numcols');
        colorScaleGenerator = opts != null ? (ref = opts.heatmap) != null ? ref.colorScaleGenerator : void 0 : void 0;
        if (colorScaleGenerator == null) {
            colorScaleGenerator = function(values) {
                var max, min;
                min = Math.min.apply(Math, values);
                max = Math.max.apply(Math, values);
                return function(x) {
                    var nonRed;
                    if (max === min) {
                        nonRed = 0;
                    } else {
                        nonRed = 255 - Math.round(255 * (x - min) / (max - min));
                    }
                    return 'rgb(255,' + nonRed + ',' + nonRed + ')';
                };
            };
        }
        heatmapper = (function(_this) {
            return function(scope) {
                var colorScale, forEachCell, values;
                forEachCell = function(f) {
                    return _this.find(scope).each(function() {
                        var x;
                        x = $(this).data('value');
                        if ((x != null) && isFinite(x)) {
                            return f(x, $(this));
                        }
                    });
                };
                values = [];
                forEachCell(function(x) {
                    return values.push(x);
                });
                colorScale = colorScaleGenerator(values);
                return forEachCell(function(x, elem) {
                    return elem.css('background-color', colorScale(x));
                });
            };
        })(this);
        switch (scope) {
            case 'heatmap':
                heatmapper('.pvtVal');
                break;
            case 'rowheatmap':
                for (i = l = 0, ref1 = numRows; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
                    heatmapper('.pvtVal.row' + i);
                }
                break;
            case 'colheatmap':
                for (j = n = 0, ref2 = numCols; 0 <= ref2 ? n < ref2 : n > ref2; j = 0 <= ref2 ? ++n : --n) {
                    heatmapper('.pvtVal.col' + j);
                }
        }
        heatmapper('.pvtTotal.rowTotal');
        heatmapper('.pvtTotal.colTotal');
        return this;
    };

    /*
    Barchart post-processing
     */
    $.fn.barchart = function() {
        var barcharter, i, k, numCols, numRows, ref;
        numRows = this.data('numrows');
        numCols = this.data('numcols');
        barcharter = (function(_this) {
            return function(scope) {
                var forEachCell, max, scaler, values;
                forEachCell = function(f) {
                    return _this.find(scope).each(function() {
                        var x;
                        x = $(this).data('value');
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
                    wrapper = $('<div>').css({
                        'position': 'relative'
                    });
                    wrapper.append($('<div>').css({
                        'position': 'absolute',
                        'bottom': -2,
                        'left': 0,
                        'right': 0,
                        'height': scaler(x) + '%',
                        'background-color': 'gray'
                    }));
                    wrapper.append($('<div>').text(text).css({
                        'position': 'relative',
                        'padding-left': '5px',
                        'padding-right': '5px'
                    }));
                    return elem.css({
                        'padding': 0,
                        'padding-top': '5px',
                        'text-align': 'center'
                    }).html(wrapper);
                });
            };
        })(this);
        for (i = k = 0, ref = numRows; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            barcharter('.pvtVal.row' + i);
        }
        barcharter('.pvtTotal.colTotal');
        return this;
    };
    return {
        'Table': function(pvtData, opts) {
            return $(datatable(pvtData, opts)).finalize(opts);
        },
        'Table Barchart': function(pvtData, opts) {
            return $(datatable(pvtData, opts)).barchart().finalize(opts);
        },
        'Heatmap': function(pvtData, opts) {
            return $(datatable(pvtData, opts)).heatmap('heatmap', opts).finalize(opts);
        },
        'Row Heatmap': function(pvtData, opts) {
            return $(datatable(pvtData, opts)).heatmap('rowheatmap', opts).finalize(opts);
        },
        'Col Heatmap': function(pvtData, opts) {
            return $(datatable(pvtData, opts)).heatmap('colheatmap', opts).finalize(opts);
        }
    };
}));
