import { URL_PATTERN, URL_PATTERN_AUTOLINK } from '../../../../src/components/NcRichText/helpers.js'

import { describe, expect, it } from 'vitest'

describe('URL_PATTERN', () => {
	const urls = [
		'http://example.org',
		'https://example.org/',
		'https://cloud.example.org/index.php/apps/files/',
		'http://localhost/',
		'http://localhost:8080/index.php',
		'http://192.168.1.3/',
	]

	for (const url of urls) {
		it(`URL_PATTERN regex matches URL ${url}`, () => {
			expect(new RegExp(URL_PATTERN).exec(url)).toBeTruthy()
		})
		it(`URL_PATTERN_AUTOLINK regex matches URL ${url}`, () => {
			expect(new RegExp(URL_PATTERN_AUTOLINK).exec(url)).toBeTruthy()
		})
	}
})
