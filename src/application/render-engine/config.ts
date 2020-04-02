'use strict'

import { isDefined } from '../helper'

export interface Config {
	validExtensions?: string[],
	reloadRendererOnEveryRequest?: boolean
}

export const parseConfig = (config?: Config): Config => {
	const validExtensions = isDefined(config) && isDefined(config.validExtensions)
		? config.validExtensions : ['html', 'hbs']

	const reloadRendererOnEveryRequest = isDefined(config) && isDefined(config.reloadRendererOnEveryRequest)
		? config.reloadRendererOnEveryRequest : true

	return {
		validExtensions,
		reloadRendererOnEveryRequest
	}
}