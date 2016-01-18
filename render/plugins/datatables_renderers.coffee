###
    Data Analytics Toolkit: Explore any data avaialable through a REST service 
    Copyright (C) 2016  Scott Aslan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.html>.
###
callWithJQuery = (pivotModule) ->
    if typeof exports is "object" and typeof module is "object" # CommonJS
        pivotModule require("jquery")
    else if typeof define is "function" and define.amd # AMD
        define ["jquery"], pivotModule
    # Plain browser env
    else
        pivotModule jQuery
        
callWithJQuery ($) ->
    
    datatable = (pivotData, opts) ->
        defaults =
            localeStrings:
                totals: "Totals"

        opts = $.extend defaults, opts

        colAttrs = pivotData.colAttrs
        rowAttrs = pivotData.rowAttrs
        rowKeys = pivotData.getRowKeys()
        colKeys = pivotData.getColKeys()

        #now actually build the output
        result = document.createElement("table")
        $(result).width(opts.datatables.width)
        result.className = opts.datatables.class.join(" ")
        thead = document.createElement("thead")
        tbody = document.createElement("tbody")
        tfoot = document.createElement("tfoot")

        #helper function for setting row/col-span in pivotTableRenderer
        spanSize = (arr, i, j) ->
            if i != 0
                noDraw = true
                for x in [0..j]
                    if arr[i-1][x] != arr[i][x]
                        noDraw = false
                if noDraw
                  return -1 #do not draw cell
            len = 0
            while i+len < arr.length
                stop = false
                for x in [0..j]
                    stop = true if arr[i][x] != arr[i+len][x]
                break if stop
                len++
            return len

        #the first few rows are for col headers
        for own j, c of colAttrs
            tr = document.createElement("tr")
            if parseInt(j) == 0 and rowAttrs.length != 0
                th = document.createElement("th")
                th.setAttribute("colspan", rowAttrs.length)
                th.setAttribute("rowspan", colAttrs.length)
                tr.appendChild th
            th = document.createElement("th")
            th.className = "pvtAxisLabel"
            $(th).css("white-space", "nowrap")
            th.innerHTML = c
            tr.appendChild th
            for own i, colKey of colKeys
                x = spanSize(colKeys, parseInt(i), parseInt(j))
                if x != -1
                    th = document.createElement("th")
                    $(th).off('dblclick').on 'dblclick', (event) ->
                        # Create a new jQuery.Event object with specified event properties.
                        e = $.Event( "colLabelDrillDownEvent", { event: event, renderingEngineId: opts.renderingEngineId } );
                        $(window).trigger( e );
                    th.className = "pvtColLabel"
                    th.innerHTML = colKey[j]
                    th.setAttribute("colspan", x)
                    if parseInt(j) == colAttrs.length-1 and rowAttrs.length != 0
                        th.setAttribute("rowspan", 2)
                    tr.appendChild th
            if parseInt(j) == 0
                th = document.createElement("th")
                th.className = "pvtTotalLabel"
                th.innerHTML = opts.localeStrings.totals
                th.setAttribute("rowspan", colAttrs.length + (if rowAttrs.length ==0 then 0 else 1))
                tr.appendChild th
            thead.appendChild tr

        #then a row for row header headers
        if rowAttrs.length !=0
            tr = document.createElement("tr")
            for own i, r of rowAttrs
                th = document.createElement("th")
                $(th).css("white-space", "nowrap")
                th.className = "pvtAxisLabel"
                th.innerHTML = r
                tr.appendChild th 
            th = document.createElement("th")
            if colAttrs.length ==0
                th.className = "pvtTotalLabel"
                th.innerHTML = opts.localeStrings.totals
            tr.appendChild th
            thead.appendChild tr

        #now the actual data rows, with their row headers and totals
        for own i, rowKey of rowKeys
            tr = document.createElement("tr")
            for own j, txt of rowKey
                th = document.createElement('th')
                $(th).css("white-space", "nowrap")
                $(th).off('dblclick').on 'dblclick', (event) ->
                    # Create a new jQuery.Event object with specified event properties.
                    e = $.Event( "rowLabelDrillDownEvent", { event: event, renderingEngineId: opts.renderingEngineId } );
                    $(window).trigger( e );
                th.className = 'pvtRowLabel'
                th.innerHTML = txt
                tr.appendChild th
                if parseInt(j) == rowAttrs.length-1 and colAttrs.length !=0
                    tr.appendChild document.createElement('th')
            for own j, colKey of colKeys #this is the tight loop
                aggregator = pivotData.getAggregator(rowKey, colKey)
                val = aggregator.value()
                td = document.createElement("td")
                td.className = "pvtVal row#{i} col#{j}"
                td.innerHTML = aggregator.format(val)
                td.setAttribute("data-value", val)
                tr.appendChild td

            totalAggregator = pivotData.getAggregator(rowKey, [])
            val = totalAggregator.value()
            td = document.createElement("td")
            td.className = "pvtTotal rowTotal"
            td.innerHTML = totalAggregator.format(val)
            td.setAttribute("data-value", val)
            td.setAttribute("data-for", "row"+i)
            tr.appendChild td
            tbody.appendChild tr

        #finally, the row for col totals, and a grand total
        tr = document.createElement("tr")
        th = document.createElement("th")
        th.className = "pvtTotalLabel"
        th.innerHTML = opts.localeStrings.totals
        th.setAttribute("colspan", rowAttrs.length + (if colAttrs.length == 0 then 0 else 1))
        tr.appendChild th
        for own j, colKey of colKeys
            totalAggregator = pivotData.getAggregator([], colKey)
            val = totalAggregator.value()
            td = document.createElement("td")
            td.className = "pvtTotal colTotal"
            td.innerHTML = totalAggregator.format(val)
            td.setAttribute("data-value", val)
            td.setAttribute("data-for", "col"+j)
            tr.appendChild td
        totalAggregator = pivotData.getAggregator([], [])
        val = totalAggregator.value()
        td = document.createElement('td')
        td.className = 'pvtGrandTotal'
        td.innerHTML = totalAggregator.format(val)
        td.setAttribute("data-value", val)
        tr.appendChild td
        result.appendChild thead
        result.appendChild tbody
        tfoot.appendChild tr
        result.appendChild tfoot

        #squirrel this away for later
        result.setAttribute("data-numrows", rowKeys.length)
        result.setAttribute("data-numcols", colKeys.length)

        return result
    
    $.fn.finalize = (opts)  ->
        numRows = opts.numRows
        numCols = opts.numCols
        
        numFixedLeftCols = numRows
        if numCols > 0
          numFixedLeftCols = numFixedLeftCols + 1
            
        postRenderOpts = 
          scrollY: opts['datatables'].height
          fixedColumns:
            leftColumns: numFixedLeftCols
            rightColumns: 1
          scrollX: true
          scrollCollapse: true
          paging: false
          keys: true
          dom: 'Bfrtip'
          buttons: [
            'csvHtml5'
            'pdfHtml5'
            'print'
          ]
    
        if numRows != 0 or numCols != 0
            return returnObject = 
                html: this.width('100%') #DataTables needs the table to be 100% wide
                type: 'datatables'
                postRenderOpts: postRenderOpts
                postRenderFunction: (html, opts) ->
                    $(html).DataTable(opts)
                    return
        
        return returnObject = 
                html: this
                type: 'datatables'
    
    
    ###
    Heatmap post-processing
    ###

    $.fn.heatmap = (scope = "heatmap") ->
        numRows = @data "numrows"
        numCols = @data "numcols"

        colorGen = (color, min, max) ->
            hexGen = switch color
                when "red"   then (hex) -> "ff#{hex}#{hex}"
                when "green" then (hex) -> "#{hex}ff#{hex}"
                when "blue"  then (hex) -> "#{hex}#{hex}ff"

            return (x) ->
                intensity = 255 - Math.round 255*(x-min)/(max-min)
                hex = intensity.toString(16).split(".")[0]
                hex = 0+hex if hex.length == 1
                return hexGen(hex)

        heatmapper = (scope, color) =>
            forEachCell = (f) =>
                @find(scope).each ->
                    x = $(this).data("value")
                    f(x, $(this)) if x? and isFinite(x)

            values = []
            forEachCell (x) -> values.push x
            colorFor = colorGen color, Math.min(values...), Math.max(values...)
            forEachCell (x, elem) -> elem.css "background-color", "#" + colorFor(x)

        switch scope
            when "heatmap"
                heatmapper ".pvtVal", "red"
            when "rowheatmap"
                heatmapper ".pvtVal.row#{i}", "red" for i in [0...numRows]
            when "colheatmap"
                heatmapper ".pvtVal.col#{j}", "red" for j in [0...numCols]

        heatmapper ".pvtTotal.rowTotal", "red"
        heatmapper ".pvtTotal.colTotal", "red"

        return this

    ###
    Barchart post-processing
    ###

    $.fn.barchart =  ->
        numRows = @data "numrows"
        numCols = @data "numcols"

        barcharter = (scope) =>
            forEachCell = (f) =>
                @find(scope).each ->
                    x = $(this).data("value")
                    f(x, $(this)) if x? and isFinite(x)

            values = []
            forEachCell (x) -> values.push x
            max = Math.max(values...)
            scaler = (x) -> 100*x/(1.4*max)
            forEachCell (x, elem) ->
                text = elem.text()
                wrapper = $("<div>").css
                    "position": "relative"
                wrapper.append $("<div>").css
                    "position": "absolute"
                    "bottom": -2
                    "left": 0
                    "right": 0
                    "height": scaler(x) + "%"
                    "background-color": "gray"
                wrapper.append $("<div>").text(text).css
                    "position":"relative"
                    "padding-left":"5px"
                    "padding-right":"5px"

                elem.css("padding": 0,"padding-top": "5px", "text-align": "center").html wrapper

        barcharter ".pvtVal.row#{i}" for i in [0...numRows]
        barcharter ".pvtTotal.colTotal"

        return this
    
    datatables_renderers =
        "Table":          (pvtData, opts) ->   $(datatable(pvtData, opts)).finalize(opts)
        "Table Barchart": (pvtData, opts) -> $(datatable(pvtData, opts)).barchart().finalize(opts)
        "Heatmap":        (pvtData, opts) -> $(datatable(pvtData, opts)).heatmap().finalize(opts)
        "Row Heatmap":    (pvtData, opts) -> $(datatable(pvtData, opts)).heatmap("rowheatmap").finalize(opts)
        "Col Heatmap":    (pvtData, opts) -> $(datatable(pvtData, opts)).heatmap("colheatmap").finalize(opts)