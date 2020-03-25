/**
 * @copyright Copyright (c) 2019 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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

export default {
	data() {
		return {
			isFullscreen: this._isFullscreen(),
		}
	},
	beforeMount() {
		window.addEventListener('resize', this._onResize)
	},
	beforeDestroy() {
		window.removeEventListener('resize', this._onResize)
	},
	methods: {
		_onResize() {
			// Update fullscreen mode
			this.isFullscreen = this._isFullscreen()
		},
		_isFullscreen() {
			// if the window height is equal to the screen height,
			// we're in full screen mode
			return window.outerHeight === screen.height
		},
	},
}
