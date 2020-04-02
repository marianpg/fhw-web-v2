'use strict'

import { Config } from "../src/application"
import { FHWedelWeb } from "./fh-wedel-web"

const config: Config = {
	server: {
		port: 8080,
		withSessions: true
	},
}

const fhwWeb = new FHWedelWeb(config, '/dev')

fhwWeb.start()