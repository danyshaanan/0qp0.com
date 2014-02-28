'use strict';

var url = require('url');
var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var State = require('./State.js');

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
var app = express();
var publicFolder = __dirname + '/public/';
var index = publicFolder + 'index.htm';

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

app.use(express.static(publicFolder));
app.get('/', function(req, res){
  res.sendfile(index);
});

app.get(config.updateConfigPath, function(req, res){
  res.send(updateConfig() ? 'success' : 'failed');
});

app.get('/logs', function(req, res){
  var files = fs.readdirSync('public/logs/').filter(function(file) { return /log\.\d+-\d+\.json/.test(file) });
  res.send(files);
});

app.get('/board', function(req, res){
  stats.boardRequestCount++;
  res.send(board);
});

app.get('/save', function(req, res){
  state.write('board', board);
  res.send('Board saved!');
});

app.get('/flip', function(req, res){
  // This ip calculation is based on the way I redirect a domain from 80 to another port.
  // TODO: get the ip in a universal and correct way
  var ip = JSON.parse(JSON.stringify(req['headers']))['x-forwarded-for'];

  if (_.contains(config.bannedIPs,ip)) {
    res.send('You are banned!! Have you tried to mess with the application somehow?');
    return;
  }
  stats.flipRequestCount++;
  var cell = url.parse(req.url, true).query.cell;
  if (config.record.state) {
    fs.appendFile(
      'logs/' + config.record.filename,
      [(new Date()).getTime(),cell].join(' ') + '\n',
      function(err) {
        if (err) console.log(err)
      });
  }
  if (board[cell]) delete board[cell];
  else board[cell] = 1;
  if (stats.flipRequestCount % 100 == 0) state.write('board', board);
  res.send('flip completed');
});

app.get('/stats', function(req, res){
  stats.now = Date.now();
  stats.nowDate = new Date(stats.now);
  stats.hoursRunning = ((stats.now - stats.start)/1000/60/60).toFixed(3);
  stats.flipsPerHour = stats.flipRequestCount / stats.hoursRunning;
  res.send(stats);
});

app.listen(config.port);
console.log('now listening to port', config.port)
