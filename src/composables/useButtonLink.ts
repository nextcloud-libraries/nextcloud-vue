/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MaybeRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { computed, inject, reactive } from 'vue'
import { routerKey } from 'vue-router'

type ButtonLinkProps = {
	// Required - general link props

	/**
	 * RouterLink's to props and a trigger to use RouterLink.
	 * Note: This takes precedence over the href attribute.
	 */
	to: MaybeRef<RouteLocationRaw | undefined>
	/**
	 * HyperLink href attribute and a trigger to use <a> hyperlink.
	 */
	href: MaybeRef<string | undefined>
	/**
	 * Define additional attributes, based on the tag
	 */
	additionalAttrs?: (tag: 'RouterLink' | 'a' | 'button') => object | undefined

	// RouterLink props

	/**
	 * RouterLink's activeClass prop
	 */
	activeClass?: MaybeRef<string | undefined>

	// Hyperlink

	/**
	 * <a> hyperlink's target attribute
	 */
	target?: MaybeRef<AnchorHTMLAttributes['target'] | undefined>
	/**
	 * <a> hyperlink's download attribute
	 */
	download?: MaybeRef<string | boolean | undefined>

	// Button

	/**
	 * <button> element's type attribute, but default to "button" instead of "submit"
	 */
	type?: MaybeRef<ButtonHTMLAttributes['type'] | undefined>
	/**
	 * <button> element's disabled attribute
	 */
	disabled?: MaybeRef<boolean | undefined>
}

/**
 * Reusable implementation of an interactive button-like element that can be a link or a button
 *
 * @param options - Props to determine the button/link behavior. Can be a reactive object, or an object with nested refs, or mixed.
 */
export function useButtonLink(options: ButtonLinkProps) {
	// Resolve all MaybeRef-s values and maybe reactive object via unwrapping
	const props = reactive(options)

	const hasVueRouterContext = inject(routerKey, null) !== null

	/**
	 * Tag name to be used
	 */
	const tag = computed(() => {
		// TODO: should we warn if props.to is provided but there is no vue-router?
		if (hasVueRouterContext && props.to) {
			// Note: RouterLink is used as globally registered component (by name) and not imported intentionally
			// to use injected component from the app and not bundle it to the button
			return 'RouterLink'
		} else if (props.href) {
			return 'a'
		} else {
			return 'button'
		}
	})

	const isLink = computed(() => tag.value === 'RouterLink' || tag.value === 'a')
	const isHyperLink = computed(() => tag.value === 'a')
	const isRouterLink = computed(() => tag.value === 'RouterLink')
	const isButton = computed(() => tag.value === 'button')

	const attrs = computed(() => {
		if (tag.value === 'RouterLink') {
			return {
				to: props.to,
				activeClass: 'active',
				...(props.additionalAttrs?.('RouterLink') ?? {}),
			}
		} else if (tag.value === 'a') {
			return {
				href: props.href,
				target: props.target,
				download: props.download || undefined,
				rel: 'nofollow noreferrer noopener',
				...(props.additionalAttrs?.('a') ?? {}),
			}
		} else if (tag.value === 'button') {
			return {
				type: props.type || 'button',
				disabled: props.disabled,
				...(props.additionalAttrs?.('button') ?? {}),
			}
		}
	})

	return {
		tag,
		isLink,
		isHyperLink,
		isRouterLink,
		isButton,
		attrs,
	}
}
