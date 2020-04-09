'use strict'

// in future, when the FHWedelWeb module is published the import statement is going to change
// const FHWedelWeb = require("fhw-web")
//import { FHWedelWeb } from "../dev/fh-wedel-web"
const FHWedelWeb = require("../dev/fh-wedel-web").FHWedelWeb

const config = {
	rootPath: '/yannick',
	server: {
		port: 8080
	},
	routing: {
		magic: true
	},
	sessions: {
		active: false
	}
}

const fhwWeb = new FHWedelWeb(config)

fhwWeb.start()