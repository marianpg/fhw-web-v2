'use strict'

const getStyleString = () => `
:host {
	--nav-height: 4em;
	--nav-color: #2980B9;
	--green: #7ef0b3;
	--green-light: #ccffed;
	--blue: #6ab0de;
	--blue-light: #e7f2fa; 
	--orange: #f0b37e;
	--orange-light: #ffedcc;

	--fhw-highlight-01: #f2f5d5;
	--fhw-highlight-02: #d5f5d8;
	--fhw-highlight-03: #d8d5f5;
	--fhw-highlight-04: #f5d5f2;
}

.fhw-highlight-01 {
	background-color: var(--fhw-highlight-01);
}
.fhw-highlight-02 {
	background-color: var(--fhw-highlight-02);
}

.fhw-highlight-03 {
	background-color: var(--fhw-highlight-03);
}
.fhw-highlight-04 {
	background-color: var(--fhw-highlight-04);
}

* {
	box-sizing: border-box;
}

.banner {
	z-index: 300;
	position: fixed;
	top: 0;
	right: 0;
	height: var(--nav-height);
	padding: 0.5em 1em;
	display: flex;
}

.menu-icon::before {
	content: "\\2756";
}
.menu-icon {
	color: white;
	font-size: 32pt;
	background-color: var(--nav-color);
}
.menu-icon:hover {
	cursor: pointer;
}

.menu {
	position: fixed;
	top: var(--nav-height);
	right: 0;
	bottom: var(--nav-height);
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}
.menu.menu-hide {
	display: none;
}
.menu .menu-content {
	background-color: var(--blue-light);
	color: black;
}
.menu .menu-heading {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5em 0.4em 0.4em 0.4em;
	background-color: var(--blue);
	color: white;
}
.menu .menu-heading > *:not(:first-child) {
	margin-left: 1em;
}
.menu .menu-heading * {
	margin: 0;
}
.menu .menu-close:hover {
	cursor: pointer;
}
.menu .menu-close::before {
	content: "X";
	font-weight: bold;
	font-size: 18pt;
}
.menu .menu-text {
	padding: 1em;
}
.menu .menu-preview-colour {
	height: 2em;
}

.menu table * {
	text-align: center;
}
.menu table th, .menu table td {
	padding: 0.25em 0.75em;
}
.menu table tbody tr:hover {
	background-color: #fbfbfb;
}
`
const createText = (text) => document.createTextNode(text)

const createElement = ({ tag, classList, text, type, name, onclick }) => {
	const element = document.createElement(tag)

	if (classList != null && Array.isArray(classList)) {
		element.classList.add(...classList)
	}
	if (text != null) {
		element.appendChild(createText(text))
	}
	if (type != null) {
		element.type = type
	}
	if (name != null) {
		element.name = name
	}
	if (onclick != null) {
		element.addEventListener('click', onclick)
	}

	return element
}

const createStyleElement = ({ styleString }) => {
	const container = createElement({ tag: 'style'})
	container.textContent = styleString

	return container
}

const createBanner = ({ highlightContent }) => {
	const tagName = 'fhw-web-highlight'
	
	const createBannerElement = ({ content }) => {
		const container = createElement({ tag: 'div', classList: ['banner'] })

		const createMenu = ({ content }) => {
			const wrapper = createElement({ tag: 'div', classList: ['menu', 'menu-hide'] })

			const createToggleMenu = ({ menu }) => {
				let hide = false

				return () => {
					if (hide) {
						menu.classList.add('menu-hide')
					} else {
						menu.classList.remove('menu-hide')
					}
					hide = !hide
				}
			}
			const toggleMenu = createToggleMenu({ menu: wrapper })

			const container = createElement({ tag: 'article', classList: ['menu-content'] })

			const heading = createElement({ tag: 'div', classList: ['menu-heading'] })
			const title = createElement({ tag: 'h1', text: 'Highlight' })
			const close = createElement({ tag: 'div', classList: ['menu-close'] })
			close.addEventListener('click', toggleMenu)
			heading.appendChild(title)
			heading.appendChild(close)

			const contentWrapper = createElement({ tag: 'div', classList: ['menu-text']})
			contentWrapper.appendChild(content)

			container.appendChild(heading)
			container.appendChild(contentWrapper)
			wrapper.appendChild(container)

			return { menu: wrapper, toggleMenu: toggleMenu }
		}
		const { menu, toggleMenu } = createMenu({ content })

		const menuIcon = createElement({ tag: 'div', classList: ['menu-icon'] })
		menuIcon.addEventListener('click', toggleMenu)

		container.appendChild(menuIcon)
		container.appendChild(menu)

		return container
	}

	customElements.define(tagName, class extends HTMLElement {
		constructor() {
			super()	
			const shadow = this.attachShadow({ mode: 'open' })	

			const styles = createStyleElement({ styleString: getStyleString() })
			const banner = createBannerElement({ content: highlightContent })

			shadow.appendChild(styles)
			shadow.appendChild(banner)
		}
	})

	return document.createElement(tagName)
}

/**
 * 
 * @param {*} highlightContent a HTML-Element holding html for the pop-up
 * @returns object with properties:
 * - container - a HTML-Element holding the created html
 * - changeHighlight - Function to change the documents' highlight
 * 	the definition is changeHighlight(type: string, id: string) => void
 * 	where type is one of "all-content" | "all" | "anw" | "tec"
 * 	and id is one of "01" | "02" | "03" | "04" if type is not "all-content"
 */
