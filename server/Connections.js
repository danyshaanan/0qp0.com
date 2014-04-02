'use strict';

function Connections() {
  this.sockets = {};
}

Connections.prototype.add = function(socket) {
  this.sockets[socket.id] = socket;
};

Connections.prototype.remove = function(socket) {
  delete this.sockets[socket.id];
};

Connections.prototype.broadcast = function(event, data) {
  Object.keys(this.sockets).forEach(function(key) {
    this.sockets[key].emit(event, data);
  }.bind(this));
};

module.exports = Connections;
