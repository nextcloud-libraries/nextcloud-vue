const { defineConfig } = require('vue-docgen-cli')
const fs = require('fs')

const generatePages = () => {
	const path = 'src/components'
	return fs.readdirSync(path)
		.filter(file => fs.statSync(`${path}/${file}`).isDirectory())
		.map(file => {
			return {
				components: `${file}/*.vue`,
				outFile: `${file}.md`,
			}
		})
}

module.exports = defineConfig({
	componentsRoot: 'src/components',
	docsRepo: 'nextcloud/nextcloud-vue',
	docsBranch: 'master',
	editLinkLabel: 'Fork me on GitHub',
	outDir: 'docs/components',

	pages: generatePages(),
})
