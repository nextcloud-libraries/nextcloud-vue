import * as path from "path";
import * as fs from 'fs'
import { fileURLToPath } from "url";
import { defineConfig } from "vitepress";
// Not supported with vite4, wait for next release "vitepress-plugin-search": "^1.0.4-alpha.16",
// import { SearchPlugin } from 'vitepress-plugin-search'
import PackageJSON from '../../package.json'
import hljs from 'highlight.js/lib/common'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const version = PackageJSON.version
const docsPath = path.resolve(__dirname, '../docs')

/**
 * Generate list of all components grouped by functionality for sidebar menu
 * 
 * @returns {import('vitepress').DefaultTheme.SidebarItem[]}
 */
function getComponents() {
	const sections = {}

	fs.readdirSync(path.resolve(docsPath, 'components'))
		.forEach(file => {
			const name = file.replace('.md', '')
			const words = name.split(/(?=[A-Z])/)
			const section = words
				.slice(0, (words[1] === 'App' && words.length >= 3 ? 3 : 2))
				.join('')
				.replace(/s$/, '') // fix NcActions
			if (!(section in sections)) sections[section] = []
			sections[section].push(name)
		})

	return Object.keys(sections)
		.sort()
		.map(section => {
			// Get base component as first entry, sort is not enogh because of `NcActions` vs `NcActionX`
			const first = sections[section].sort((p, q) => p.length - q.length)[0]
			const other = sections[section].filter(p => p !== first).sort()
			return {
				text: section,
				items: [
					first,
					...other
				].map(file => ({ text: file, link: `/components/${file}` }))
			}
		})
}

export default defineConfig({
	title: '@nextcloud/vue',
	description: 'Vue.js components for Nextcloud app development',

	ignoreDeadLinks: true,

	themeConfig: {
		logo: 'https://nextcloud.com/wp-content/uploads/2022/10/nextcloud-logo-blue-transparent.svg',
		nav: [
			{
				text: `${version}`, items: [
					{ text: 'Changelog', link: `https://github.com/nextcloud/nextcloud-vue/blob/v${version}/CHANGELOG.md` },
				]
			},
		],
		sidebar: [
			{
				text: 'Components',
				collapsible: true,
				collapsed: true,
				items: getComponents(),
			},
			{
				items: [{
					text: 'Directives',
					link: '/directives'
				}]
			},
		],
		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/nextcloud/nextcloud-vue'
			}
		],
	},

	outDir: '../styleguide',
	vite: {
		plugins: [vueDocsPlugin /*, SearchPlugin()*/],
	},

	markdown: {
		highlight: (str, language, attr) => `<pre ${attr} v-pre><code>${hljs.highlight(str, { language: language === 'vue' || language === '' ? 'xml' : language }).value}</code></pre>`
	},

	vite: {
		root: docsPath,
		plugins: [SearchPlugin()],
		resolve: {
			alias: [
				{
					find: 'vue/server-renderer',
					replacement: "node_modules/vue/server-renderer/index.mjs"
				},
				{
					find: '@vue/server-renderer',
					replacement: "node_modules/@vue/server-renderer/dist/server-renderer.esm-bundler.js"
				}
			]
		}
	}
})
