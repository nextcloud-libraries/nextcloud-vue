/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const pluginTransformTypeScript = require('@babel/plugin-transform-typescript')
const babelConfig = require('@nextcloud/babel-config')

babelConfig.presets.push('@babel/preset-typescript')
babelConfig.overrides = [
	{
		test: /\.vue$/,
		plugins: [
			pluginTransformTypeScript,
		],
	},
]

module.exports = babelConfig
