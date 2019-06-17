import '@babel/polyfill'
import Vue from 'vue'
import VTooltip from './../src/directives/Tooltip'

window.OC = {
	getCurrentUser() {
		return {
			uid: 'admin',
			displayName: 'Administrator'
		}
	},
	generateUrl() {
		return 'https://nextcloud.com/wp-content/themes/next/assets/img/common/nextcloud-square-logo.png'
	}
}
window.OCA = {}

window.t = (app, text) => text

Vue.prototype.t = window.t
Vue.prototype.OC = window.OC
Vue.prototype.OCA = window.OCA

Vue.directive('tooltip', VTooltip)
