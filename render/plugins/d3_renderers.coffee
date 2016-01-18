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
        pivotModule require("jquery"), require("d3")
    else if typeof define is "function" and define.amd # AMD
        define ["jquery", "d3"], pivotModule
    # Plain browser env
    else
        pivotModule jQuery, d3
        
callWithJQuery ($, d3) ->

    d3_renderers = Treemap: (pivotData, opts) ->
        defaults =
            localeStrings: {}
            d3:
                width: -> $(window).width() / 1.4
                height: -> $(window).height() / 1.4

        opts = $.extend defaults, opts


        result = $("<div>").css(width: opts.d3.width(), height: opts.d3.height())

        tree = name: "All", children: []
        addToTree = (tree, path, value) ->
            if path.length == 0
                tree.value = value
                return
            tree.children ?= []
            x = path.shift()
            for child in tree.children when child.name == x
                addToTree(child, path, value)
                return
            newChild = name: x
            addToTree(newChild, path, value)
            tree.children.push newChild

        for rowKey in pivotData.getRowKeys()
            value = pivotData.getAggregator(rowKey, []).value()
            if value?
                addToTree(tree, rowKey, value)

        color = d3.scale.category10()
        width = opts.d3.width()
        height = opts.d3.height()

        treemap = d3.layout.treemap()
            .size([width, height])
            .sticky(true)
            .value( (d) -> d.size )

        d3.select(result[0])
            .append("div")
                .style("position", "relative")
                .style("width", width + "px")
                .style("height", height + "px")
            .datum(tree).selectAll(".node")
                .data(treemap.padding([15,0,0,0]).value( (d) -> d.value ).nodes)
            .enter().append("div")
            .attr("class", "node")
            .style("background", (d) -> if d.children? then "lightgrey" else color(d.name) )
            .text( (d) -> d.name )
            .call ->
                    this.style("left",  (d) -> d.x+"px" )
                        .style("top",   (d) -> d.y+"px" )
                        .style("width", (d) -> Math.max(0, d.dx - 1)+"px" )
                        .style("height",(d) -> Math.max(0, d.dy - 1)+"px" )
                    return
        
        return returnObject = 
                html: result
    


