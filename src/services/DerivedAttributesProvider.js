define([],
    function() {
        'use strict';

        return function DerivedAttributesProvider() {
            var derivedAttributes = {};

            /*
             * Adds an attribute deriving function.
             */
            this.add = function(name, deriver) {
                derivedAttributes[name] = deriver;
            };

            this.$get = [function DerivedAttributesFactory() {
                /**
                 * A dictionary of attribute deriving functions. The keys
                 * are the names of the new derived attribute, and the 
                 * functions take an existing record and return the value
                 * of the new attribute.
                 */
                function DerivedAttributes(derivedAttributes) {
                    $.extend(this, derivedAttributes);
                }
                DerivedAttributes.prototype = {
                    constructor: DerivedAttributes,
                    /*
                     * Adds an attribute deriving function.
                     */
                    add: function(name, deriver) {
                        this[name] = deriver;
                    },
                    /**
                     * Lists the derived attributes.
                     * 
                     * @return {Array.<string>} The lookup names.
                     */
                    list: function() {
                        return Object.keys(this);
                    }
                };

                return new DerivedAttributes(derivedAttributes);
            }];
        }
    });
