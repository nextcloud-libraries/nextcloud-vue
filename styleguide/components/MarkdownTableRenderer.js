/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { TableRenderer } from 'rsg-components-default/Markdown/Table/TableRenderer'
import Styled from 'rsg-components/Styled'

/**
 * The table of the Markdown documentation, under its own name.
 *
 * Styleguidist caches a stylesheet by the name of the component it styles. The
 * Markdown table and the props, events and slots table are both called
 * `TableRenderer`, so they shared one sheet: whichever rendered first in a
 * session styled both, and a page with a table in its documentation left every
 * props table after it without padding, borders or column widths.
 *
 * @param {object} props The props of the Markdown table
 */
function MarkdownTableRenderer(props) {
	return TableRenderer(props)
}

/**
 * The styles of the original Markdown table.
 *
 * @param {object} theme The styleguide theme
 * @param {number[]} theme.space The spacing scale
 */
function styles({ space }) {
	return {
		table: {
			marginTop: 0,
			marginBottom: space[2],
			borderCollapse: 'collapse',
		},
	}
}

export default Styled(styles)(MarkdownTableRenderer)
