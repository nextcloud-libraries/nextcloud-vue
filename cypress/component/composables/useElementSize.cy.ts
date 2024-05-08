/**
 * SPDX-FileCopyrightText: 2024 Max <max@nextcloud.com>
 * SPDX-License-Identifier: @license AGPL-3.0-or-later
 *
 * This is a cypress test because useElementSize needs a proper browser.
 * The size of elements cannot be measured in environments like jsdom
 * as they only stub geometry related functions such as resizeObserver.
 */


import { computed, isRef, ref } from 'vue'
import { useElementSize } from '../../../src/composables/useElementSize/index.ts'

const StyleableComponent = {
	props: { style: Object },
	setup() {
		const widgetRoot = ref()
		const { width, height } = useElementSize(widgetRoot)
		return { widgetRoot, width, height }
	},
	template: '<div class="test" :style="style" ref="widgetRoot" />',
}

describe('useElementSize', () => {
	it('returns refs', () => {
		const { width, height } = useElementSize()
		expect(isRef(width)).to.be.true
		expect(isRef(height)).to.be.true
	})

	it('defaults to 0', () => {
		const { width, height } = useElementSize()
		expect(width.value).to.be.equal(0)
		expect(height.value).to.be.equal(0)
	})

	it('measures the size', () => {
		const style = { width: '100px', height: '200px' }
		cy.mount(StyleableComponent, { propsData: { style } })
			.its('component').as('component')
		cy.get('@component').its('width').should('equal', 100)
		cy.get('@component').its('height').should('equal', 200)
	})

	it('updates the size', () => {
		const style = ref({ width: '123px', height: '200px' })
		cy.mount(StyleableComponent, { propsData: { style } })
			.its('component').as('component')
		cy.get('@component').its('width').should('equal', 123)
		cy.get('@component').its('height').should('equal', 200)
		cy.then(() => style.value.width = '246px')
		cy.then(() => style.value.height = '400px')
		cy.get('@component').its('width').should('equal', 246)
		cy.get('@component').its('height').should('equal', 400)
	})

})

