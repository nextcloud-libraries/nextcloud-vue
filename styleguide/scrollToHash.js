/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// vue-styleguidist scrolls the window to the section from the `?id=` hash parameter, which does not work here:
// - the page content is scrolled inside `#rsg-root .rsg--root-1`, not the window (see assets/styleguide.css)
// - React renders asynchronously, so a section on another page is not in the DOM yet when the hash changes

const MAX_ATTEMPTS = 60

/**
 * Scroll to the section from the `?id=` hash parameter, or to the top of the page if there is none
 */
function scrollToHash() {
	const id = new URLSearchParams(window.location.hash.split('?')[1]).get('id')
	let attempts = 0

	const tryScroll = () => {
		if (!id) {
			document.querySelector('#rsg-root .rsg--root-1')?.scrollTo(0, 0)
			return
		}

		const element = document.getElementById(id)
		if (element) {
			element.scrollIntoView()
		} else if (++attempts < MAX_ATTEMPTS) {
			requestAnimationFrame(tryScroll)
		}
	}

	requestAnimationFrame(tryScroll)
}

window.addEventListener('hashchange', scrollToHash)
window.addEventListener('load', scrollToHash)
