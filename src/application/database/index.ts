'use strict'

import { Database as IDatabase, SqlStatementResult, JsonData } from '../../public/database'

import { isDefined } from '../helper'

import { Config } from './config'
import { Logging } from '../logging'
import { FileUtils } from '../filesystem-utils'
import { GlobalData } from '../../public/global'


export { Config, parseConfig } from './config'

// import sequelize

// TODO: json and sqlite databases are possible
// read from config which to choose and to deliver
// ==> need for generic functions to open/save json and to run sql statements

type Filename = string
type Json = Record<string, any>
type JsonDataFiles = Record<Filename, Json>

type LoadJsonFunction = (filename: string) => JsonData
type SavejsonFunction = (filename: string, data: JsonData) => void
type ExecuteSqlFunction = (sql: string) => Promise<SqlStatementResult>

class Database implements IDatabase {
	constructor(
		public loadJson: LoadJsonFunction,
		public saveJson: SavejsonFunction,
		public executeSql: ExecuteSqlFunction
	) { }
}


export class DatabaseService {
	private database: IDatabase
	private jsonDataFiles: JsonDataFiles
	private globalData: GlobalData

	constructor(
		private config: Config,
		private logging: Logging,
		private fileUtils: FileUtils
	) {
		this.logging = this.logging.modify('database')
	}

	async build(): Promise<DatabaseService> {
		this.load()

		return this
	}

	loadJson(filename: string): JsonData | null {
		return isDefined(this.jsonDataFiles[filename])
			? JSON.parse(JSON.stringify(this.jsonDataFiles[filename]))
			: null
	}

	async saveJson(filename: string, data: JsonData): Promise<void> {
		this.jsonDataFiles[filename] = data
	}

	// TODO: Unhandled Promise Rejection
	private async loadJsonData(): Promise<void> {
		const result: JsonDataFiles = {}

		const files = await this.fileUtils.listFiles({
			directory: 'data', recursively: true
		})

		await Promise.all(
			files.map(async (filename) => {
				result[filename] = await this.fileUtils.readJson(filename)
			})
		)

		this.jsonDataFiles = result
	}

	private async _executeSql(sql: string): Promise<SqlStatementResult> {
		return [ null, null, null ]
	}

	async executeSql(sql: string): Promise<SqlStatementResult> {
		if (!this.config.useSql) {
			this.logging.info('Attempted execution of a SQL Statement, but "useSql" option in application configuration is deactivated. Statement has not been executed.')
			return [ false, null, null ]
		} else {
			return this._executeSql(sql)
		}
	}
	private async loadSqlData(): Promise<void> {
		//FIXME
	}

	private async loadGlobalData(): Promise<void> {
		this.globalData = await this.fileUtils.readJson<Record<string, any>>('global')
	}

	async load(): Promise<void> {
		await this.loadJsonData()
		await this.loadSqlData()
		await this.loadGlobalData()

		this.database = new Database(this.loadJson, this.saveJson, this.executeSql)
	}

	async save(): Promise<void> {
		await Promise.all(
			Object.keys(this.jsonDataFiles).map(async (filename) => {
				await this.fileUtils.writeJson(this.jsonDataFiles[filename], filename, 'data')
			})
		)
	}

	async getDatabase(): Promise<IDatabase> {
		if (this.config.reloadOnEveryRequest) {
			await this.load()
		}
		return this.database
	}

	async getGlobalData(): Promise<GlobalData> {
		if (this.config.reloadOnEveryRequest) {
			await this.loadGlobalData()
		}

		return this.globalData
	}
}