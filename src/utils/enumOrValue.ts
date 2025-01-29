/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Helper to allow either the enum T or its string variant.
 *
 * @example ```ts
 * enum Foo {
 *   A = 'a',
 *   B = 'b',
 * }
 * // The type will be: Foo | 'a' | 'b'
 * let foo: EnumOrValue<Foo>
 * // The type is only `Foo` - thus passing 'a' or 'b' is invalid
 * let bar: Foo
 * ```
 */
export type EnumOrValue<T extends string> = T | `${T}`
