'use strict'

import { Express } from 'express'
import express = require('express') //see https://stackoverflow.com/a/34520891
import { Server as HttpServer } from 'http'
import cookieParser = require('cookie-parser') //and again...
import morganBody = require('morgan-body') //and again...

import { isDefined } from '../helper'
import { Config } from './config'
import { Logging } from '../logging'
import { FileUtils } from '../filesystem-utils'

import { Router } from './router'
import { ResponseService } from '../response-service'

export { Config, parseConfig } from './config'
export { parseRequest } from './request'
export { Response, ResponseEmpty, ResponseHtml, ResponseJson, ResponseRedirect, ResponseStatic, ResponseText } from './response'
export { parseMethod } from './method'


export class Server {
	private app: Express
	private httpServer: HttpServer

	constructor(
		private config: Config,
		private logging: Logging,
		private fileUtils: FileUtils,
		private responseService: ResponseService
	) {
		this.logging = this.logging.modify('server')
	}

	async build(): Promise<void> {
		this.app = express()
		this.app.use(express.urlencoded({ extended: true }))
		this.app.use(express.json())
		this.app.use(cookieParser())

		const router = new Router(
			this.config, this.logging, this.fileUtils,
			this.responseService)
		router.plugIn(this.app)

		morganBody(this.app)
	}

	async start(): Promise<void> {
		this.httpServer = this.app.listen(this.config.port, () => {
			this.logging.info(`Server is listening on port ${this.config.port}`)
		})
	}

	async close(): Promise<void> {

	}

	get listening(): boolean {
		return isDefined(this.httpServer) && this.httpServer.listening
	}
}