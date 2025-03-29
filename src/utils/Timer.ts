/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import logger from './logger.ts'

/**
 * @param {Function} callback The function to call
 * @param {number} delay The time to wait
 */
export class Timer {

	private _callback: () => void
	private _interval: number
	private _remainingTime: number
	private _startingTime: number
	private _timeoutId: number | null

	/**
	 *
	 * @param callback - The callback to invoke
	 * @param interval - The interval in which to call the callback (in ms)
	 */
	constructor(callback: () => void, interval: number) {
		this._callback = callback
		this._interval = interval
		this._timeoutId = null
		this._startingTime = 0
		this._remainingTime = interval
	}

	/**
	 * Start or resume the timer.
	 */
	public start(): void {
		if (!this.isRunning) {
			this._timeoutId = window.setTimeout(() => this._onTimeout(), this._remainingTime)
			this._startingTime = Date.now()
		}
	}

	/**
	 * Pause the current timer.
	 */
	public pause(): void {
		if (this._timeoutId) {
			window.clearTimeout(this._timeoutId)
			this._timeoutId = null
			this._remainingTime = Math.max(0, this._interval - (Date.now() - this._startingTime))
		}
	}

	/**
	 * Stop and clear the timer.
	 */
	public clear() {
		this.pause()
		this._remainingTime = this._interval
	}

	/**
	 * Running state of the timer.
	 */
	public get isRunning(): boolean {
		return this._timeoutId !== null
	}

	private _onTimeout(): void {
		try {
			this._callback()
		} catch (error) {
			logger.warn('Exception during timer callback', { error })
		}
		// This can happen if the timer object gets out-of-scope so it is garbage collected
		// then this is undefined and we shall not re-add the timeout
		if (this) {
			this._timeoutId = window.setTimeout(() => this._onTimeout(), this._interval)
		}
	}

}
