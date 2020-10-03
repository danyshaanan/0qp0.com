/* global io */
'use strict'

import { createBoard, setCell, loadBoardData } from "./boardInteractions"

export default function clientClick() {
	if (!window.io) throw new Error('socket.io is not loaded! Aborting...') // TODO: check error, show in gui.

	let boardLoaded = false

	const socket = io.connect('/')
	window.socket = socket;

	const $board = createBoard($('div#boardContainer'), "board")

	socket.on('board', function (boardData) {
		boardLoaded = true
		loadBoardData($board, boardData)

		$board.on('click', 'span', (event) => {
			if (boardLoaded) {
				socket.emit('flip', $(event.target).attr('id'))
			}
		})
	})

	socket.on('flip', function (data) {
		setCell($board, data.cell, data.state)
	})

	socket.on('banned', function (cell) {
		console.log('flip rejected. You seem to be banned. Contact the site owner if you think this was a mistake')
		// TODO: negate cell
	})


	socket.emit('board')
}