const createHighlighting = () => {
	const container = createElement({ tag: 'div' })
	const explanation = createElement({
		tag: 'p',
		text: 'Select a preset to highlight only relevant paragraphs.'
	})

	const blocks = {
		tec: [
			document.querySelectorAll('[class*="fhw-web"][class*="tec"]'),
			document.querySelectorAll('.fhw-web-01-tec'),
			document.querySelectorAll('.fhw-web-02-tec'),
			document.querySelectorAll('.fhw-web-03-tec'),
			document.querySelectorAll('.fhw-web-04-tec')
		],
		anw: [
			document.querySelectorAll('[class*="fhw-web"][class*="anw"]'),
			document.querySelectorAll('.fhw-web-01-anw'),
			document.querySelectorAll('.fhw-web-02-anw'),
			document.querySelectorAll('.fhw-web-03-anw'),
			document.querySelectorAll('.fhw-web-04-anw')
		],
		all: document.querySelectorAll('[class*="fhw-web"]'),
	}

	const highlightings = {
		classes: [ 'fhw-highlight-01', 'fhw-highlight-02', 'fhw-highlight-03', 'fhw-highlight-04' ],
		selector: ''
	}
	highlightings.selector = highlightings.classes.reduce(
		(str, elem) => (`${str}, .${elem}`), ''
	).substr(2)
	
	const removeAllHighlightings = () => {
		document.querySelectorAll(highlightings.selector).forEach(
			paragraph => paragraph.classList.remove(...highlightings.classes)
		)
	}

	const addHighlighting = ({ type, id }) => {
		const i = +id
		if (i > 0) {
			blocks[type][i].forEach(
				paragraph => paragraph.classList.add(highlightings.classes[i-1])
			)
			addHighlighting({ type, id: i-1 })
		}
	}

	const changeHighlight = ({ type, id }) => {
		removeAllHighlightings()
		switch (type) {
			case 'all-content':
				// showing all-content means that there is no need for special highlighting
				break
			case 'all':
				addHighlighting({ type: 'anw', id })
				addHighlighting({ type: 'tec', id })
				break
			case 'anw':
			case 'tec':
				addHighlighting({ type, id })
		}
	}

	const createTable = ({ changeHighlight }) => {
		const createCell = ({ tag, text, node, colSpan, rowSpan }) => {
			const element = createElement({ tag, text })
			if (colSpan != null) {
				element.colSpan = colSpan
			}
			if (rowSpan != null) {
				element.rowSpan = rowSpan
			}
			if (node != null) {
				element.appendChild(node)
			}
			return element
		}
		const table = createElement({ tag: 'table' })
		const createHead = () => {
			const container = createElement({ tag: 'thead' })
			const heading = [
				createElement({ tag: 'tr' }),
				createElement({ tag: 'tr' })
			]

			Array.from([
				createCell({ tag: 'th', text: 'Exercise', rowSpan: 2 }),
				createCell({ tag: 'th', text: 'Audience', colSpan: 3 }),
				createCell({ tag: 'th', text: 'Color', rowSpan: 2 })
			]).forEach(cell => heading[0].appendChild(cell))
			Array.from([
				createCell({ tag: 'th', text: 'all' }),
				createCell({ tag: 'th', text: 'anw' }),
				createCell({ tag: 'th', text: 'tec' })
			]).forEach(cell => heading[1].appendChild(cell))
	
			container.appendChild(heading[0])
			container.appendChild(heading[1])

			return container
		}
		const head = createHead()

		const createBody = ({ changeHighlight }) => {
			const container = createElement({ tag: 'tbody' })

			Array.from({ length: 4}, (_, idx) => {
				const id = `0${idx+1}`
				return [
					createText(`Exercise ${id}`),
					createElement({ tag: 'input', type: 'radio', name: 'fhw-highlight', onclick: () => changeHighlight({ type: 'all', id }) }),
					createElement({ tag: 'input', type: 'radio', name: 'fhw-highlight', onclick: () => changeHighlight({ type: 'anw', id }) }),
					createElement({ tag: 'input', type: 'radio', name: 'fhw-highlight', onclick: () => changeHighlight({ type: 'tec', id }) }),
					createElement({ tag: 'div', classList: ['menu-preview-colour', `fhw-highlight-${id}`] })
				]
			}).map(entries => entries.map(entry => createCell({ tag: 'td', node: entry }))
			).map(cells => {
				const row = createElement({ tag: 'tr' })
				cells.forEach(cell => row.appendChild(cell))
				return row
			}).forEach(row => container.appendChild(row))

			return container
		}
		const body = createBody({ changeHighlight })
		
		const createFoot = ({ changeHighlight }) => {
			const container = createElement({ tag: 'tfoot' })
			const row = createElement({ tag: 'tr' })

			Array.from([
				createCell({ tag: 'td', text: 'All Content' }),
				createCell({ tag: 'td', node:
					createElement({
						tag: 'input',
						type: 'radio',
						name: 'fhw-highlight',
						onclick: () => changeHighlight({ type: 'all-content', id: 0 })
					})
				})
			]).forEach(cell => row.appendChild(cell))
			
			container.appendChild(row)

			return container
		}			
		const foot = createFoot({ changeHighlight} )

		table.appendChild(head)
		table.appendChild(body)
		table.appendChild(foot)

		return table
	}
	const table = createTable({ changeHighlight })

	container.appendChild(explanation)
	container.appendChild(table)

	return { container, changeHighlight }
}

const fhwSetup = () => {
	const highlighting = createHighlighting()
	const highlightBanner = createBanner({ highlightContent: highlighting.container })
	document.querySelector('body').appendChild(highlightBanner)
}

document.addEventListener("DOMContentLoaded", () => {
	fhwSetup()
})