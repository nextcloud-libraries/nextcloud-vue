/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DefaultTheme } from 'vitepress'

import { globSync } from 'glob'
import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { DOCS, listComponents } from './components.ts'

interface ComponentGroup {
	/** Name shown in the sidebar */
	text: string
	/** Optional page with an introduction for this group */
	link?: string
	/** Name patterns (`*` as wildcard) of the components in this group, the order defines the order in the sidebar */
	components: string[]
}

/**
 * Groups of related components.
 * Every component not matched by any group is listed on the top level.
 */
const componentGroups: ComponentGroup[] = [
	{
		text: 'App containers',
		link: '/app-containers',
		components: ['NcContent', 'NcGuestContent', 'NcAppContent', 'NcAppContent*', 'NcAppNavigation', 'NcAppNavigation*', 'NcAppSidebar', 'NcAppSidebar*', 'NcAppSettings*'],
	},
	{ text: 'NcActions', components: ['NcActions', 'NcAction*'] },
	{ text: 'Nextcloud Assistant', components: ['NcAssistant*'] },
	{ text: 'NcBreadcrumbs', components: ['NcBreadcrumbs', 'NcBreadcrumb'] },
	{ text: 'NcDashboard', components: ['NcDashboard*'] },
	{ text: 'NcDialog', components: ['NcDialog', 'NcDialog*'] },
	{ text: 'NcFormBox', components: ['NcFormBox', 'NcFormBox*', 'NcFormGroup'] },
	{ text: 'NcFields', components: ['Nc*Field', 'NcTextArea'] },
	{ text: 'NcHeader', components: ['NcHeader*'] },
	{ text: 'NcListItems', components: ['NcListItem', 'NcListItem*'] },
	{ text: 'NcPickers', components: ['Nc*Picker*'] },
	{ text: 'NcRadioGroup', components: ['NcRadioGroup', 'NcRadioGroup*'] },
	{ text: 'NcRichText', components: ['NcRichText', 'NcRichContenteditable'] },
	{ text: 'NcSelect', components: ['NcSelect', 'NcSelect*'] },
	{ text: 'NcSettings', components: ['NcSettings*'] },
]

const toRegExp = (pattern: string) => new RegExp(`^${pattern.replaceAll('*', '\\w*')}$`)

/**
 * Get the sidebar entries for all components
 */
export function componentsSidebar(): DefaultTheme.SidebarItem[] {
	const remaining = new Set(listComponents().map(({ name }) => name))
	const link = (name: string) => ({ text: name, link: `/components/${name}` })

	const items: { sortKey: string, item: DefaultTheme.SidebarItem }[] = []
	for (const group of componentGroups) {
		const members: string[] = []
		for (const pattern of group.components) {
			const regexp = toRegExp(pattern)
			const matches = [...remaining].filter((name) => regexp.test(name)).sort()
			for (const name of matches) {
				members.push(name)
				remaining.delete(name)
			}
		}
		if (members.length > 0) {
			items.push({
				sortKey: group.link ? '' : members[0]!,
				item: {
					text: group.text,
					link: group.link,
					collapsed: true,
					items: members.map(link),
				},
			})
		}
	}
	items.push(...[...remaining].map((name) => ({ sortKey: name, item: link(name) })))

	return items
		.sort((a, b) => a.sortKey.localeCompare(b.sortKey))
		.map(({ item }) => item)
}

/**
 * Sidebar entries for all markdown pages within a directory of the docs
 *
 * @param dir - The directory relative to the docs root
 */
export function pagesSidebar(dir: string): DefaultTheme.SidebarItem[] {
	return globSync(`${dir}/*.md`, { cwd: DOCS })
		.sort()
		.map((file) => {
			const title = readFileSync(join(DOCS, file), 'utf8').match(/^# (.+)$/m)?.[1] ?? basename(file, '.md')
			return { text: title, link: `/${file.replace(/\.md$/, '')}` }
		})
}
