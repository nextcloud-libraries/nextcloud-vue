/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { addons } from '@storybook/manager-api'
import nextcloudTheme from './nextcloudTheme.ts'
 
addons.setConfig({
	theme: nextcloudTheme,
})
