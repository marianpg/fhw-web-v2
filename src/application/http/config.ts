'use strict'

export interface Config {
	port?: number,
	magicRoutes?: boolean,
	withSessions?: boolean,
	reloadRoutesOnEveryRequest?: boolean
}

export const parseConfig = (config?: Config) => {
	const _config: Config = {
		port: config && config.port ? config.port : 8080,
		magicRoutes: config && config.magicRoutes ? config.magicRoutes : true,
		withSessions: config && config.withSessions ? config.withSessions : false,
		reloadRoutesOnEveryRequest: config && config.reloadRoutesOnEveryRequest ? config.reloadRoutesOnEveryRequest : true
	}

	return _config
}