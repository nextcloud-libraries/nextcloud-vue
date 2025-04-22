/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Meta, StoryObj } from "@storybook/vue3"
import type { Component } from "vue"

import { Canvas as StorybookCanvas } from "@storybook/blocks"
import { h } from "vue"

/**
 * Create a story from a Vue story file.
 *
 * @param name - Name of the story
 */
export async function makeStory<T extends StoryObj>(vueComponent: Promise<{ default: Component }>, source: Promise<{ default: string }>) {
	const { default: component } = await vueComponent
	const { default: sourceCode } = await source

	const vueStorySource = sourceCode.replaceAll(
		/import (Nc\S+) from '\.\.\/.+/g,
		'import $1 from \'@nextcloud/vue/components/$1\'',
	)

	return {
		render: (args) => ({
			render: () => h(component, { ...args }),
		}),


		vueStorySource,
		tags: ['autodocs'],
	} as unknown as T & { vueStorySource: string }
}

type CanvasProps = Parameters<typeof StorybookCanvas>[0]
export const Canvas = (props: CanvasProps) => StorybookCanvas({ ...props, source: { code: props.of.vueStorySource, language: 'html' } })
