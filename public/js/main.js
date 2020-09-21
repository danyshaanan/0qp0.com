'use strict'
import clientClick from "./clientClick"
import clientClickKeyboard from "./clientClick-keyboard"
import { navManagment, statsTracker } from "./navItems"

$(function () {
	clientClick()
	clientClickKeyboard()
	navManagment()
	statsTracker()
})