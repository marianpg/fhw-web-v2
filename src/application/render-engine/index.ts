'use strict'

import { TemplatingConfig } from '../../public/config'
import { GlobalData } from '../../public/global'
import { RequestData } from '../../public/request'
import { SessionData } from '../../public/session'
import { Frontmatter, PageData } from '../../public/frontmatter'

import Handlebars = require('handlebars') //see https://stackoverflow.com/a/34520891
import promisedHandlebars = require('promised-handlebars')

import { isDefined } from '../helper'
import { Logging } from '../logging'
import { FileUtils } from '../filesystem-utils'

import { FrontmatterService } from './frontmatter-service'
import { HelpersRegistration } from './helper'
import { Validation } from '../validator'

import { ErrorBannerTemplate } from './templates/error-banner-template.hbs'
import { AnyErrorTemplate } from './templates/any-error-template.hbs'
import { ValidationErrorTemplate } from './templates/validation-error-template.hbs'
import { isException, RouteException } from '../exception'


export enum RenderType {
	PAGE = 'PAGE',
	TEMPLATE = 'TEMPLATE'
}

export class RenderEngine {
	private hbs: typeof Handlebars
	private helpers: HelpersRegistration

	constructor(
		private config: TemplatingConfig,
		private logging: Logging,
		private fileUtils: FileUtils
	) {
		this.helpers = new HelpersRegistration(this.config, this.logging, this.fileUtils)
	}

	async build(): Promise<RenderEngine> {
		await this.setupRenderer()
		return this
	}

	private async setupRenderer(): Promise<void> {
		this.hbs = promisedHandlebars(Handlebars)
		this.helpers.registerGlobalHelpers(this.hbs)
		this.helpers.registerCustomHelpers(this.hbs)
	}

	private async findExtension(fullPath: string): Promise<string> {
		const acceptedExtensions = await Promise.all(this.config.allowedExtensions.map(
			async (ext) => {
				return await this.fileUtils.exist(`${fullPath}.${ext}`)
			}
		))
		if (acceptedExtensions.indexOf(true) === -1) {
			throw new Error(`Can not find file on filesystem with any of the valid file extensions(${this.config.allowedExtensions}): ${fullPath}`)
		}
		const extension = this.config.allowedExtensions[acceptedExtensions.indexOf(true)]

		return extension
	}

	private async readFile(pagePath: string): Promise<string> {
		const path = this.fileUtils.fullPath(pagePath)
		const fullPath = await this.fileUtils.isDirectory(path)
			? this.fileUtils.join(path, 'index')
			: path
		
		const filepath = this.fileUtils.hasExtension(fullPath)
			? fullPath
			: `${fullPath}.${await this.findExtension(fullPath)}`

		if (!await this.fileUtils.fileExist(filepath)) {
			throw RouteException.NotFound(`Can not find requested file: ${filepath}`)
		}
		const file = await this.fileUtils.readFile(filepath)

		return file
	}

	private async readPage(filePath: string): Promise<string> {
		const pagePath = this.fileUtils.join('pages', filePath)
		
		return this.readFile(pagePath)
	}

	private async readTemplate(filePath: string): Promise<string> {
		const pagePath = this.fileUtils.join('templates', filePath)
		
		return this.readFile(pagePath)
	}

	private extract(file: string): [PageData, string] {
		const extraction = file.split('---').map(str => str.trim()).filter(str => str.length > 0)
		if (extraction.length > 1) {
			// TODO: Better Error Message in JSON Parse Error
			return [ JSON.parse(extraction[0]), extraction[1] ]
		} else {
			return [ {}, extraction[0] ]
		}
	}

	private async _render(file: string, parentFrontmatter: Frontmatter, contentHtml?: string): Promise<string> {
		const [pageFrontmatter, hbs] = this.extract(file)
		const frontmatter = FrontmatterService.Merge(parentFrontmatter, pageFrontmatter)

		this.hbs.registerHelper('content', () => {
			return new this.hbs.SafeString(contentHtml)
		})

		this.hbs.registerHelper('include', async (fname) => {
			const templateHtml = await this._renderTemplate(fname, frontmatter)
			return new this.hbs.SafeString(templateHtml)
		})

		let templateName = null
		if (isDefined(frontmatter.page.template)) {
			templateName = frontmatter.page.template
			delete frontmatter.page.template
		}		

		const hbsTemplate = this.hbs.compile(hbs)

		// note: it's the 'promised-handlebars' api, function 'hbsTemplate' returns a promise
		let html = await hbsTemplate(frontmatter)

		if (isDefined(templateName)) {
			html = await this._renderTemplate(templateName, frontmatter, html)
		}
		
		return html
	}

	private async _renderTemplate(filePath: string, frontmatter: Frontmatter, contentHtml?: string): Promise<string> {
		const file = await this.readTemplate(filePath)
		return this._render(file, frontmatter, contentHtml)		
	}

	async renderTemplate(filePath: string, global: GlobalData, request: RequestData, session: SessionData): Promise<string> {
		const frontmatter = FrontmatterService.Build({ global, request, session })
		const file = await this.readTemplate(filePath)
		return this._render(file, frontmatter)		
	}

	async renderPage(filePath: string, global: GlobalData, request: RequestData, session: SessionData): Promise<string> {
		const frontmatter = FrontmatterService.Build({ global, request, session })
		const file = await this.readPage(filePath)
		return this._render(file, frontmatter)
	}

	private injectErrorHtml(html: string, errorHtml: string): string {
		const bodytagClosingPosition = html.lastIndexOf('</body>')
		if (bodytagClosingPosition >= 0) {
			return `${html.substr(0, bodytagClosingPosition)}\n${errorHtml}\n${html.substr(bodytagClosingPosition)}`
		} else {
			return `${html}\n${errorHtml}`
		}
	}

	private async renderError(errorHtml): Promise<string> {
		const frontmatter: Frontmatter = FrontmatterService.Build({
			global: {
				errorHtml
		}})

		return await this._render(ErrorBannerTemplate, frontmatter)
	}

	async renderAnyError(error: Error, html?: string): Promise<string> {
		const frontmatter: Frontmatter = FrontmatterService.Build({
			global: {
				error: {
					name: error.name,
					message: error.message,
					stacktrace: error.stack
		}}})

		const errorHtml = await this.renderError(
			await this._render(AnyErrorTemplate, frontmatter)
		)

		if (isDefined(html)) {
			return this.injectErrorHtml(html, errorHtml)
		} else {
			return errorHtml
		}
	}

	async renderValidationError(validation: Validation, html: string): Promise<string> {
		const frontmatter: Frontmatter = FrontmatterService.Build({
			global: { validation, clientHtml: html }
		})

		const errorHtml = await this.renderError(
			await this._render(ValidationErrorTemplate, frontmatter)
		)

		return this.injectErrorHtml(html, errorHtml)
	}
}