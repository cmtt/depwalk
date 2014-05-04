module.exports = ['directory','basePath','log','pad','sprintf',function (directory, basePath, log, pad, sprintf) {

  var _log = log('PackageManagers');
  var async = require('async');
  var semver = require('semver');
  var _ = require('lodash');

  var packageIndexes = {};

  var managers = [
    {
      id : 'npm',
      pathName : 'node_modules',
      index : 'package.json',
      dependencies :{
        'default' : 'dependencies',
        'optional' : ['optionalDependencies', 'optional-dependencies'],
        'bundled' : ['bundledDependencies', 'bundled-dependencies'],
        'development' : ['devDependencies', 'dev-dependencies']
      }
    },
    {
      id : 'bower',
      pathName : 'bower_components',
      index : 'bower.json',
      dependencies : {
        'default' : 'dependencies',
        'development' : 'devDependencies'
      }
    }
  ];

  function _processPackage(manager, packageId, callback) {
    var index = packageIndexes[manager.id];
    async.waterfall([
      function (next) {
        directory.readJson(basePath(manager.pathName, packageId, manager.index), next);
      },
      function (data, next) {
        if (typeof data.version === 'undefined') return next(null);
        index.available[packageId] = data.version;
        next(null);
      }
    ], callback);
  }

  function _processIndex(manager, data, callback) {
    var index = {
      all : {},
      available : {},
      tarballs : [],
      repositories : []
    };
    packageIndexes[manager.id] = index;

    _log.verbose('Processing indexes for',manager.id);

    async.waterfall([
      function (next) {
        _.each(manager.dependencies, function (depIds, key) {
          index[key] = [];
          if (typeof depIds === 'string') depIds = [depIds];
          var depId, deps, l = depIds.length;
          _.each(depIds, function (depId) {
            deps = data[depId] || {};
            index.all = _.extend(index.all, deps);
            _.each(deps, function (version, depId) {
              if ( (/^http/).test(version) ) {
                index.tarballs.push(depId);
              }
              if ( (/^git/).test(version) ) {
                index.repositories.push(depId);
              }
              index[key].push(depId);
            });
          });
        });
        next(null);
      },
      function (next) {
        _log.verbose('Reading package directory', manager.id);
        var _process = _processPackage.bind(null, manager);
        directory.walkDirectories(basePath(manager.pathName), _process, next);
      }
    ], function (err) {
      if (err) return callback(err);
      callback(null, packageIndexes);
    });
  }

  managers.readIndexes = function (callback) {
    async.forEachSeries(managers, function (manager, cb) {
      async.waterfall([
        function (next) {
          directory.readJson(basePath(manager.index), next);
        },
        function (data, next) {
          _processIndex(manager, data, next);
        }
      ], function (err) {
        if (err) {
          if (err.code === 'ENOENT') _log.debug('No indexes found for ' + manager.id);
          else _log.error(err);
          delete packageIndexes[manager.id];
        }
        cb(null);
      });
    }, callback);
  };

  managers.list = function () {
    _.each(managers, function (manager) {
      var index = packageIndexes[manager.id];
      if (!index) return;
      var availablePackages = _.keys(index.available);
      var registeredPackages = [];
      var packageTypes = _.keys(manager.dependencies);
      _.each(packageTypes, function (key) {
        registeredPackages = registeredPackages.concat(index[key]);
      });

      var longestPackageNameLength = _.chain(registeredPackages)
                                      .concat(availablePackages)
                                      .concat(_.keys(index.all))
                                      .map(function (id) { return id.length; })
                                      .max()
                                      .value();

      var packagesToCheck = _.intersection(availablePackages, registeredPackages);

      _log(sprintf('\n # Registered and installed packages (%s)\n', manager.id));
      _log([pad('id', longestPackageNameLength, ' '), pad('installed',10),pad('required',10),pad('state',10),'\n'].join(''));

      _.each(packagesToCheck, function (id) {
        var logLine = [pad(id, longestPackageNameLength,' ')];
        logLine.push(pad(index.available[id],10));

        if (~index.repositories.indexOf(id) || ~index.tarballs.indexOf(id)) {
          logLine.push(pad('-',10),pad(' @ ',10), index.all[id]);
        } else {
          logLine.push(pad(index.all[id],10));
          var valid = semver.satisfies(index.available[id], index.all[id]);
          var state = 'ok';
          if (!valid) {
            var gtr = semver.gtr(index.available[id], index.all[id]);
            state = gtr ? 'downgrade' : 'upgrade';
          }
          logLine.push(pad(state, 10));
        }

        _log(logLine.join(''));
      });

      var packagesNotRegistered = _.difference(availablePackages, registeredPackages);
      if (packagesNotRegistered.length) {
        _log('\n  Packages not registered:\n');
        _.each(packagesNotRegistered, function (id) {
          var logLine = [pad(id, longestPackageNameLength,' ')];
          logLine.push(pad(index.available[id],10));
          logLine.push(pad('-',10));
          _log(logLine.join(''));
        });
      }

      var packagesNotInstalled = _.difference(registeredPackages, availablePackages);
      if (packagesNotInstalled.length) {
        _log('\n  Packages not installed: \n');
        _.each(packagesNotInstalled, function (id) {
          var logLine = [pad(id, longestPackageNameLength,' ')];
          logLine.push(pad('-',10));
          if (~index.repositories.indexOf(id) || ~index.tarballs.indexOf(id)) {
            logLine.push(pad('-',10),pad(' @ ',10), index.all[id]);
          } else {
            logLine.push(pad(index.all[id],10));
          }
          _log(logLine.join(''));
        });
      }
      console.log('');
    });
  };

  return managers;
}];
