'use strict'

import { Config } from './config'
import { Logging } from './logging'
import { FileUtils } from './filesystem-utils'

import { Server } from './http'

import { Request } from './request'
import { ResponseService } from './response-service'
import { RenderEngine } from './render-engine'
import { Validator } from './validator'
import { DatabaseService } from './database'

export { Config, parseConfig } from './config'


export class Application {
	private server: Server

	constructor(
		private config: Config,
		private logging: Logging,
		private fileUtils: FileUtils
	) {
		this.logging = this.logging.modify('app')
	}

	async start(): Promise<void> {
		await this.buildServer()
		await this.startServer()
	}

	async stop(): Promise<void> {
		if (this.server && this.server.listening) {
			await this.server.close()
		}
	}

	private async buildServer(): Promise<void> {
		const renderEngine = await new RenderEngine(
			this.config.renderer, this.logging, this.fileUtils
		).build()

		const request = new Request(this.config, this.logging)

		const validator = new Validator(
			this.config.validator, this.logging, this.fileUtils,
			request
		)

		const databaseService = await new DatabaseService(this.config.database, this.logging, this.fileUtils).build()
		
		const responseService = await new ResponseService(
			this.config, this.logging, this.fileUtils,
			renderEngine, validator, databaseService
		).build()

		this.server = new Server(
			this.config.server, this.logging, this.fileUtils,
			responseService
		)

		await this.server.build()
	}

	private async startServer(): Promise<void> {
		await this.server.start()
	}
}