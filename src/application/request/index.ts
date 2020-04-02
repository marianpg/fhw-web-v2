'use strict'

import axios from 'axios'
import url = require('url') //see https://stackoverflow.com/a/34520891

import { isDefined } from '../helper'
import { Config } from '../config'
import { Logging } from '../logging'

import { NuValidation } from '../validator'


export class Request {
	constructor(
		private config: Config,
		private logging: Logging
	) {	}

	async sendNuChecker(html: string): Promise<NuValidation[]> {
		const { data } = await axios.post('https://validator.w3.org/nu/?out=json', html, {
			headers: {
				"Content-Type": "text/html",
				"charset": "utf-8"
			}
		})

		if (!isDefined(data.messages)) {
			throw new Error(`Invalid or unexpected Validation-Response: ${data}`)
		}
		
		return data.messages
	}

	async getStylesheet(path: string): Promise<string> {
		const port = this.config.server.port
		const _url = url.resolve(`http://localhost:${port}/`, path)
		const { data } = await axios.get(_url, {
			headers: {
				"Content-Type": "text/css",
				"charset": "utf-8",
				"User-Agent": "fhw-web/1.0.0 (Internal Call to fetch Stylesheet)"
			}
		})
		
		return data
	}
}