'use strict'

const text = () => {
	const time = new Date().toLocaleTimeString()
	
    return {
		status: 200,
		text: `Die aktuelle Uhrzeit ist ${time}`
	}
}

const json = () => {
	const time = new Date().toLocaleTimeString()
	
    return {
		status: 200,
		json: {
			msg: `Die aktuelle Uhrzeit ist ${time}`,
			time
		}
	}
}

const redirect = () => {	
    return {
		status: 307,
		redirect: '/controller/text'
	}
}

const page = () => {
	return {
		status: 200,
		page: 'index'
	}
}

const fragment = () => {
	return {
		status: 200,
		fragment: 'greetz'
	}
}

const promise = () => {
	const callTime = Date.now()

	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const delta = Date.now() - callTime
			const result = {
				status: 200,
				text: `You waitet ${delta}ms for this.`
			}
			resolve(result)
		}, 1000)
	})
}

const promiseChained = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(promise())
		}, 3000)
	})
}

module.exports = {
	text,
	json,
	redirect,
	page,
	fragment,
	promise,
	'promise-chained': promiseChained
}