<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!-- Accessibility guidelines:
https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-actions.html -->

<docs>
### Single action

```vue
<template>
	<NcActions>
		<NcActionButton @click="actionDelete">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
	</NcActions>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete.vue'

export default {
	components: {
		Delete,
	},
	methods: {
		actionDelete() {
			alert('Delete')
		},
	},
}
</script>
```

### Multiple actions

```vue
<template>
	<NcActions>
		<NcActionButton @click="showMessage('Edit')">
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</NcActionButton>
		<NcActionButton @click="showMessage('Delete')">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionLink href="https://nextcloud.com">
			<template #icon>
				<OpenInNew :size="20" />
			</template>
			Link
		</NcActionLink>
	</NcActions>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete.vue'
import OpenInNew from 'vue-material-design-icons/OpenInNew.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'

export default {
	components: {
		Delete,
		OpenInNew,
		Pencil,
	},
	methods: {
		showMessage(msg) {
			alert(msg)
		},
	},
}
</script>
```

### Multiple actions with 2 items inline

```vue
<template>
	<NcActions :inline="2">
		<NcActionButton @click="showMessage('Add')">
			<template #icon>
				<Plus :size="20" />
			</template>
			Add
		</NcActionButton>
		<NcActionButton @click="showMessage('Edit')">
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</NcActionButton>
		<NcActionButton @click="showMessage('Delete')">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionLink href="https://nextcloud.com">
			<template #icon>
				<OpenInNew :size="20" />
			</template>
			Link
		</NcActionLink>
	</NcActions>
</template>
<script>
import Plus from 'vue-material-design-icons/Plus.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import OpenInNew from 'vue-material-design-icons/OpenInNew.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'

export default {
	components: {
		Delete,
		OpenInNew,
		Pencil,
		Plus,
	},
	methods: {
		showMessage(msg) {
			alert(msg)
		},
	},
}
</script>
```

### Multiple actions with 2 items inline AND forced names

```vue
<template>
	<NcActions :force-name="true" :inline="2">
		<NcActionButton @click="showMessage('Add')">
			<template #icon>
				<Plus :size="20" />
			</template>
			Add
		</NcActionButton>
		<NcActionButton @click="showMessage('Edit')">
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</NcActionButton>
		<NcActionButton @click="showMessage('Delete')">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionLink href="https://nextcloud.com">
			<template #icon>
				<OpenInNew :size="20" />
			</template>
			Link
		</NcActionLink>
	</NcActions>
</template>
<script>
import Plus from 'vue-material-design-icons/Plus.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import OpenInNew from 'vue-material-design-icons/OpenInNew.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'
export default {
	components: {
		Delete,
		OpenInNew,
		Pencil,
		Plus,
	},
	methods: {
		showMessage(msg) {
			alert(msg)
		},
	},
}
</script>
```

### Multiple actions with custom icon

```vue
<template>
	<NcActions>
		<template #icon>
			<Pencil :size="20" />
		</template>
		<NcActionButton @click="showMessage('Edit')">
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</NcActionButton>
		<NcActionButton @click="showMessage('Delete')">
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionLink href="https://nextcloud.com">
			<template #icon>
				<OpenInNew :size="20" />
			</template>
			Link
		</NcActionLink>
	</NcActions>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete.vue'
import OpenInNew from 'vue-material-design-icons/OpenInNew.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'

export default {
	components: {
		Delete,
		OpenInNew,
		Pencil,
	},
	methods: {
		showMessage(msg) {
			alert(msg)
		},
	},
}
</script>
```

### With menu name

```vue
<template>
	<NcActions menu-name="Object management">
		<template #icon>
			<Pencil :size="20" />
		</template>
		<NcActionButton>
			<template #icon>
				<Pencil :size="20" />
			</template>
			Rename
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<ArrowRight :size="20" />
			</template>
			Validate
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Download :size="20" />
			</template>
			Download
		</NcActionButton>
	</NcActions>
</template>
<script>
import ArrowRight from 'vue-material-design-icons/ArrowRight.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import Download from 'vue-material-design-icons/Download.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'

export default {
	components: {
		ArrowRight,
		Delete,
		Download,
		Pencil,
	},
}
</script>
```

### Various icons styles
```vue
<template>
	<NcActions :primary="true">
		<NcActionButton>
			<template #icon>
				<Pencil :size="20" />
			</template>
			Edit
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
	</NcActions>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'

export default {
	components: {
		Delete,
		Pencil,
	},
}
</script>
```

```vue
<template>
	<NcActions :primary="true" menu-name="Object management">
		<template #icon>
			<Plus :size="20" />
		</template>
		<NcActionButton>
			<template #icon>
				<Pencil :size="20" />
			</template>
			Rename
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<ArrowRight :size="20" />
			</template>
			Validate
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Download :size="20" />
			</template>
			Download
		</NcActionButton>
	</NcActions>
</template>
<script>
import ArrowRight from 'vue-material-design-icons/ArrowRight.vue'
import Delete from 'vue-material-design-icons/Delete.vue'
import Download from 'vue-material-design-icons/Download.vue'
import Pencil from 'vue-material-design-icons/Pencil.vue'
import Plus from 'vue-material-design-icons/Plus.vue'

export default {
	components: {
		ArrowRight,
		Delete,
		Download,
		Pencil,
		Plus,
	},
}
</script>
```

### Custom icon slot
To be used with `vue-material-design-icons` only. For icon classes use the `default-icon` slot.
It can be used with one or multiple actions.
```vue
<template>
	<div style="display: flex;align-items: center;">
		<NcButton @click="toggled = !toggled">Toggle multiple action</NcButton>
		<NcActions>
			<template #icon>
				<DotsHorizontalCircleOutline :size="20" />
			</template>
			<NcActionButton>
				<template #icon>
					<MicrophoneOff :size="20" />
				</template>
				Mute
			</NcActionButton>
			<NcActionButton v-if="toggled">
				<template #icon>
					<Delete :size="20" />
				</template>
				Delete
			</NcActionButton>
		</NcActions>
	</div>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete.vue'
import DotsHorizontalCircleOutline from 'vue-material-design-icons/DotsHorizontalCircleOutline.vue'
import MicrophoneOff from 'vue-material-design-icons/MicrophoneOff.vue'

export default {
	components: {
		Delete,
		DotsHorizontalCircleOutline,
		MicrophoneOff,
	},
	data() {
		return {
			toggled: false
		}
	}
}
</script>
```

