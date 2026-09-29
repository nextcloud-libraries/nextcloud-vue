/**
 * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { linkifyString } from '../../../src/utils/linkify.ts'

describe('utils: linkify', () => {
	it('should linkify an URL', () => {
		expect(linkifyString('hello http://example.com')).toMatchInlineSnapshot('"hello <a href="http://example.com" class="external linkified" target="_blank" rel="nofollow noopener noreferrer">http://example.com</a>"')
	})

	it('should linkify an email', () => {
		expect(linkifyString('send information to mailto:foo@example.com')).toMatchInlineSnapshot('"send information to <a href="mailto:foo@example.com" class="external linkified" target="_blank" rel="nofollow noopener noreferrer">mailto:foo@example.com</a>"')
	})

	it('escape quotation marks', () => {
		expect(linkifyString('https://example.com/"')).toMatchInlineSnapshot('"<a href="https://example.com/" class="external linkified" target="_blank" rel="nofollow noopener noreferrer">https://example.com/</a>&quot;"')
	})

	it('escape other HTML', () => {
		expect(linkifyString('<p>foo</p><br />"')).toMatchInlineSnapshot('"&lt;p&gt;foo&lt;/p&gt;&lt;br /&gt;&quot;"')
	})

	it('should not linkify strings longer than 10000 characters', () => {
		const long = `${'a'.repeat(10_000)} <b> http://example.com`
		expect(linkifyString(long)).toBe(`${'a'.repeat(10_000)} &lt;b&gt; http://example.com`)
	})

	it('should still linkify strings of exactly 10000 characters', () => {
		const url = 'http://example.com'
		const str = `${'a '.repeat((10_000 - url.length) / 2)}${url}`
		expect(str).toHaveLength(10_000)
		expect(linkifyString(str)).toContain('<a href="http://example.com"')
	})

	it('should return quickly for long domain-like input', () => {
		const start = performance.now()
		linkifyString('a.'.repeat(500_000))
		expect(performance.now() - start).toBeLessThan(1000)
	})
})
