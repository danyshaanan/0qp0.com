'use strict';
import clientClick from "./clientClick"
import clientClickKeyboard from "./clientClick-keyboard"
import navManagment from "./navManagment"

$(function () {
	clientClick();
	clientClickKeyboard();
	navManagment();
});