### Custom icon slot in child elements
```vue
<template>
	<NcActions :primary="true">
		<NcActionButton>
			<template #icon>
				<Magnify :size="20" />
			</template>
			Search
		</NcActionButton>
		<NcActionButton>
			<template #icon>
				<Delete :size="20" />
			</template>
			Delete
		</NcActionButton>
	</NcActions>
</template>
<script>
import Delete from 'vue-material-design-icons/Delete.vue'
import Magnify from 'vue-material-design-icons/Magnify.vue'

export default {
	components: {
		Delete,
		Magnify,
	},
}
</script>
```

### Type variants

```vue
<template>
	<div>
		<NcActions :type="current">
			<template #icon>
				<SelectColor :size="20" />
			</template>

			<NcActionButton v-if="current" close-after-click @click="define()">
				<template #icon>
					<Delete :size="20" />
				</template>
				Remove
			</NcActionButton>

			<NcActionButton v-for="row in types" close-after-click @click="define(row)" :key="`type-icon--${row}`">
				<template #icon>
					<CheckboxMarkedCircleOutline v-if="row === current" :size="20" />
					<SelectColor v-else :size="20" />
				</template>
				{{ row }}
			</NcActionButton>
		</NcActions>

		<NcActions :type="current" menu-name="Choose a type">
			<NcActionButton v-if="current" close-after-click @click="define()">
				<template #icon>
					<Delete :size="20" />
				</template>
				Remove
			</NcActionButton>

			<NcActionButton v-for="row in types" close-after-click @click="define(row)" :key="`type-text--${row}`">
				<template #icon>
					<CheckboxMarkedCircleOutline v-if="row === current" :size="20" />
					<SelectColor v-else :size="20" />
				</template>
				{{ row }}
			</NcActionButton>
		</NcActions>

		<NcActions :type="current"  menu-name="Choose a type">
			<template #icon>
				<SelectColor :size="20" />
			</template>

			<NcActionButton v-if="current" close-after-click @click="define()">
				<template #icon>
					<Delete :size="20" />
				</template>
				Remove
			</NcActionButton>

			<NcActionButton v-for="row in types" close-after-click @click="define(row)" :key="`type-icon-text--${row}`">
				<template #icon>
					<CheckboxMarkedCircleOutline v-if="row === current" :size="20" />
					<SelectColor v-else :size="20" />
				</template>
				{{ row }}
			</NcActionButton>
		</NcActions>
	</div>
</template>

<script>
import Delete from 'vue-material-design-icons/Delete.vue'
import Palette from 'vue-material-design-icons/Palette.vue'
import SelectColor from 'vue-material-design-icons/SelectColor.vue'
import CheckboxMarkedCircleOutline from 'vue-material-design-icons/CheckboxMarkedCircleOutline.vue'

export default {
	components: {
		Delete,
		Palette,
		SelectColor,
		CheckboxMarkedCircleOutline,
	},
	data() {
		return {
			current: 'primary',
			types: [
				'primary',
				'secondary',
				'tertiary',
				'error',
				'warning',
				'success'
			]
		}
	},
	methods: {
		define(row = undefined) {
			this.current = row
		}
	}
}
</script>
```

### Use cases

