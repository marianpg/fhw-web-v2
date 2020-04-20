'use strict'

import { FHWedelWeb } from "./fh-wedel-web"


const fhwWeb = new FHWedelWeb({
	rootPath: '/dev',
	server: {
		port: 8080
	},
	routing: {
		magic: true
	},
	sessions: {
		active: true
	},
	database: {
		sqlite: true
	}
})

fhwWeb.start()