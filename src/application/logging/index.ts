'use strict'

import { isDefined } from '../helper'
import { Config } from './config'


export { Config, parseConfig } from './config'


const colors = require('colors')

colors.setTheme({
	debug: 'blue',
	info: 'green',
	warn: 'yellow',
	error: 'red',
	data: 'grey'
})

type LogType = 'debug' | 'info' | 'warn' | 'error' | 'data'


export class Logging {
	private subtag: string

	constructor(
		private tag: string,
		private config: Config
	) { }

	protected log(type: LogType, ...args: any[]) {
		let tag = `[${this.tag}`
		if (isDefined(this.subtag)) {
			tag = `${tag}: ${this.subtag}]`
		} else {
			tag = `${tag}]`
		}
		console.log(colors[type](tag), ...args)
	}

	setSubtag(subtag: string): void {
		this.subtag = subtag
	}

	modify(tag: string): Logging {
		const logging = new Logging(this.tag, this.config)
		logging.setSubtag(tag)
		return logging
	}

	debug(...args: any[]): void {
		if (this.config.debug) {
			this.log('debug', ...args)
		}
	}

	info(...args: any[]): void {
		if (this.config.info) {
			this.log('info', ...args)
		}
	}

	warn(...args: any[]): void {
		if (this.config.warn) {
			this.log('warn', ...args)
		}
	}

	error(...args: any[]): void {
		if (this.config.error) {
			this.log('error', ...args)
		}
	}

	data(...args: any[]): void {
		if (this.config.data) {
			this.log('data', ...args)
		}
	}
}


export class FakeLogging extends Logging {
	constructor() {
		const tag = ''
		const config: Config = {
			data: false,
			debug: false,
			error: false,
			info: false,
			warn: false
		}
		super(tag, config)
	 }

	protected log(type: LogType, ...args: any[]) {	}

	modify(tag: string): Logging {
		return this
	}
}