```vue
<template>
	<div>
		<h2>Application menu</h2>
		<p>Has buttons, button groups, links and router links, separators, texts. May have checkboxes and radio buttons. Separator can be used to make groups of radio buttons as well.</p>
		<p><kbd>Arrows</kbd> are used to navigate between items, <kbd>Tab</kbd> is used to navigate to the next UI element on the page.</p>
		<p>
			<NcActions aria-label="Email menu" type="tertiary">
				<NcActionButtonGroup>
					<NcActionButton>
						<template #icon>
							<StarOutline :size="20" />
						</template>
						Favorite
					</NcActionButton>
					<NcActionButton>
						<template #icon>
							<EmailUnread :size="20" />
						</template>
						Unread
					</NcActionButton>
					<NcActionButton>
						<template #icon>
							<Bookmark :size="20" />
						</template>
						Important
					</NcActionButton>
				</NcActionButtonGroup>
				<NcActionText>
					<template #icon>
						<ClockOutlineIcon :size="20" />
					</template>
					{{ new Date().toLocaleDateString('en-US') }}
				</NcActionText>
				<NcActionSeparator />
				<NcActionButton>
					<template #icon>
						<AlertOctagonIcon :size="20" />
					</template>
					Mark as spam
				</NcActionButton>
				<NcActionCheckbox :checked.sync="selected">
					Select
				</NcActionCheckbox>
				<NcActionButton>
					<template #icon>
						<OpenInNewIcon :size="20" />
					</template>
					Move thread
				</NcActionButton>
				<NcActionLink href="#">
					<template #icon>
						<DownloadIcon :size="20" />
					</template>
					Download message
				</NcActionLink>
			</NcActions>
		</p>
		<p>
			<NcActions aria-label="Text settings" type="tertiary">
				<template #icon>
					<FormatTitle :size="20" />
				</template>
				<NcActionButtonGroup name="Allignment">
					<NcActionButton aria-label="Left">
						<template #icon>
							<FormatAlignLeft :size="20" />
						</template>
					</NcActionButton>
					<NcActionButton aria-label="Center">
						<template #icon>
							<FormatAlignCenter :size="20" />
						</template>
					</NcActionButton>
					<NcActionButton aria-label="Right">
						<template #icon>
							<FormatAlignRight :size="20" />
						</template>
					</NcActionButton>
				</NcActionButtonGroup>
				<NcActionSeparator />
				<NcActionCheckbox :checked.sync="checked.bold" value="bold">
					<template #icon>
						<FormatBold :size="20" />
					</template>
					Bold
				</NcActionCheckbox>
				<NcActionCheckbox :checked.sync="checked.italic" value="italic">
					<template #icon>
						<FormatItalic :size="20" />
					</template>
					Italic
				</NcActionCheckbox>
				<NcActionCheckbox :checked.sync="checked.underline" value="underline">
					<template #icon>
						<FormatUnderline :size="20" />
					</template>
					Underline
				</NcActionCheckbox>
				<NcActionSeparator />
				<NcActionRadio name="color" :checked.sync="color.black" value="Black">Black</NcActionRadio>
				<NcActionRadio name="color" :checked.sync="color.blue" value="Blue">Blue</NcActionRadio>
				<NcActionRadio name="color" :checked.sync="color.red" value="Red">Red</NcActionRadio>
				<NcActionRadio name="color" :checked.sync="color.green" value="Green">Green</NcActionRadio>
			</NcActions>
		</p>

		<h2>Navigation</h2>
		<p>Has links or router links. May use text elements, captions and separators.</p>
		<p>Uses classic <kbd>Tab</kbd> navigation.</p>
		<p>
			<NcActions aria-label="Applications navigation" :inline="2" type="tertiary">
				<NcActionLink href="/apps/dashboard" icon="icon-category-dashboard-white">
					Dashboard
				</NcActionLink>
				<NcActionLink href="/apps/files" icon="icon-files-white">
					Files
				</NcActionLink>
				<NcActionLink href="/apps/spreed" icon="icon-talk-white">
					Talk
				</NcActionLink>
				<NcActionLink href="/apps/contacts" icon="icon-contacts-white">
					Contacts
				</NcActionLink>
				<NcActionLink href="/apps/circles" icon="icon-circles-white">
					Circles
				</NcActionLink>
			</NcActions>
		</p>

		<h2>Dialog</h2>
		<p>Includes data input elements, forms.</p>
		<p>Uses <kbd>Tab</kbd> navigation with a focus trap.</p>
		<p>
			<NcActions aria-label="Group management">
				<NcActionInput trailing-button-label="Submit" label="Rename group">
					<template #icon>
						<Pencil :size="20" />
					</template>
				</NcActionInput>
				<NcActionButton>
					<template #icon>
						<Delete :size="20" />
					</template>
					Remove group
				</NcActionButton>
			</NcActions>
		</p>

		<h2>Toolip</h2>
		<p>Has only text and no interactive elements.</p>
		<p>
			<NcActions aria-label="Contact" :inline="1">
				<NcActionLink aria-label="View profile" href="/u/alice" icon="icon-user-white">
					View profile
				</NcActionLink>
				<NcActionText icon="icon-timezone-white">
					Local time: 10:12
				</NcActionText>
			</NcActions>
		</p>
	</div>
</template>

<script>
// Common icons
import Pencil from 'vue-material-design-icons/Pencil.vue'
import Delete from 'vue-material-design-icons/Delete.vue'

// Email icons
import StarOutline from 'vue-material-design-icons/StarOutline.vue'
import EmailUnread from 'vue-material-design-icons/Email.vue'
import Bookmark from 'vue-material-design-icons/Bookmark.vue'
import ClockOutlineIcon from 'vue-material-design-icons/ClockOutline.vue'
import AlertOctagonIcon from 'vue-material-design-icons/AlertOctagon.vue'
import CheckIcon from 'vue-material-design-icons/Check.vue'
import OpenInNewIcon from 'vue-material-design-icons/OpenInNew.vue'
import DownloadIcon from 'vue-material-design-icons/Download.vue'

// Formating icons
import FormatTitle from 'vue-material-design-icons/FormatTitle.vue'
import FormatAlignLeft from 'vue-material-design-icons/FormatAlignLeft.vue'
import FormatAlignCenter from 'vue-material-design-icons/FormatAlignCenter.vue'
import FormatAlignRight from 'vue-material-design-icons/FormatAlignRight.vue'
import FormatBold from 'vue-material-design-icons/FormatBold.vue'
import FormatItalic from 'vue-material-design-icons/FormatItalic.vue'
import FormatUnderline from 'vue-material-design-icons/FormatUnderline.vue'

export default {
	components: {
		// Common icons
		Pencil,
		Delete,

		// Email icons
		StarOutline,
		EmailUnread,
		Bookmark,
		ClockOutlineIcon,
		AlertOctagonIcon,
		CheckIcon,
		OpenInNewIcon,
		DownloadIcon,

		// Formating icons
		FormatTitle,
		FormatAlignLeft,
		FormatAlignCenter,
		FormatAlignRight,
		FormatBold,
		FormatItalic,
		FormatUnderline,
	},

	data() {
		return {
			selected: false,
			// Formating
			checked: {
				bold: true,
				italic: false,
				underline: false,
			},
			color: {
				black: true,
				blue: false,
				red: false,
				green: false,
			},
		}
	},
}
</script>

<style scoped>
p {
	margin: 1rem 0;
}
</style>
```

## NcActions children limitations

`<NcActions>` is supposed to be used with direct `<NcAction*>` children.
Although it works when actions are not direct children but wrapped in custom components, it has limitations:
- No `inline` prop property, including a single action display;
- Accessibility issues, including changed keyboard behavior (see below);
- Invalid HTML.

```
<template>
	<table class="actions-limitations-table">
		<tr>
			<th style="width: 50%">Non-direct children</th>
			<th style="width: 50%">Direct NcAction* children</th>
		</tr>

		<tr>
			<th colspan="2">This single button is supposed to be rendered as inline action but it is rendered as a menu:</th>
		</tr>
		<tr>
			<td>
				<NcActions>
					<MyUserActionButton />
				</NcActions>
			</td>
			<td>
				<NcActions>
					<NcActionButton>
						<template #icon>
							<Account :size="20" />
						</template>
						Button
					</NcActionButton>
				</NcActions>
			</td>
		</tr>
		<tr>
			<th colspan="2">This NcActions is supposed to have 2 inline buttons but it has none:</th>
		</tr>
		<tr>
			<td>
				<NcActions :inline="2">
					<MyUserActionButton v-for="i in 4" />
				</NcActions>
			</td>
			<td>
				<NcActions :inline="2">
					<NcActionButton v-for="i in 4">
						<template #icon>
							<Account :size="20" />
						</template>
						Button
					</NcActionButton>
				</NcActions>
			</td>
		</tr>
		<tr>
			<th colspan="2">This NcActions is supposed to have a11y role menu and keyboard navigation but it acts like a dialog:</th>
		</tr>
		<tr>
			<td>
				<NcActions>
					<MyActionsList />
				</NcActions>
			</td>
			<td>
				<NcActions>
					<NcActionButton v-for="i in 4">
						<template #icon>
							<Account :size="20" />
						</template>
						Button
					</NcActionButton>
				</NcActions>
			</td>
		</tr>
	</table>
</template>

<script>
import Account from 'vue-material-design-icons/Account.vue'

export default {
	components: {
		Account,

		MyUserActionButton: {
			name: 'MyUserActionButton',
			components: { Account },
			render: (h) => h('NcActionButton', ['Button', h('Account', { props: { size: 20 }, slot: 'icon' })]),
		},

		MyActionsList: {
			name: 'MyActionsList',
			components: { Account },
			render: (h) => h('div', [
				h('NcActionButton', ['Button', h('Account', { props: { size: 20 }, slot: 'icon' })]),
				h('NcActionButton', ['Button', h('Account', { props: { size: 20 }, slot: 'icon' })]),
				h('NcActionButton', ['Button', h('Account', { props: { size: 20 }, slot: 'icon' })]),
				h('NcActionButton', ['Button', h('Account', { props: { size: 20 }, slot: 'icon' })]),
			]),
		}
	}
}
</script>

<style>
.actions-limitations-table {
	border-collapse: collapse;
	width: 100%;
	th,
	td {
		border: 1px solid var(--color-border);
		padding: var(--default-grid-baseline);
		max-width: 50%;
	}

	th {
		text-align: center;
		text-wrap: wrap;
	}
}
</style>
```

