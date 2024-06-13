/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * @param {Function} callback The function to call
 * @param {number} delay The time to wait
 */
export default function timer(callback, delay) {
	let id
	let started
	let remaining = delay
	let running

	this.start = function() {
		running = true
		started = new Date()
		id = setTimeout(callback, remaining)
	}

	this.pause = function() {
		running = false
		clearTimeout(id)
		remaining -= new Date() - started
	}

	this.clear = function() {
		running = false
		clearTimeout(id)
		remaining = 0
	}

	this.getTimeLeft = function() {
		if (running) {
			this.pause()
			this.start()
		}

		return remaining
	}

	this.getStateRunning = function() {
		return running
	}

	this.start()
}
