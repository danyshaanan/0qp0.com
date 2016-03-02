'use strict'

function clientClick() {
  if (!window.io) throw 'socket.io is not loaded! Aborting...' // TODO: check error, show in gui.

  function createBoard(boardSize, cellSize) {
    board = $('<div/>', { id: 'board' }).appendTo($('div#content'))
    for (var h = 1; h <= boardSize; h++) {
      for (var w = 1; w <= boardSize; w++) {
        $('<span/>', { id: h + 'x' + w, style: 'top:' + (h * cellSize) + 'px; left:' + (w * cellSize) + 'px;' }).appendTo(board)
      }
    }
    cells = $('span', board)
      .css({ width: cellSize, height: cellSize, position: 'absolute', border: 'black 1px solid' })
      .click(function() {
        $(this).css('background-color', $(this).css('background-color') == 'black' ? 'white' : 'black')
        socket.emit('flip', $(this).attr('id'))
      })
  }

  function set(cell, state) {
    $('#' + cell).css('background-color', state ? 'black' : 'white')
  }

  var socket = io.connect('/')
  var cells, board // TODO: Is board ever used? use it to hold current state on client.
  // var updateInterval, playerInterval

  socket.on('flip', function(data) {
    set(data.cell, data.state)
  })

  socket.on('banned', function(cell) {
    window.console.log('flip rejected. You seem to be banned. Contact the site owner if you think this was a mistake')
    // TODO: negate cell
  })

  socket.on('board', function(board) {
    cells.each(function(i, v) {
      var id = $(v).attr('id')
      set(id, ~board.indexOf(id))
    })
  })

  createBoard(30, 20)
  socket.emit('board')
}
