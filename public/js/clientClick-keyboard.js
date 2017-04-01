/* globals $ */
function clientClickKeyboard() { // eslint-disable-line no-unused-vars
  'use strict'
  if (!window.$) throw new Error('$ is not loaded! Aborting...') // TODO: check error, show in gui.

  function setSelected() {
    window.localStorage.selectedId = id
    $('span').css('border', 'solid black 1px')
    $('#' + id).css('border', 'solid grey 2px')
  }

  function handleKey(e) {
    if (e.which === 32) {
      $('#' + id).click()
      return false
    } else if (~[37, 38, 39, 40].indexOf(e.which)) {
      var boardSize = 60
      var dim = (e.which % 2) ? 1 : 0
      var diff = (e.which <= 38) ? -1 : 1
      var pair = id.split('x').map(function(v) { return parseInt(v) })
      pair[dim] = (pair[dim] + boardSize + diff - 1) % boardSize + 1
      id = pair.join('x')
      setSelected()
      return false
    }
  }

  var id = window.localStorage.selectedId || '1x1'
  setSelected()
  $('body').keydown(handleKey)
}
