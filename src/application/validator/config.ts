'use strict'

import { isDefined } from '../helper'


export enum ValidationType {
	html = 'html',
	css = 'css'
}

export interface Config {
	html?: boolean,
	css?: boolean
}

export const parseConfig = (config?: Config): Config => {
	return {
		html: isDefined(config) && isDefined(config.html) ? config.html : true,
		css: isDefined(config) && isDefined(config.css) ? config.css : true
	}
}

