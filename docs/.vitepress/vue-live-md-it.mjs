/// @ts-check
import { parse, compileScript } from '@vue/compiler-sfc'

function addVueLive(md, opts) {
	const fence = md.renderer.rules.fence
	md.renderer.rules.fence = (...args) => {
		const [tokens, idx] = args
		const token = tokens[idx]
		const lang = token.info.trim()

		// Only handle `vue`, `vue live`, or code without type
		if (lang && lang !== 'vue' && lang !== 'vue live') {
			return fence(...args)
		}

		const getImports = code => {
			// script is at the beginning of a line after a return
			// In case we are loading a vue component as an example, extract script tag
			return [...code.matchAll(/\s*import\s+([^\s]+)\s+from +["']([^'"]+)["'][\s;]*\n/g)].map(match => [match[1], match[2]])
		}

		const code = token.content

		// analyze code to find requires
		// put all requires into a "requires" object
		// add this as a prop
		const imports = getImports(code)
		const requires = imports.map(mod => `"${mod[1]}": import("../../node_modules/${mod[1]}${mod[1].startsWith('vue-material-design') ? '.vue' : ''}")`)
		const langArray = lang.split(' ')
		const langClean = langArray[0]
		const codeClean = md.utils.escapeHtml(code).replace(/\`/g, '\\`').replace(/\$/g, '\\$')
		const editorProps = langArray.find(l => /^\{.+\}$/.test(l))
		const jsx = langArray.length > 2 && langArray[1] === 'jsx' ? 'jsx ' : '' // to enable jsx, we want ```vue jsx live or ```jsx jsx live
		const markdownGenerated = `<vue-live ${jsx}
      :layoutProps="{lang:'${langClean}'}" 
      :code="\`${codeClean}\`"
	  :requires='{${requires.join(',')}}'
      ${editorProps ? ` :editorProps="${editorProps}"` : ''}
       />`
		return markdownGenerated
	}
}

export default addVueLive
