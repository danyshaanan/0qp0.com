"use strict"
export function navManagment() {
	const $nav = $('.nav')
	let $selectedItem = $("[data-id='boardContainer']")

	$nav.on('click', 'li', (event) => {
		const $newItem = $(event.target)
		if ($selectedItem.data('id') !== $newItem.data('id')) {
			$newItem.addClass('active')
			$selectedItem.removeClass('active')
			$(`#${$selectedItem.data('id')}`).hide()
			$(`#${$newItem.data('id')}`).show()
			$selectedItem = $newItem
		}
	})
}

export function statsTracker() {
	socket.on('stats', function (data) {
		const $stats = $('.statsNumber')
		$stats.eq(0).text(new Date(data.startDate).toLocaleString())
		$stats.eq(1).text(Math.floor(data.hoursRunning) + " hours and " + Math.floor((data.hoursRunning - Math.floor(data.hoursRunning)) * 60) + " minutes")
		$stats.eq(2).text(data.flipRequestCount)
		$stats.eq(3).text(data.boardRequestCount)
		$stats.eq(4).text(Math.round(data.flipsPerHour * 100) / 100)
	})
}

export function timeToString(minutes) {
	var sign = minutes < 0 ? "-" : "";
	var min = Math.floor(Math.abs(minutes))
	var sec = Math.floor((Math.abs(minutes) * 60) % 60);
	return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}