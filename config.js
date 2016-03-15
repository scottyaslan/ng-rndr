define([], function(){
    function AppConfig() {
        this.BOWER_HOME;
    };
    AppConfig.prototype = {
        constructor: AppConfig,
        init: function(){
            var self = this;
            self.BOWER_HOME = '/pitchpredict/app/bower_components/data-analytics-toolkit/'
        }
    }
    var config = new AppConfig();
    config.init();
    return config;
});