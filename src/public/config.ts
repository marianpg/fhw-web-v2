'use strict'

import { FrontmatterType } from "./frontmatter";

export enum Languages {
	DE = 'de',
	EN = 'en'
}

export enum LoggingTypes {
	INFO = 'info',
	DATA = 'data',
	WARN = 'warn',
	ERROR = 'error',
	DEBUG = 'debug'
}

export enum RoutingFileExtensions {
	JSON = 'json',
	TS = 'ts'
}

export interface ServerConfig {
	host: string
	port: number
	logging: boolean
}

export interface RoutingConfig {
	magic: boolean
	fileName: string
	fileExtension: RoutingFileExtensions
	reloadOnEveryRequest: boolean
	logging: boolean
}

export interface TemplatingConfig {
	validation: boolean
	paths: {
		pages: string
		templates: string
		helpers: string
		controller: string
	},
	allowedExtensions: string[]
	frontmatterFormat: FrontmatterType
	logging: boolean
}

export interface SessionsConfig {
	active: boolean
	path: string
	logging: boolean
}

export interface DatabaseConfig {
	reloadOnEveryRequest: boolean
	globalFile: string
	path: string
	sql: boolean
	logging: boolean
}

export interface Config {
	rootPath: string
	language: Languages
	loggingActive: LoggingTypes[]
	server: ServerConfig
	routing: RoutingConfig
	templating: TemplatingConfig
	sessions: SessionsConfig
	database: DatabaseConfig
}

export const DefaultConfig: Config = {
	rootPath: process.cwd(),
	language: Languages.DE,
	loggingActive: [LoggingTypes.INFO, LoggingTypes.WARN, LoggingTypes.ERROR],
	server: {
		host: 'localhost',
		port: 8080,
		logging: true
	},
	routing: {
		magic: false,
		fileName: 'routes',
		fileExtension: RoutingFileExtensions.JSON,
		reloadOnEveryRequest: true,
		logging: true
	},
	templating: {
		validation: true,
		paths: {
			pages: 'pages',
			templates: 'templates',
			helpers: 'helpers',
			controller: 'controller'
		},
		allowedExtensions: ['html', 'hbs'],
		frontmatterFormat: FrontmatterType.JSON,
		logging: true
	},
	sessions: {
		active: true,
		path: 'sessions',
		logging: true
	},
	database: {
		reloadOnEveryRequest: true,
		globalFile: 'global.json',
		path: 'data',
		sql: false,
		logging: true
	}
}