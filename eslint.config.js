/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { recommendedLibrary } from '@nextcloud/eslint-config'
import { defineConfig } from 'eslint/config'
import storybook from 'eslint-plugin-storybook'

export default defineConfig([
	{
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
			reportUnusedInlineConfigs: 'error',
		},
	},

	...recommendedLibrary,

	storybook.configs['flat/recommended'],

	{
		files: ['**/*.vue'],
		rules: {
			// we are that library - we provide the deprecations...
			'@nextcloud/vue/no-deprecated-props': 'off',
		},
	},

	// disable required poperty documentation for test components
	{
		files: ['tests/**/*.vue'],
		rules: {
			'vue/require-prop-comment': 'off',
		},
	},
])
