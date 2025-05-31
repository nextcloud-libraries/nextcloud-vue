/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AllowedComponentProps, Component, VNodeProps } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentProps<C extends Component> = C extends new (...args: any) => any
	? Omit<InstanceType<C>['$props'], keyof VNodeProps | keyof AllowedComponentProps | `on${string}`>
	: never;

type ClassType = string | Record<string, boolean | undefined>
export type VueClassType = ClassType | ClassType[] | VueClassType[]
