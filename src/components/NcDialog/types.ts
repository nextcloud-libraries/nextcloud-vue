/**
 * @copyright Copyright (c) 2023 Ferdinand Thiessen
 *
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
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
import type { AsyncComponent, Component } from 'vue'

/**
 * Properties of the dialog button
 *
 * Exported to be used by NcDialog for the `buttons` prop
 */
export interface IDialogButton {
	/** Text of the button */
	label: string,
	/** Icon component used for the button */
	icon?: Component | AsyncComponent,
	/** Callback which is called on click */
	callback: () => void,
	/**
	 * Button type
	 * @see NcButton
	 */
	type?: 'primary' | 'secondary' | 'error' | 'warning' | 'success'
}
