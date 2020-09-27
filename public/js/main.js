'use strict'
import clientClick from "./clientClick"
import clientClickKeyboard from "./clientClick-keyboard"
import { navManagment, statsTracker } from "./navItems"
import { gridHistory } from "./gridHistory"

$(function () {
	clientClick()
	clientClickKeyboard()
	navManagment()
	statsTracker()
	gridHistory()
})