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
define(["angularAMD",
        "fastclick",
        "jquery-ui-touch-punch",
        "angular-resource",
        "angular-local-storage",
        "angular-route",
        "angular-material"], 
function(angularAMD, fastclick) {
    // FastClick (for touch screens) doesn"t attach any listeners on desktop browsers.
    // Chrome 32+ on Android with width=device-width in the viewport meta tag doesn"t have a 300ms delay, therefore listeners aren"t attached.
    // <meta name="viewport" content="width=device-width, initial-scale=1">
    // Same goes for Chrome on Android (all versions) with user-scalable=no in the viewport meta tag. But be aware that user-scalable=no also disables pinch zooming, which may be an accessibility concern.
    // For IE11+, you can use touch-action: manipulation; to disable double-tap-to-zoom on certain elements (like links and buttons). For IE10 use -ms-touch-action: manipulation.
    fastclick.attach(document.body);
    //Create exploreApp
    var app = angular.module("exploreApp", ["ngResource", "ngRoute", "ngMaterial", "LocalStorageModule"]);
    //Configure exploreApp    
    app.config(function($routeProvider, $locationProvider, $mdThemingProvider, localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix("com.exploreApp");
        //For pretty URLs
        $locationProvider.html5Mode(true);
        //Define routes, views, and controllers
        $routeProvider.when("/", angularAMD.route({
            templateUrl: "data_analytics_toolkit/app/views/index.html",
            controller: "DATController",
            controllerUrl: 'controllers/DATController'
        })).when("/404", angularAMD.route({
            templateUrl: "data_analytics_toolkit/app/views/404.html"
        })).otherwise(angularAMD.route({
            redirectTo: "/404"
        }));
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
    });
    //Boostrap explorerApp
    return angularAMD.bootstrap(app, true, document.getElementById('exploreApp'));
});