/**
 * Copyright (c) Zeste de Savoir (https://zestedesavoir.com)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Patched version of https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-disable-tokenizers
 * to avoid newline issues described in https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-disable-tokenizers
 */

import clone from 'clone'

const noop = () => false

const throwing = (msg) =>
	() => {
		throw new Error(msg)
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
				if (Array.isArray(key)) return block.map(xs => xs[0]).includes(key[0])
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
				if (Array.isArray(key)) return inline.map(xs => xs[0]).includes(key[0])
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
