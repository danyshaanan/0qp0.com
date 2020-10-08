'use strict'
import clientClick from "./clientClick"
import clientClickKeyboard from "./clientClick-keyboard"
import { navManagment, statsTracker } from "./navItems"
import GridHistory from "./gridHistory"

$(function () {
	clientClick()
	clientClickKeyboard()
	navManagment()
	statsTracker()
	new GridHistory()
})