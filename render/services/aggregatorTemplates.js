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
define(['app', '../../common/services/serviceProvider', '../../render/services/renderingEngineUtils'], function(app) {
    app.factory('AggregatorTemplates', ["ServiceProvider", "RenderingEngineUtils",
        function(ServiceProvider, RenderingEngineUtils) {
            function AggregatorTemplates() {
                this.aggregatorTemplates;
            }
            AggregatorTemplates.prototype = {
                constructor: AggregatorTemplates,
                init: function(){
                    if(ServiceProvider.AggregatorTemplates === undefined){
                        ServiceProvider.add('AggregatorTemplates', agregatorTemplates);
                    }
                },
                count: function(formatter) {
                    if (formatter == null) {
                        formatter = RenderingEngineUtils.usFmtInt;
                    }
                    return function() {
                        return function(data, rowKey, colKey) {
                            return {
                                count: 0,
                                push: function() {
                                    return this.count++;
                                },
                                value: function() {
                                    return this.count;
                                },
                                format: formatter
                            };
                        };
                    };
                },
                countUnique: function(formatter) {
                    if (formatter == null) {
                        formatter = RenderingEngineUtils.usFmtInt;
                    }
                    return function(arg) {
                        var attr;
                        attr = arg[0];
                        return function(data, rowKey, colKey) {
                            return {
                                uniq: [],
                                push: function(record) {
                                    var ref;
                                    if (ref = record[attr], indexOf.call(this.uniq, ref) < 0) {
                                        return this.uniq.push(record[attr]);
                                    }
                                },
                                value: function() {
                                    return this.uniq.length;
                                },
                                format: formatter,
                                numInputs: attr != null ? 0 : 1
                            };
                        };
                    };
                },
                listUnique: function(sep) {
                    return function(arg) {
                        var attr;
                        attr = arg[0];
                        return function(data, rowKey, colKey) {
                            return {
                                uniq: [],
                                push: function(record) {
                                    var ref;
                                    if (ref = record[attr], indexOf.call(this.uniq, ref) < 0) {
                                        return this.uniq.push(record[attr]);
                                    }
                                },
                                value: function() {
                                    return this.uniq.join(sep);
                                },
                                format: function(x) {
                                    return x;
                                },
                                numInputs: attr != null ? 0 : 1
                            };
                        };
                    };
                },
                sum: function(formatter) {
                    if (formatter == null) {
                        formatter = RenderingEngineUtils.usFmt;
                    }
                    return function(arg) {
                        var attr;
                        attr = arg[0];
                        return function(data, rowKey, colKey) {
                            return {
                                sum: 0,
                                push: function(record) {
                                    if (!isNaN(parseFloat(record[attr]))) {
                                        return this.sum += parseFloat(record[attr]);
                                    }
                                },
                                value: function() {
                                    return this.sum;
                                },
                                format: formatter,
                                numInputs: attr != null ? 0 : 1
                            };
                        };
                    };
                },
                min: function(formatter) {
                    if (formatter == null) {
                        formatter = RenderingEngineUtils.usFmt;
                    }
                    return function(arg) {
                        var attr;
                        attr = arg[0];
                        return function(data, rowKey, colKey) {
                            return {
                                val: null,
                                push: function(record) {
                                    var ref, x;
                                    x = parseFloat(record[attr]);
                                    if (!isNaN(x)) {
                                        return this.val = Math.min(x, (ref = this.val) != null ? ref : x);
                                    }
                                },
                                value: function() {
                                    return this.val;
                                },
                                format: formatter,
                                numInputs: attr != null ? 0 : 1
                            };
                        };
                    };
                },
                max: function(formatter) {
                    if (formatter == null) {
                        formatter = RenderingEngineUtils.usFmt;
                    }
                    return function(arg) {
                        var attr;
                        attr = arg[0];
                        return function(data, rowKey, colKey) {
                            return {
                                val: null,
                                push: function(record) {
                                    var ref, x;
                                    x = parseFloat(record[attr]);
                                    if (!isNaN(x)) {
                                        return this.val = Math.max(x, (ref = this.val) != null ? ref : x);
                                    }
                                },
                                value: function() {
                                    return this.val;
                                },
                                format: formatter,
                                numInputs: attr != null ? 0 : 1
                            };
                        };
                    };
                },
                average: function(formatter) {
                    if (formatter == null) {
                        formatter = RenderingEngineUtils.usFmt;
                    }
                    return function(arg) {
                        var attr;
                        attr = arg[0];
                        return function(data, rowKey, colKey) {
                            return {
                                sum: 0,
                                len: 0,
                                push: function(record) {
                                    if (!isNaN(parseFloat(record[attr]))) {
                                        this.sum += parseFloat(record[attr]);
                                        return this.len++;
                                    }
                                },
                                value: function() {
                                    return this.sum / this.len;
                                },
                                format: formatter,
                                numInputs: attr != null ? 0 : 1
                            };
                        };
                    };
                },
                sumOverSum: function(formatter) {
                    if (formatter == null) {
                        formatter = RenderingEngineUtils.usFmt;
                    }
                    return function(arg) {
                        var denom, num;
                        num = arg[0], denom = arg[1];
                        return function(data, rowKey, colKey) {
                            return {
                                sumNum: 0,
                                sumDenom: 0,
                                push: function(record) {
                                    if (!isNaN(parseFloat(record[num]))) {
                                        this.sumNum += parseFloat(record[num]);
                                    }
                                    if (!isNaN(parseFloat(record[denom]))) {
                                        return this.sumDenom += parseFloat(record[denom]);
                                    }
                                },
                                value: function() {
                                    return this.sumNum / this.sumDenom;
                                },
                                format: formatter,
                                numInputs: (num != null) && (denom != null) ? 0 : 2
                            };
                        };
                    };
                },
                sumOverSumBound80: function(upper, formatter) {
                    if (upper == null) {
                        upper = true;
                    }
                    if (formatter == null) {
                        formatter = RenderingEngineUtils.usFmt;
                    }
                    return function(arg) {
                        var denom, num;
                        num = arg[0], denom = arg[1];
                        return function(data, rowKey, colKey) {
                            return {
                                sumNum: 0,
                                sumDenom: 0,
                                push: function(record) {
                                    if (!isNaN(parseFloat(record[num]))) {
                                        this.sumNum += parseFloat(record[num]);
                                    }
                                    if (!isNaN(parseFloat(record[denom]))) {
                                        return this.sumDenom += parseFloat(record[denom]);
                                    }
                                },
                                value: function() {
                                    var sign;
                                    sign = upper ? 1 : -1;
                                    return (0.821187207574908 / this.sumDenom + this.sumNum / this.sumDenom + 1.2815515655446004 * sign * Math.sqrt(0.410593603787454 / (this.sumDenom * this.sumDenom) + (this.sumNum * (1 - this.sumNum / this.sumDenom)) / (this.sumDenom * this.sumDenom))) / (1 + 1.642374415149816 / this.sumDenom);
                                },
                                format: formatter,
                                numInputs: (num != null) && (denom != null) ? 0 : 2
                            };
                        };
                    };
                },
                fractionOf: function(wrapped, type, formatter) {
                    if (type == null) {
                        type = "total";
                    }
                    if (formatter == null) {
                        formatter = RenderingEngineUtils.usFmtPct;
                    }
                    return function() {
                        var x;
                        x = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                        return function(data, rowKey, colKey) {
                            return {
                                selector: {
                                    total: [[], []],
                                    row: [rowKey, []],
                                    col: [[], colKey]
                                }[type],
                                inner: wrapped.apply(null, x)(data, rowKey, colKey),
                                push: function(record) {
                                    return this.inner.push(record);
                                },
                                format: formatter,
                                value: function() {
                                    return this.inner.value() / data.getAggregator.apply(data, this.selector).inner.value();
                                },
                                numInputs: wrapped.apply(null, x)().numInputs
                            };
                        };
                    };
                }
            };
            var agregatorTemplates = new AggregatorTemplates();
            agregatorTemplates.init();
            return agregatorTemplates;
        }
    ]);
});