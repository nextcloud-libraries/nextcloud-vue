import { mount } from 'cypress/vue2'
import Vue, { defineComponent } from 'vue'
import VueRouter from 'vue-router'

import NcAppNavigationItem from '../../src/components/NcAppNavigationItem/NcAppNavigationItem.vue'

describe('NcAppNavigationItem', () => {
	describe('With router link', () => {
		const RouterComponent = defineComponent({
			template: '<div style="width: 300px; background: white;"><NcAppNavigationItem name="Home" to="/" :editable="true" /><NcAppNavigationItem name="Foo" to="/foo" :editable="true" /></div>',
			components: { NcAppNavigationItem },
		})

		const router = new VueRouter({
			routes: [
				{ path: '/' },
				{ path: '/foo' },
			],
		})

		beforeEach(() => {
			Vue.use(VueRouter)

			mount(RouterComponent as never, {
				extensions: {
					plugins: [router],
				},
				router,
			})
		})

		it('has tertiary styling on non active route', () => {
			cy.contains('.app-navigation-entry', 'Foo').compareSnapshot('NcAppNavigationItem-tertiary-non-active-route')
		})

		it('has primary styling on active route', () => {
			cy.contains('.app-navigation-entry', 'Home').compareSnapshot('NcAppNavigationItem-primary-on-active-route')
		})

		it('has primary button styling on active route with editing=true', () => {
			cy.contains('.app-navigation-entry', 'Home').find('.app-navigation-entry__actions').click()
			cy.get('.app-navigation-entry--editing').compareSnapshot('NcAppNavigationItem-primary-on-active-route-menu-active')
		})
	})
})
