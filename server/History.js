const fs = require('fs')

class History {

	constructor(folderPath) {
		this._path = folderPath + "/"
		this.lastSavedDay = {
			year: "",
			month: "",
			day: "",
		}
	}

	update(board) {
		const today = new Date()
		const currentYear = today.getFullYear()
		const monthNumber = today.getMonth()
		const dayNumber = today.getDate()

		if (currentYear + monthNumber + dayNumber !== this.lastSavedDay.year + this.lastSavedDay.month + this.lastSavedDay.day) {
			this.saveData(board, this._path + currentYear, monthNumber, dayNumber)
		}

		this.lastSavedDay = {
			year: currentYear,
			month: monthNumber,
			day: dayNumber
		}
		return
	}


	saveData(board, pathToFile, month, day) {
		const pathWithFile = pathToFile + `/${month}.json`
		if (!fs.existsSync(pathWithFile)) {
			fs.mkdirSync(pathToFile, { recursive: true })
			this.saveToNewFile(board, pathWithFile, day)
		} else {
			this.saveToExistingFile(board, pathWithFile, day)
		}
	}

	saveToNewFile(board, pathWithFile, day) {
		console.log('saving to a new file')
		const newData = this.hydrateData({}, day, board)
		fs.writeFileSync(pathWithFile, JSON.stringify(newData))
	}

	saveToExistingFile(board, pathWithFile, day) {
		console.log('saving to an existing file')
		try {
			let fileData = JSON.parse(fs.readFileSync(pathWithFile))
			const newData = this.hydrateData(fileData, day, board)
			fs.writeFileSync(pathWithFile, JSON.stringify(newData))
		} catch (e) {
			throw new Error(e)
		}
	}

	hydrateData(data, day, board) {
		data[day] = {
			"timestamp": Date.now(),
			"board": board
		}
		return data
	}
}

module.exports = History