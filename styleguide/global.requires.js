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

window.NextcloudVueDocs = {
	tags: '<?xml version="1.0"?><d:multistatus xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns"><d:response><d:href>/remote.php/dav/systemtags/</d:href><d:propstat><d:prop><oc:id/><oc:display-name/><oc:user-visible/><oc:user-assignable/><oc:can-assign/></d:prop><d:status>HTTP/1.1 404 Not Found</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/7</d:href><d:propstat><d:prop><oc:id>7</oc:id><oc:display-name>tag1</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/2</d:href><d:propstat><d:prop><oc:id>2</oc:id><oc:display-name>tag2</oc:display-name><oc:user-visible>false</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/3</d:href><d:propstat><d:prop><oc:id>3</oc:id><oc:display-name>tag3</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/4</d:href><d:propstat><d:prop><oc:id>4</oc:id><oc:display-name>important</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>true</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/1</d:href><d:propstat><d:prop><oc:id>1</oc:id><oc:display-name>secret</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>false</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/5</d:href><d:propstat><d:prop><oc:id>5</oc:id><oc:display-name>test</oc:display-name><oc:user-visible>true</oc:user-visible><oc:user-assignable>false</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/dav/systemtags/6</d:href><d:propstat><d:prop><oc:id>6</oc:id><oc:display-name>test2</oc:display-name><oc:user-visible>false</oc:user-visible><oc:user-assignable>false</oc:user-assignable><oc:can-assign>true</oc:can-assign></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response></d:multistatus>'
}

Vue.directive('tooltip', VTooltip)
