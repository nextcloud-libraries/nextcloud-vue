import { computed, inject } from 'vue'

/**
 * Get the NcActions's context for NcAction-item component.
 * Supposed to be used in all NcAction-item components.
 *
 * @return {{ liRole: import('vue').ComputedRef<string | undefined>, menuType: import('vue').ComputedRef<string | undefined>}}
 */
export function useNcActionsContext() {
	const getActionsListRole = inject('NcActions:getMenuType')
	const menuType = computed(() => getActionsListRole())

	const getListItemRole = inject('NcActions:getListItemRole')
	const liRole = computed(() => getListItemRole())

	return {
		liRole,
		menuType,
	}
}
