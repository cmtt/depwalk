module.exports = ['pad','sprintf','argv',function (pad, sprintf, argv) {
  var colour = require('colour');
  var maxIdLength = 0;

  return function (id) {
    if (id.length > maxIdLength) maxIdLength = id.length;
    var str = pad(id,maxIdLength, ' ');

    function _prependId (color, args) {
      args = Array.prototype.slice.apply(args);
      str = pad(id,maxIdLength, ' ');

      if (color) {
        if (typeof color === 'string') color = [color];
        var l = color.length;
        while (l--) str = str[color[l]];
      }

      args[0] = str + ' | ' + args[0];
      return args;
    }

    function logFunction () {
      console.log.apply(console, arguments);
    }

    logFunction.log = function () {
      var args = _prependId(null, arguments);
      logFunction.apply(console, args);
    };

    logFunction.verbose = function () {
      if (!argv.verbose) return;
      var args = _prependId('gray', arguments);
      logFunction.apply(console, args);
    };

    logFunction.debug = function () {
      if (!argv.debug) return;
      var args = _prependId('gray', arguments);
      logFunction.apply(console, args);
    };

    logFunction.error = function () {
      var args = _prependId(['bold','red'], arguments);
      logFunction.apply(console, args);
    };

    logFunction.sprintf = function () {
      var args = Array.prototype.slice.apply(arguments);
      logFunction.apply(console, [sprintf.apply(null, args)]);
    };

    return logFunction;

  };
}];
