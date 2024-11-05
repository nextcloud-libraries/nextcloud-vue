/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue, { getCurrentInstance, computed } from 'vue'

/**
 * Create model proxy to new v9 model (modelValue + update:modelValue) with a fallback to old model
 * @param {string} oldModelName - Name of model prop in nextcloud-vue v8
 * @param {string} oldModelEvent - Event name of model event in nextcloud-vue v8
 * @param {boolean} required - If the prop is required
 * @return {import('vue').WritableComputedRef} - model proxy
 */
export function useModelMigration(oldModelName, oldModelEvent, required = false) {
	const vm = getCurrentInstance()!.proxy

	if (required && vm.$props[oldModelName] === undefined && vm.$props.modelValue === undefined) {
		Vue.util.warn(`Missing required prop: "modelValue" or old "${oldModelName}"`)
	}

	const model = computed({
		get() {
			if (vm.$props[oldModelName] !== undefined) {
				return vm.$props[oldModelName]
			}
			return vm.$props.modelValue
		},

		set(value) {
			// Old nextcloud-vue v8 event
			vm.$emit(oldModelEvent, value)
			// New nextcloud-vue v9 event
			vm.$emit('update:modelValue', value)
			// Vue 2 fallback for kebab-case event names in templates (recommended by Vue 3 style guide)
			vm.$emit('update:model-value', value)
		},
	})

	return model
}
