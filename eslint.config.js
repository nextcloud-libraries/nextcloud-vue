/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { recommendedLibrary } from '@nextcloud/eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig([
	{
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
			reportUnusedInlineConfigs: 'error',
		},
	},

	...recommendedLibrary,
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
