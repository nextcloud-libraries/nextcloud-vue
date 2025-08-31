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

	// Temporarily disable rules during migration
	{
		name: '@nextcloud/vue/disabled-during-migration',
		files: ['**/*.{js,ts,vue,mjs,mts}'],
		rules: {
			// Auto-fixable
			'jsdoc/check-tag-names': 'off',
			'jsdoc/no-types': 'off',
			'jsdoc/require-jsdoc': 'off',
			'jsdoc/tag-lines': 'off',
			'vue/first-attribute-linebreak': 'off',
			'vue/no-useless-v-bind': 'off',

			// Non auto-fixable
			'jsdoc/require-param-description': 'off',
			'jsdoc/require-param-type': 'off',
			'no-console': 'off',
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'no-use-before-define': 'off',
			'no-useless-concat': 'off',
			'no-useless-escape': 'off',
			'@stylistic/function-paren-newline': 'off',
			'@stylistic/max-statements-per-line': 'off',
			'@typescript-eslint/no-this-alias': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-use-before-define': 'off',
			'vue/no-boolean-default': 'off',
			'vue/no-required-prop-with-default': 'off',
			'vue/no-unused-properties': 'off',
			'vue/no-unused-refs': 'off',
			'vue/prefer-prop-type-boolean-first': 'off',
			'vue/require-default-prop': 'off',
			'vue/require-prop-comment': 'off',
		},
	},
])
