var fs = require('fs');
var extend = require('util')._extend;

module.exports = function(app) {
  //
  // Set hardcoded defaults
  //

  // All the known settings and their hardcoded defaults
  var settings = {};
  settings.port = 8080;
  settings.serverConfigDir = app.cwd+'/config';  // can be used to read other config files defined by app
  settings.localConfig = '';

  //
  // Read in platform-dependent settings from /config dir
  //

  // construct the path to our default settings file (platform dependent)
  var defaultPath = settings.serverConfigDir+'/'+app.platform+'.json';
  console.log("default platform config read from: "+defaultPath);
  // read the file, convert it to an object, and merge it with settings
  var defaults = JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
  settings = extend(settings, defaults);

  //
  // Read in local settings (if the file exists)
  //

  // get the path to our local settings (default to linux)
  var localPath = settings.localConfig;
  // if the local config path is not defined by hardcoded or /config settings, try to read a
  // local config from a file path based on the platform we're running on
  if (localPath === undefined || localPath === '') {
    if (app.platform == 'win32') { // windows
      localPath = process.env.USERPROFILE;
    } else {  // Mac ('darwin') and Linux
      localPath = process.env.HOME;
    }
    // check for the local stuff in a subdir of the home dir
    localPath = localPath + '/.pinodeserver';
    // if the subdir isn't there create it for convenience sake
    if (!fs.existsSync(localPath)){
      fs.mkdirSync(localPath);
    }
    // tack on the file name
    localPath = localPath + "/webconfig.json";
  }
  // read the local file, convert it to an object, and merge it with settings
  console.log("Reading local config from: "+localPath);
  try {
    var locals = JSON.parse(fs.readFileSync(localPath, 'utf8'));
    settings = extend(settings, locals);
  } catch (e) {
    console.log("local config file not found or not accessible");
  }

  return settings;
};
