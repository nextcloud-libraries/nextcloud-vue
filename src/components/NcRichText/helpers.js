/**
 * Regex pattern to match links to be resolved by the link-reference provider
 *
 * @type {RegExp}
 */
export const URL_PATTERN = /(\s|\(|^)(https?:\/\/)((?:[-A-Z0-9+_]+\.)+[-A-Z]+(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*)(\s|\)|$)/ig

/**
 * Regex pattern to identify strings as links and then making them clickable
 * Opposed to the above regex this one also matches IP addresses, which we would like to be clickable,
 * but in general resolving references for them might mostly not work,
 * as the link provider checks for local addresses and does not resolve them.
 *
 * @type {RegExp}
 */
export const URL_PATTERN_AUTOLINK = /(\s|\(|^)((https?:\/\/)((?:[-A-Z0-9+_]+\.)+[-A-Z0-9]+(?::[0-9]+)?(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*))(?=\s|\)|$)/ig
