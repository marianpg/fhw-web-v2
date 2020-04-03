'use strict'

import { Config } from '../src/public/config'

import { FHWedelWebInterface } from '../src'
import { parseConfig } from '../src/application/config'
import { Application } from  '../src/application'
import { FileUtils } from  '../src/application/filesystem-utils'
import { Logging, LoggingService } from  '../src/application/logging'

type RecursivePartial<T> = {
	[P in keyof T]?:
	T[P] extends (infer U)[] ? RecursivePartial<U>[] :
	T[P] extends object ? RecursivePartial<T[P]> :
	T[P]
}

export class FHWedelWeb implements FHWedelWebInterface {
	
	private logging: Logging
	private config: Config
	private app: Application
	
	constructor(
		config?: RecursivePartial<Config>
	) {
		try {
			this.config = parseConfig(config)
			const shouldLog = this.config.server.logging

			const logService = new LoggingService(this.config.loggingActive)
			this.logging = logService.create('server', shouldLog)

			const fileUtils = new FileUtils(
				logService.create('filesystem', shouldLog),
				this.config.rootPath
			)

			this.app = new Application(this.config, logService, fileUtils)
			
		} catch (e) {
			this.logging.error('#######', 'FATAL [new]')
			this.logging.error(e)
			this.logging.error('#######', 'FATAL END')
		}
	}


	async start(): Promise<void> {
		try {
			await this.app.start()
		} catch (e) {
			this.logging.error('#######', 'FATAL [start]')
			this.logging.error(e)
			this.logging.error('#######', 'FATAL END')
		}
	}

	async stop(): Promise<void> {
		await this.app.stop()
	}
}