/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { recommendedVue2Library } from '@nextcloud/eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig([
	{
		name: '@nextcloud/vue/linterOptions',
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
			reportUnusedInlineConfigs: 'error',
		},
	},

	...recommendedVue2Library,

	{
		name: '@nextcloud/vue/override',
		files: ['**/*.vue'],
		rules: {
			// we are that library - we provide the deprecations...
			'@nextcloud/vue/no-deprecated-props': 'off',
		},
	},

	// Disable required property documentation for test components
	{
		name: '@nextcloud/vue/test-override',
		files: ['tests/**/*.vue', 'cypress/**/*.vue'],
		rules: {
			'vue/require-prop-comment': 'off',
			'vue/no-boolean-default': 'off',
		},
	},

	{
		name: '@nextcloud/vue/build-time-globals',
		files: ['**/*.{js,ts,vue,mjs,mts}'],
		languageOptions: {
			globals: {
				SCOPE_VERSION: 'readonly',
				NEXTCLOUD_VERSION: 'readonly',
			},
		},
	},

	{
		name: '@nextcloud/vue/tests-jest',
		files: ['tests/**/*.{js,ts}', '**/*.spec.{js,ts}', '**/*.test.{js,ts}'],
		languageOptions: {
			globals: {
				describe: 'readonly',
				it: 'readonly',
				test: 'readonly',
				expect: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				beforeAll: 'readonly',
				afterAll: 'readonly',
				jest: 'readonly',
			},
		},
	},

	{
		name: '@nextcloud/vue/tests-cypres',
		files: ['cypress/**/*.{js,ts}'],
		languageOptions: {
			globals: {
				describe: 'readonly',
				it: 'readonly',
				expect: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				cy: 'readonly',
				Cypress: 'readonly',
			},
		},
	},

	// Temporarily disable rules during migration
	{
		name: '@nextcloud/vue/disabled-during-migration',
		files: ['**/*.{js,ts,vue,mjs,mts}'],
		rules: {
			'vue/no-unused-properties': 'off',
			'vue/no-unused-refs': 'off',
			'vue/require-prop-comment': 'off',
		},
	},
])
