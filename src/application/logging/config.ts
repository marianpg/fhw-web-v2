'use strict'

import { isDefined } from '../helper'


export interface Config {
	debug: boolean
	info: boolean
	warn: boolean
	error: boolean
	data: boolean
}

const defaultValue = true
export const parseConfig = (config?: Config) => {
	const _config: Config = {
		debug: isDefined(config) ? config.debug : defaultValue,
		info: isDefined(config) ? config.info : defaultValue,
		warn: isDefined(config) ? config.warn : defaultValue,
		error: isDefined(config) ? config.error : defaultValue,
		data: isDefined(config) ? config.data : defaultValue
	}

	return _config
}