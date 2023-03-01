let mytimer = 0
/**
 *
 * @param callback
 * @param ms
 */
export function delay(callback, ms) {
	return function() {
		const context = this
		const args = arguments
		clearTimeout(mytimer)
		mytimer = setTimeout(function() {
			callback.apply(context, args)
		}, ms || 0)
	}
}
/**
 *
 * @param str
 */
export function isUrl(str) {
	try {
		return Boolean(new URL(str))
	} catch (error) {
		return false
	}
}
