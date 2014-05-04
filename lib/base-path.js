module.exports = function (cwd) {
  var path = require('path');

  function basePath () {
    var files = Array.prototype.slice.apply(arguments);
    if (!files.length) return cwd;
    files.unshift(cwd);
    return path.join.apply(path, files);
  }

  basePath.valueOf = function () {
    return cwd;
  };

  return basePath;
};
