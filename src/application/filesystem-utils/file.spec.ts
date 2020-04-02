'use strict'

import { expect } from 'chai'
import 'mocha'

import { FileUtils } from '.'
import { FakeLogging } from '../logging'

const fileUtils = new FileUtils(new FakeLogging)

describe('listFiles', () => {
	it('recursively', async () => {
		const paths = await fileUtils.listFiles({})
		const pathsRec = await fileUtils.listFiles({ recursively: true })
	
		expect(pathsRec.length > paths.length).to.be.true
	})
})
