'use strict'

import { Config, Languages, LoggingTypes, RoutingFileExtensions } from '.'
import { FrontmatterType } from '../frontmatter'


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