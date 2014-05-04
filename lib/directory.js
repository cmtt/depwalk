module.exports = [function () {
  var fs = require('fs');
  var path = require('path');
  var async = require('async');

  function _getDirectories (dirname, callback) {
    async.waterfall([
      function (next) {
        fs.readdir(dirname, next);
      },
      function (files, next) {
        async.filter(files, function (file, cb) {
          fs.stat(path.join(dirname,file), function (err, stat) {
            if (err) return cb(false);
            cb(stat.isDirectory());
          });
        }, function (directories) {
          next(null, directories);
        });
      }
    ], callback);
  }

  function _walkDirectories (dirname, fn, callback) {
    var queue = [];

    async.waterfall([
      function (next) {
        _getDirectories(dirname, next);
      },
      function (directories, next) {
        async.forEach(directories, fn, next);
      }
    ], callback);
  }

  function _readTextFile (isJson, filename, callback) {
    async.waterfall([
      function (next) {
        fs.stat(filename, function (err, stat) {
          if (err || !stat.isFile()) return next(null, isJson ? '{}' : '');
          fs.readFile(filename, next);
        });
      },
      function (buffer, next) {
        var text = buffer.toString();
        if (isJson) {
          try { text = JSON.parse(text); }
          catch(e) { return next(e); }
        }
        next(null, text);
      }
    ], callback);
  }

  return {
    getDirectories : _getDirectories,
    walkDirectories : _walkDirectories,
    readFile : _readTextFile.bind(null, false),
    readJson : _readTextFile.bind(null, true)
  };

}];
