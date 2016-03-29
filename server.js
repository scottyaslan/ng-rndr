// Express and Authentication
// var flash = require('connect-flash');
var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var DAT = function() {
    //scope
    var self = this;
    self.app = express();
    /**
     *  //Set up server IP address and port # using env variables/defaults.
     */
    self.setEnvironmentVariables = function() {
        //  Set the environment variables we need
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || '';
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
        if(typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
    };
    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if(typeof self.zcache === "undefined") {
            self.zcache = {
                'index.html': ''
            };
        }
        //  Local cache for static content.
        // self.zcache['index.html'] = fs.readFileSync('./index.html');
    };
    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) {
        return self.zcache[key];
    };
    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig) {
        if(typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };
    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function() {
        //  Process on exit and signals.
        process.on('exit', function() {
            self.terminator();
        });
        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach(function(element, index, array) {
            process.on(element, function() {
                self.terminator(element);
            });
        });
    };
    /**
     *  Middle Ware.
     */
    self.middleware = function() {
        var app = self.app;
        // all environments
        app.set('views', path.join(__dirname, './'));
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'ejs');
        app.use(express.favicon());
        app.use(express.json({limit: '50mb'}));
        app.use(express.urlencoded({limit: '50mb'}));
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser('sixhourdays'));
        app.use(express.session({secret: 'sixhourdays'})); 
        app.use(app.router);
        app.use(express.static(path.join(__dirname, './')));
        // Handle 404
        app.use(function(req, res) {
            res.status(400);
            res.render('data_analytics_toolkit/app/views/400.html');
        });
        // Handle 500
        app.use(function(error, req, res, next) {
            res.status(500);
            res.render('data_analytics_toolkit/app/views/500.html');
        });
        // development only
        if('development' == app.get('env')) {
            app.use(express.errorHandler());
        }
    };
    self.routes = function() {
        self.app.get('/demo', function(req, res) {
            res.render('index.html');
        });
        self.app.get('/samples/requirejs/html', function(req, res) {
            res.render('./samples/requirejs/html/index.html');
        });
    };
    /*
     *   Initialize Server
     */
    self.initialize = function() {
        self.setEnvironmentVariables();
        self.middleware();
        self.populateCache();
        self.setupTerminationHandlers();
        self.routes();
    };
    /*
     *   Start Server
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        http.createServer(self.app).listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...', Date(Date.now()), self.ipaddress, self.port);
        });
    };
};
/**
 *  main():  Main code.
 */
var app = new DAT();
app.initialize();
app.start();