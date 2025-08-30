/**
 * SPDX-FileCopyrightText: Zeste de Savoir (https://zestedesavoir.com)
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

/**
 * Patched version of https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-disable-tokenizers
 * to avoid newline issues described in https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-disable-tokenizers
 */

import clone from 'clone'

const noop = () => false

function throwing(msg) {
	return () => {
		throw new Error(msg)
	}
}

/**
 *
 * @param {object} root0 The object to destructure
 * @param {Array} root0.block The array containing blocks
 * @param {Array} root0.inline The array containline inline
 */
function ignore({ block = [], inline = [] } = {}) {
	if (block.length) {
		block
			.filter((key) => {
				if (Array.isArray(key)) { return block.map((xs) => xs[0]).includes(key[0]) }
				return block.includes(key)
			})
			.forEach((key) => {
				if (Array.isArray(key) && key.length === 2) {
					this.Parser.prototype.blockTokenizers[key[0]] = throwing(key[1])
				} else {
					this.Parser.prototype.blockTokenizers[key] = noop
				}
			})
	}

	if (inline.length) {
		inline
			.filter((key) => {
				if (Array.isArray(key)) { return inline.map((xs) => xs[0]).includes(key[0]) }
				return inline.includes(key)
			})
			.forEach((key) => {
				let tokenizerName
				let replacer
				if (Array.isArray(key) && key.length === 2) {
					tokenizerName = key[0]
					replacer = throwing(key[1])
				} else {
					tokenizerName = key
					replacer = clone(noop)
				}
				if (this.Parser.prototype.inlineTokenizers[tokenizerName]) {
					Object
						.keys(this.Parser.prototype.inlineTokenizers[tokenizerName])
						.forEach((prop) => {
							replacer[prop] = this.Parser.prototype.inlineTokenizers[tokenizerName][prop]
						})
				}
				this.Parser.prototype.inlineTokenizers[tokenizerName] = replacer
			})
	}
}

export default ignore
