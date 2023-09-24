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
	'@ckpack/vue-color',
	'ansi-regex',
	'bail',
	'char-regex',
	'character-*',
	'comma-separated-tokens',
	'decode-named-character-reference',
	'devlop', // ESM dependency of unified
	'escape-string-regexp',
	'hast-*',
	'is-*',
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
]

module.exports = {
	moduleFileExtensions: [
		'js',
		'ts',
		'vue',
	],

	testEnvironment: 'jsdom',
    testEnvironmentOptions: {
		customExportConditions: ["node", "node-addons"],
	 },
	setupFilesAfterEnv: [
		'./tests/setup.js',
	],

	transform: {
		'^.+\\.(j|t)s$': 'babel-jest',
		'^.+\\.vue$': '@vue/vue3-jest',
		'.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(' + ignorePatterns.join('|') + '))',
	],
	// Temporarily exclude not yet migrated vue2 components
	testPathIgnorePatterns: [
		"/node_modules/",
		"<rootDir>/tests/unit/components/NcActions",
		"<rootDir>/tests/unit/components/NcAppNavigation",
		"<rootDir>/tests/unit/components/NcAppSidebar",
		"<rootDir>/tests/unit/components/NcModal",
		"<rootDir>/tests/unit/components/NcRichContenteditable",
		"<rootDir>/tests/unit/components/NcRichText",
		"<rootDir>/tests/unit/mixins/",
	],

	moduleNameMapper: {
		'\\.(css|scss)$': 'jest-transform-stub',
	},

	snapshotSerializers: [
		'<rootDir>/node_modules/jest-serializer-vue',
	],

	coverageDirectory: './coverage/',
	collectCoverage: false,
	collectCoverageFrom: [
		'<rootDir>/src/**/*.{js,ts,vue}',
		'!**/node_modules/**',
	],
	coverageReporters: [
		'json',
		'text',
		'html',
		'lcov',
		'clover',
	],
}
