/*!
 * Check if an element is out of the viewport
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}  elem The element to check
 * @return {Object}     A set of booleans for each side of the element
 */
const isOutOfViewport = function (elem) {
	// Get element's bounding
	const bounding = elem.getBoundingClientRect()
	const contentHeight = document.documentElement.clientHeight
	const contentWidth = document.documentElement.clientWidth

	// Check if it's out of the viewport on each side
	const out = Object.assign({})
	out.top = bounding.top < 0
	out.left = bounding.left < 0
	out.bottom = bounding.bottom > contentHeight
	out.right = bounding.right > contentWidth
	out.any = out.top || out.left || out.bottom || out.right
	out.all = out.top && out.left && out.bottom && out.right

	out.offsetY = out.top
		? bounding.top
		: out.bottom
			? bounding.bottom - contentHeight
			: 0
	out.offsetX = out.left
		? bounding.left
		: out.right
			? bounding.right - contentWidth
			: 0

	return out
}

export default isOutOfViewport
