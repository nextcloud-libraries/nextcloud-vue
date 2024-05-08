/**
 * Regex pattern to match links to be resolved by the link-reference provider
 *
 * @type {RegExp}
 */
export const URL_PATTERN =
	/(\s|^)(https?:\/\/)([-A-Z0-9+_.]+(?::[0-9]+)?(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*)(\s|$)/gi

/**
 * Regex pattern to identify strings as links and then making them clickable
 *
 * @type {RegExp}
 */
export const URL_PATTERN_AUTOLINK =
	/(\s|\(|^)((https?:\/\/)([-A-Z0-9+_.]+[-A-Z0-9]+(?::[0-9]+)?(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*))(?=\s|\)|$)/gi
