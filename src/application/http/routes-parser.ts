'use strict'

import { Route } from '../../public/route'

import { isDefined } from '../helper'
import { Config } from '.'
import { Logging } from '../logging'
import { FileUtils } from '../filesystem-utils'

import { parseRoutes, MagicRoutes } from '../route'


export class RoutesParser {

	private routesDefinitionFilename: {
		ts: string
		json: string
	}

	constructor(
		private config: Config,
		private logging: Logging,
		private fileUtils: FileUtils
	) {
		this.routesDefinitionFilename = {
			ts: this.fileUtils.fullPath('routes.ts'),
			json: this.fileUtils.fullPath('routes.json')
		}
	}

	async parseRoutesDefinitionFile(): Promise<Route[]> {
		if (await this.fileUtils.exist(this.routesDefinitionFilename.ts)) {
			const routesFile = require(this.routesDefinitionFilename.ts)
			if (!isDefined(routesFile.Routes)) {
				throw new Error('Die "routes.ts" Datei muss eine Konstante "Routes" vom Typen "Route[]" exportieren (export const Routes: Routes[] = [])')
			}
			const json = routesFile.Routes as Record<string, any>[]
			return parseRoutes(json)
		}
		else if (await this.fileUtils.exist(this.routesDefinitionFilename.json)) {
			const json = await this.fileUtils
				.readJson<Record<string, any>[]>(
					this.routesDefinitionFilename.json)
			return parseRoutes(json)
		}

		if (this.config.magicRoutes) {
			return MagicRoutes
		} else {
			throw new Error('Es wurde keine Routen-Definitionsdatei gefunden; die ist erforderlich, da die "MagicRoutes"-Konfiguration deaktiviert ist.')
		}
	}
}