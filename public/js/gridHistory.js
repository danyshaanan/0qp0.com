'use strict'
import { createBoard, setCell, loadBoardData } from "./boardInteractions"

export default class GridHistory {

	constructor() {
		this.today = new Date()
		this.historyData = {}
		this.selectedDate = {
			year: null,
			month: null,
			day: null
		}

		window.socket.on('history', (data, year) => {
			this.handleDataResponse(data, year)
		})

		this.$board = createBoard($('div#historyContainer'), "historyBoard")
		this.initDatePicker()
		this.fetchYear(this.today.getFullYear())
	}

	initDatePicker() {
		this.$historyTemplate = $(
			`<div class="historyDates">
				<div id="years" class="historySelector"></div>
				<div id="months" class="historySelector"></div>
				<div id="days" class="historySelector"></div>
				<div id="currentBoard"></div>
			</div>`)

		this.$historyTemplate.on("click", ".historySelector > span", (event) => {
			const $target = $(event.target)
			switch ($target.parent(".historySelector").attr("id")) {
				case "years":
					// TODO: Fetch if necessary
					this.selectDate($target.data("value"), null, null)
					break
				case "months":
					this.selectDate(null, $target.data("value"), null)
					break
				case "days":
					this.selectDate(null, null, $target.data("value"))
					break
			}
		})

		// TODO: Change 2019 for 2020 after testing
		for (let year = 2019; year <= this.today.getFullYear(); year++) {
			this.$historyTemplate.find("#years").append(`<span data-value=${year}>${year}</span>`)
		}

		this.$board.before(this.$historyTemplate)
	}

	handleDataResponse(data, year) {
		this.historyData[year] = data

		console.log(this.historyData)

		if (!this.selectedDate.year) {
			this.findInitialDate(year)
		}
	}

	fetchYear(year) {
		window.socket.emit('history', year)
		// TODO: regenerate datepicker
	}

	findInitialDate(year) {
		const months = Object.keys(this.historyData[year]).reverse()
		for (const month of months) {
			if (this.historyData[year][month] !== null) {
				const days = Object.keys(this.historyData[year][month]).reverse()
				for (const day of days) {
					if (this.historyData[year][month][day] !== null) {
						this.selectDate(year, month, day)
						break;
					}
				}

				if (this.selectedDate.year !== null) {
					break
				}
			}
			console.log('error, did not find any initial day')
			// TODO: return error
		}
	}

	selectDate(year, month, day) {
		console.log(year, month, day)
		if(year !== null) {
			this.selectedDate.year = year;
			// TODO: select last day available && last day
			// TODO: regenerate date picker
			this.$historyTemplate.find(`#years.active`).removeClass("active")
			this.$historyTemplate.find(`#years[data-value="${year}"]`).addClass("active")
		}
		if(month !== null) {
			this.selectedDate.month = month;
			// TODO: select last day available
			// TODO: regenerate date picker
			this.$historyTemplate.find(`#months.active`).removeClass("active")
			this.$historyTemplate.find(`#months[data-value="${month}"]`).addClass("active")
		}
		if(day !== null) {
			this.selectedDate.day = day;
			this.$historyTemplate.find(`#days.active`).removeClass("active")
			this.$historyTemplate.find(`#days[data-value="${day}"]`).addClass("active")
		}
		loadBoardData(this.$board, this.historyData[this.historyData.year][this.historyData.month][this.historyData.day].board)
	}


}