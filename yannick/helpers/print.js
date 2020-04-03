'use strict'

const getMantra = (() =>{
	const mantras = [
		"Be still.",
		"Live fearlessly.",
		"Don't worry, be happy.",
		"Give back.",
		"Live your truth.",
		"Invest in yourself.",
		"Trust the process.",
		"Seize the day.",
		"Trust your instincts.",
		"Be at peace.",
		"Never stop dreaming.",
		"It's okay to ask for help.",
		"Find joy in the ordinary.",
		"Trust yourself.",
		"Run your own race.",
		"Dream big.",
		"You are awesome.",
		"Life happens now.",
		"Be gentle with yourself.",
		"Ride the waves.",
		"Thrive on change.",
		"Be kind.",
		"Live simply.",
		"Action conquers fear.",
		"You've got this! Start now.",
		"Be grateful.",
		"Empower yourself.",
		"Do the things you love.",
		"Do no harm.",
		"Baby steps.",
		"Wonder begets wisdom.",
		"Be honest.",
		"Do great things.",
		"Be here now.",
		"Progress, not perfection.",
		"You are worthy.",
		"Make it happen.",
		"Make your dreams happen.",
		"Have fun.",
	]
	const getRandom = () => Math.floor(Math.random()*(mantras.length))

	return () => mantras[getRandom()]
})()

module.exports = {
	getMantra
}