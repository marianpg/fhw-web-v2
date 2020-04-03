'use strict'


export interface DatabaseConfig {
	reloadOnEveryRequest: boolean
	globalFile: string
	path: string
	sql: boolean
	logging: boolean
}