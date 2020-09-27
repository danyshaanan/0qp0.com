'use strict'


export function gridHistory() {
	// TODO: ALL or specific year
	// store it inside localStorage and don't ask it to the database again
	window.socket.emit('history', 2020)
	window.socket.on('history', function (data) {
		console.log(data)
	})
}