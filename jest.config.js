/**
 * @copyright Copyright (c) 2020 Marco Ambrosini <marcoambrosini@pm.me>
 *
 * @author Marco Ambrosini <marcoambrosini@pm.me>
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

const ignorePatterns = [
	'ansi-regex',
	'bail',
	'ccount', // ESM dependency of remark-gfm
	'char-regex',
	'comma-separated-tokens',
	'decode-named-character-reference',
	'devlop', // ESM dependency of unified
	'escape-string-regexp',
	'hast-*',
	'is-*',
	'longest-streak', // ESM dependency of remark-gfm
	'markdown-table', // ESM dependency of remark-gfm
	'mdast-util-*',
	'micromark',
	'property-information',
	'rehype-*',
	'remark-*',
	'space-separated-tokens',
	'string-length',
	'strip-ansi',
	'tributejs',
	'trim-lines',
	'trough',
	'unified',
	'unist*',
	'vfile',
	'vue-material-design-icons',
	'web-namespaces',
	'zwitch', // ESM dependency of remark-gfm
]

module.exports = {
	moduleFileExtensions: ['js', 'ts', 'vue'],

	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['./tests/setup.js'],

	transform: {
		'^.+\\.(j|t)s$': 'babel-jest',
		'^.+\\.vue$': '@vue/vue2-jest',
		'.+\\?raw$': 'jest-raw-loader',
		'.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
			'jest-transform-stub',
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(' + ignorePatterns.join('|') + '))',
	],

	moduleNameMapper: {
		'\\.(css|scss)$': 'jest-transform-stub',
		'\\?raw$': 'jest-raw-loader',
	},

	snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],

	coverageDirectory: './coverage/',
	collectCoverage: false,
	collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts,vue}', '!**/node_modules/**'],
	coverageReporters: ['json', 'text', 'html', 'lcov', 'clover'],
}
