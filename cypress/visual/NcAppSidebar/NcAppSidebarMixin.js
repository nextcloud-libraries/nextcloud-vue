/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import sanitize from 'sanitize-filename'
import NcActionButton from '../../../src/components/NcActionButton/NcActionButton.vue'
import NcAppSidebar from '../../../src/components/NcAppSidebar/NcAppSidebar.vue'

// Server CSS styles
import '../../../styleguide/assets/icons.css'
import '../../../styleguide/assets/additional.css'
/**
 * We need this custom style because we run the AppSidebar component without a Content component,
 * which applies this rule:
 * https://github.com/nextcloud/nextcloud-vue/blob/master/src/components/Content/Content.vue#L88-L90
 */
import './style.css'
// Import font so CI has the same
import '@fontsource/roboto'

/**
 * Split the Appsidebar test in two for performances
 *
 * @param {boolean} compact make the appsidebar compact or not
 */
export default function(compact) {
	describe(`NcAppSidebar.vue ${compact ? '' : 'not '}in compact mode`, () => {
		'use strict'
		// Possible props and actions
		const name = 'Very long title that will certainly overflow the sidebar width'
		const subnames = ['', 'Very long subtitle what will certainly overflow the sidebar width']
		const nameEditable = [false, true]
		const starred = [null, false, true]
		const header = ['', '<div style="background: no-repeat center/contain var(--icon-folder-000); height: 100%;" />']
		const secondary = ['', '<NcActionButton icon="icon-delete">Action1</NcActionButton><NcActionButton icon="icon-delete">Action2</NcActionButton>']

		const components = {
			NcActionButton,
		}
		// extend Vue with global components
		const extensions = {
			components,
		}

		subnames.forEach((subname) => {
			nameEditable.forEach((editable) => {
				starred.forEach((star) => {
					header.forEach((head) => {
						secondary.forEach((second) => {
							// TODO remove when https://github.com/mjhea0/cypress-visual-regression/pull/56
							const fileName = sanitize(`NcAppSidebar.vue
									-subname_${subname ? 'true' : 'null'}
									-starred_${star === null ? 'null' : star ? 'true' : 'false'}
									-compact_${compact ? 'true' : 'false'}
									-header_${head ? 'image' : 'none'}
									-secondary_${second ? 'button' : 'none'}
									-editable_${editable ? 'true' : 'false'}
							`)

							const defaultOptions = {
								propsData: {
									name,
									subname,
									starred: star,
									compact,
									nameEditable: editable,
								},
								slots: {
									default: ['<div />'],
									header: head,
									'secondary-actions': second,
								},
								extensions,
							}

							it('Renders ' + fileName, () => {
								cy.mount(NcAppSidebar, defaultOptions)
								cy.get('.app-sidebar-header')
									// Ensure cursor is not displayed to prevent flaky tests (flashing input cursor)
									.invoke('css', 'caret-color', 'transparent')
									// Compare to "golden" standard
									.compareSnapshot(fileName)
							})
						})
					})
				})
			})
		})
	})
}
