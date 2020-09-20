export default function navManagment() {
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