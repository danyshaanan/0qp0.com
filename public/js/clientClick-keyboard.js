'use strict'
export default function clientClickKeyboard() { // eslint-disable-line no-unused-vars

  function setSelected(id) {
    window.localStorage.selectedId = id
    $('.selectedCell').removeClass('selectedCell')
    $('#' + id).addClass('selectedCell')
  }

  function handleKey(event) {
    const key = event.which;
    if (key === 32 || key === 13) {  // Space or Enter
      $('#' + id).trigger("click")
    } else if ([37, 38, 39, 40].includes(key)) {
      const boardSize = 30
      const dim = (key % 2) ? 1 : 0
      const diff = (key <= 38) ? -1 : 1
      const pair = id.split('x').map(function (v) { return parseInt(v) })
      pair[dim] = (pair[dim] + boardSize + diff - 1) % boardSize + 1
      id = pair.join('x')
      setSelected(id)
    }
  }

  let id = window.localStorage.selectedId || '1x1'
  $('body').on('keydown', handleKey)
}