#### Manually providing semantic menu information
Due to limitations of Vue, when using a custom wrapper for action components, you have to provide the semantic menu type yourself.
This is used for keyboard navigation and accessibility.
In this example a `NcActionInput` component is used within a custom wrapper, so `NcActions` is not able to detect the semantic menu type of 'dialog' automatically,
meaning it must be provided manually:

```vue
<template>
	<NcActions menu-semantic-type="dialog">
		<MyWrapper />
	</NcActions>
</template>
<script>
import Pencil from 'vue-material-design-icons/Pencil.vue'

export default {
	components: {
		MyWrapper: {
			template: `
<NcActionInput trailing-button-label="Submit" label="Rename group">
	<template #icon>
		<Pencil :size="20" />
	</template>
</NcActionInput>`,
		},
		components: {
			Pencil,
		},
	},
}
</script>
```

</docs>

<script>
import NcButton from '../NcButton/index.js'
import NcPopover from '../NcPopover/index.js'
import GenRandomId from '../../utils/GenRandomId.js'

import { t } from '../../l10n.js'
import { getTrapStack } from '../../utils/focusTrap.js'
import { useElementBounding, useWindowSize } from '@vueuse/core'
import Vue, { ref, computed, toRef } from 'vue'

import IconDotsHorizontal from 'vue-material-design-icons/DotsHorizontal.vue'

const focusableSelector = '.focusable'

/**
 * The Actions component can be used to display one ore more actions.
 * If only a single action is provided, it will be rendered as an inline icon.
 * For more, a menu indicator will be shown and a popovermenu containing the
 * actions will be opened on click.
 *
 * @since 0.10.0
 */
