define([], function() {
    'use strict';

    function ServiceProvider() {
        function ServiceProvider() {
        };
        ServiceProvider.prototype = {
            constructor: ServiceProvider,
            add: function(objectName, object) {
                serviceProvider[objectName] = object;
            },
            delete: function(objectName) {
                delete serviceProvider[objectName];
            }
        };
        var serviceProvider = new ServiceProvider();
        return serviceProvider;
    }

    ServiceProvider.$inject=[];

    return ServiceProvider;
});