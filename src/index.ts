'use strict'

import { Config, parseConfig } from './application/config'
import { Logging } from './application/logging'
import { Application } from './application'
import { FileUtils } from './application/filesystem-utils'

export interface FHWedelWebInterface {
	start(): Promise<void>
	stop(): Promise<void>
}

// TODO express.Router({ caseSensitive: true })

export class FHWedelWeb implements FHWedelWebInterface {

	private logging: Logging
	private config: Config
	private app: Application

	constructor(
		config?: Config
	) {
		this.config = parseConfig(config)
		this.logging = new Logging('fhwedel-web', this.config.logging)
		const fileUtils = new FileUtils(this.logging)
		this.app = new Application(this.config, this.logging, fileUtils)
	}

	async start(): Promise<void> {
		try {
			await this.app.start()
			this.logging.info('Application started successfully')
		} catch (err) {
			this.logging.error('Application start failed')
		}
	}

	async stop(): Promise<void> {
		try {
			await this.app.stop()
			this.logging.info('Application stopped successfully')
		} catch (err) {
			this.logging.error('Application stop failed')
		}
	}
}