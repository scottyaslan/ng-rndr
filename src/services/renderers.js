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
                 * @param {Renderer} renderer Need to figure out how to document the return type of a {@link Renderer}
                 * @param {RendererOpts} opts     Need to figure out how to document the options for the `renderer`.
                 */
                add: function(name, renderer, opts) {
                    this[name] = {
                        render: renderer,
                        opts: opts
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
