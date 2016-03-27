define([],function(){
    'use strict';

    function config($routeProvider, $locationProvider, $mdThemingProvider, localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix("com.exploreApp");
        //For pretty URLs
        $locationProvider.html5Mode(true);
        //Define routes, views, and controllers
        $routeProvider.otherwise({
            templateUrl: "data_analytics_toolkit/app/views/index.html",
            controller: "DATController",
            controllerUrl: 'controllers/DATController'
        });
        //Define app palettes
        var customBluePaletteMap = $mdThemingProvider.extendPalette("grey", {
            "contrastDefaultColor": "light",
            "contrastDarkColors": ["100"], //hues which contrast should be "dark" by default
            "contrastLightColors": ["600"], //hues which contrast should be "light" by default
            "500": "021b2c"
        });
        var customRedPaletteMap = $mdThemingProvider.extendPalette("grey", {
            "contrastDefaultColor": "dark",
            "contrastDarkColors": ["100"], //hues which contrast should be "dark" by default
            "contrastLightColors": ["600"], //hues which contrast should be "light" by default
            "500": "B22234"
        });
        $mdThemingProvider.definePalette("bluePalette", customBluePaletteMap);
        $mdThemingProvider.definePalette("redPalette", customRedPaletteMap);
        $mdThemingProvider.theme("default").primaryPalette("bluePalette", {
            "default": "500",
            "hue-1": "50", // use for the <code>md-hue-1</code> class
            "hue-2": "300", // use for the <code>md-hue-2</code> class
            "hue-3": "600" // use for the <code>md-hue-3</code> class
        }).accentPalette("redPalette", {
            "default": "500",
            "hue-1": "50", // use for the <code>md-hue-1</code> class
            "hue-2": "300", // use for the <code>md-hue-2</code> class
            "hue-3": "600" // use for the <code>md-hue-3</code> class
        });
    }

    config.$inject=['$routeProvider', '$locationProvider', '$mdThemingProvider', 'localStorageServiceProvider'];

    return config;
});