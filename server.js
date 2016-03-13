// node's native http handler
var http = require('http');
// something for handling routes.  Could use express but it's BIG
var Router = require('node-simple-router');
var router = Router();
// Template engine to make HTML creation easier.  I like jade better, but it's BIG.  Use ECT instead.
var ECT = require('ect');

// add app object (where we'll store all our global stuff) to Node's global object
global.app = global.app || {};  // add ourselves to node's global space (if we're not already there)
global.app.cwd = process.cwd();  // save off our app's directory
global.app.platform = process.platform;  // save off the platform we're running on
// intantiate the HTML template renderer
global.app.router = router;
global.app.renderer = ECT({ root : global.app.cwd+'/public/templates', ext : '.ect' });

// read in the config for our app (see the README)
global.app.config = require(global.app.cwd+'/helpers/config')(global.app);

//
// load helpers (note: helpers/config loaded above)
//
// global.app.my_helper = require(global.app.cwd+'/helpers/my_helper')(global.app);

// the default route
router.get('/', function(request, response) {
  // compile cwd/public/templates/index.ect into HTML and send it to requester
  var html = global.app.renderer.render('index', global.app);
  response.end(html);
});

//
// other routes defined in separate files
// Each route may compile their own templates and send HTML to requester
// and/or provide APIs
//

// a dev page from which one can update and restart the server
require(global.app.cwd+'/routes/dev')(router, '/dev');
// a simple git API (used by /dev)
require(global.app.cwd+'/routes/git')(router, '/git');
// a very simple API for restarting the server (used by /dev)
require(global.app.cwd+'/routes/restart')(router, '/restart');

// Ready!  Fire up the server!!
var server = http.createServer(router);

server.listen(global.app.config.port, function() {
    console.log("Server listening on: http://localhost:%s", global.app.config.port);
});
