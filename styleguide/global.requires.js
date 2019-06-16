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

window.t = (app, text) => text

Vue.directive('tooltip', VTooltip)
