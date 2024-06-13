/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { shallowMount } from '@vue/test-utils'
import NcIconSvgWrapper from '../../../../src/components/NcIconSvgWrapper/index.js'

// @mdi/check.svg
const SVG_ICON = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-check" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /></svg>'

const SVG_ICON_SNAPSHOT = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
</svg>`

/**
 * @param {NcIconSvgWrapper.props} propsData - NcIconSvgWrapper.props
 */
function mountNcIconSvgWrapper(propsData) {
	return shallowMount(NcIconSvgWrapper, { propsData })
}

describe('NcIconSvgWrapper', () => {
	it('should render SVG from svg prop in a span', () => {
		const wrapper = mountNcIconSvgWrapper({ svg: SVG_ICON })
		const svg = wrapper.find('svg')
		expect(svg.exists()).toBeTruthy()
		expect(svg.html()).toBe(SVG_ICON_SNAPSHOT)
	})

	it('should render SVG in a span with aria-hidden when no name is provided', () => {
		const wrapper = mountNcIconSvgWrapper({ svg: SVG_ICON })
		expect(wrapper.attributes('aria-hidden')).toBe('true')
		expect(wrapper.attributes('aria-label')).not.toBeDefined()
	})

	it('should render SVG in a span with aria-label when name is provided', () => {
		const wrapper = mountNcIconSvgWrapper({ svg: SVG_ICON, name: 'Check' })
		expect(wrapper.attributes('aria-hidden')).not.toBeDefined()
		expect(wrapper.attributes('aria-label')).toBe('Check')
	})

	it('should remove ID from rendered SVG', () => {
		const wrapper = mountNcIconSvgWrapper({ svg: SVG_ICON })
		const svg = wrapper.get('svg')
		expect(svg.attributes('id')).not.toBeDefined()
	})

	it('should sanitize SVG', () => {
		const svgWithXSS = `<svg xmlns="http://www.w3.org/2000/svg" id="mdi-check" viewBox="0 0 24 24">
            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            <script type="text/javascript">
                alert("This is an example of a stored XSS attack in an SVG image")
            </script>
        </svg>`
		const wrapper = mountNcIconSvgWrapper({ svg: svgWithXSS })
		const svg = wrapper.get('svg')
		expect(svg.find('script').exists()).toBeFalsy()
	})
})
