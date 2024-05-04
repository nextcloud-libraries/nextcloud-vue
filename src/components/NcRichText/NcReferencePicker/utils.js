let mytimer = 0
/**
 *
 * @param {Function} callback The callback to call after the delay
 * @param {number} ms The delay in milli-seconds
 */
export function delay(callback, ms) {
	return function () {
		const context = this
		const args = arguments
		clearTimeout(mytimer)
		mytimer = setTimeout(function () {
			callback.apply(context, args)
		}, ms || 0)
	}
}
/**
 *
 * @param {string} str The url
 */
export function isUrl(str) {
	try {
		return Boolean(new URL(str))
	} catch (error) {
		return false
	}
}
