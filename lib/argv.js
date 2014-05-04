module.exports = [function () {

  var args = {};

  args.debug = ~process.argv.indexOf('--debug') || ~process.argv.indexOf('-d');
  args.verbose = ~process.argv.indexOf('--verbose') || ~process.argv.indexOf('-v');
  if (args.verbose) args.debug = true;

  return args;
}];
