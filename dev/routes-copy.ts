'use strict'

import { Route, PageRoute } from "../src/public/route"


export const Routes: Route[] = [
	{
		url: '/public/*',
		static: 'assets/*'
	},
	{
		url: '*',
		page: '*'
	}
]
/*
export const Routes: Route[] = [
	{
		url: '/public/*',
		static: 'assets/*'
	},
	{
		url: '/public-a/sub/*',
		static: 'assets/*'
	},
	{
		url: '/public-b/sub/*',
		static: 'assets/sub/sub/*'
	},
	{
		url: '/',
		page: 'index'
	},
	{
		url: '/tine-m',
		page: 'tine-m'
	},
	{
		url: '/karl-e',
		page: 'karl-e'
	},
	{
		url: '/validator',
		page: 'validator'
	},
	{
		url: '/controller/text',
		controller: { file: 'all-response-types', function: 'text' }
	},
	{
		url: '/controller/json',
		controller: { file: 'all-response-types', function: 'json' }
	},
	{
		url: '/controller/redirect',
		controller: { file: 'all-response-types', function: 'redirect' }
	},
	{
		url: '/controller/page',
		controller: { file: 'all-response-types', function: 'page' }
	},
	{
		url: '/controller/fragment',
		controller: { file: 'all-response-types', function: 'fragment' }
	},
	{
		url: '/controller/promise',
		controller: { file: 'all-response-types', function: 'promise' }
	},
	{
		url: '/controller/promise-chained',
		controller: { file: 'all-response-types', function: 'promise-chained' }
	}, {
		url: '/params/:name',
		page: '/params',
		method: ['get', 'post']
	}
]
*/