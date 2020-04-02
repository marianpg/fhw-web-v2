'use strict'

import { isDefined } from './helper'

import { Config as ServerConfig, parseConfig as parseServerConfig } from './http'
import { Config as LoggingConfig, parseConfig as parseLoggingConfig } from './logging'
import { Config as DatabaseConfig, parseConfig as parseDatabaseConfig } from './database'
import { Config as RendererConfig, parseConfig as parseRendererConfig } from './render-engine'
import { Config as ValidatorConfig, parseConfig as parseValidatorConfig } from './validator'


export enum Language {
	DE = 'de',
	EN = 'en'
}
const DefaultLanguage = Language.DE

const parseLanguage = (toVerify?: string): Language => {
	return isDefined(toVerify)
		? Object.values(Language).find(lang => toVerify.includes(lang)) || DefaultLanguage
		: DefaultLanguage
}

export interface Config {
	language?: Language
	server?: ServerConfig
	logging?: LoggingConfig
	database?: DatabaseConfig
	renderer?: RendererConfig
	validator?: ValidatorConfig
}

export const parseConfig = (config?: Config): Config => {
	const _language: string = isDefined(config) ? config.language : null
	const _serverConfig: ServerConfig = isDefined(config) ? config.server : null
	const _loggingConfig: LoggingConfig = isDefined(config) ? config.logging : null
	const _databaseConfig: DatabaseConfig = isDefined(config) ? config.database : null
	const _rendererConfig: RendererConfig = isDefined(config) ? config.renderer : null
	const _validatorConfig: ValidatorConfig = isDefined(config) ? config.validator : null
	
	const _config: Config = {
		language: parseLanguage(_language),
		server: parseServerConfig(_serverConfig),
		logging: parseLoggingConfig(_loggingConfig),
		database: parseDatabaseConfig(_databaseConfig),
		renderer: parseRendererConfig(_rendererConfig),
		validator: parseValidatorConfig(_validatorConfig)
	}

	return _config
}