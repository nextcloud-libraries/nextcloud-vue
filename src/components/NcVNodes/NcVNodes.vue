<!--
 - @copyright Copyright (c) 2023 Raimund Schlüßler <raimund.schluessler@mailbox.org>
 -
 - @author Raimund Schlüßler <raimund.schluessler@mailbox.org>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<script>
export default {
	name: 'NcVNodes',
	props: {
		/**
		 * The vnodes to render
		 */
		vnodes: {
			type: [Array, Object],
			default: null,
		},
	},
	/**
	 * The render function to display the component
	 *
	 * @param {Function} h The function to create VNodes
	 * @return {object} The created VNode
	 */
	render(h) {
		return this.vnodes || this.$slots?.default || this.$scopedSlots?.default?.()
	},
}
</script>
