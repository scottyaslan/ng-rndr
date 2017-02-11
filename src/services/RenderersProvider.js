define(['jquery'],
    function($) {
        'use strict';

        return function RenderersProvider() {
            var renderers = {};

            /**
             * Adds a renderer function.
             * 
             * @param {string} name     The lookup name of the renderer.
             * @param {function} renderer A "data visulization constructing" function.
             * @param {string} dataViewName     The name of the `dataView` used by the `renderer` function.
             * @param {object} opts     Overrides or extends the options for the `renderer`.
             * @param {function} finalize     The post rendering function for the attached and visible DOM ouput of the `renderer`. Allows users to apply other jQuery plugins to the visualization. It takes as parameters:
             *                                Parameter  | Type | Description
             *                                ---------  | ---- | -----------
             *                                `element` | jQuery | The jQuery object of the containing DOM element for the rendered visualization.
             *                                `result` | object | The object returned from the renderer.
             *                                `opts` | object | The `opts` object passed to the render function.
             */
            this.add = function(name, renderer, dataViewName, opts, finalize) {
                if (finalize === undefined || finalize === '' || finalize === null) {
                    finalize = function(element, result, opts) {};
                }
                renderers[name] = {
                    render: renderer,
                    opts: opts,
                    dataViewName: dataViewName,
                    finalize: finalize
                };
            };

            this.$get = [function RenderersFactory() {
                /**
                 * A dictionary of renderer functions.
                 */
                function Renderers(renderers) {
                    $.extend(this, renderers);
                }
                Renderers.prototype = {
                    constructor: Renderers,
                    /**
                     * Adds a renderer function.
                     * 
                     * @param {string} name     The lookup name of the renderer.
                     * @param {function} renderer A "data visulization constructing" function.
                     * @param {string} dataViewName     The name of the `dataView` used by the `renderer` function.
                     * @param {object} opts     Overrides or extends the options for the `renderer`.
                     * @param {function} finalize     The post rendering function for the attached and visible DOM ouput of the `renderer`. Allows users to apply other jQuery plugins to the visualization. It takes as parameters:
                     * Parameter  | Type | Description
                     * ---------  | ---- | -----------
                     * `element` | jQuery | The jQuery object of the containing DOM element for the rendered visualization.
                     * `result` | object | The object returned from the renderer.
                     * `opts` | object | The `opts` object passed to the render function.
                     */
                    add: function(name, renderer, dataViewName, opts, finalize) {
                        if (finalize === undefined || finalize === '' || finalize === null) {
                            finalize = function(element, result, opts) {};
                        }
                        this[name] = {
                            render: renderer,
                            opts: opts,
                            dataViewName: dataViewName,
                            finalize: finalize
                        };
                    },
                    /**
                     * Lists the available renderer plugins.
                     * 
                     * @return {Array.<string>} The lookup names.
                     */
                    list: function() {
                        return Object.keys(this);
                    }
                };

                return new Renderers(renderers);
            }];
        }
    });
