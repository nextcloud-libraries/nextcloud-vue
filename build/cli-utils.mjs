/*
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
/* eslint-disable no-console */

/**
 * Generic command-line helpers shared by the build scripts: coloured terminal
 * output, fail-fast subprocess runners and keyboard-driven prompts. Nothing
 * here is specific to the release process.
 */

import { spawnSync } from 'node:child_process'
import process, { stdin, stdout } from 'node:process'
import { emitKeypressEvents } from 'node:readline'

// --- Terminal helpers ------------------------------------------------------
export const c = {
	info: (m) => console.info(`\x1b[1;34m➜\x1b[0m ${m}`),
	ok: (m) => console.info(`\x1b[1;32m✔\x1b[0m ${m}`),
	warn: (m) => console.warn(`\x1b[1;33m!\x1b[0m ${m}`),
	err: (m) => console.error(`\x1b[1;31m✖\x1b[0m ${m}`),
}

/**
 * Run a command, inheriting stdio, and exit the process on failure.
 *
 * @param {string} cmd command to run
 * @param {string[]} args arguments
 * @param {object} [options] extra spawn options; `capture` pipes stdout back
 * @return {string} captured stdout (trimmed) when `capture` is set, else ''
 */
export function run(cmd, args, options = {}) {
	const { capture = false, ...rest } = options
	const result = spawnSync(cmd, args, {
		encoding: 'utf-8',
		stdio: capture ? ['inherit', 'pipe', 'inherit'] : 'inherit',
		...rest,
	})
	if (result.status !== 0) {
		c.err(`Command failed: ${cmd} ${args.join(' ')}`)
		process.exit(result.status ?? 1)
	}
	return capture ? (result.stdout ?? '').trim() : ''
}

/**
 * Run a command only to read its output, returning null on failure.
 *
 * @param {string} cmd command to run
 * @param {string[]} args arguments
 * @param {object} [options] extra spawn options
 * @return {string|null} trimmed stdout, or null if the command failed
 */
export function tryRead(cmd, args, options = {}) {
	const result = spawnSync(cmd, args, { encoding: 'utf-8', ...options })
	return result.status === 0 ? (result.stdout ?? '').trim() : null
}

/**
 * Prompt with an arrow-key list (↑/↓ or k/j, Enter to pick, Esc/Ctrl+C to
 * abort). Returns the default without prompting when autoYes is set or stdin is
 * not a TTY, so callers still run unattended.
 *
 * @param {string} question the prompt to display
 * @param {Array<{label: string, value: boolean|string}>} choices the selectable options
 * @param {object} [options] prompt options
 * @param {boolean|string} [options.defaultValue] value highlighted first / used non-interactively
 * @param {boolean} [options.autoYes] skip the prompt and return the default
 * @return {Promise<boolean|string>} the chosen value
 */
export function select(question, choices, { defaultValue, autoYes = false } = {}) {
	let index = choices.findIndex((choice) => choice.value === defaultValue)
	if (index === -1) {
		index = 0
	}

	if (autoYes || !stdin.isTTY) {
		const reason = autoYes ? 'auto-confirm' : 'non-interactive shell'
		c.info(`${question} — ${choices[index].label} (auto-selected, ${reason})`)
		return Promise.resolve(choices[index].value)
	}

	return new Promise((resolve) => {
		const render = (first) => {
			if (!first) {
				stdout.write(`\x1b[${choices.length}A`) // move back up to redraw the list
			}
			for (const [i, choice] of choices.entries()) {
				const active = i === index
				const pointer = active ? '\x1b[1;36m❯\x1b[0m' : ' '
				const label = active ? `\x1b[1;36m${choice.label}\x1b[0m` : choice.label
				stdout.write(`\x1b[2K${pointer} ${label}\n`)
			}
		}

		const cleanup = () => {
			stdin.removeAllListeners('keypress')
			stdin.setRawMode(false)
			stdin.pause()
		}

		const onKeypress = (_str, key) => {
			if (key.name === 'up' || key.name === 'k') {
				index = (index - 1 + choices.length) % choices.length
				render(false)
			} else if (key.name === 'down' || key.name === 'j') {
				index = (index + 1) % choices.length
				render(false)
			} else if (key.name === 'return' || key.name === 'enter') {
				cleanup()
				// Replace the header + list with a one-line summary.
				stdout.write(`\x1b[${choices.length + 1}A\x1b[0J`)
				stdout.write(`\x1b[1;32m✔\x1b[0m ${question} \x1b[1;36m${choices[index].label}\x1b[0m\n`)
				resolve(choices[index].value)
			} else if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
				cleanup()
				c.err('Aborted.')
				process.exit(130)
			}
		}

		stdout.write(`\x1b[1;36m?\x1b[0m ${question} \x1b[2m(↑/↓ to move, Enter to select)\x1b[0m\n`)
		emitKeypressEvents(stdin)
		stdin.setRawMode(true)
		stdin.resume()
		render(true)
		stdin.on('keypress', onKeypress)
	})
}

/**
 * Ask a yes/no question via an arrow-key select.
 *
 * @param {string} question the prompt to display
 * @param {object} [options] prompt options
 * @param {boolean} [options.autoYes] skip the prompt and confirm automatically
 * @return {Promise<boolean>} true when the user confirms
 */
export function confirm(question, { autoYes = false } = {}) {
	return select(question, [
		{ label: 'Yes', value: true },
		{ label: 'No', value: false },
	], { defaultValue: true, autoYes })
}
