'use strict'

import { FHWedelWebInterface } from '../src'
import { Config, parseConfig } from '../src/application'
import { Application } from  '../src/application'
import { FileUtils } from  '../src/application/filesystem-utils'
import { Logging } from  '../src/application/logging'

export class FHWedelWeb implements FHWedelWebInterface {
	
	private logging: Logging
	private config: Config
	private app: Application
	
	constructor(
		config: Config,
		projectDirectory: string
	) {
		this.config = parseConfig(config)
		this.logging = new Logging('fh-wedel-web', this.config.logging)

		const fileUtils = new FileUtils(this.logging, projectDirectory)
		this.app = new Application(this.config, this.logging, fileUtils)
	}


	async start(): Promise<void> {
		await this.app.start()
	}

	async stop(): Promise<void> {
		await this.app.stop()
	}
}