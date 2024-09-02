import { getCurrentInstance } from "vue"
import { computed } from "vue"

export function useModelMigration(oldModelName, oldModelEvent) {
    const instance = getCurrentInstance()
    console.log('instance', instance)
    const props = getCurrentInstance().$props
    const emit = getCurrentInstance().$emit

    const model = computed({
        get() {
            if (props[oldModelName] !== undefined) {
                return props[oldModelName]
            }
            return props.modelValue
        },

        set(value) {
            emit('update:modelValue', value)
            emit(oldModelEvent, value)
        }
    })

    return {
        model,
    }
}