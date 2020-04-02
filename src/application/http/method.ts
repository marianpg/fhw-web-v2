'use strict'

import { RequestMethod } from '../../public/request'

import { isDefined } from '../helper'


export { RequestMethod as Method, DEFAULT_METHOD } from '../../public/request'

export const AllMethods: RequestMethod[] = [
	'get', 'post', 'patch', 'put', 'delete'
]

export const parseMethod = (method: string): RequestMethod => {
	const m = AllMethods.find(aMethod => aMethod === method.toLowerCase())

	if (!isDefined(m)) {
		throw new Error('Ciritcal Error - could not extrat HTTP Method from request.')
	}
	
	return m
} 