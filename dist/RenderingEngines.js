// (function(root, factory) {
//     if (typeof define === 'function' && define.amd) {
//         define('rndrRenderingEngines', [], function() {
//             return (root.rndr.RenderingEngines = factory(root));
//         });
//     } else if (typeof module === 'object' && module.exports) {
//         module.exports = (root.rndr.RenderingEngines = factory(root));
//     } else {
//         root.rndr.RenderingEngines = factory(root);
//     }
// }(this, function(root) {
//     'use strict';

//     /**
//      * Maintains a dictionary of {@link RenderingEngine}'s.
//      */
//     function RenderingEngines() {
//         this.map = new Map();
//     }
//     RenderingEngines.prototype = {
//         constructor: RenderingEngines,
//         /**
//          * Adds a {@link RenderingEngine} to the map.
//          * 
//          * @param {RenderingEngine} dataSource The {@link RenderingEngine} to add.
//          */
//         add: function(renderingEngine) {
//             this.map.set(renderingEngine.id, renderingEngine);
//         },
//         /**
//          * Lists the available {@link RenderingEngine}s.
//          * 
//          * @return {Array.<string>} The lookup names.
//          */
//         list: function() {
//             return Object.keys(this.map);
//         },
//         /**
//          * The number of {@link RenderingEngine}'s in this map.
//          * 
//          * @return {number} The number of {@link RenderingEngine}'s in the map.
//          */
//         size: function() {
//             return Object.keys(this.map).length;
//         },
//         /**
//          * Deletes a {@link RenderingEngine} from the map by `id`.
//          * 
//          * @param  {string} id The UUID of the {@link RenderingEngine} to remove from the map.
//          */
//         delete: function(id) {
//             delete this.map.get(id);
//         }
//     };

//     return RenderingEngines;
// }));
