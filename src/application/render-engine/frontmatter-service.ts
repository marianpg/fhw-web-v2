'use strict'

import { RequestData } from '../../public/request'
import { DefaultMethod } from '../../public/route'
import { Frontmatter, PageData } from '../../public/frontmatter'
import { GlobalData } from '../../public/global'
import { SessionData } from '../../public/session'

import { isDefined } from '../helper'



// TODO: json or yaml frontmatter
// TODO: allow sql statements and fetch and execute them


interface MaybeFrontmatter {
	global?: GlobalData
	page?: PageData
	request?: RequestData
	session?: SessionData
}

export class FrontmatterService {

	static CreateEmpty(): Frontmatter {
		return {
			global: {},
			page: {},
			request: {
				query: {}, body: {}, params: {},
				method: DefaultMethod, path: '',
				originalUrl: '', ip: '', headers: {} },
			session: { id: '' }
		}
	}

	static Build(fm: MaybeFrontmatter): Frontmatter {
		const empty = FrontmatterService.CreateEmpty()
		const request: RequestData = isDefined(fm.request)
			? {
				query: fm.request.query || empty.request.query,
				body: fm.request.body || empty.request.body,
				params: fm.request.params || empty.request.params,
				method: fm.request.method || empty.request.method,
				path: fm.request.path || empty.request.path,
				originalUrl: fm.request.originalUrl || empty.request.originalUrl,
				ip: fm.request.ip || empty.request.ip,
				headers: fm.request.headers || empty.request.headers
			}
			: empty.request

		return {
			global: fm.global || empty.global,
			page: fm.page || empty.page,
			request: request,
			session: fm.session || empty.session
		}
	}

	static Parse(obj?: Record<string, any>): Frontmatter {
		if (!isDefined(obj)) {
			return FrontmatterService.CreateEmpty()
		} else {
			return {
				global: obj.global || {},
				page: obj.page || {},
				request: obj.request || {},
				session: obj.session || {}
			}
		}
	}

	static Merge(parent: Frontmatter, page: PageData): Frontmatter {
		return {
			global: parent.global,
			page: { ...parent.page, ...page },
			request: { ...parent.request },
			session: { ...parent.session },
		}
	}
}