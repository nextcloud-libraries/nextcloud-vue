/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
	'lowlight', // ESM dependency of rehype-highlight
	'markdown-table', // ESM dependency of remark-gfm
	'mdast-util-*',
	'micromark',
	'p-queue',
	'p-timeout',
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
	moduleFileExtensions: [
		'js',
		'ts',
		'vue',
	],

	testEnvironment: 'jsdom',
	setupFilesAfterEnv: [
		'./tests/setup.js',
	],

	transform: {
		'^.+\\.(j|t)s$': 'babel-jest',
		'^.+\\.vue$': '@vue/vue2-jest',
		'.+\\?raw$': 'jest-raw-loader',
		'.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(' + ignorePatterns.join('|') + '))',
	],

	moduleNameMapper: {
		'\\.(css|scss)$': 'jest-transform-stub',
		'\\?raw$': 'jest-raw-loader',
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
