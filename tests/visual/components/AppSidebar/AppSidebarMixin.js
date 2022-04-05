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

import { mount } from 'cypress-vue-unit-test'
import sanitize from 'sanitize-filename'

// import Vue from 'vue'
import AppSidebar from '../../../../src/components/AppSidebar/AppSidebar.vue'
import ActionButton from '../../../../src/components/ActionButton/ActionButton.vue'

// Server CSS styles
import server from '../../../../styleguide/assets/server.css'
import icons from '../../../../styleguide/assets/icons.css'
import variables from '../../../../styleguide/assets/variables.css'

// Import font so CI has the same
import font from '@fontsource/roboto'

/**
 * Split the Appsidebar test in two for performances
 *
 * @param {boolean} compact make the appsidebar compact or not
 */
export default function(compact) {
	describe(`AppSidebar.vue ${compact ? '' : 'not '}in compact mode`, () => {
		'use strict'

		/**
		 * We need this custom style because we run the AppSidebar component without a Content component,
		 * which applies this rule:
		 * https://github.com/nextcloud/nextcloud-vue/blob/master/src/components/Content/Content.vue#L73-L75
		 */
		const style = `
			* {
				box-sizing: border-box;
			}
		`
		// Load the server CSS styles
		const cssFiles = [font, server, icons, variables]

		// Possible props and actions
		const title = 'Very long title that will certainly overflow the sidebar width'
		const subtitles = ['', 'Very long subtitle what will certainly overflow the sidebar width']
		const titleEditable = [false, true]
		const starred = [null, false, true]
		const header = ['', '<div style="background: no-repeat center/contain var(--icon-folder-000); height: 100%;" />']
		const secondary = ['', '<ActionButton icon="icon-delete">Action1</ActionButton><ActionButton icon="icon-delete">Action2</ActionButton>']

		const components = {
			ActionButton,
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
							const fileName = sanitize(`AppSidebar.vue
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
								style,
								cssFiles,
								extensions,
							}

							it('Renders ' + fileName, () => {
								mount(AppSidebar, defaultOptions)
								cy.get('.app-sidebar-header').compareSnapshot(fileName)
							})
						})
					})
				})
			})
		})
	})
}
