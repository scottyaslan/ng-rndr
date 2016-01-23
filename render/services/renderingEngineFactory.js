/*   Data Analytics Toolkit: Explore any data avaialable through a REST service 
*    Copyright (C) 2016  Scott Aslan
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/agpl.html>.
*/
define(['app', 'jquery-csv', '../../render/services/aggregators', '../../render/services/renderingEngineUtils', '../../render/services/renderers', '../../render/services/pivotDataFactory'], function(app) {
    app.factory('RenderingEngineFactory', ['Aggregators', 'RenderingEngineUtils', 'Renderers', 'PivotDataFactory', '$q', '$timeout', '$window', '$rootScope',
        function(Aggregators, RenderingEngineUtils, Renderers, PivotDataFactory, $q, $timeout, $window, $rootScope) {
            function RenderingEngineFactory() {
                this.id;
                this.element;
                this.disabled;
                this.title;
                this.rendererName;
                this.aggregatorName;
                this.aggInputAttributeName;
                this.numInputsToProcess;
                this.axisValues;
                this.shownAttributes;
                this.availableAttributes;
                this.tblCols;
                this.cols;
                this.rows;
                this.attributesAvailableForRowsAndCols;
                this.attributeFilterExclusions;
                this.attributeFilterInclusions;
                this.tile;
            }
            RenderingEngineFactory.prototype = {
                constructor: RenderingEngineFactory,
                init: function(dataSourceConfigId) {
                    var self = this;
                    self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                        return v.toString(16);
                    });
                    self.dataSourceConfigId = dataSourceConfigId;
                    //Does not belong here...This is a flag that the tabs use in the
                    //Explore perspective to know which tab is active. We should have
                    //some sort of tab manager that tracks this...
                    self.disabled = false; 
                    self.title = "Untitiled";
                    //Does not belong here...This is an objet the dashboardFactory uses in
                    //the Dashboard Designer perspective to know location and size of the widget.
                    //We should have some sort of dashboard manager that tracks this...
                    self.tile = {
                        size_x: 1,
                        size_y: 1,
                        col: 1,
                        row: 1
                    };
                    self.rendererName = "Table";
                    self.aggregatorName = "Count";
                    self.aggInputAttributeName = [];
                    self.numInputsToProcess = [];
                    self.axisValues = {};
                    self.shownAttributes = [];
                    self.availableAttributes = [];
                    self.tblCols = [];
                    self.cols = [];
                    self.rows = [];
                    self.attributesAvailableForRowsAndCols = [];
                    self.attributeFilterExclusions = {};
                    self.attributeFilterInclusions = {};
                },
                setRendererName: function(rendererName, data) {
                    var self = this;
                    self.rendererName = rendererName;
                    self.draw(data);
                },
                setNumberOfAggregateInputs: function (){
                    var self = this;
                    var numInputs;
                    try {
                        numInputs = Aggregators.availableAggregators[self.aggregatorName]([])().numInputs;
                    } catch(_error) {
                        //Log error and do nothing...we just needed to know how many inputs we need to collect
                        e = _error;
                        if (typeof console !== "undefined" && console !== null) {
                            console.error(e.stack);
                        }
                    }
                    if(numInputs === undefined) {
                        self.numInputsToProcess = new Array();
                        self.aggInputAttributeName = new Array();
                    } else {
                        self.numInputsToProcess = new Array(numInputs);
                        if(self.aggInputAttributeName.length !== numInputs) {
                            self.aggInputAttributeName = new Array(numInputs);
                        }
                    }
                },
                setAggregatorName: function(aggregatorName) {
                    var self = this;
                    self.aggregatorName = aggregatorName;
                },
                isExcluded: function(property, key) {
                    var self = this;
                    if(self.attributeFilterExclusions[property] !== undefined) {
                        if(self.attributeFilterExclusions[property].indexOf(key) >= 0){
                            return false;
                        } else {
                            return true;    
                        }
                    }
                    return true;
                },
                addExclusionFilter: function(attributeFilterName, filterByAttributeValue) {
                    var self = this;
                    if(self.attributeFilterExclusions[attributeFilterName] !== undefined) {
                        var index = this.attributeFilterExclusions[attributeFilterName].indexOf(filterByAttributeValue);
                        if(index >= 0) {
                            self.attributeFilterExclusions[attributeFilterName].splice(index, 1);
                        } else {
                            self.attributeFilterExclusions[attributeFilterName].push(filterByAttributeValue);
                        }
                    } else {
                        self.attributeFilterExclusions[attributeFilterName] = [];
                        self.attributeFilterExclusions[attributeFilterName].push(filterByAttributeValue);
                    } 
                    self.attributeFilterInclusions[attributeFilterName] = [];
                    angular.forEach(self.axisValues[attributeFilterName], function(value, key) {
                        if(self.attributeFilterExclusions[attributeFilterName].indexOf(key) < 0) {
                            self.attributeFilterInclusions[attributeFilterName].push(key);
                        }
                    });
                },
                addInclusionFilter: function(attributeFilterName, filterByAttributeValue) {
                    var self = this;
                    self.attributeFilterInclusions[attributeFilterName] = [];
                    self.attributeFilterExclusions[attributeFilterName] = [];
                    self.addExclusionFilter(attributeFilterName, filterByAttributeValue);
                    var oldAttributeFilterInclusions = self.attributeFilterInclusions[attributeFilterName];
                    self.attributeFilterInclusions[attributeFilterName] = self.attributeFilterExclusions[attributeFilterName];
                    self.attributeFilterExclusions[attributeFilterName] = oldAttributeFilterInclusions;
                },
                //Does not belong here...This is an objet the dashboardFactory uses in
                //the Dashboard Designer perspective to know location and size of the widget.
                //We should have some sort of dashboard manager that tracks this...
                updateTile: function(size_x, size_y, col, row){
                    var self = this;
                    self.tile = {
                        size_x: size_x,
                        size_y: size_y,
                        col: col,
                        row: row
                    };
                },
                /*
                 * @param {string} [table]
                 *    A plain JSON-serialized string of the data.
                 */
                draw: function(data) {
                    var self = this;
                    var deferred = $q.defer();
                    $rootScope.$emit('draw initiated');
                    $timeout(function(data) {
                        //Set the RenderingEngine id, # rows, and #cols for access in renderer
                        Renderers.availableRendererOptions['renderingEngineId'] = self.id;
                        Renderers.availableRendererOptions['numRows'] = self.rows.length;
                        Renderers.availableRendererOptions['numCols'] = self.cols.length;
                        //Set the height and width for each renderer option to fit into container
                        angular.forEach(Renderers.availableRendererOptions, function(value, key) {
                            switch (key){
                                case "datatables":
                                    value.height = (self.element.parent().parent().innerHeight() - 24 - 40 - 31 - 31 - 22 - ((self.cols.length + 1)*30)) + 'px'; //height - header - buttons - table head - table foot - bottom message - # of cols
                                    value.width = self.element.parent().parent().innerWidth();
                                    break;
                                case "gchart":
                                    value.height = self.element.parent().parent().innerHeight() - 24 - 10;//height - header - title?
                                    value.width = self.element.parent().parent().innerWidth();
                                    break;
                                case "c3":
                                    value.size.height = self.element.parent().parent().innerHeight() - 24 - 10;//height - header - title?
                                    value.size.width = self.element.parent().parent().innerWidth();
                                    break;
                                case "d3":
                                    value.height = function(){ return self.element.parent().parent().innerHeight();};//height is ignored for d3???
                                    value.width = function(){ return self.element.parent().parent().innerWidth() - 16;};//d3 draws a little too wide???
                                    break;
                                default:
                                    //do nothing
                            }
                                    
                        });
                        try{
                          data = angular.fromJson(data);
                        } catch(e){
                          try{
                            data = $.csv.toArrays(data);
                          } catch(e){
                            //Do nothing
                          }
                        }
                        data = RenderingEngineUtils.convertToArray(data);
                        if(data !== undefined){
                            if(data.length > 0){
                                self.availableAttributes = self.rows.concat(self.cols);
                                var opts = {
                                    cols: self.cols,
                                    rows: self.rows,
                                    vals: self.aggInputAttributeName,
                                    hiddenAttributes: [],
                                    filter: function(record) {
                                        var excludedItems, ref7;
                                        for (k in self.attributeFilterExclusions) {
                                            excludedItems = self.attributeFilterExclusions[k];
                                            if (ref7 = "" + record[k], RenderingEngineUtils.indexOf.call(excludedItems, ref7) >= 0) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    },
                                    aggregator: Aggregators.availableAggregators[self.aggregatorName](self.aggInputAttributeName),
                                    aggregatorName: self.aggregatorName,
                                    sorters: function() {},
                                    derivedAttributes: {}
                                };
                                self.tblCols = [];
                                self.tblCols = (function() {
                                    var ref, results;
                                    ref = data[0];
                                    results = [];
                                    for (k in ref) {
                                        if (!RenderingEngineUtils.hasProp.call(ref, k)) continue;
                                        results.push(k);
                                    }
                                    return results;
                                })();
                                self.axisValues = {};
                                for (l = 0, len1 = self.tblCols.length; l < len1; l++) {
                                    x = self.tblCols[l];
                                    self.axisValues[x] = {};
                                }
                                RenderingEngineUtils.forEachRecord(data, opts.derivedAttributes, function(record) {
                                    var base, results, v;
                                    results = [];
                                    for (k in record) {
                                        if (!RenderingEngineUtils.hasProp.call(record, k)) continue;
                                        v = record[k];
                                        if (v == null) {
                                            v = "null";
                                        }
                                        if ((base = self.axisValues[k])[v] == null) {
                                            base[v] = 0;
                                        }
                                        results.push(self.axisValues[k][v]++);
                                    }
                                    return results;
                                });
                                self.shownAttributes = [];
                                self.shownAttributes = (function() {
                                    var len2, n, results;
                                    results = [];
                                    for (n = 0, len2 = self.tblCols.length; n < len2; n++) {
                                        c = self.tblCols[n];
                                        if (RenderingEngineUtils.indexOf.call(opts.hiddenAttributes, c) < 0) {
                                            results.push(c);
                                        }
                                    }
                                    return results;
                                })();
                                if(self.attributesAvailableForRowsAndCols.length + self.rows.length + self.cols.length !== self.shownAttributes.length) {
                                    self.attributesAvailableForRowsAndCols = self.shownAttributes;
                                }
                                var result = null;
                                var DataView = null;
                                try {
                                    DataView = new PivotDataFactory();
                                    DataView.init(data, opts);
                                    try {
                                        result = Renderers.availableRenderers[self.rendererName](DataView, Renderers.availableRendererOptions);
                                    } catch (_error) {
                                        e = _error;
                                        if (typeof console !== "undefined" && console !== null) {
                                            console.error(e.stack);
                                        }
                                        result = $("<span>").html(opts.localeStrings.renderError);
                                    }
                                } catch (_error) {
                                    e = _error;
                                    if (typeof console !== "undefined" && console !== null) {
                                        console.error(e.stack);
                                    }
                                    result = $("<span>").html(opts.localeStrings.computeError);
                                }
                                //Remove old viz
                                self.element.empty();
                                //append the new viz
                                self.element.append(result.html);
                                $rootScope.$emit('draw complete');
                                //run any post render functions defined by visual
                                if(result.postRenderFunction){
                                    result.postRenderFunction(result.html, result.postRenderOpts);
                                }
                                //clean up
                                delete DataView;
                                delete data;
                                delete result;
                            }
                        }
                        deferred.resolve();
                    }, 1500, true, data);
                    return deferred.promise;
                }
            };
            return RenderingEngineFactory;
        }
    ]);
});