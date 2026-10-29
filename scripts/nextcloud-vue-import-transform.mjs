/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import { resolve, join, extname } from 'node:path'

const silent = false

const log = (...args) => !silent && console.log(...args)

/**
 * Generate import from @nextcloud/vue/dist for a specific name
 *
 * @param {string} name - name of the import
 * @param {string} asName - name to import as
 * @return {string|null} import statement like `import NcButton as Button from '@nextcloud/vue/dist/Components/NcButton.js'`
 */
export function generateImportStatement(name, asName) {
	const doGenerateImportStatement = ({ name, asName, scope, filename = null, isDefault = true }) => {
		const importPath = `@nextcloud/vue/dist/${scope}/${filename ?? name}.js`
		const importName = isDefault
			? asName
			: name === asName
				? `{ ${name} }`
				: `{ ${name} as ${asName} }`
		return `import ${importName} from '${importPath}'\n`
	}

	const MIXIN_NAMES = ['clickOutsideOptions', 'isFullscreen', 'isMobile', 'richEditor', 'userStatus']
	const DIRECTIVE_NAMES = ['Focus', 'Linkify', 'Tooltip']
	const modulesMap = {
		Mixins: {
			richEditor: ['USERID_REGEX', 'USERID_REGEX_WITH_SPACE'],
		},
		Composables: {
			useIsFullscreen: ['isFullscreenState', 'useIsFullscreen'],
			useIsMobile: ['MOBILE_BREAKPOINT', 'MOBILE_SMALL_BREAKPOINT', 'isMobileState', 'useIsMobile', 'useIsSmallMobile'],
		},
		Functions: {
			a11y: ['isA11yActivation'],
			emoji: ['EmojiSkinTone', 'emojiAddRecent', 'emojiSearch', 'getCurrentSkinTone', 'setCurrentSkinTone'],
			reference: ['NcCustomPickerRenderResult', 'anyLinkProviderId', 'getLinkWithPicker', 'getProvider', 'getProviders', 'hasInteractiveView', 'isCustomPickerElementRegistered', 'isWidgetRegistered', 'registerCustomPickerElement', 'registerWidget', 'renderCustomPickerElement', 'renderWidget', 'searchProvider', 'sortProviders'],
			registerReference: ['NcCustomPickerRenderResult', 'destroyCustomPickerElement', 'destroyWidget', 'getCustomPickerElementSize', 'isCustomPickerElementRegistered', 'isWidgetRegistered', 'registerCustomPickerElement', 'registerWidget', 'renderCustomPickerElement', 'renderWidget'],
			// It is not a default import
			// usernameToColor: ['usernameToColor'],
		},
	}

	if (name.startsWith('Nc') && name !== 'NcCustomPickerRenderResult') {
		// import NcButton as Button from '@nextcloud/vue/dist/Components/NcButton.js'
		return doGenerateImportStatement({ name, asName, scope: 'Components' })
	} else if (DIRECTIVE_NAMES.includes(name)) {
		// import Focus as vFocus from '@nextcloud/vue/dist/Directives/Focus.js'
		return doGenerateImportStatement({ name, asName, scope: 'Directives' })
	} else if (MIXIN_NAMES.includes(name)) {
		// import richEditor as richEditorMixin from '@nextcloud/vue/dist/Mixins/richEditor.js'
		return doGenerateImportStatement({ name, asName, scope: 'Mixins' })
	} else if (name === 'usernameToColor') {
		// Special case, the only function with the default export
		// import usernameToColor from '@nextcloud/vue/dist/Functions/usernameToColor'
		return doGenerateImportStatement({ name, asName, scope: 'Functions' })
	} else {
		// import { isFullscreenState } from '@nextcloud/vue/dist/Composables/useIsFullscreen.js'
		for (const [scope, map] of Object.entries(modulesMap)) {
			const filename = Object.keys(map).find((key) => map[key].includes(name))
			if (filename) {
				return doGenerateImportStatement({ name, asName, scope, filename, isDefault: false })
			}
		}
	}

	// Not found...
	return null
}

/**
 * @typedef {object} ImportTransformResult
 * @property {boolean} hasChanges - whether content has anything changed
 * @property {string} output - transformed content
 * @property {string[]} unprocessedImports - list of imports that were not transformed
 */

/**
 * Replaces import with re-export to per-item imports for @nextcloud/vue in some content
 *
 * @param {string} content - source content
 * @return {ImportTransformResult} transformation result
 */
