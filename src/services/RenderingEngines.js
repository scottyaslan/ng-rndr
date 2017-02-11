define([],
    function() {
        'use strict';

        return function(RenderingEngine) {
            /**
             * The dictionary of registered {@link RenderingEngine}'s.
             */
            function RenderingEngines() {
                this.init();
            }
            RenderingEngines.prototype = {
                constructor: RenderingEngines,
                /**
                 * Initialize.
                 */
                init: function() {
                    var self = this;
                    self.map = {};
                    // self.activeRenderingEngine = undefined;
                },
                /**
                 * The number of {@link RenderingEngine}'s in this map.
                 * 
                 * @return {number} The number of {@link RenderingEngine}'s in the map.
                 */
                size: function() {
                    return Object.keys(this.map).length;
                },
                /**
                 * Adds a {@link RenderingEngine} to the map.
                 * 
                 * @param {RenderingEngine} dataSource The {@link RenderingEngine} to add.
                 */
                add: function(renderingEngine) {
                    var self = this;
                    self.map[renderingEngine.id] = renderingEngine;
                },
                /**
                 * Deletes a {@link RenderingEngine} from the map by `id`.
                 * 
                 * @param  {string} id The UUID of the {@link RenderingEngine} to remove from the map.
                 */
                delete: function(id) {
                    var self = this;
                    delete self.map[id];
                }
            };

            return RenderingEngines;
        }
    });
