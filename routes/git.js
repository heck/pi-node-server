var spawnSync = require('child_process').spawnSync;

module.exports = function(router, route) {
  // fetches a list of files that have changed between this server and the remote master
  router.get(route, function(request, response) {
    // need to to a fetch first so we get the latest meta data from our source repo
    var ret = spawnSync('git', ['-C', global.app.cwd, 'fetch']);
    if (ret.stderr.length > 0) response.end('ERROR (on fetch): '+ret.stderr);
    // okay, get the status (no changes made to server)
    ret = spawnSync('git', ['-C', global.app.cwd, 'status']);
    // ret = spawnSync('git', ['-C', global.app.cwd, 'diff', 'HEAD..origin', '--stat']);
    if (ret.stderr.length > 0) response.end('ERROR: '+ret.stderr);
    response.end(ret.stdout);
  });

  // updates this server to the state of the remote master
  router.patch(route, function(request, response) {
    var ret = spawnSync('git', ['-C', global.app.cwd, 'pull']);
    if (ret.stderr.length > 0) response.end('ERROR: '+ret.stderr);
    response.end(ret.stdout);
  });
};
