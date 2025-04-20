/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { create } from '@storybook/theming/create';
// import logo from './logo.png?url'

export default create({
	base: 'light',

	brandTitle: 'Nextcloud Vue components',
	brandUrl: 'https://github.com/nextcloud-libraries/nextcloud-vue',
	// brandImage: logo,
	brandTarget: '_self',
	colorPrimary: '#00679e',
});