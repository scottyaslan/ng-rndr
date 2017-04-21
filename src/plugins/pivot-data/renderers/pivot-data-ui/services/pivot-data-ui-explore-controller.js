define([], function() {
    'use strict';

    return function($window, $timeout) {
        function ExploreController() {
            this.constants = {
                sortableOptions: {
                    placeholder: "placeholder",
                    connectWith: ".dropzone",
                    update: function(e, ui) {
                        //Cannot correctly update renderer until the angular digest completes which updates the RenderingEngine.rows and
                        //RenderingEngine.cols arrays. We must get on the call stack after the that cycle completes 
                        $timeout(function() {
                            exploreController.embeddedRenderingEngine.draw(exploreController.embeddedRenderingEngine.dataView.data);
                        }, 0);
                    }
                }
            };
            this.renderingEngine;
            this.embeddedRenderingEngine;
        }
        ExploreController.prototype = {
            constructor: ExploreController,
            init: function(renderingEngine, embeddedRenderingEngine) {
                exploreController.renderingEngine = renderingEngine;
                exploreController.embeddedRenderingEngine = embeddedRenderingEngine;
            },
            isExcluded: function(property, key) {
                if (exploreController.renderingEngine.dataView.meta.attributeFilterExclusions[property] !== undefined) {
                    if (exploreController.renderingEngine.dataView.meta.attributeFilterExclusions[property].indexOf(key) >= 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
                return true;
            }
        };
        var exploreController = new ExploreController();
        return exploreController;
    };
});
