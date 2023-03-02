export const URL_PATTERN = /(\s|^)(https?:\/\/)((?:[-A-Z0-9+_]+\.)+[-A-Z]+(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*)(\s|$)/ig

// FIXME See if we can merge those two
export const URL_PATTERN_AUTOLINK = /(\s|\(|^)((https?:\/\/)((?:[-A-Z0-9+_]+\.)+[-A-Z]+(?::[0-9]+)?(?:\/[-A-Z0-9+&@#%?=~_|!:,.;()]*)*))(?=\s|\)|$)/ig
