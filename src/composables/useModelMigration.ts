/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue, { computed } from 'vue'
import type { WritableComputedRef } from 'vue'
import type { EmitFn } from 'vue/types/v3-setup-context'
import type { DefaultProps } from 'vue/types/options'

/**
 * Create model proxy to new v9 model (modelValue + update:modelValue) with a fallback to old model
 * @param props - Original props from setup()
 * @param emit - Original emit from setup()
 * @param oldModelName - Name of model prop in nextcloud-vue v8
 * @param oldModelEvent - Event name of model event in nextcloud-vue v8
 * @param required - If the prop is required
 * @return model proxy
 */
export function useModelMigration(props: DefaultProps, emit: EmitFn, oldModelName: string, oldModelEvent: string, required: boolean = false): WritableComputedRef<any> {
	if (required && props[oldModelName] === undefined && props.modelValue === undefined) {
		Vue.util.warn(`Missing required prop: "modelValue" or old "${oldModelName}"`)
	}

	const model = computed({
		get() {
			if (props[oldModelName] !== undefined) {
				return props[oldModelName]
			}
			return props.modelValue
		},

		set(value) {
			// New nextcloud-vue v9 event
			emit('update:modelValue', value)
			// Vue 2 fallback for kebab-case event names in templates (recommended by Vue 3 style guide)
			emit('update:model-value', value)
			// Old nextcloud-vue v8 event
			emit(oldModelEvent, value)
		},
	})

	return model
}
