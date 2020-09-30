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

		this.$board = createBoard($('div#historyContainer'))
		this.fetchAllYears()
	}

	handleDataResponse(data, year) {
		this.historyData[year] = data

		console.log(this.historyData)
		// TODO: Save in local storage previous years

		if (!this.selectedDate.year) {
			this.findInitialDate(year)
		}
	}

	fetchAllYears() {
		for (let year = this.today.getFullYear(); year >= 2020; year--) {
			// TODO: Don't ask if the years data are present in local storage and retrieve it
			window.socket.emit('history', year)
		}
	}

	findInitialDate(year) {
		for (let index in this.historyData[year]) {
			if (this.historyData[year][index] !== null) {
				const month = index
				console.log(this.historyData[year][month])
				const [day] = [Object.keys(this.historyData[year][month])[0]]
				this.selectDate(year, month, day)
				break;
			}
		}
	}

	selectDate(year, month, day) {
		loadBoardData(this.$board, this.historyData[year][month][day].board)
	}


}