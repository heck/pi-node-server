var fork = require('child_process').fork;

module.exports = function(router, route) {
  // restarts the server by forking a new server process then killing this one
  router.put(route, function(request, response) {
    fork(global.app.cwd+'/server.js');
    process.exit(0);
  });
};
