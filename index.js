var namespace = require('dijs')(null, true);

namespace.provide('managers', require('./lib/package-managers'))
         .provide('directory', require('./lib/directory'))
         .provide('cwd', process.cwd(), true)
         .provide('basePath', require('./lib/base-path'))
         .provide('argv', require('./lib/argv'))
         .provide('sprintf', require('util').format, true)
         .provide('pad', require('./lib/pad'))
         .provide('log', require('./lib/log'))
         .resolve();

module.exports = namespace;
