<!--
  - @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
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
-->

<docs>

### General description

This component displays contenteditable div with automated @ autocompletion [at].

### Examples

```vue
<template>
	<div>
		<RichContenteditable
			v-model="message"
			:auto-complete="autoComplete"
			placeholder="Try mentioning the user Test01"
			style="width: 350px;height: 100px;" />
		{{ message }}
	</div>
</template>
<script>
export default {
	data() {
		return {
			message: '',
		}
	},
	methods: {
		/**
		* Do your own query to the autocompletion api.
		* The returned data bellow is a fake data example.
		* The callback expects the same format returned by the core/autocomplete/get ocs api endpoint!
		* @param {string} search the query
		* @param {Function} callback the callback to process the results with
		*/
		autoComplete(search, callback) {
			return callback([{
				icon: 'icon-user',
				id: 'Test01',
				label: 'Test01',
				source: 'users',
			}])
		}
	}
}
</script>
```

</docs>

<template>
	<InputContenteditable
		_is="div"
		:value="value"
		:placeholder="placeholder"
		class="rich-contenteditable__input"
		@input="onInput" />
</template>

<script>
import InputContenteditable from 'vue-input-contenteditable'

import Tribute from 'tributejs/dist/tribute.esm'
import debounce from 'debounce'
import { generateUrl } from '@nextcloud/router'

import { t } from '../../l10n.js'

export default {
	name: 'RichContenteditable',

	components: {
		InputContenteditable,
	},

	props: {
		value: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: t('Write message, @ to mention someone …'),
		},
		autoComplete: {
			type: Function,
			required: true,
		},
		menuContainer: {
			type: Element,
			default: () => document.body,
		},
	},

	data() {
		return {
			tribute: null,
			options: {
				fillAttr: 'id',
				// Search against id and label (display name)
				lookup: result => `${result.id} ${result.label}`,
				menuContainer: this.menuContainer,
				menuItemTemplate: this.genTemplate,
				noMatchTemplate: () => '<span class="hidden"></span>',
				selectTemplate: item => `@${item.original.id}`,
				values: this.debouncedAutoComplete,
			},
		}
	},

	mounted() {
		this.tribute = new Tribute(this.options)
		this.tribute.attach(this.$el)
	},
	beforeDestroy() {
		if (this.tribute) {
			this.tribute.detach(this.$el)
		}
	},

	methods: {
		/**
		 * Re-emit the input event to the parent
		 * @param {string} text the message
		 */
		onInput(text) {
			this.$emit('input', text)
			this.$emit('update:value', text)
		},

		/**
		 * Debounce the autocomplete function
		 */
		debouncedAutoComplete: debounce(async function(search, callback) {
			this.autoComplete(search, callback)
		}, 200),

		genTemplate({ original }) {
			const avatarUrl = original.source === 'users'
				? this.getAvatarUrl(original.id)
				: null

			const haveStatus = original.status?.icon || original.status?.status

			return `<div class="autocomplete-result" data-v-${SCOPE_VERSION}>
				<!-- Avatar or icon -->
				<div class="autocomplete-result__icon ${original.icon} autocomplete-result__avatar--${avatarUrl ? 'with-avatar' : ''}" style="background-image: ${avatarUrl}">
					<div class="autocomplete-result__status autocomplete-result__status--${original.status?.icon ? 'icon' : original.status?.status}"
						style="${haveStatus ? '' : 'display:none'}">${original.status?.icon || ''}</div>
				</div>

				<!-- Title and subtitle -->
				<span class="autocomplete-result__content">
					<span class="autocomplete-result__title">
						${original.label}
					</span>
					<span class="autocomplete-result__subline" style="${original.subline ? '' : 'display:none'}">
						${original.subline}
					</span>
				</span>
			</div>`
		},

		getAvatarUrl(user) {
			return generateUrl('/avatar/{user}/{size}', {
				user,
				size: 44,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.rich-contenteditable__input {
	width: auto;
	cursor: text;

	&:empty:before {
		content: attr(placeholder);
		color: var(--color-text-maxcontrast);
	}
}
</style>

<style lang="scss">
@import '../../fonts/scss/iconfont-vue';

.tribute-container {
	z-index: 9000;
	overflow: auto;
	min-width: 250px;
	max-width: 300px;
	// Show maximum 4 entries and a half to show scroll
	max-height: $clickable-area * 4.5;
	// Space it out a bit from the text
	margin: 5px 0;
	color: var(--color-main-text);
	border-radius: var(--border-radius);
	background: var(--color-main-background);
	box-shadow: 0 0 5px var(--color-box-shadow);
}

$padding: 10px;

.autocomplete-result[data-v-#{$scope_version}] {
	display: flex;
	height: $clickable-area;
	padding: $padding;

	.highlight & {
		color: var(--color-main-text);
		background: var(--color-primary-light);
		&, * {
			cursor: pointer;
		}
	}

	.autocomplete-result__icon {
		position: relative;
		width: $clickable-area;
		height: $clickable-area;
		border-radius: $clickable-area;
		background-color: var(--color-background-darker);
		background-repeat: no-repeat;
		background-position: center;
		background-size: $clickable-area - 2 * $padding;
		&--with-avatar {
			color: inherit;
			background-size: cover;
		}
	}

	.autocomplete-result__status {
		position: absolute;
		right: -4px;
		bottom: -4px;
		box-sizing: border-box;
		width: 18px;
		height: 18px;
		border: 2px solid var(--color-main-background);
		border-radius: 50%;
		background-color: var(--color-main-background);
		font-size: 14px;
		line-height: 14px;
		&--online {
			color: #49b382;

			@include iconfont('user-status-online');
		}
		&--dnd {
			color: #ed484c;
			background-color: #fff;

			@include iconfont('user-status-dnd');
		}
		&--away {
			color: #f4a331;

			@include iconfont('user-status-away');
		}
		&--icon {
			border: none;
			background-color: transparent;
		}
	}

	.autocomplete-result__content {
		display: flex;
		flex: 1 1;
		flex-direction: column;
		justify-content: center;
		padding-left: $padding;
	}

	.autocomplete-result__subline {
		color: var(--color-text-lighter);
	}
}

</style>
