document.addEventListener("DOMContentLoaded", () => {
	const blocks = {
		tec: [
			document.querySelectorAll('.fhw-web-01-tec'),
			document.querySelectorAll('.fhw-web-01-tec')
		],
		awn: {
			1: document.querySelectorAll('.fhw-web-01-anw')
		}
	}

	const filterButton = document.querySelector('#fhw-web-filter')
	console.log('filterButton', filterButton)
	filterButton.addEventListener('click', () => {
		blocks.tec[1].forEach(elem => elem.style.display = 'none')
	})
})