export default {
	name: 'NcActions',

	components: {
		NcButton,
		NcPopover,
	},

	provide() {
		return {
			/**
			 * NcActions can be used as:
			 * - Application menu (has menu role)
			 * - Expanded block (has no specific role, should be used an element with expanded role)
			 * - Popover with plain text or text inputs (has no specific role)
			 * Depending on the usage (used items), the menu and its items should have different roles for a11y.
			 * Provide the role for NcAction* components in the NcActions content.
			 * @type {import('vue').ComputedRef<boolean>}
			 */
			'NcActions:isSemanticMenu': computed(() => this.actionsMenuSemanticType === 'menu'),
		}
	},

	props: {
		/**
		 * Specify the open state of the popover menu
		 */
		open: {
			type: Boolean,
			default: false,
		},

		/**
		 * This disables the internal open management,
		 * so the actions menu only respects the `open` prop.
		 * This is e.g. necessary for the NcAvatar component
		 * to only open the actions menu after loading it's entries has finished.
		 */
		manualOpen: {
			type: Boolean,
			default: false,
		},

		/**
		 * Force the actions to display in a three dot menu
		 */
		forceMenu: {
			type: Boolean,
			default: false,
		},

		/**
		 * Force the name to show for single actions
		 */
		forceName: {
			type: Boolean,
			default: false,
		},

		/**
		 * Specify the menu name
		 */
		menuName: {
			type: String,
			default: null,
		},

		/**
		 * NcActions can be used as:
		 *
		 * - Application menu (has menu role)
		 * - Navigation (has no specific role, should be used an element with expanded role)
		 * - Popover with plain text or text inputs (has no specific role)
		 *
		 * By default the used type is automatically detected by components used in the default slot.#
		 *
		 * With Vue this is limited to direct children of the NcActions component.
		 * So if you use a wrapper, you have to provide the semantic type yourself (see Example)
		 *
		 * Choose:
		 *
		 * - 'dialog' if you use any of these components: NcActionInput', 'NcActionTextEditable'
		 * - 'menu' if you use any of these components: 'NcActionButton', 'NcActionButtonGroup', 'NcActionCheckbox', 'NcActionRadio'
		 * - 'expanded' if using one of these: 'NcActionLink', 'NcActionRouter'. This represents an expanded block.
		 * - 'tooltip' only to be used when a text without any interactive elements is used.
		 * - Leave this property unset otherwise
		 */
		forceSemanticType: {
			type: String,
			default: null,
			validator(value) {
				return ['dialog', 'menu', 'expanded', 'tooltip'].includes(value)
			},
		},

		/**
		 * Apply primary styling for this menu
		 */
		primary: {
			type: Boolean,
			default: false,
		},

		/**
		 * Specifies the button type used for trigger and single actions buttons
		 * Accepted values: primary, secondary, tertiary, tertiary-no-background, tertiary-on-primary, error, warning, success. If left empty,
		 * the default button style will be applied.
		 */
		type: {
			type: String,
			validator(value) {
				return ['primary', 'secondary', 'tertiary', 'tertiary-no-background', 'tertiary-on-primary', 'error', 'warning', 'success'].indexOf(value) !== -1
			},
			default: null,
		},

		/**
		 * Icon to show for the toggle menu button
		 * when more than one action is inside the actions component.
		 * Only replace the default three-dot icon if really necessary.
		 */
		defaultIcon: {
			type: String,
			default: '',
		},

		/**
		 * Aria label for the actions menu.
		 *
		 * If `menuName` is defined this will not be used to prevent
		 * any accessible name conflicts. This ensures that the
		 * element can be activated via voice input.
		 */
		ariaLabel: {
			type: String,
			default: t('Actions'),
		},

		/**
		 * @deprecated To be removed in @nextcloud/vue 9. Migration guide: remove ariaHidden prop from NcAction* components.
		 * @todo Add a check in @nextcloud/vue 9 that this prop is not provided,
		 * otherwise root element will inherit incorrect aria-hidden.
		 */
		ariaHidden: {
			type: Boolean,
			default: null,
		},

		/**
		 * Wanted direction of the menu
		 */
		placement: {
			type: String,
			default: 'bottom',
		},

		/**
		 * DOM element for the actions' popover boundaries
		 */
		boundariesElement: {
			type: Element,
			default: () => document.querySelector('#content-vue') ?? document.querySelector('body'),
		},

		/**
		 * Selector for the actions' popover container
		 */
		container: {
			type: [String, Object, Element, Boolean],
			default: 'body',
		},

		/**
		 * Disabled state of the main button (single action or menu toggle)
		 */
		disabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * Display x items inline out of the dropdown menu
		 * Will be ignored if `forceMenu` is set
		 */
		inline: {
			type: Number,
			default: 0,
		},
	},

	emits: [
		'open',
		'update:open',
		'close',
		'focus',
		'blur',
		'click',
	],

	setup(props) {
		const randomId = `menu-${GenRandomId()}`
		const triggerRandomId = `trigger-${randomId}`

		const triggerButton = ref()

		const { top, bottom } = useElementBounding(triggerButton)
		const { top: boundaryTop, bottom: boundaryBottom } = useElementBounding(toRef(props, 'boundariesElement'))
		const { height: windowHeight } = useWindowSize()
		const maxMenuHeight = computed(() => Math.max(
			// Either expand to the top
			Math.min(
				// max height is the top position of the trigger minus the header height minus the wedge and the padding
				top.value - 84,
				// and also limited to the space in the boundary
				top.value - boundaryTop.value,
			),
			// or expand to the bottom
			Math.min(
				// the max height is the window height minus current position of the trigger minus the wedge and padding
				windowHeight.value - bottom.value - 34,
				// and limit to the available space in the boundary
				boundaryBottom.value - bottom.value,
			),
		))

		return {
			triggerButton,
			maxMenuHeight,

			randomId,
			triggerRandomId,
		}
	},

	data() {
		return {
			opened: this.open,
			focusIndex: 0,
			/**
			 * @type {'menu'|'expanded'|'dialog'|'tooltip'|'unknown'}
			 */
			actionsMenuSemanticType: 'unknown',
			externalFocusTrapStack: [],
		}
	},

	computed: {
		triggerBtnType() {
			// If requested, we use a primary button
			return this.type || (this.primary
				? 'primary'
				// If it has a name, we use a secondary button
				: this.menuName ? 'secondary' : 'tertiary')
		},

		/**
		 * A11y roles and keyboard navigation configuration depending on the semantic type
		 */
		config() {
			/**
			 * Accessibility notes:
			 *
			 * "aria-haspopup" and "aria-expanded" are managed by NcPopover via `popupRole`
			 *
			 * "aria-controls" should only present together with a valid aria-haspopup
			 *
			 * There is no valid popup role for expanded and tooltip in `aria-haspopup`.
			 * aria-haspopup="true" is equivalent to aria-haspopup="menu".
			 * They must not be treated as menus.
			 *
			 * Having both arrow and tab navigation is not allowed for a11y.
			 * Either menu is an atomic UI element, and arrows select menu items, Tab moves to the next UI element.
			 * Or the menu is an expanded list of UI elements.
			 *
			 * Navigation type is just an "expanded" block, similar to native <details> element.
			 *
			 * Arrow and Tab navigation should not be used together:
			 * - Arrow navigation is used to navigate between items of UI element
			 * - Tab navigation is used to navigate between UI elements on the page
			 * - Menu is either an atomic UI element of just an expanded block of elements
			 */
			const configs = {
				menu: {
					popupRole: 'menu',
					withArrowNavigation: true,
					withTabNavigation: false,
					withFocusTrap: false,
					triggerA11yAttr: {
						'aria-controls': this.opened ? this.randomId : null,
					},
					popoverContainerA11yAttrs: {},
					popoverUlA11yAttrs: {
						'aria-labelledby': this.triggerRandomId,
						id: this.randomId,
						role: 'menu',
					},
				},
				expanded: {
					popupRole: undefined,
					withArrowNavigation: false,
					withTabNavigation: true,
					withFocusTrap: false,
					triggerA11yAttr: {},
					popoverContainerA11yAttrs: {},
					popoverUlA11yAttrs: {},
				},
				dialog: {
					popupRole: 'dialog',
					withArrowNavigation: false,
					withTabNavigation: true,
					withFocusTrap: true,
					triggerA11yAttr: {
						'aria-controls': this.opened ? this.randomId : null,
					},
					popoverContainerA11yAttrs: {
						id: this.randomId,
						role: 'dialog',
						// Dialog must have a label
						'aria-labelledby': this.triggerRandomId,
						'aria-modal': 'true',
					},
					popoverUlA11yAttrs: {},
				},
				tooltip: {
					popupRole: undefined,
					withArrowNavigation: false,
					withTabNavigation: false,
					withFocusTrap: false,
					triggerA11yAttr: {},
					popoverContainerA11yAttrs: {},
					popoverUlA11yAttrs: {},
				},
				// Due to Vue limitations, we sometimes cannot determine the true type
				// As a fallback use both arrow navigation and focus trap
				unknown: {
					popupRole: undefined,
					role: undefined,
					withArrowNavigation: true,
					withTabNavigation: false,
					withFocusTrap: true,
					triggerA11yAttr: {},
					popoverContainerA11yAttrs: {},
					popoverUlA11yAttrs: {
						// there is nothing against labelling a list, it is mostly recommended
						// so as we do not know the dialog type lets include the label
						'aria-labelledby': this.triggerRandomId,
					},
				},
			}
			return configs[this.actionsMenuSemanticType]
		},
	},

	watch: {
		// Watch parent prop
		open(state) {
			if (state === this.opened) {
				return
			}

			this.opened = state
		},

		opened() {
			this.intersectIntoCurrentFocusTrapStack()

			// Ensure that pressing escape will close the menu even if the menu is not hovered
			// and not currently active, e.g. because user opened the context menu
			if (this.opened) {
				document.body.addEventListener('keydown', this.handleEscapePressed)
			} else {
				document.body.removeEventListener('keydown', this.handleEscapePressed)
			}
		},
	},

	methods: {
		/**
		 * Get the name of the action component
		 *
		 * @param {import('vue').VNode} action - a vnode with a NcAction* component instance
		 * @return {string} the name of the action component
		 */
		getActionName(action) {
			return action?.componentOptions?.Ctor?.extendOptions?.name ?? action?.componentOptions?.tag
		},

		/**
		 * When the component has its own focus trap, then it is managed by global trap stack by focus-trap.
		 *
		 * However if the component has no focus trap and is used inside another focus trap - there is an issue.
		 * By default popover content is rendered in body or other container, which is likely outside the current focus trap containers.
		 * It results in broken behavior from focus-trap.
		 *
		 * We need to pause all the focus traps for opening popover and then unpause them back after closing.
		 */
		intersectIntoCurrentFocusTrapStack() {
			if (this.config.withFocusTrap) {
				return
			}

			if (this.opened) {
				this.externalFocusTrapStack = [...getTrapStack()]
				for (const trap of this.externalFocusTrapStack) {
					trap.pause()
				}
			} else {
				for (const trap of this.externalFocusTrapStack) {
					trap.unpause()
				}
				this.externalFocusTrapStack = []
			}
		},

		/**
		 * Do we have exactly one Action and
		 * is it allowed as a standalone element?
		 *
		 * @param {import('vue').VNode} action The action to check
		 * @return {boolean}
		 */
		isValidSingleAction(action) {
			return ['NcActionButton', 'NcActionLink', 'NcActionRouter'].includes(this.getActionName(action))
		},

		/**
		 * Check whether a icon prop value is an URL or not
		 * @param {string} url The icon prop value
		 */
		isIconUrl(url) {
			try {
				return !!(new URL(url, url.startsWith('/') ? window.location.origin : undefined))
			} catch (error) {
				return false
			}
		},

		// MENU STATE MANAGEMENT
		openMenu(e) {
			if (this.opened) {
				return
			}

			this.opened = true

			/**
			 * Event emitted when the popover menu open state is changed
			 *
			 * @type {boolean}
			 */
			this.$emit('update:open', true)

			/**
			 * Event emitted when the popover menu is opened
			 */
			this.$emit('open')
		},
		async closeMenu(returnFocus = true) {
			if (!this.opened) {
				return
			}

			// Wait for the next tick to keep the menu in DOM, allowing other components to find what button in what menu was used,
			// for example, to implement auto set return focus.
			// NcPopover will actually remove the menu from DOM also on the next tick.
			await this.$nextTick()

			this.opened = false

			this.$refs.popover?.clearFocusTrap({ returnFocus })

			/**
			 * Event emitted when the popover menu open state is changed
			 *
			 * @type {boolean}
			 */
			this.$emit('update:open', false)

			/**
			 * Event emitted when the popover menu is *being* closed.
			 * @deprecated use `update:open` instead. This is always emitted the same time as `('update:open', false)`
			 */
			this.$emit('close')

			// close everything
			this.focusIndex = 0

			if (returnFocus) {
				// Focus back the trigger button
				this.$refs.triggerButton?.$el.focus()
			}
		},

		onClosed() {
			/**
			 * Event emitted when the popover menu is closed.
			 *
			 * This event is emitted after `update:open` was emitted and the closing transition finished.
			 */
			 this.$emit('closed')
		},

		/**
		 * Called when popover is shown after the show delay
		 */
		onOpen() {
			this.$nextTick(() => {
				this.focusFirstAction(null)
				this.resizePopover()
			})
		},

		/**
		 * Handle resizing the popover to make sure users can discover there is more to scroll
		 */
		resizePopover() {
			// Get the inner v-popper element that defines the popover height (from floating-vue)
			const inner = this.$refs.menu.closest('.v-popper__inner')
			const height = this.$refs.menu.clientHeight

			// If the popover height is limited by the max-height (scrollbars shown) limit the height to half of the last element
			if (height > this.maxMenuHeight) {
				// sum of action heights
				let currentHeight = 0
				// last action height
				let actionHeight = 0
				for (const action of this.$refs.menuList.children) {
					// If the max height would be overflown by half of the current element,
					// then we limit the height to the half of the previous element
					if ((currentHeight + action.clientHeight / 2) > this.maxMenuHeight) {
						inner.style.height = `${currentHeight - actionHeight / 2}px`
						break
					}
					// otherwise sum up the height
					actionHeight = action.clientHeight
					currentHeight += actionHeight
				}
			} else {
				inner.style.height = 'fit-content'
			}
		},

		// MENU KEYS & FOCUS MANAGEMENT
		/**
		 * @return {HTMLElement|null}
		 */
		getCurrentActiveMenuItemElement() {
			return this.$refs.menu.querySelector('li.active')
		},
		/**
		 * @return {NodeListOf<HTMLElement>}
		 */
		getFocusableMenuItemElements() {
			return this.$refs.menu.querySelectorAll(focusableSelector)
		},
		/**
		 * Dispatches the keydown listener to different handlers
		 *
		 * @param {object} event The keydown event
		 */
		onKeydown(event) {
			if (event.key === 'Tab') {
				if (this.config.withFocusTrap) {
					// Focus is managed by focus-trap
					return
				}

				if (!this.config.withTabNavigation) {
					// Tab is not used for navigation - close the menu
					// Return focus to restore Tab sequence
					// So browser will correctly move focus to the next element
					this.closeMenu(true)
					return
				}

				// Tab is used for classic navigation but we implement it manually

				event.preventDefault()

				const focusList = this.getFocusableMenuItemElements()
				const focusIndex = [...focusList].indexOf(document.activeElement)
				if (focusIndex === -1) {
					// This is not supposed to happen
					// But if it does - do nothing and keep native behavior
					return
				}
				const newFocusIndex = event.shiftKey ? focusIndex - 1 : focusIndex + 1

				// There is no focus-trap, so going out of the menu closes it
				if (newFocusIndex < 0 || newFocusIndex === focusList.length) {
					this.closeMenu(true)
				}

				// Update current focused element
				this.focusIndex = newFocusIndex
				this.focusAction()
				return
			}

			if (this.config.withArrowNavigation) {
				if (event.key === 'ArrowUp') {
					this.focusPreviousAction(event)
				}

				if (event.key === 'ArrowDown') {
					this.focusNextAction(event)
				}

				if (event.key === 'PageUp') {
					this.focusFirstAction(event)
				}

				if (event.key === 'PageDown') {
					this.focusLastAction(event)
				}
			}

			this.handleEscapePressed(event)
		},

		onTriggerKeydown(event) {
			if (event.key === 'Escape') {
				// Tooltip has no focusable elements and the focus remains on the trigger button.
				// So keydown event on the menu cannot be handled to close Tooltip on Escape.
				// Handle on the trigger.
				if (this.actionsMenuSemanticType === 'tooltip') {
					this.closeMenu()
				}
			}
		},

		handleEscapePressed(event) {
			if (event.key === 'Escape') {
				this.closeMenu()
				event.preventDefault()
			}
		},

		removeCurrentActive() {
			const currentActiveElement = this.$refs.menu.querySelector('li.active')
			if (currentActiveElement) {
				currentActiveElement.classList.remove('active')
			}
		},
		focusAction() {
			// TODO: have a global disabled state for non input elements
			const focusElement = this.getFocusableMenuItemElements()[this.focusIndex]
			if (focusElement) {
				this.removeCurrentActive()
				const liMenuParent = focusElement.closest('li.action')
				focusElement.focus()
				if (liMenuParent) {
					liMenuParent.classList.add('active')
				}
			}
		},
		focusPreviousAction(event) {
			if (this.opened) {
				if (this.focusIndex === 0) {
					this.focusLastAction(event)
				} else {
					this.preventIfEvent(event)
					this.focusIndex = this.focusIndex - 1
				}
				this.focusAction()
			}
		},
		focusNextAction(event) {
			if (this.opened) {
				const indexLength = this.getFocusableMenuItemElements().length - 1
				if (this.focusIndex === indexLength) {
					this.focusFirstAction(event)
				} else {
					this.preventIfEvent(event)
					this.focusIndex = this.focusIndex + 1
				}
				this.focusAction()
			}
		},
		focusFirstAction(event) {
			if (this.opened) {
				this.preventIfEvent(event)
				// In case a NcActionButton is considered checked we will use this one as a initial focus
				// Having aria-checked is the simplest way to determine the checked state of a button
				// TODO: determine when we need to focus the first checked item and when we not, for example, if menu has many radio groups
				const firstCheckedIndex = [...this.getFocusableMenuItemElements()].findIndex((button) => {
					return button.getAttribute('aria-checked') === 'true' && button.getAttribute('role') === 'menuitemradio'
				})
				this.focusIndex = firstCheckedIndex > -1 ? firstCheckedIndex : 0
				this.focusAction()
			}
		},
		focusLastAction(event) {
			if (this.opened) {
				this.preventIfEvent(event)
				this.focusIndex = this.getFocusableMenuItemElements().length - 1
				this.focusAction()
			}
		},
		preventIfEvent(event) {
			if (event) {
				event.preventDefault()
				event.stopPropagation()
			}
		},
		onFocus(event) {
			this.$emit('focus', event)
		},
		onBlur(event) {
			this.$emit('blur', event)

			// When there is no focusable elements to handle Tab press from actions menu
			// It requries manual closing
			if (this.actionsMenuSemanticType === 'tooltip') {
				// Tooltip is supposed to have no focusable element.
				// However, if there is a custom focusable element, it will be auto-focused and cause the menu to be closed on open.
				if (this.$refs.menu && this.getFocusableMenuItemElements().length === 0) {
					this.closeMenu(false)
				}
			}
		},
		onClick(event) {
			/**
			 * Event emitted when the menu toggle button is clicked.
			 *
			 * This is e.g. necessary for the NcAvatar component
			 * which needs to fetch the menu items on click.
			 *
			 * @type {PointerEvent}
			 */
			this.$emit('click', event)
		},
	},

	/**
	 * The render function to display the component
	 *
	 * @param {Function} h The function to create VNodes
	 * @return {object|undefined} The created VNode
	 */
	render(h) {
		/**
		 * Filter the Actions, so that we only get allowed components.
		 * This also ensure that we don't get 'text' elements, which would
		 * become problematic later on.
		 */
		const actions = (this.$slots.default || []).filter(action => this.getActionName(action))

		// Check that we have at least one action
		if (actions.length === 0) {
			return
		}

		/**
		 * Separate the actions into inline and menu actions
		 */

		/**
		 * @type {import('vue').VNode[]}
		 */
		let validInlineActions = actions.filter(this.isValidSingleAction)
		if (this.forceMenu && validInlineActions.length > 0 && this.inline > 0) {
			Vue.util.warn('Specifying forceMenu will ignore any inline actions rendering.')
			validInlineActions = []
		}
		/**
		 * @type {import('vue').VNode[]}
		 */
		const inlineActions = validInlineActions.slice(0, this.inline)
		/**
		 * @type {import('vue').VNode[]}
		 */
		const menuActions = actions.filter(action => !inlineActions.includes(action))

		/**
		 * Determine what kind of menu we have.
		 * It defines keyboard navigation and a11y.
		 */
		if (this.forceSemanticType) {
			this.actionsMenuSemanticType = this.forceSemanticType
		} else {
			const textInputActions = ['NcActionInput', 'NcActionTextEditable']
			const menuItemsActions = ['NcActionButton', 'NcActionButtonGroup', 'NcActionCheckbox', 'NcActionRadio']
			const linkActions = ['NcActionLink', 'NcActionRouter']

			const hasTextInputAction = menuActions.some(action => textInputActions.includes(this.getActionName(action)))
			const hasMenuItemAction = menuActions.some(action => menuItemsActions.includes(this.getActionName(action)))
			const hasLinkAction = menuActions.some(action => linkActions.includes(this.getActionName(action)))

			if (hasTextInputAction) {
				this.actionsMenuSemanticType = 'dialog'
			} else if (hasMenuItemAction) {
				this.actionsMenuSemanticType = 'menu'
			} else if (hasLinkAction) {
				this.actionsMenuSemanticType = 'expanded'
			} else {
				// (!) Hotfix (!)
				// In Vue 2 it is not easy to search for NcAction* in sub-component of a slot.
				// When a menu is rendered, children are not mounted yet.
				// If we have NcActions > MyActionsList > NcActionButton, only MyActionsList's vnode is available.
				// So when NcActions has actions as non-direct children, here then we don't know about them.
				// Like this menu has no buttons/links/inputs.
				// It makes the menu incorrectly considered a tooltip.
				const ncActions = actions.filter((action) => this.getActionName(action).startsWith('NcAction'))
				if (ncActions.length === actions.length) {
					// True tooltip
					this.actionsMenuSemanticType = 'tooltip'
				} else {
					// Custom components are passed to the NcActions
					this.actionsMenuSemanticType = 'unknown'
				}
			}
		}

		/**
		 * Render the provided action
		 *
		 * @param {import('vue').VNode} action the action to render
		 * @return {Function} the vue render function
		 */
		const renderInlineAction = (action) => {
			const iconProp = action?.componentOptions?.propsData?.icon
			const icon = action?.data?.scopedSlots?.icon()?.[0] ?? (
				this.isIconUrl(iconProp)
					? h('img', { class: 'action-item__menutoggle__icon', attrs: { src: iconProp, alt: '' } })
					: h('span', { class: ['icon', iconProp] })
			)
			const attrs = action?.data?.attrs || {}
			const clickListener = action?.componentOptions?.listeners?.click

			const text = action?.componentOptions?.children?.[0]?.text?.trim?.()
			const ariaLabel = action?.componentOptions?.propsData?.ariaLabel || text
			const buttonText = this.forceName ? text : ''

			let title = action?.componentOptions?.propsData?.title
			// Show a default title for single actions if none is present
			if (!(this.forceName || title)) {
				title = text
			}

			const propsToForward = { ...(action?.componentOptions?.propsData ?? {}) }
			const nativeType = ['submit', 'reset'].includes(propsToForward.type) ? propsToForward.modelValue : 'button'
			// not available on NcButton or with different meaning
			delete propsToForward.modelValue
			delete propsToForward.type

			return h('NcButton',
				{
					class: [
						'action-item action-item--single',
						action?.data?.staticClass,
						action?.data?.class,
					],
					attrs: {
						...attrs,
						'aria-label': ariaLabel,
						title,
					},
					ref: action?.data?.ref,
					props: {
						// If it has a menuName, we use a secondary button
						type: this.type || (buttonText ? 'secondary' : 'tertiary'),
						disabled: this.disabled || action?.componentOptions?.propsData?.disabled,
						pressed: action?.componentOptions?.propsData?.modelValue,
						nativeType,
						...propsToForward,
					},
					on: {
						focus: this.onFocus,
						blur: this.onBlur,
						// forward any pressed state from NcButton just like NcActionButton does
						'update:pressed': action?.componentOptions?.listeners?.['update:modelValue'] ?? (() => {}),
						// If we have a click listener,
						// we bind it to execute on click and forward the click event
						...(!!clickListener && {
							click: (event) => {
								if (clickListener) {
									clickListener(event)
								}
							},
						}),
					},
				},
				[
					h('template', { slot: 'icon' }, [icon]),
					buttonText,
				],
			)
		}

		/**
		 * Render the actions popover
		 *
		 * @param {Array} actions the actions to render within
		 * @return {Function} the vue render function
		 */
		const renderActionsPopover = (actions) => {
			const triggerIcon = this.$slots.icon?.[0] || (
				this.defaultIcon
					? h('span', { class: ['icon', this.defaultIcon] })
					: h(IconDotsHorizontal, {
						props: {
							size: 20,
						},
					})
			)
			return h('NcPopover',
				{
					ref: 'popover',
					props: {
						delay: 0,
						handleResize: true,
						shown: this.opened,
						placement: this.placement,
						boundary: this.boundariesElement,
						container: this.container,
						popoverBaseClass: 'action-item__popper',
						popupRole: this.config.popupRole,
						setReturnFocus: this.config.withFocusTrap ? this.$refs.triggerButton?.$el : null,
						focusTrap: this.config.withFocusTrap,
					},
					// For some reason the popover component
					// does not react to props given under the 'props' key,
					// so we use both 'attrs' and 'props'
					attrs: {
						delay: 0,
						handleResize: true,
						shown: this.opened,
						placement: this.placement,
						boundary: this.boundariesElement,
						container: this.container,
						...this.manualOpen && { triggers: [] },
					},
					on: {
						show: this.openMenu,
						'apply-show': this.onOpen,
						hide: this.closeMenu,
						'apply-hide': this.onClosed,
					},
				},
				[
					h('NcButton', {
						class: 'action-item__menutoggle',
						props: {
							type: this.triggerBtnType,
							disabled: this.disabled,
						},
						slot: 'trigger',
						ref: 'triggerButton',
						attrs: {
							id: this.triggerRandomId,
							'aria-label': this.menuName ? null : this.ariaLabel,
							...this.config.triggerA11yAttr,
						},
						on: {
							focus: this.onFocus,
							blur: this.onBlur,
							click: this.onClick,
							keydown: this.onTriggerKeydown,
						},
					}, [
						h('template', { slot: 'icon' }, [triggerIcon]),
						this.menuName,
					]),
					h('div', {
						class: {
							open: this.opened,
						},
						attrs: {
							tabindex: '-1',
							...this.config.popoverContainerA11yAttrs,
						},
						on: {
							keydown: this.onKeydown,
						},
						ref: 'menu',
					}, [
						h('ul', {
							attrs: {
								tabindex: '-1',
								...this.config.popoverUlA11yAttrs,
							},
							ref: 'menuList',
						}, [
							actions,
						]),
					]),
				],
			)
		}

		/**
		 * If we have a single action only and didn't force a menu,
		 * we render the action as a standalone button
		 */
		if (actions.length === 1 && validInlineActions.length === 1 && !this.forceMenu) {
			return renderInlineAction(actions[0])
		}

		// If we completely re-render the children
		// we need to focus the first action again
		// Mostly used when clicking a menu item
		this.$nextTick(() => {
			if (this.opened && this.$refs.menu) {
				this.resizePopover()
				const isAnyActive = this.$refs.menu.querySelector('li.active') || []
				if (isAnyActive.length === 0) {
					this.focusFirstAction()
				}
			}
		})

		/**
		 * If we some inline actions to render, render them, then the menu
		 */
		if (inlineActions.length > 0 && this.inline > 0) {
			return h('div',
				{
					class: [
						'action-items',
						`action-item--${this.triggerBtnType}`,
					],
				},
				[
					// Render inline actions
					...inlineActions.map(renderInlineAction),
					// render the rest within the popover menu
					menuActions.length > 0
						? h('div',
							{
								class: [
									'action-item',
									{
										'action-item--open': this.opened,
									},
								],
							},
							[
								renderActionsPopover(menuActions),
							])
						: null,
				])
		}

		/**
		 * Otherwise, we render the actions in a popover
		 */
		return h('div',
			{
				class: [
					'action-item action-item--default-popover',
					`action-item--${this.triggerBtnType}`,
					{
						'action-item--open': this.opened,
					},
				],
			},
			[
				renderActionsPopover(actions),
			],
		)
	},
}
</script>

