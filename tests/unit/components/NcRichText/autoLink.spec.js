/**
 * @copyright Copyright (c) 2024 Grigorii K. Shartsev <me@shgk.me>
 *
 * @author Grigorii K. Shartsev <me@shgk.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { jest, describe, it, beforeAll } from '@jest/globals'
import { getRoute } from '../../../../src/components/NcRichText/autolink.js'
import VueRouter from 'vue-router'
import { getBaseUrl, getRootUrl } from '@nextcloud/router'

jest.mock('@nextcloud/router')

describe('autoLink', () => {
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

							[
								'https://external.ltd/nextcloud/index.php/apps/test/foo',
								null,
							], // Different origin
							[
								'https://cloud.ltd/external/index.php/apps/test/foo/',
								null,
							], // Different base
							[
								'https://cloud.ltd/nextcloud/index.php/apps/not-router-base/',
								null,
							], // Different router base
							['https://cloud.ltd/nextcloud/apps/test/baz', null], // No matching route
						])('should get route %s => %s', (link, expectedRoute) => {
							const routerTest = new VueRouter({
								mode: 'history',
								base: `${routerBase}/apps/test`,
								routes: [
									{ path: '/foo', name: 'foo' },
									{
										path: '/bar/:param',
										name: 'bar',
									},
								],
							})
							expect(getRoute(routerTest, link)).toBe(expectedRoute)
						})

						it.each([
							[`${linkBase}/apps/files/`, '/files'],
							[`${linkBase}/apps/files/favorites/1`, '/favorites/1'],
							[
								`${linkBase}/apps/files/files/1?fileid=2#c`,
								'/files/1?fileid=2#c',
							], // With query and hash
							[
								`${linkBase}/apps/files/files/1?dir=server/lib/index.php#c`,
								'/files/1?dir=server%2Flib%2Findex.php#c',
							], // With index.php in query
						])(
							'should get route for Files: %s => %s',
							(link, expectedRoute) => {
								const routerFiles = new VueRouter({
									mode: 'history',
									base: `${routerBase}/apps/files`,
									routes: [
										{
											path: '/',
											name: 'root',
											redirect: '/files',
										},
										{
											path: '/:view/:fileid(\\d+)?',
											name: 'fileslist',
										},
									],
								})

								expect(getRoute(routerFiles, link)).toBe(
									expectedRoute,
								)
							},
						)

						it.each([
							[
								`${linkBase}/apps/spreed?callTo=alice`,
								'/apps/spreed?callTo=alice',
							],
							[
								`${linkBase}/call/abc123ef#message_123`,
								'/call/abc123ef#message_123',
							],
							[`${linkBase}/apps/files`, null],
							[`${linkBase}`, null],
						])(
							'should get route for Talk: %s => %s',
							(link, expectedRoute) => {
								const routerTalk = new VueRouter({
									mode: 'history',
									base: `${routerBase}`,
									routes: [
										{
											path: '/apps/spreed',
											name: 'root',
										},
										{ path: '/call/:id', name: 'call' },
									],
								})
								expect(getRoute(routerTalk, link)).toBe(
									expectedRoute,
								)
							},
						)

						it.each([
							[`${linkBase}/settings/apps`, '/apps'],
							[`${linkBase}/apps/files`, null],
						])(
							'should get route for Settings: %s => %s',
							(link, expectedRoute) => {
								const routerSettings = new VueRouter({
									mode: 'history',
									base: `${routerBase}/settings`,
									routes: [{ path: '/apps', name: 'apps' }],
								})

								expect(getRoute(routerSettings, link)).toBe(
									expectedRoute,
								)
							},
						)
					})
				})
			})
		})

		it('should not get route from relative link with base /nextcloud/index.php/apps/test/foo', () => {
			getBaseUrl.mockReturnValue('https://cloud.ltd/nextcloud')
			getRootUrl.mockReturnValue('/nextcloud')
			const router = new VueRouter({
				mode: 'history',
				base: '/nextcloud/index.php/apps/test',
				routes: [{ path: '/foo', name: 'foo' }],
			})

			expect(getRoute(router, '/nextcloud/index.php/apps/test/foo')).toBe(null)
		})

		// getRoute doesn't have to guarantee Talk Desktop compatibility, but checking just in case
		describe('with Talk Desktop router - no router base and invalid getRootUrl', () => {
			it.each([
				[
					'https://cloud.ltd/nextcloud/index.php/apps/spreed',
					'/apps/spreed',
				],
				[
					'https://cloud.ltd/nextcloud/index.php/apps/spreed?callTo=alice',
					'/apps/spreed?callTo=alice',
				],
				[
					'https://cloud.ltd/nextcloud/index.php/call/abc123ef',
					'/call/abc123ef',
				],
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

				const routerTalkDesktop = new VueRouter({
					// On Talk Desktop, we use hash mode, because it works on file:// protocol
					mode: 'hash',
					// On Talk Desktop we have no base because we open an HTML document as a file
					base: '',
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
