/**
 * @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { mount } from '@cypress/vue'
import sanitize from 'sanitize-filename'

// import Vue from 'vue'
import NcAppSidebar from '../../../../src/components/NcAppSidebar/NcAppSidebar.vue'
import NcActionButton from '../../../../src/components/NcActionButton/NcActionButton.vue'

// // Server CSS styles
import '../../../../styleguide/assets/server.css'
import '../../../../styleguide/assets/icons.css'
import '../../../../styleguide/assets/variables.css'
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
		const title = 'Very long title that will certainly overflow the sidebar width'
		const subtitles = ['', 'Very long subtitle what will certainly overflow the sidebar width']
		const titleEditable = [false, true]
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

		subtitles.forEach(subtitle => {
			titleEditable.forEach(editable => {
				starred.forEach(star => {
					header.forEach(head => {
						secondary.forEach(second => {
							// TODO remove when https://github.com/mjhea0/cypress-visual-regression/pull/56
							const fileName = sanitize(`NcAppSidebar.vue
									-subtitle_${subtitle ? 'true' : 'null'}
									-starred_${star === null ? 'null' : star ? 'true' : 'false'}
									-compact_${compact ? 'true' : 'false'}
									-header_${head ? 'image' : 'none'}
									-secondary_${second ? 'button' : 'none'}
									-editable_${editable ? 'true' : 'false'}
							`)

							const defaultOptions = {
								propsData: {
									title,
									subtitle,
									starred: star,
									compact,
									titleEditable: editable,
								},
								slots: {
									default: ['<div />'],
									header: head,
									'secondary-actions': second,
								},
								extensions,
							}

							it('Renders ' + fileName, () => {
								mount(NcAppSidebar, defaultOptions)
								cy.get('.app-sidebar-header').compareSnapshot(fileName)
							})
						})
					})
				})
			})
		})
	})
}
