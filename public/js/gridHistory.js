'use strict'
import { createBoard, loadBoardData } from "./boardInteractions"

export default class GridHistory {

	constructor() {
		this.today = new Date()
		this.historyData = {}
		this.selectedDate = {
			year: null,
			month: null,
			day: null
		}

		this.$board = createBoard($('div#historyContainer'), "historyBoard")
		this.initDatePicker()

		window.socket.on('history', (data, year) => {
			this.handleDataResponse(data, year)
		})
		this.selectDate(this.today.getFullYear(), null, null)
	}

	initDatePicker() {
		this.$historyTemplate = $(
			`<div class="historyDates">
				<div id="years" class="historySelector"></div>
				<div id="months" class="historySelector"></div>
				<div id="days" class="historySelector"></div>
				<div id="currentBoard"></div>
			</div>`)

		this.initClickEvents()

		// TODO: Change 2019 for 2020 after testing
		for (let year = 2019; year <= this.today.getFullYear(); year++) {
			this.$historyTemplate.find("#years").append(`<span data-value=${year}>${year}</span>`)
		}

		this.$board.before(this.$historyTemplate)
	}

	updateDatePicker() {
		const $previousSelectedYear = this.$historyTemplate.find(`#years .active`)
		if ($previousSelectedYear.data("value") != this.selectedDate.year) {
			this.$historyTemplate.find(`#years [data-value="${this.selectedDate.year}"]`).addClass("active")
		}
		$previousSelectedYear.removeClass("active")
		this.$historyTemplate.find(`#years [data-value="${this.selectedDate.year}"]`).addClass("active")

		const previousSelectedMonth = this.$historyTemplate.find(`#months .active`).data("value")
		if (previousSelectedMonth != this.selectedDate.month) {
			this.$historyTemplate.find("#months").empty()
			for (const month in this.historyData[this.selectedDate.year]) {
				const dateToMonth = new Date()
				if (this.historyData[this.selectedDate.year][month] !== null) {
					dateToMonth.setMonth(month)
					this.$historyTemplate.find("#months").append(`<span data-value=${month}>${dateToMonth.toLocaleString(undefined, { month: 'long'})}</span>`)
				}
			}
			this.$historyTemplate.find(`#months [data-value="${this.selectedDate.month}"]`).addClass("active")
		}

		this.$historyTemplate.find("#days").empty()
		for (const day in this.historyData[this.selectedDate.year][this.selectedDate.month]) {
			this.$historyTemplate.find("#days").append(`<span data-value=${day}>${day}</span>`)
		}
		this.$historyTemplate.find(`#days [data-value="${this.selectedDate.day}"]`).addClass("active")
	}

	initClickEvents() {
		this.$historyTemplate.on("click", ".historySelector > span", (event) => {
			const $target = $(event.target)
			const id = $target.parent(".historySelector").attr("id")

			const year = (id === "years") ? $target.data("value") : null
			const month = (id === "months") ? $target.data("value") : null
			const day = (id === "days") ? $target.data("value") : null
			this.selectDate(year, month, day)
		})
	}

	handleDataResponse(data, year) {
		this.historyData[year] = data

		if (this.selectedDate.year == year || !this.selectedDate.year) {
			this.selectDate(year, null, null)
		}
	}

	fetchYear(year) {
		window.socket.emit('history', year)
	}

	findInitialMonthAndDay(year) {
		const months = Object.keys(this.historyData[year]).reverse()
		if(months.length === 0) {
			console.log('error, did not find any initial month')
			//TODO: Find a way to roll back to the old year
			return
		}

		for (const month of months) {
			if (this.historyData[year][month] !== null) {
				this.findInitialDay(year, month)

				if (this.selectedDate.year !== null) {
					break
				}
			}
		}
	}

	findInitialDay(year, month) {
		const days = Object.keys(this.historyData[year][month]).reverse()
		for (const day of days) {
			if (this.historyData[year][month][day] !== null) {
				this.selectedDate.year = year;
				this.selectedDate.month = month;
				this.selectedDate.day = day;
				break;
			}
		}
	}

	selectDate(year, month, day) {
		if (year !== null && !this.historyData[year]) { // The year is not already loaded
			this.selectedDate.year = year
			this.fetchYear(year)
			return
		}

		if (year !== null) {
			if (month === null && day === null) {
				this.findInitialMonthAndDay(year)
			}
			this.updateDatePicker()
		}
		if (month !== null) {
			this.selectedDate.month = month;
			if (year === null && day === null) {
				this.findInitialDay(this.selectedDate.year, month)
			}
			this.updateDatePicker()
		}
		if (day !== null) {
			this.selectedDate.day = day;
			this.updateDatePicker()
		}
		loadBoardData(this.$board, this.historyData[this.selectedDate.year][this.selectedDate.month][this.selectedDate.day].board)
	}

}