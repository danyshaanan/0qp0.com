#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var State = require('./State.js')
var History = require('./History.js')
var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io').listen(server)
const state = new State(path.join(__dirname, '/state.json'))
const history = new History(path.join(__dirname, '/history'))

const timeBetweenClicks = 33

function getConfigFile() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json')))
  } catch (e) {
    return {}
  }
}

var config = _.assign(getConfigFile(), { port: 8080 })

config.bannedIPs = [].concat(config.bannedIPs || [])
console.log('Loaded config:\n', config)

var board = state.read('board')

var stats = {
  boardRequestCount: 0,
  flipRequestCount: 0,
  start: Date.now(),
  startDate: new Date(Date.now())
}

app.use(express.static(path.join(__dirname, '/../public/'), { index: 'index.html' }))


// Application

io.set('log level', 1)

io.sockets.on('connection', function (socket) {
  socket.on('board', function () {
    stats.boardRequestCount++
    socket.emit('board', board)
    history.update(board)
  })

  socket.on('save', function () {
    state.write('board', board)
    socket.emit('save', 'Board saved!')
  })

  socket.on('flip', function (cell) {
    if (Date.now() - socket.last < timeBetweenClicks) return
    socket.last = Date.now()

    var ip = socket.handshake.address.address
    if (~config.bannedIPs.indexOf(ip)) {
      console.log('banned ip:', ip)
      socket.emit('banned', cell)
      return
    }

    stats.flipRequestCount++
    var index = board.indexOf(cell)
    if (~index) {
      board.splice(index, 1)
    } else {
      board.push(cell)
    }
    if (stats.flipRequestCount % 100 === 0) state.write('board', board)
    io.sockets.emit('flip', { cell: cell, state: !~index })
  })

  socket.on('stats', function () {
    stats.now = Date.now()
    stats.nowDate = new Date(stats.now)
    stats.hoursRunning = ((stats.now - stats.start) / 1000 / 60 / 60).toFixed(3)
    stats.flipsPerHour = stats.flipRequestCount / stats.hoursRunning
    socket.emit('stats', stats)
  })

  // socket.on('disconnect', function() { });
})

server.listen(config.port)
console.log('now listening to port', config.port)
