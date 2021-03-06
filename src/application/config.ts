'use strict'

import {
	Config, DefaultConfig,
	Languages,
	LoggingTypes,
	ServerConfig,
	RoutingConfig,
	TemplatingConfig,
	SessionsConfig,
	DatabaseConfig
} from '../public/config'

import { isDefined, isArray } from './helper'

const decide = (toVerify: any, _default: any): any => {
	return isDefined(toVerify) ? toVerify : _default
}

const parseRootPath = (toVerify: any, _default: string): string => {
	return decide(toVerify, _default)
}

const parseLanguage = (toVerify: any, _default: Languages): Languages => {
	return isDefined(toVerify)
		? Object.values(Languages).find(lang => toVerify === lang) || _default
		: _default
}

const isOneOfLogging = (toVerify: any, _default: LoggingTypes[]): boolean => {
	// TODO possible Optimization with Logging[toVerify]
	return isDefined(Object.values(LoggingTypes).find(log => toVerify === log))
}

const parseLoggingActive = (toVerify: any, _default: LoggingTypes[]): LoggingTypes[] => {
	return isDefined(toVerify) && isArray(toVerify)
		? toVerify.reduce<LoggingTypes[]>(
			(acc, log) => {
				if (isOneOfLogging(log, _default)) {
					acc.push(log)
				}
				return acc
			}, []
		) || _default
		: _default
}

const parseServerConfig = (toVerify: any, _default: ServerConfig): ServerConfig => {
	return isDefined(toVerify)
		? {
			host: decide(toVerify.host, _default.host),
			port: decide(toVerify.port, _default.port),
			logging: decide(toVerify.logging, _default.logging)
		}
		: _default
}

const parseRoutingConfig = (toVerify: any, _default: RoutingConfig): RoutingConfig => {
	return isDefined(toVerify)
		? {
			magic: decide(toVerify.magic, _default.magic),
			fileName: decide(toVerify.fileName, _default.fileName),
			fileExtension: decide(toVerify.fileExtension, _default.fileExtension),
			reloadOnEveryRequest: decide(toVerify.reloadOnEveryRequest, _default.reloadOnEveryRequest),
			logging: decide(toVerify.logging, _default.logging)
		}
		: _default
}

const parseTemplatingConfig = (toVerify: any, _default: TemplatingConfig): TemplatingConfig => {
	return isDefined(toVerify)
		? {
			validation: decide(toVerify.validation, _default.validation),
			paths: isDefined(toVerify.paths)
				? {
					pages: decide(toVerify.paths.pages, _default.paths.pages),
					templates: decide(toVerify.paths.templates, _default.paths.templates),
					helpers: decide(toVerify.paths.helpers, _default.paths.helpers),
					controller: decide(toVerify.paths.controller, _default.paths.controller)
				}
				: _default.paths,
			allowedExtensions: decide(toVerify.allowedExtensions, _default.allowedExtensions),
			frontmatterFormat: decide(toVerify.frontmatterFormat, _default.frontmatterFormat),
			logging: decide(toVerify.logging, _default.logging)
		}
		: _default
}

const parseSessionsConfig = (toVerify: any, _default: SessionsConfig): SessionsConfig => {
	return isDefined(toVerify)
		? {
			active: decide(toVerify.active, _default.active),
			path: decide(toVerify.path, _default.path),
			logging: decide(toVerify.logging, _default.logging)
		}
		: _default
}

const parseDatabaseConfig = (toVerify: any, _default: DatabaseConfig): DatabaseConfig => {
	return isDefined(toVerify)
		? {
			reloadOnEveryRequest: decide(toVerify.reloadOnEveryRequest, _default.reloadOnEveryRequest),
			globalFile: decide(toVerify.globalFile, _default.globalFile),
			path: decide(toVerify.path, _default.path),
			sqlite: decide(toVerify.sqlite, _default.sqlite),
			sqliteFilename: decide(toVerify.sqliteFilename, _default.sqliteFilename),
			logging: decide(toVerify.logging, _default.logging)
		}
		: _default
}


export const parseConfig = (toVerify: any): Config => {
	return isDefined(toVerify)
		? {
			rootPath: parseRootPath(toVerify.rootPath, DefaultConfig.rootPath),
			language: parseLanguage(toVerify.language, DefaultConfig.language),
			loggingActive: parseLoggingActive(toVerify.loggingActive, DefaultConfig.loggingActive),
			server: parseServerConfig(toVerify.server, DefaultConfig.server),
			routing: parseRoutingConfig(toVerify.routing, DefaultConfig.routing),
			templating: parseTemplatingConfig(toVerify.templating, DefaultConfig.templating),
			sessions: parseSessionsConfig(toVerify.sessions, DefaultConfig.sessions),
			database: parseDatabaseConfig(toVerify.database, DefaultConfig.database),
		}
		: DefaultConfig
}