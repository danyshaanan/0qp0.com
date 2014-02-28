"use strict";

var fs = require('fs');

function State(path) {
  this._path = path;
  if (!fs.existsSync(this._path)) {
    throw new Error('State path does not exist!');
  }
}

State.prototype.read = function(key) {
  if (fs.existsSync(this._path)) {
    var data = fs.readFileSync(this._path);
    var settings = JSON.parse(data);
    return settings[key];
  } else {
    return undefined;
  }
};

State.prototype.write = function(key, val) {
  try {
    var settings = JSON.parse(fs.readFileSync(this._path));
    settings[key] = val;
    fs.writeFileSync(this._path, JSON.stringify(settings));
  } catch(e) {
    throw new Error(e);
  }
};

module.exports = State;
