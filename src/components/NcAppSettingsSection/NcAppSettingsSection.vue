<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<section :id="htmlId" :aria-labelledby="`${htmlId}--label`" class="app-settings-section">
		<h3 :id="`${htmlId}--label`" class="app-settings-section__name">
			{{ name }}
		</h3>
		<slot />
		<!-- @slot Optonal icon to for the secion in the navigation -->
		<slot v-if="false" name="icon" />
	</section>
</template>

<script>
export default {
	name: 'NcAppSettingsSection',
	inject: ['registerSection', 'unregisterSection'],

	props: {
		name: {
			type: String,
			required: true,
		},

		id: {
			type: String,
			required: true,
			validator(id) {
				// Only alphanumeric, dash and underscore
				return /^[a-z0-9\-_]+$/.test(id)
			},
		},
	},
	computed: {
		// generate an id for each settingssection based on the name without whitespaces
		htmlId() {
			return 'settings-section_' + this.id
		},
	},
	// Reactive changes for section navigation
	watch: {
		id(newId, oldId) {
			this.unregisterSection(oldId)
			this.registerSection(newId, this.name, this.$slots?.icon?.())
		},
		name(newName) {
			this.unregisterSection(this.id)
			this.registerSection(this.id, newName, this.$slots?.icon?.())
		},
	},
	mounted() {
		// register section for navigation
		this.registerSection(this.id, this.name, this.$slots?.icon?.())
	},
	beforeUnmount() {
		this.unregisterSection(this.id)
	},
}

</script>

<style lang="scss" scoped>
.app-settings-section {
	margin-bottom: 80px;
	&__name {
		font-size: 1.6em;
		margin: 0;
		padding: 20px 0;
		font-weight: bold;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>
