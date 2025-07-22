/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, describe, it, vi, beforeAll } from 'vitest'
import { getRoute, parseUrl } from '../../../../src/components/NcRichText/autolink.ts'
import { createRouter, createMemoryHistory, createWebHashHistory } from 'vue-router'
import { getBaseUrl, getRootUrl } from '@nextcloud/router'

vi.mock('@nextcloud/router')

describe('autoLink', () => {
	describe('parseUrl', () => {
		describe.each([
			['with', 'http://'],
			['with', 'https://'],
			['without protocol', ''],
		])('%s %s', (_, protocol) => {
			describe.each([
				[' and domain', 'www.nextcloud.com'],
				[' and domain', 'localhost'],
				[' and domain', '128.0.0.1'],
			])('%s %s', (_, domain) => {
				describe.each([
					[' without port', ''],
					[' and port', ':80'],
				])('%s %s', (_, port) => {
					describe.each([
						[' without path', '/'],
						[' and path', '/path/to/file.html'],
						[' and path', '/#/Components/NcRichText'],
					])('%s %s', (_, path) => {
						it.each([
							[' without parameters', ''],
							[' and parameters', '?query=string&another=1#some_hash'],
						])('%s %s', (_, parameters) => {
							const testUrl = `${protocol}${domain}${port}${path}${parameters}`
							const output = parseUrl(testUrl)
							if (output.length > 1) {
								console.log(output[1].props.href)
								expect(output[1].component.name).toBe('NcLink')
								expect(output[1].props.href).toBe(testUrl)
							} else {
								// Not parsed
								console.log(output[0])
								expect(output[0]).toBe(testUrl)
							}
						})
					})
				})
			})
		})

		it.each([
			['not a link', 'not/a/link'],
			['not a link', 'not-a-link'],
			['not a link', 'not.a.link'],
		])('%s %s', (_, payload) => {
			const output = parseUrl(payload)
			// Not parsed
			console.log(output)
			expect(output[0]).toBe(payload)
		})
	})

	describe('getRoute', () => {
		describe.each([
			['an absolute link', 'https://cloud.ltd'],
			['a relative link', ''],
		])('for %s', (_, origin) => {
			describe.each([
				['with base /nextcloud', '/nextcloud'],
				['on server root', ''],
			])('%s', (_, root) => {
				describe.each([
					['with', '/index.php'],
					['without', ''],
				])('%s /index.php in link', (_, indexPhp) => {
					const linkBase = origin ? origin + root + indexPhp : ''
					beforeAll(() => {
						getBaseUrl.mockReturnValue(`https://cloud.ltd${root}`)
						getRootUrl.mockReturnValue(root)
					})

					describe.each([
						['with', '/index.php'],
						['without', ''],
					])('%s /index.php in router base', (_, indexPhpInRouterBase) => {
						const routerBase = `${root}${indexPhpInRouterBase}`

						it.each([
							[`${linkBase}/apps/test/foo`, '/foo'],
							[`${linkBase}/apps/test/foo/`, '/foo/'],
							[`${linkBase}/apps/test/bar/1`, '/bar/1'],

							['https://external.ltd/nextcloud/index.php/apps/test/foo', null], // Different origin
							['https://cloud.ltd/external/index.php/apps/test/foo/', null], // Different base
							['https://cloud.ltd/nextcloud/index.php/apps/not-router-base/', null], // Different router base
							['https://cloud.ltd/nextcloud/apps/test/baz', null], // No matching route
						])('should get route %s => %s', (link, expectedRoute) => {
							const routerTest = createRouter({
								history: createMemoryHistory(`${routerBase}/apps/test`),
								routes: [
									{ path: '/foo', name: 'foo' },
									{ path: '/bar/:param', name: 'bar' },
								],
							})
							expect(getRoute(routerTest, link)).toBe(expectedRoute)
						})

						it.each([
							[`${linkBase}/apps/files/`, '/'],
							[`${linkBase}/apps/files/favorites/1`, '/favorites/1'],
							[`${linkBase}/apps/files/files/1?fileid=2#c`, '/files/1?fileid=2#c'], // With query and hash
							[`${linkBase}/apps/files/files/1?dir=server/lib/index.php#c`, '/files/1?dir=server/lib/index.php#c'], // With index.php in query

						])('should get route for Files: %s => %s', (link, expectedRoute) => {
							const routerFiles = createRouter({
								history: createMemoryHistory(`${routerBase}/apps/files`),
								routes: [
									{ path: '/', name: 'root', redirect: '/files' },
									{ path: '/:view/:fileid(\\d+)?', name: 'fileslist' },
								],
							})

							expect(getRoute(routerFiles, link)).toBe(expectedRoute)
						})

						it.each([
							[`${linkBase}/apps/spreed?callTo=alice`, '/apps/spreed?callTo=alice'],
							[`${linkBase}/call/abc123ef#message_123`, '/call/abc123ef#message_123'],
							[`${linkBase}/apps/files`, null],
							[`${linkBase}`, null],
						])('should get route for Talk: %s => %s', (link, expectedRoute) => {
							const routerTalk = createRouter({
								history: createMemoryHistory(`${routerBase}`),
								routes: [
									{ path: '/apps/spreed', name: 'root' },
									{ path: '/call/:id', name: 'call' },
								],
							})
							expect(getRoute(routerTalk, link)).toBe(expectedRoute)
						})

						it.each([
							[`${linkBase}/settings/apps`, '/apps'],
							[`${linkBase}/apps/files`, null],
						])('should get route for Settings: %s => %s', (link, expectedRoute) => {
							const routerSettings = createRouter({
								history: createMemoryHistory(`${routerBase}/settings`),
								routes: [
									{ path: '/apps', name: 'apps' },
								],
							})

							expect(getRoute(routerSettings, link)).toBe(expectedRoute)
						})
					})
				})
			})
		})

		it('should not get route from relative link with base in the link /nextcloud/index.php/apps/test/foo', () => {
			getBaseUrl.mockReturnValue('https://cloud.ltd/nextcloud')
			getRootUrl.mockReturnValue('/nextcloud')
			const router = createRouter({
				mode: 'history',
				history: createMemoryHistory('/nextcloud/index.php/apps/test'),
				routes: [
					{ path: '/foo', name: 'foo' },
				],
			})

			expect(getRoute(router, '/nextcloud/index.php/apps/test/foo')).toBe(null)
		})

		it('should not get route from relative link without a leading slash', async () => {
			getBaseUrl.mockReturnValue('https://cloud.ltd/')
			getRootUrl.mockReturnValue('')
			const routerTalk = createRouter({
				history: createMemoryHistory(''),
				routes: [
					{ path: '/apps/spreed', name: 'root' },
					{ path: '/call/:id', name: 'call' },
				],
			})
			routerTalk.push('/call/12345678')

			expect(getRoute(routerTalk, 'abcdefgh')).toBe(null)
			expect(getRoute(routerTalk, 'call/abcdefgh')).toBe(null)
		})

		describe('Non-HTTP links', () => {
			const routerTalk = createRouter({
				history: createMemoryHistory(''),
				routes: [
					{ path: '/apps/spreed', name: 'root' },
					{ path: '/call/:id', name: 'call' },
				],
			})
			getBaseUrl.mockReturnValue('https://cloud.ltd/')
			getRootUrl.mockReturnValue('')
			routerTalk.push('/call/12345678')

			it('should not handle mailto: link as a relative link', () => {
				expect(getRoute(routerTalk, 'mailto:email@nextcloud.ltd')).toBe(null)
			})

			it('should not handle nc: link as a relative link', () => {
				expect(getRoute(routerTalk, 'nc://login')).toBe(null)
			})

			it('should not handle a1.b-c+d: link as a relative link', () => {
				expect(getRoute(routerTalk, 'a1.b-c+d://action')).toBe(null)
			})
		})

		// getRoute doesn't have to guarantee Talk Desktop compatibility, but checking just in case
		describe('with Talk Desktop router - no router base and invalid getRootUrl', () => {
			it.each([
				['https://cloud.ltd/nextcloud/index.php/apps/spreed', '/apps/spreed'],
				['https://cloud.ltd/nextcloud/index.php/apps/spreed?callTo=alice', '/apps/spreed?callTo=alice'],
				['https://cloud.ltd/nextcloud/index.php/call/abc123ef', '/call/abc123ef'],
				['https://cloud.ltd/nextcloud/index.php/apps/files', null],
				['https://cloud.ltd/nextcloud/', null],
				['/apps/spreed', '/apps/spreed'],
				['/apps/spreed?callTo=alice', '/apps/spreed?callTo=alice'],
				['/call/abc123ef', '/call/abc123ef'],
				['/apps/files', null],
				['/', null],
			])('should get route %s => %s', (link, expectedRoute) => {
				getBaseUrl.mockReturnValue('https://cloud.ltd/nextcloud')
				getRootUrl.mockReturnValue('/nextcloud')

				const routerTalkDesktop = createRouter({
					// On Talk Desktop we use hash mode, because it works on file:// protocol
					// And we have no base because we open an HTML document as a file
					history: createWebHashHistory(''),
					routes: [
						{ path: '/apps/spreed', name: 'root' },
						{ path: '/call/:id', name: 'call' },
					],
				})

				expect(getRoute(routerTalkDesktop, link)).toBe(expectedRoute)
			})
		})
	})
})
