import { expect, describe, it, jest } from '@jest/globals'
import { getRoute } from '../../../../src/components/NcRichText/autolink.js'
import VueRouter from 'vue-router'
import { getBaseUrl } from '@nextcloud/router'

jest.mock('@nextcloud/router')

describe('autoLink', () => {
	describe('getRoute', () => {
		const testCases = [
			// ['http://cloud.ltd/nextcloud/index.php/apps/test', '/'],
			// ['http://cloud.ltd/nextcloud/index.php/apps/test/', '/'],
			['http://cloud.ltd/nextcloud/index.php/apps/test/foo', '/foo'],
			['http://cloud.ltd/nextcloud/index.php/apps/test/foo/', '/foo/'],
			['http://cloud.ltd/nextcloud/index.php/apps/test/bar/1', '/bar/1'],
			['http://cloud.ltd/nextcloud/index.php/apps/test/bar/1?fileid=2#c', '/bar/1?fileid=2#c'],
			['http://cloud.ltd/nextcloud/index.php/apps/test/bar/1?dir=server/lib/index.php#c', '/bar/1?dir=server/lib/index.php#c'],

			// ['http://cloud.ltd/nextcloud/apps/test', '/'],
			// ['http://cloud.ltd/nextcloud/apps/test/', '/'],
			['http://cloud.ltd/nextcloud/apps/test/foo', '/foo'],
			['http://cloud.ltd/nextcloud/apps/test/bar/1', '/bar/1'],
			['http://cloud.ltd/nextcloud/apps/test/bar/1?fileid=2#c', '/bar/1?fileid=2#c'],
			['http://cloud.ltd/nextcloud/apps/test/bar/1?dir=server/lib/index.php#c', '/bar/1?dir=server/lib/index.php#c'],

			['http://external.ltd/nextcloud/index.php/apps/test/foo', null],
			['http://cloud.ltd/external/index.php/apps/test/foo/', null],
			['http://cloud.ltd/nextcloud/index.php/apps/not-router-base/', null],

			// This is not a route in the router, but it is still covered by the router
			// ['http://cloud.ltd/nextcloud/apps/test/baz', '/baz'],
		]

		beforeAll(() => {
			getBaseUrl.mockReturnValue('http://cloud.ltd/nextcloud')
		})

		describe('without index.php in router base', () => {
			const routerWithoutIndexPhp = new VueRouter({
				mode: 'history',
				base: '/nextcloud/apps/test',
				routes: [
					{ path: '/foo', name: 'foo' },
					{ path: '/bar/:param', name: 'bar' },
				],
			})

			it.each(testCases)('should get route %s => %s', (link, expectedRoute) => {
				expect(getRoute(routerWithoutIndexPhp, link)).toBe(expectedRoute)
			})
		})

		describe('with index.php in router base', () => {
			const routerWithIndexPhp = new VueRouter({
				mode: 'history',
				base: '/nextcloud/index.php/apps/test',
				routes: [
					{ path: '/foo', name: 'foo' },
					{ path: '/bar/:param', name: 'bar' },
				],
			})

			it.each(testCases)('should get route %s => %s', (link, expectedRoute) => {
				expect(getRoute(routerWithIndexPhp, link)).toBe(expectedRoute)
			})
		})

		describe('with root / route in router', () => {
			const routerWithRoot = new VueRouter({
				mode: 'history',
				base: '/nextcloud/apps/files',
				routes: [
					{ path: '/', name: 'root' },
					{ path: '/:view/:fileid(\\d+)?', name: 'fileslist' },
				],
			})

			it.each([
				['http://cloud.ltd/nextcloud/apps/files/', '/'],
				['http://cloud.ltd/nextcloud/apps/files/favorites/1', '/favorites/1'],
			])('should get route %s => %s', (link, expectedRoute) => {
				expect(getRoute(routerWithRoot, link)).toBe(expectedRoute)
			})
		})

		describe('with settings router', () => {
			const routerSettings = new VueRouter({
				mode: 'history',
				base: '/nextcloud/settings',
				routes: [
					{ path: '/apps', name: 'apps' },
				],
			})

			it.each([
				['http://cloud.ltd/nextcloud/settings/apps', '/apps'],
				['http://cloud.ltd/nextcloud/apps/files', null],
			])('should get route %s => %s', (link, expectedRoute) => {
				expect(getRoute(routerSettings, link)).toBe(expectedRoute)
			})
		})
	})
})
