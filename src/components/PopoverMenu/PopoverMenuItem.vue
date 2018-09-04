<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
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

<template>
	<li>
		<!-- If item.href is set, a link will be directly used -->
		<a v-if="item.href" :href="(item.href) ? item.href : '#' "
			:target="(item.target) ? item.target : '' "
			rel="noreferrer noopener" @click="action">
			<span v-if="!iconIsUrl" :class="item.icon" />
			<img v-else :src="item.icon">
			<span v-if="item.text">{{ item.text }}</span>
			<p v-else-if="item.longtext">{{ item.longtext }}</p>
		</a>

		<!-- If item.input is set instead, an put will be used -->
		<span v-else-if="item.input" class="menuitem">
			<!-- does not show if input is checkbox -->
			<span v-if="item.input !== 'checkbox'" :class="item.icon" />

			<!-- only shows if input is text -->
			<form v-if="item.input === 'text'"
				:class="item.input" @submit.prevent="item.action">
				<input :type="item.input" :value="item.value" :placeholder="item.text"
					required>
				<input type="submit" value="" class="icon-confirm">
			</form>

			<!-- checkbox -->
			<template v-else>
				<input :id="key" v-model="item.model" :type="item.input"
					:class="item.input" @change="item.action">
				<label :for="key" @click.stop.prevent="item.action">{{ item.text }}</label>
			</template>
		</span>

		<!-- If item.action is set instead, a button will be used -->
		<button v-else-if="item.action" @click.stop.prevent="item.action">
			<span :class="item.icon" />
			<span v-if="item.text">{{ item.text }}</span>
			<p v-else-if="item.longtext">{{ item.longtext }}</p>
		</button>

		<!-- If item.longtext is set AND the item does not have an action -->
		<span v-else class="menuitem">
			<span :class="item.icon" />
			<span v-if="item.text">{{ item.text }}</span>
			<p v-else-if="item.longtext">{{ item.longtext }}</p>
		</span>
	</li>
</template>

<script>
export default {
	name: 'PopoverMenuItem',
	props: {
		item: {
			type: Object,
			required: true,
			default: () => {
				return {
					key: 'nextcloud-link',
					href: 'https://nextcloud.com',
					icon: 'icon-links',
					text: 'Nextcloud'
				}
			},
			// check the input types
			// TODO: add more validation of types
			validator: item => {
				// TODO: support radio
				if (item.input) {
					return ['text', 'checkbox'].indexOf(item.input) !== -1
				}
				return true
			}
		}
	},
	computed: {
		// random key for inputs binding if not provided
		key() {
			return this.item.key
				? this.item.key
				: Math.round(Math.random() * 16 * 1000000).toString(16)
		},
		iconIsUrl() {
			try {
				// eslint-disable-next-line no-new
				new URL(this.item.icon)
				return true
			} catch (_) {
				return false
			}
		}
	},
	methods: {
		// allow us to use both link and an action on `a`
		// we still need to make sure item.action exists
		action(event) {
			if (this.item.action) {
				this.item.action(event)
			}
		}
	}
}
</script>
