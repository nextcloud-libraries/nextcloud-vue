<!--
 - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<script setup>
import ContactsIcon from 'vue-material-design-icons/Contacts.vue'
import NcActionButton from '../../NcActionButton/NcActionButton.vue'
import NcAvatar from '../../NcAvatar/NcAvatar.vue'
import NcChip from '../NcChip.vue'
</script>

<template>
	<div class="nc-chip-with-actions">
		<!-- The actions container is only needed for this documentation example to keep the popover within the render canvas -->
		<NcChip actions-container=".nc-chip-with-actions">
			<!-- The icon slot allow to use custom components as the chip icon -->
			<template #icon>
				<NcAvatar :size="24" user="jdoe" display-name="J. Doe" />
			</template>
			<!-- The actions slot allows to add custom actions -->
			<template #actions>
				<NcActionButton>
					<template #icon>
						<ContactsIcon :size="20" />
					</template>
					Add to contacts
				</NcActionButton>
			</template>
			<!-- The default slot can be used for add content, just like the `text` prop -->
			J. Doe
		</NcChip>
	</div>
</template>

<style scoped>
.nc-chip-with-actions {
	/* Ensure the actions fit into this example render canvas - not needed for your apps code */
	min-height: calc(3 * var(--default-clickable-area));
}
</style>
