'use strict'

import { RequestMethod, DEFAULT_METHOD } from '../../public/request'

import {
	Express,
	Router as ExpRouter,
	Request as ExpRequest,
	Response as ExpResponse,
	NextFunction as ExpNextFunction
} from 'express'
import express = require('express') //see https://stackoverflow.com/a/34520891

import { isDefined, jsonStringify } from '../helper'
import { Config } from '.'
import { Logging } from '../logging'
import { FileUtils } from '../filesystem-utils'

import { RoutesParser } from './routes-parser'
import { ResponseService } from '../response-service'
import { parseRequest } from './request'
import { Response, checkResponse } from './response'
import { setHeaders } from './headers'
import { SessionService } from './session-service'


export class Router {

	private app: Express
	private expRouter: ExpRouter

	constructor(
		private config: Config,
		private logging: Logging,
		private fileUtils: FileUtils,
		private responseService: ResponseService
	) {
		this.logging = this.logging.modify('router')
	}

	async plugIn(app: Express): Promise<void> {
		this.app = app
		this.app.use(async (req: ExpRequest, res: ExpResponse, next: ExpNextFunction) => {
			if (this.config.reloadRoutesOnEveryRequest) {
				await this.setup()
			}
			this.expRouter(req, res, next)
		})
		await this.setup()
	}
	
	
	private async setup(): Promise<void> {
		this.expRouter = express.Router({ caseSensitive: true })
		const routesParser = new RoutesParser(this.config, this.logging, this.fileUtils)
		const routes = await routesParser.parseRoutesDefinitionFile()

		routes.forEach(async route => {
			const methods: RequestMethod[] = (route as any).method || [DEFAULT_METHOD]
			methods.forEach(async method => {
				this.expRouter[method](route.url, async (req: ExpRequest, res: ExpResponse, next: ExpNextFunction) => {					
					let response: Response
					try {
						const request = parseRequest(req)
						const sessionService = new SessionService(this.config, this.fileUtils, req, res)
						response = await this.responseService.serve(route, request, sessionService)
						checkResponse(response)
					} catch (error) {
						response = {
							type: 'text/html',
							statusCode: 500,
							html: await this.responseService.serveErrorPage(error)
						}
					}
					this.sendResponse(response, res)
				})
			})
		})
	}

	/**
	 * @important must not throw any error
	 * 
	 * @param response FHW-Web-Response Object
	 * @param res Express-Response Object
	 */
	private sendResponse(response: Response, res: ExpResponse): void {
		if (isDefined(response.headers)) {
			setHeaders(res, response.headers)
		}
		res.status(response.statusCode)

		switch(response.type) {
			case 'empty':
				res.sendStatus(response.statusCode)
				break
			case 'text/plain':
				res.send(response.text)
				break
			case 'static':
				res.sendFile(response.pathToFile)
				break
			case 'text/html':
				res.send(response.html)
				break
			case 'application/json':
				res.json(response.body)
				break
			case 'redirect':
				res.redirect(response.redirectLocation)
				break
		}
	}
}