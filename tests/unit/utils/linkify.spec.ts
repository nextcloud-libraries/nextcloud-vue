/**
 * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { linkifyString } from '../../../src/utils/linkify'

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
})
