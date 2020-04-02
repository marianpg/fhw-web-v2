'use strict'

export type SqlSuccess = boolean
export type SqlData = Record<string, any>[]
export type SqlMetadata = Record<string, any>
export type SqlStatementResult = [SqlSuccess, SqlData?, SqlMetadata?]

export type JsonData = Record<string, any> | Record<string, any>[]

export interface Database {	
	loadJson(filename: string): JsonData | null
	saveJson(filename: string, data: JsonData): void
	executeSql(sql: string): Promise<SqlStatementResult>
}