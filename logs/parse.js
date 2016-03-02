#!/usr/local/bin/node

'use strict'

var fs = require('fs')
var filename = process.argv[2]
var results = []
var nextBlock, match

fs.readFileSync(filename).toString().split('\n').forEach(function(line) {
  if (match = line.match(/Starting at (\d+)\.\.\./)) results.push(nextBlock = { start: parseInt(match[1]), clicks: [] })
  if (match = line.match(/(\d+) (\d+)x(\d+)/)) nextBlock.clicks.push({ uts: match[1], x: match[2], y: match[3] }) // TODO: Parse full id, don't break to x,y
})

results.filter(function(result) { return result.clicks.length }).forEach(function(result) {
  var name = 'log.' + result.clicks[0].uts + '-' + result.clicks[result.clicks.length - 1].uts + '.json'
  fs.writeFileSync(name, JSON.stringify(result))
  console.log('Written file: ' + name + ', containing ' + result.clicks.length + ' clicks.')
})





