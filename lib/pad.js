module.exports = [function () {
  return function pad (str, len, val, left) {
    str = String(str);
    val = typeof val !== 'undefined' ? val.toString() : ' ';
    if (str.length > len) len = str.length;
    if (!left) str = new Array(len - str.length + 1).join(val) + str;
    else str = str + new Array(len - str.length + 1).join(val);
    return str;
  };
}];
