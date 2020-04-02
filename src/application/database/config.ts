'use strict'

import { isDefined } from "../helper"

export interface Config {
	useSql: boolean,
	reloadOnEveryRequest: boolean
}
const DEFAULT: Config = {
	useSql: false,
	reloadOnEveryRequest: true
}

export const parseConfig = (config?: Config): Config => {
	const _config: Config = {
		useSql: isDefined(config) && isDefined(config.useSql) ? config.useSql : DEFAULT.useSql,
		reloadOnEveryRequest: isDefined(config) && isDefined(config.reloadOnEveryRequest) ? config.reloadOnEveryRequest : DEFAULT.reloadOnEveryRequest
	}

	return _config
}