/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { CustomPickerElement } from './customPickerElements.ts'
import type { ReferenceProvider } from './providerHelper.ts'

declare global {
	interface Window {
		_vue_richtext_reference_providers: ReferenceProvider[]
		_vue_richtext_reference_provider_timestamps: Record<number, number>

		_vue_richtext_custom_picker_elements: Record<string, CustomPickerElement>
		_registerCustomPickerElement: (id: string, callback: CustomPickerElementRegistrationCallback, onDestroy?: CustomPickerElementDestroyCallback, size?: CustomPickerElement['size']) => void

		_vue_richtext_widgets: Record<string, WidgetProps>
		_registerWidget: (id: string, callback: widgetRenderCallback, onDestroy?: widgetDestroyCallback, props?: WidgetPropsOptional) => void
	}
}

export {}