<style lang="scss" scoped>
// Inline buttons
.action-items {
	display: flex;
	align-items: center;
	gap: calc($icon-margin / 2);
}

.action-item {
	--open-background-color: var(--color-background-hover, $action-background-hover);
	position: relative;
	display: inline-block;

	&.action-item--primary {
		--open-background-color: var(--color-primary-element-hover);
	}

	&.action-item--secondary {
		--open-background-color: var(--color-primary-element-light-hover);
	}

	&.action-item--error {
		--open-background-color: var(--color-error-hover);
	}

	&.action-item--warning {
		--open-background-color: var(--color-warning-hover);
	}

	&.action-item--success {
		--open-background-color: var(--color-success-hover);
	}

	&.action-item--tertiary-no-background {
		--open-background-color: transparent;
	}

	&.action-item--open .action-item__menutoggle {
		background-color: var(--open-background-color);
	}

	&__menutoggle__icon {
		width: 20px;
		height: 20px;
		object-fit: contain;
	}
}
</style>

<style lang="scss">
// We overwrote the popover base class, so we can style
// the popover__inner for actions only.
.v-popper--theme-dropdown.v-popper__popper.action-item__popper .v-popper__wrapper {
	border-radius: var(--border-radius-large);

	.v-popper__inner {
		border-radius: var(--border-radius-large);
		padding: 4px;
		max-height: calc(100vh - var(--header-height));
		overflow: auto;
	}
}
</style>
