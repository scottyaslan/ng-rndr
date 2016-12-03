define([],
    function() {
        'use strict';

        return function() {
            /**
             * Renderers constructor
             * @type {Renderers}
             */
            function Renderers() {}
            Renderers.prototype = {
                /**
                 * @typedef Renderers
                 * @type {object}
                 * @property {string} id - The UUID for this data source configuration.
                 * @property {string} flattenDataFunctionString - The code .
                 * @property {object} httpConfig - Angular http config: https://docs.angularjs.org/api/ng/service/$http#usage.
                 * @property {string} name - The human readable name for this data source configuration.
                 */
                constructor: Renderers,
                /**
                 * Adds a {@link Renderer} function by `name` for fast lookup.
                 * 
                 * @param {string} name     The lookup name of the renderer.
                 * @param {function} renderer A `renderer` is a function that defines what the user will actually see. It takes as parameters a `dataView` object defined by thie `dataViewName` and the `opts` object and returns an object.
                 * @param {string} dataViewName     The name of the `dataView` to be passed to the `renderer` function.
                 * @param {object} opts     The options to be passed to the `renderer` function.
                 * @param {function} finalize     The post rendering function defined for a particular visualization. It takes as parameters a `jQuery` object (which will be the "visualization" and injected into the DOM) and the `results` object returned by the `renderer` function.
                 */
                add: function(name, renderer, dataViewName, opts, finalize) {
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

            return new Renderers();
        }
    });
