// Return the created Board JQuery element
export function createBoard($container, id) {
	const $board = $('<div/>', { id: id, class: "board" }).appendTo($container)
	for (let h = 1; h <= 30; h++) {
		for (let w = 1; w <= 30; w++) {
			$('<span/>', { id: h + 'x' + w, class: 'cell' }).appendTo($board)
		}
	}
	return $board
}

export function setCell($board, cellId, newState) {
	const $myCell = $board.find("#" + cellId)
	$myCell.addClass(newState ? 'blackCell' : 'whiteCell').removeClass(!newState ? 'blackCell' : 'whiteCell')
}

export function loadBoardData($board, boardData) {
	$board.find('span').each(function (index, element) {
		const cellId = $(element).attr('id')
		setCell($board, cellId, ~boardData.indexOf(cellId))
	})
}