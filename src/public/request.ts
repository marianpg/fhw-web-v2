'use strict'


export type RequestQuery = Record<string, any>
export type RequestBody = Record<string, any>
export type RequestParams = { [key: string]: string } // TODO: is value always string-typed?
export type RequestHeaders = Record<string, string>

export type RequestMethod = 
	'get' |
	'post' |
	'patch' |
	'put' |
	'delete'

export const DEFAULT_METHOD: RequestMethod = 'get'

export interface RequestData {
	query: RequestQuery
	body: RequestBody
	params: RequestParams
	method: RequestMethod
	path: string
	originalUrl: string
	ip: string
	headers: RequestHeaders
}