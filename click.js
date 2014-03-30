#!/usr/bin/env node
'use strict';

var url = require('url');
var fs = require('fs');
var _ = require('lodash');
var State = require('./State.js');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var Connections = require('./Connections.js');
var connections = new Connections();
var state = new State('./state.json');
var config = undefined;

function updateConfig() {
  try {
    config = JSON.parse(fs.readFileSync('config.json'));
    config.bannedIPs = [].concat(config.bannedIPs);
    config.modIPs = [].concat(config.modIPs);
    console.log('Loaded config:\n', config);
    return true;
  } catch(e) {
    console.log('Config loading failed\n', e);
    if (!config) process.exit();
  }
}

updateConfig();

var board = state.read('board');

if (config.record.state) {
  fs.appendFile(
    'logs/' + config.record.filename,
    'Starting at ' + (new Date()).getTime() + '...\n' + JSON.stringify(board) + '\n',
    function(err) {
      if (err) console.log(err)
    });
}

var stats = {
  boardRequestCount: 0,
  flipRequestCount: 0,
  start: Date.now(),
  startDate: new Date(Date.now())
}

app.use(express.static(__dirname + '/public/', { index: 'index.htm' }));

//////////////////

io.sockets.on('connection', function(socket) {
  connections.add(socket);

  socket.on(config.updateConfigPath, function() {
    socket.emit('updateConfig', updateConfig())
  });

  socket.on('logs', function() {
    socket.emit('logs', fs.readdirSync('public/logs/').filter(function(file) { return /log\.\d+-\d+\.json/.test(file) }))
  });

  socket.on('board', function() {
    stats.boardRequestCount++;
    socket.emit('board', board);
  });

  socket.on('save', function() {
    state.write('board', board);
    socket.emit('save', 'Board saved!');
  });

  socket.on('flip', function(cell) {
    // This ip calculation is based on the way I redirect a domain from 80 to another port. ?
    // var ip = JSON.parse(JSON.stringify(req['headers']))['x-forwarded-for'];
    // if (_.contains(config.bannedIPs,ip)) { return; } //TODO: put this in connection part

    stats.flipRequestCount++;
    // var cell = url.parse(req.url, true).query.cell;
    if (config.record.state) {
      fs.appendFile(
        'logs/' + config.record.filename,
        [(new Date()).getTime(),cell].join(' ') + '\n',
        function(err) {
          if (err) console.log(err)
        });
    }
    var index = board.indexOf(cell);
    if (~index) {
      board.splice(index, 1);
    } else {
      board.push(cell);
    }
    if (stats.flipRequestCount % 100 == 0) state.write('board', board);
    connections.broadcast('flip', { cell: cell, state: !~index });
  });

  socket.on('stats', function() {
    stats.now = Date.now();
    stats.nowDate = new Date(stats.now);
    stats.hoursRunning = ((stats.now - stats.start)/1000/60/60).toFixed(3);
    stats.flipsPerHour = stats.flipRequestCount / stats.hoursRunning;
    res.send(stats);
  });

  socket.on('disconnect', function() {
    connections.remove(socket);
  });
});


server.listen(config.port);
// app.listen(config.port);
console.log('now listening to port', config.port)
