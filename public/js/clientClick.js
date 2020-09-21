/* global io */
'use strict'

export default function clientClick() {
  if (!window.io) throw new Error('socket.io is not loaded! Aborting...') // TODO: check error, show in gui.

  let boardLoaded = false

  function createBoard() {
    $board = $('<div/>', { id: 'board' }).appendTo($('div#boardContainer'))
    for (var h = 1; h <= 30; h++) {
      for (var w = 1; w <= 30; w++) {
        $('<span/>', { id: h + 'x' + w, class: 'cell' }).appendTo(board)
      }
    }
    $cells = $board.find('span')
  }

  function set(cell, state) {
    const $cell = $('#' + cell);
    $cell.addClass(state ? 'blackCell' : 'whiteCell').removeClass(!state ? 'blackCell' : 'whiteCell');
  }


  const socket = io.connect('/')
  window.socket = socket;
  let $cells = []
  let $board

  socket.on('flip', function (data) {
    set(data.cell, data.state)
  })

  socket.on('banned', function (cell) {
    console.log('flip rejected. You seem to be banned. Contact the site owner if you think this was a mistake')
    // TODO: negate cell
  })

  socket.on('board', function (board) {
    boardLoaded = true
    $cells.each(function (index, element) {
      const id = $(element).attr('id')
      set(id, ~board.indexOf(id))
    })

    $board.on('click', 'span', (event) => {
      if (boardLoaded) {
        socket.emit('flip', $(event.target).attr('id'))
      }
    })
  })

  createBoard()
  socket.emit('board')
  socket.emit('stats')
}