function transformImports(content) {
	// import { NcButton } from '@nextcloud/vue'
	//    -- or --
	// import { NcButton, NcDialog as Dialog } from '@nextcloud/vue'
	//    -- or --
	// import {
	//    NcButton,
	//    NcDialog as Dialog,
	// } from '@nextcloud/vue'
	const importFromReExportRE = /^import\s*{([\s\w,]+)}\s*from\s+'@nextcloud\/vue'\n/mg

	let hasChanges = false
	const unprocessedImports = []

	const output = content.replaceAll(importFromReExportRE, (_, importedItems) => {

		// NcButton
		// -- or --
		// NcButton, NcDialog as Dialog
		// -- or --
		// NcButton,
		// NcDialog as Dialog
		const importNameRE = /(\w+)(?:\s+as\s+(\w+))?(?:,|\s*$)/gi

		const newImports = []

		const oldImport = importedItems.replaceAll(importNameRE, (importItem, name, asName) => {
			asName ??= name
			const newImport = generateImportStatement(name, asName)
			if (newImport) {
				newImports.push(newImport)
				return ''
			} else {
				unprocessedImports.push(name)
				return importItem
			}
		}).trim()

		let transformedImports = ''
		if (oldImport) {
			transformedImports += oldImport.includes('\n')
				? `import {\n\t${oldImport}\n} from '@nextcloud/vue'\n`
				: `import { ${oldImport} } from '@nextcloud/vue'\n`
		}
		if (newImports.length) {
			transformedImports += newImports.join('')
			hasChanges = true
		}

		return transformedImports
	})

	return {
		hasChanges,
		output,
		unprocessedImports,
	}
}

/**
 * Transform import with re-export to per-item imports for @nextcloud/vue in a file
 *
 * @param {string} filepath - path to file
 * @param {object} options - options
 * @param {boolean} options.dry - do not write changes to file
 * @return {Promise<{ unprocessedImports: string[], hasChanges: boolean }>}
 */
async function transformImportsInFile(filepath, { dry } = { dry: true }) {
	const content = await readFile(filepath, 'utf8')
	const { hasChanges, output, unprocessedImports } = transformImports(content)

	if (hasChanges && !dry) {
		await writeFile(filepath, output, 'utf8')
	}

	return { unprocessedImports, hasChanges }
}

/**
 * Iterate over files in a directory recursively
 *
 * @param {string} root - root path to iterate over
 * @yields {string} path to a file
 */
async function * iterateOverFilesInDir(root) {
	const rootPath = resolve(root)
	const rootStats = await stat(rootPath)
	if (rootStats.isDirectory()) {
		const nodes = await readdir(root)
		for (const node of nodes) {
			const nodePath = join(root, node)
			for await (const child of iterateOverFilesInDir(nodePath)) {
				yield child
			}
		}
	} else if (rootStats.isFile()) {
		const ext = extname(root)
		if (!/^.(?:[mc]?[tj]s|vue)$/.test(ext)) {
			return
		}
		yield rootPath
	}
}

/**
 * Transform imports in all files in a directory
 *
 * @param {string} dir - path to root directory
 * @param {object} options - options
 * @param {boolean} options.dry - do not write changes to files
 */
async function transformImportsInDir(dir, { dry = true }) {
	const allUnprocessedImports = {}
	const directoryIterator = iterateOverFilesInDir(dir)
	for await (const file of directoryIterator) {
		const { unprocessedImports, hasChanges } = await transformImportsInFile(file, { dry })
		if (unprocessedImports.length) {
			allUnprocessedImports[file] = unprocessedImports
		} else if (hasChanges) {
			log(`✅ ${file} [transformed]`)
		} else {
			log(`👀 ${file} [checked]`)
		}
	}
	for (const [file, unprocessedImports] of Object.entries(allUnprocessedImports)) {
		log(`⚠️ ${file} [fix required]`)
		for (const unprocessedImport of unprocessedImports) {
			log('\t- ', unprocessedImport)
		}
	}
}

/**
 * Run CLI
 *
 * @param {string[]} args - CLI arguments
 */
async function cli(...args) {
	// Non-CLI usage
	if (!args.length) {
		return
	}

	if (args.includes('--help') || args.includes('-h')) {
		log(
			'Transforms imports from re-export "import { ... } from \'@nextcloud/vue\'" to per-item "import . \'@nextcloud/vue/dist/...\'\n'
			+ '\n'
			+ 'Usage: nextcloud-vue-import-transformer [target] [options]\n'
			+ '\n'
			+ 'Example:\n'
			+ '\tnextcloud-vue-import-transformer src\n'
			+ '\n'
			+ 'Arguments:\n'
			+ '\t--help, -h\tShow this help\n'
			+ '\t--dry, -d\tDo not write changes to files\n',
		)
		return
	}

	const [target, ...flags] = args

	if (!target) {
		throw new Error('No target specified')
	}

	const targetPath = resolve(process.cwd(), target)
	const dry = flags.includes('--dry') || flags.includes('-d')

	log('Transforming imports in', targetPath)

	await transformImportsInDir(targetPath, { dry })
}

await cli(...process.argv.slice(2))
