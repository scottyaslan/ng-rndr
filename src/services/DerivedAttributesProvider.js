// define([],
//     function() {
//         'use strict';

//         return function DerivedAttributesProvider() {
//             var derivedAttributes = {};

//             /**
//              * Adds a data attribute deriving function.
//              * 
//              * @param {string} name    The 
//              * @param {[type]} deriver The name of the new data attribute created by the `deriver` function.
//              */
//             this.add = function(name, deriver) {
//                 derivedAttributes[name] = deriver;
//             };

//             this.$get = [function DerivedAttributesFactory() {
//                 /**
//                  * A dictionary of data attribute deriving functions. The keys
//                  * are the names of the new derived attribute, and the 
//                  * functions take an existing attribute(s) and return the value
//                  * of the new attribute.
//                  */
//                 function DerivedAttributes(derivedAttributes) {
//                     $.extend(this, derivedAttributes);
//                 }
//                 DerivedAttributes.prototype = {
//                     constructor: DerivedAttributes,
//                     /**
//                      * Adds a data attribute deriving function.
//                      * 
//                      * @param {string} name    The 
//                      * @param {[type]} deriver The name of the new data attribute created by the `deriver` function.
//                      */
//                     add: function(name, deriver) {
//                         this[name] = deriver;
//                     },
//                     /**
//                      * Lists the available derived attributes.
//                      * 
//                      * @return {Array.<string>} The lookup names.
//                      */
//                     list: function() {
//                         return Object.keys(this);
//                     }
//                 };

//                 return new DerivedAttributes(derivedAttributes);
//             }];
//         }
//     });
