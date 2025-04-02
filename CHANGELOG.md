<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Changelog

## [v8.24.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.24.0) (2025-04-02)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.23.1...v8.24.0)

### 📝 Notes

#### Boolean properties
Some boolean props have been deprecated in favor of alternatives with default value `false`.
This allows to use shorthand notation on the template, as a prop with a default value of `false`
will be set to `true` if it is set (without any value) in the template,
similar to native HTML boolean attributes.
Following components have been adjusted:

|     Component |         Deprecated prop | New alternative |
|---------------|-------------------------|-----------------|
|    `NcAvatar` |        `showUserStatus` |    `hideStatus` |
|    `NcAvatar` | `showUserStatusCompact` | `verboseStatus` |
|     `NcModal` |              `canClose` |       `noClose` |
|    `NcDialog` |              `canClose` |       `noClose` |

#### `NcButton` color variant and native type
`NcButton` (and `NcDialogButton`) now provides a `variant` prop to set the color variant to use (e.g. `'primary'`) and allows to set the native button type using the `type` prop.
The legacy behavior, `type` for the color variant and `nativeType` for the button type, still works but will be removed in the next major version.

To make a later migration to version 9 easier you can already migrate your `NcButton` usage like this:
```html
<!-- Before: -->
<NcButton type="primary" native-type="submit">Submit</NcButton>
<!-- After: -->
<NcButton variant="primary" type="submit">Submit</NcButton>
```

### 🚀 Enhancements
* feat(NcActions): add `opened` and `closed` events to handle closing/opening end [\#6683](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6683) \([skjnldsv](https://github.com/skjnldsv)\)
* feat(NcBlurHash): Add a blur hash component [\#6396](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6396) \([susnux](https://github.com/susnux)\)
* feat(NcDialog): Allow to catch `reset` event [\#6006](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6006) \([susnux](https://github.com/susnux)\)
* feat: Add consistent `variant` prop for design variant of buttons / chips [\#6472](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6472) \([susnux](https://github.com/susnux)\)
* feat(NcAppContent): Allow to set the page title [\#5269](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5269) \([susnux](https://github.com/susnux)\)
* feat: add boolean prop alternatives with false as default value [\#6656](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6656) \([susnux](https://github.com/susnux)\)

### 🐛 Fixed bugs
* fix(NcPopover): correctly wait for animation end in `after-show`/`after-hide` events [\#6683](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6683) \([skjnldsv](https://github.com/skjnldsv)\)
* fix(NcEmojiPicker): not focusable when used in another focus trap [\#6558](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6558) \([ShGKme](https://github.com/ShGKme)\)
* fix(RTL): initialize language direction check once in utils [\#6523](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6523) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcColorPicker): remove unused invalid styles [\#6565](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6565) \([susnux](https://github.com/susnux)\)
* fix(NcAppSidebar, NcHeaderMenu): correctly focus trigger/close button when no focusable elements inside [\#6636](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6636) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcInputField): Only show error state border if user interacted with the input [\#6640](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6640) \([susnux](https://github.com/susnux)\)
* fix(NcEmojiPicker): return focus steals actual focus [\#6652](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6652) \([ShGKme](https://github.com/ShGKme)\)

### Other Changes
* refactor(NcCheckboxRadioSwitch): Do not use HTML attribute name `id` as property name [\#5516](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5516) \([susnux](https://github.com/susnux)\)
* docs: adjust version number for `variant` props [\#6623](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6623) \([susnux](https://github.com/susnux)\)
* Updated workflows and dependencies
* Updated translations

## [v8.23.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.23.1) (2025-02-13)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.23.0...v8.23.1)

### 🐛 Fixed bugs
* fix(l10n): fix build error after `@nextcloud/l10n` bump [\#6521](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6521) \([ShGKme](https://github.com/ShGKme)\)

## [v8.23.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.23.0) (2025-02-13)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.22.0...v8.23.0)

### 📝 Notes
* The individual import path of components, composables, directives, and functions was changed.
  The type of import is (e.g. `components`) is now lowercase and the `dist` will be omitted.
  For example to import the `NcButton` component the path has changed:

  ```ts
  // Old import
  import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
  // New way to import
  import NcButton from '@nextcloud/vue/components/NcButton'
  ```

  The old import paths are still valid, but deprecated and will be removed in version 9.
* `#default` slot for leading icon is now deprecated in components `NcInputField`, `NcTextField`, `NcPasswordField`. Use `#icon` slot instead.
* `NcActionRadio` is now expecting String|Number in `v-model` directive (to compare with passed `value`) instead of Boolean. Consider it for migration.
* Some boolean props have been deprecated in favor of alternatives with default value `false`.
  This allows to use shorthand notation on the template, as a prop with a default value of `false`
  will be set to `true` if it is set (without any value) in the template,
  similar to native HTML boolean attributes.
  Following components have been adjusted:

  |     Component |        Deprecated prop | New alternative |
  |---------------|------------------------|-----------------|
  |     `NcModal` |          `enableSwipe` |  `disableSwipe` |
  |`NcAppContent` | `allowSwipeNavigation` | `disabledSwipe` |

### 🚀 Enhancements
* feat: Allow to import without `dist` [\#6385](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6385) \([susnux](https://github.com/susnux)\)
* feat: Use boolean props with default value false [\#6452](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6452) \([susnux](https://github.com/susnux)\)
* feat(Nc*Field): add `#icon` slot for forward compatibility with v9, `#default` slot is deprecated [\#6399](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6399) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcActionRadio): change `modelValue` to behave like NcCheckboxRadioSwitch [\#6264](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6264) [\#6470](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6470) \([Antreesy](https://github.com/Antreesy)\)

### 🐛 Fixed bugs
* fix(NcAction*): Fix RTL support for component [\#6507](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6507) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcActions): Remove on `mousemove` listener for auto focus elements [\#6475](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6475) \([susnux](https://github.com/susnux)\)
* fix(NcActionCheckbox): Fix padding in RTL mode [\#6354](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6354) \([falghamdi125](https://github.com/falghamdi125)\)
* fix(NcAppNavigation + NcUserBubble + NcRichContenteditable): RTL support [\#6455](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6455) \([DorraJaouad](https://github.com/DorraJaouad)\)
* fix(NcAvatar): title not shown when component used without menu [\#6297](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6297) \([Koc](https://github.com/Koc)\)
* fix(NcAvatar): user status and interactivity toggle button Bidi support [\#6407](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6407) \([DorraJaouad](https://github.com/DorraJaouad)\)
* fix(NcColorPicker): close popover on submit event [\#6336](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6336) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcCounterBubble): show original count in title when shortened [\#6395](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6395) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcDateTimePicker): selected and hover time is not readable [\#6492](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6492) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcDateTimePickerNative): do not set invalid value on clear event [\#6387](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6387) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcDateTimePickerNative): style alignment with other input components [\#6454](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6454) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcEmojiPicker): add arrow navigation [\#6466](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6466) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcEmojiPicker): adjust styles to correctly fit emojis [\#6465](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6465) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcListItem): Fix padding in RTL mode [\#6359](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6359) \([falghamdi125](https://github.com/falghamdi125)\)
* fix(NcModal): Enforce opaque backdrop if needed [\#6434](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6434) \([susnux](https://github.com/susnux)\)
* fix(NcPopover): emit `after-show` after `focus-trap` init to correctly return focus [\#6342](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6342) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcPopover): blurry content on scaled page in Chromium [\#6512](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6512) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRich*): style fixes and RTL support [\#6474](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6474) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcRichContenteditable): remove value linkify [\#6372](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6372) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRichText): adjust conditions for highlight syntax [\#6259](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6259) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcRichText): extract un-escaping of text/code nodes with XML-like content [\#6499](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6499) [\#6501](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6501) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcTeamResources): Do not make extraneous requests for resources [\#6379](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6379) \([Pytal](https://github.com/Pytal)\)

### Changed
* chore(stylelint): `csstools/use-logical` [\#6419](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6419) \([ShGKme](https://github.com/ShGKme)\)
* chore(stylelint): fix scripts to be unix-compatible [\#6418](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6418) \([ShGKme](https://github.com/ShGKme)\)
* chore(docs): Do not override assets while building the styleguide [\#6408](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6408) \([susnux](https://github.com/susnux)\)
* chore(docs): update documentation [\#6460](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6460) \([ShGKme](https://github.com/ShGKme)\)
* Updated workflows and dependencies
* Updated translations

## New Contributors
* @Koc made their first contribution in https://github.com/nextcloud-libraries/nextcloud-vue/pull/6297

## [v8.22.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.22.0) (2024-12-20)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.21.0...v8.22.0)

### 🚀 Enhancements
* feat(NcAvatar): implement custom javascript hook action for the contacts menu [\#6238](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6238) \([st3iny](https://github.com/st3iny)\)
* feat(NcAppNavigation): add `n` hotkey to toggle navigation [\#6311](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6311) \([skjnldsv](https://github.com/skjnldsv)\)

### 🐛 Fixed bugs
* fix(NcAppNavigationItem): TypeError: this.$refs.actions.$refs.menuButton is undefined [\#6226](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6226) \([wofferl](https://github.com/wofferl)\)
* fix(NcListItem): Don't require name prop by @artonge in [\#6128](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6128) \([artonge](https://github.com/artonge)\)
* style(NcCheckboxRadioSwitch): fix styles in disabled state [\#6265](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6265) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcModal): make 'Close' button the last element for the focus-trap [\#6266](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6266) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcAppNavigation): Fix sidebar position in RTL and mobile mode.[\#6260](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6260) \([falghamdi125](https://github.com/falghamdi125)\)
* fix(NcAppContent): add RTL support [\#6303](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6303) \([hamza221](https://github.com/hamza221)\)
* fix(NcCheckboxRadioSwitch): RTL support [\#6302](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6302) \([hamza221](https://github.com/hamza221)\)
* fix(NcDateTimePicker): popup position [\#6312](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6312) \([hamza221](https://github.com/hamza221)\)
* Fix(NcSettingsSection): Add RTL support to NcSettingsSection info icon. [\#6290](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6290) \([falghamdi125](https://github.com/falghamdi125)\)
* Fix(NcDashboardWidgetItem): Add RTL support to NcDashboardWidgetItem [\#6292](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6292) \([falghamdi125](https://github.com/falghamdi125)\)
* fix(useHotKey): allow hotkeys with implicit `SHIFT` and add `caseSensitive`, custom event filter options [\#6301](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6301) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcRichContenteditable): prevent content from overflowing [\#6316](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6316) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcActionButton): RTL support [\#6200](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6200) \([falghamdi125](https://github.com/falghamdi125)\)
### Changed
* docs(NcDateTimePickerNative): add time picker example [\#6188](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6188) \([GVodyanov](https://github.com/GVodyanov)\)
* chore(NcAppSidebarTabs): remove internal component from docs [\#6253](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6253) \([ShGKme](https://github.com/ShGKme)\)
* Updated workflows and dependencies
* Updated translations

## New Contributors
* @falghamdi125 made their first contribution in https://github.com/nextcloud-libraries/nextcloud-vue/pull/6260

## [v8.21.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.21.0) (2024-11-21)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.20.0...v8.21.0)


### 🚀 Enhancements
* feat(NcRichText): highlight code syntax if language provided [\#6212](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6212) \([Antreesy](https://github.com/Antreesy)\)

### 🐛 Fixed bugs
* fix(NcInputField): correct position of trailing icon in RTL [\#6202](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6202) \([alsulami1](https://github.com/alsulami1)\)
* fix(NcChip): wrong color-primary-text variable used [\#6218](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6218) \([skjnldsv](https://github.com/skjnldsv)\)
* fix: make sure model event in `v-model` happens first to avoid regression [\#6234](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6234) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcTextField): don't fire value-updating events twice [\#6235](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6235) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRichContenteditable): support mentions of email/* guests [\#6233](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6233) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcAppContent): correct splitter color in dark mode when using split-horizontal mode [\#6227](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6227) \([wofferl](https://github.com/wofferl)\)
* fix(NcRichContenteditable): do not break adjacent user mentions [\#6223](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6223) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcRichContenteditable): fix pasting of the content to an empty field [\#6241](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6241) \([DorraJaouad](https://github.com/DorraJaouad)\)

## New Contributors
* @alsulami1 made their first contribution in [\#6202](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6202)
* @wofferl made their first contribution in [\#6227](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6227)

## [v8.20.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.20.0) (2024-10-29)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.19.0...v8.20.0)

### 📝 Notes
Now you can use `v-model` directive, `:model-value` prop, and `@update:model-value` (`@update:modelValue`) event in all data input components to have **compatibility with v9** in the future.
```html
<!-- Only v8 (Vue 2) -->
<NcTextField :value.sync="username" />
<!-- Compatible with both v8 (Vue 2) and v9 (Vue 3) -->
<NcTextField v-model="username" />
<!-- same as -->
<NcTextField :model-value="username" @update:model-value="username = $event" />
```
If you already use `v-model` with a custom writable computed on `:value.sync` components before, it might not work as expected anymore. Make sure to remove or adjust it before update.
See the full list in [v9 breaking changes](https://github.com/nextcloud-libraries/nextcloud-vue/blob/next/CHANGELOG.md#-breaking-changes).

### 🚀 Enhancements
* feat: add `v-model` support for input-like components [\#5418](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5418) \([kyteinsky](https://github.com/kyteinsky)\)
* feat: forward compatibility with v9 on `v-model` props/events [\#6172](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6172) \([ShGKme](https://github.com/ShGKme)\)
* feat(NcRichText): add styles to mount point for custom picker and custom widget elements [\#6108](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6108) \([julien-nc](https://github.com/julien-nc)\)
* feat(NcRichText): make interactive widgets opt-in [\#6151](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6151) \([Antreesy](https://github.com/Antreesy)\)
* feat: add `isDarkTheme` functions and composables [\#5698](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5698) \([ShGKme](https://github.com/ShGKme)\)
* feat: add `spawnDialog` function [\#6195](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6195) \([susnux](https://github.com/susnux)\)

### 🐛 Fixed bugs
* fix(NcReferencePicker): allow closing modal dialog [\#6137](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6137) \([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)\)
* fix(NcActions): RTL support [\#6148](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6148) \([hamza221](https://github.com/hamza221)\)
* fix(NcAppNavigation): RTL support [\#6144](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6144) \([hamza221](https://github.com/hamza221)\)
* fix(NcSelect): RTL support [\#6150](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6150) \([hamza221](https://github.com/hamza221)\)
* fix(NcAppDetailsToggle): RTL support [\#6145](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6145) \([hamza221](https://github.com/hamza221)\)
* fix(NcModal): RTL support [\#6171](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6171) \([hamza221](https://github.com/hamza221)\)
* fix(NcAppSidebar): RTL support [\#6187](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6187) \([hamza221](https://github.com/hamza221)\)
* fix(NcDateTimePicker): adjust component styling close to native appearance [\#6095](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6095) \([GretaD](https://github.com/GretaD)\)
* fix(NcTimeZonePicker): scope css styles [\#6184](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6184) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcAppSidebarTabs): force color-main-text for icons [\#6189](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6189) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcAppNavigationItem): use $scopedSlots instead of $slots [\#6161](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6161) \([st3iny](https://github.com/st3iny)\)

### Changed
* Updated workflows and dependencies
* Updated translations

## [v8.19.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.19.0) (2024-09-16)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.18.0...v8.19.0)

### 🚀 Enhancements
* feat(NcModal): make dark header configurable [\#6083](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6083) \([mejo-](https://github.com/mejo-)\)
* feat(NcActions): Emit `closed` event only when the actions are fully closed [\#6065](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6065) \([susnux](https://github.com/susnux)\)

### 🐛 Fixed bugs
* fix(NcAppNavigationItem): align utils with actions and other components [\#6054](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6054) \([GVodyanov](https://github.com/GVodyanov)\)
* fix(NcAvatar): add a fallback for missing CSS variable [\#6090](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6090) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcColorPicker): style advanced fields as NcInputField [\#6097](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6097) \([Antreesy](https://github.com/Antreesy)\)

### Changed
* Updated workflows and dependencies

## [v8.18.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.18.0) (2024-09-12)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.17.1...v8.18.0)

### 🚀 Enhancements
* feat(NcDialogButton): Allow to return `false` from callback to keep dialog open [\#6005](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6005) \([susnux](https://github.com/susnux)\)
* feat(NcHeaderButton): Add a button-only alternative for the header menu [\#6048](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6048) \([susnux](https://github.com/susnux)\)

### 🐛 Fixed bugs
* fix(NcActions): Pressing `Escape` should always close the actions [\#6037](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6037) \([susnux](https://github.com/susnux)\)
* fix(NcListItem): make the max width in `oneline` mode apply only to the content name [\#6039](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6039) \([GVodyanov](https://github.com/GVodyanov)\)
* fix(NcHeaderMenu): Ensure trigger button has the same width as a wrapper [\#6047](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6047) \([susnux](https://github.com/susnux)\)
* fix(NcCheckboxRadioSwitch): switch may have incorrect checked-like background [\#6055](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6055) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcEmojiPicker): adjust hover effects to the new design [\#6056](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6056) \([Antreesy](https://github.com/Antreesy)\)

### Changed
* Updated workflows and dependencies
* Updated translations

## [v8.17.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.17.1) (2024-08-30)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.17.0...v8.17.1)

### 🐛 Fixed bugs
* fix(NcAppNavigation): keep border only on mobile [\#6008](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6008) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRichText): discard reference widgets on text update [\#6011](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6011) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcCheckBoxRadioSwitch): do not toggle on a click on a link inside [\#6013](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6013) \([DorraJaouad](https://github.com/DorraJaouad)\)
* fix: Adjust time intervals for relative time [\#6017](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6017) \([susnux](https://github.com/susnux)\)
* fix(NcHeaderMenu): Remove padding from popover menu [\#6026](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6026) \([susnux](https://github.com/susnux)\)
* fix(useHotKey): respect press of MacOS Cmd key as Ctrl key [\#6021](https://github.com/nextcloud-libraries/nextcloud-vue/pull/6021) \([Antreesy](https://github.com/Antreesy)\)

## [v8.17.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.17.0) (2024-08-21)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.16.0...v8.17.0)

### 🚀 Enhancements
* feat(NcButton): Allow to specify `target` attribute for buttons with href [\#5938](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5938) \([mejo-](https://github.com/mejo-)\)
* feat(NcDialog): Allow to make the dialog a form [\#5932](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5932) \([susnux](https://github.com/susnux)\)
* feat(NcListItem): allow to control the display of a three dot menu [\#5980](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5980) \([DorraJaouad](https://github.com/DorraJaouad)\)
* feat(NcCounterBubble): add count prop for humanized count display [\#5863](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5863) \([ShGKme](https://github.com/ShGKme)\)
* feat(useHotKey): add composable for keyboard shortcuts [\#5899](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5899) \([Antreesy](https://github.com/Antreesy)\)

### 🐛 Fixed bugs
* fix(NcActions): Role `menu` needs a label assigned so label by trigger [\#5933](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5933) \([susnux](https://github.com/susnux)\)
* fix(NcListItem): Adjust icon color when the list item is active [\#5936](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5936) \([susnux](https://github.com/susnux)\)
* fix(NcCounterBubble): make it perfectly aligned circle [\#5948](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5948) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAvatar): extend variable size of status icons [\#5959](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5959) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcActions): NcActionCheckbox and NcActionRadio icon alignment [\#5958](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5958) \([GretaD](https://github.com/GretaD)\)
* fix(NcCheckboxRadioSwitch): adjust to new border radius [\#5974](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5974) \([ShGKme](https://github.com/ShGKme)\)
* fix: use `--header-height` instead of `50px` constant [\#5973](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5973) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAppSettingsDialog): Adjust navigation entries to match Nextcloud 30 design [\#5963](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5963) \([susnux](https://github.com/susnux)\)
* fix(NcAppNavigationCaption): make name ellipsize [\#5982](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5982) \([GVodyanov](https://github.com/GVodyanov)\)
* fix(NcAppNavigation): add border-right [\#5953](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5953) \([marcoambrosini](https://github.com/marcoambrosini)\)
* fix(NcRichText): modify MENTION_START regex to work on older MobileSafari versions [\#5976](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5976) \([arthurlockman](https://github.com/arthurlockman)\)
* fix(NcCounterBubble): increase size [\#5985](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5985) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRichContenteditable): adjust to new design [\#5992](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5992) \([ShGKme](https://github.com/ShGKme)\)

### Changed
* chore(docs): specify more Nextcloud versions in styleguidist [\#5930](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5930) \([ShGKme](https://github.com/ShGKme)\)
* refactor(NcModal): get rid of unneeded calc() [\#5984](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5984) \([ShGKme](https://github.com/ShGKme)\)
* Updated translations

## [v8.16.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.16.0) (2024-08-05)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.15.1...v8.16.0)

### 🚀 Enhancements
* feat(NcNoteCard): Add `text` prop to pass the content of the note card [\#5894](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5894) \([susnux](https://github.com/susnux)\)
* feat(NcPasswordField): Add `as-text` prop to remove autocomplete [\#5896](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5896) \([ShGKme](https://github.com/ShGKme)\)
* feat(NcListItem): Provide additional slots for NcActions / extra actions customization [\#5870](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5870) \([Antreesy](https://github.com/Antreesy)\)
* feat(NcUserBubble): Add RouterLink support [\#5708](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5708) [\#5917](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5917) \([Antreesy](https://github.com/Antreesy)\)

### 🐛 Fixed bugs
* fix(NcSelect): Ensure that component height is the same as input element [\#5883](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5883) \([susnux](https://github.com/susnux)\)
* fix(style): Adjust elements styles to unit-less line-height [\#5889](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5889) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcSettingsSection): Remove default h2 margin-top [\#5897](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5897) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcCounterButton): Adjust min-width to make it a right circle [\#5905](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5905) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcDashboardWidgetItem): Fix alignment of dashboard list items [\#5914](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5914) \([juliushaertl](https://github.com/juliushaertl)\)
* fix(NcNoteCard): Adjust padding and margin [\#5893](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5893) \([susnux](https://github.com/susnux)\)
* fix(NcAvatar): Make button element round as the avatar [\#5898](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5898) [\#5916](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5916) \([Antreesy](https://github.com/Antreesy))\)

### Changed
* Updated translations

## [v8.15.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.15.1) (2024-07-29)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.15.0...v8.15.1)

### 🐛 Fixed bugs
* fix(NcListItem): Make paddings smaller again on Nextcloud 30 [\#5879](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5879) \([susnux](https://github.com/susnux)\)
* fix(NcChip): Ensure chips without icon do not reserve empty space for icon [\#5859](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5859) \([susnux](https://github.com/susnux)\)
* fix: alignment of listitem name for one line layout [\#5853](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5853) \([GretaD](https://github.com/GretaD)\)
* NcActionCheckbox: align with NcActionText [\#5839](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5839) \([GVodyanov](https://github.com/GVodyanov)\)
* NcSelect: make same height and color as NcTextField [\#5829](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5829) \([GVodyanov](https://github.com/GVodyanov)\)
* fix(NcSelect): increase avatar size to show subname [\#5865](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5865) \([luka-nextcloud](https://github.com/luka-nextcloud)\)
* NcListItem: remove max width [\#5830](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5830) \([GVodyanov](https://github.com/GVodyanov)\)

### Changed
* fix(NcAppNavigation): update docs example with NcAppNavigationSearch component [\#5857](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5857) \([Antreesy](https://github.com/Antreesy)\)
* Updated translations

## [v8.15.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.15.0) (2024-07-22)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.14.0...v8.15.0)

### 🚀 Enhancements
* feat(NcAppNavigation): Provide consistent in-app search [\#5831](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5831) \([susnux](https://github.com/susnux)\)
* feat(NcRichText): Call public reference API when unauthenticated [\#5800](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5800) \([mejo-](https://github.com/mejo-)\)

### 🐛 Fixed bugs
* fix(NcAppNavigationItem): Fix popper boundary element [\#5632](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5632) \([ChristophWurst](https://github.com/ChristophWurst)\)
* Use correct date in header [\#5793](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5793) \([AndyScherzinger](https://github.com/AndyScherzinger)\)
* fix(NcAppNavigationSettings): border radius of toggle button [\#5765](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5765) \([st3iny](https://github.com/st3iny)\)
* fix(NcAppNavigationCaption): properly align with NcAppNavigationItem [\#5804](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5804) \([GVodyanov](https://github.com/GVodyanov)\)
* fix(NcActions): Use full window height [\#5806](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5806) \([susnux](https://github.com/susnux)\ [\#5842](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5842) \([Antreesy](https://github.com/Antreesy)\)
* style(NcAppNavigationCaption): remove margin-bottom [\#5815](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5815) \([GVodyanov](https://github.com/GVodyanov)\)
* docs: Fix `NcAppNavigationCaption` examples [\#5820](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5820) \([susnux](https://github.com/susnux)\)
* fix(NcInputField): Make helper text aligned and maxcontrast color [\#5822](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5822) \([susnux](https://github.com/susnux)\)
* fix(NcInputField): Make focus visible on trailing button look better [\#5823](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5823) \([susnux](https://github.com/susnux)\)
* fix(NcInputField): Make sure label and placeholder is not jumping [\#5821](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5821) \([susnux](https://github.com/susnux)\)
* fix(NcListItem): Anchor height was set not to content but random area [\#5780](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5780) \([susnux](https://github.com/susnux)\)
* fix(NcListItem): do not render counter on falsy values  [\#5834](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5834) \([Antreesy](https://github.com/Antreesy)\)
* NcAppSettingsSection: make titles normal h3 size [\#5819](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5819) \([GVodyanov](https://github.com/GVodyanov)\)
* fix(NcAppSidebar): manage focus only after transition has finished [\#5833](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5833) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcColorPicker): Make the color circle size depend on clickable area [\#5816](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5816) \([ChristophWurst](https://github.com/ChristophWurst)\)
* fix(NcAppContent): splitpane splitter styles with dark theme [\#5843](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5843) \([mejo-](https://github.com/mejo-)\)
* fix(NcModal): temporary deactivate focus-traps on modal open [\#5783](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5783) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcAppNavigationSearch): Fix focus button when clearing search [\#5850](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5850) \([susnux](https://github.com/susnux)\)

### Other Changes
* Updated translations
* Migrate REUSE to TOML [\#5791](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5791) \([AndyScherzinger](https://github.com/AndyScherzinger)\)
* Add reuse status badge [\#5794](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5794) \([AndyScherzinger](https://github.com/AndyScherzinger)\)
* chore(docs): remove SPDX header from component docs [\#5810](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5810) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAppNavigationSettings): use tertiary styling for the toggle button [\#5814](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5814) \([st3iny](https://github.com/st3iny)\)

## New Contributors
* @GVodyanov made their first contribution in [\#5819](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5819)

## [v8.14.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.14.0) (2024-07-04)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.13.0...v8.14.0)

### 🚀 Enhancements
* feat(NcAppSidebar): force show navigation for a single tab [\#5740](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5740) \([Antreesy](https://github.com/Antreesy)\)
* feat(NcButton): Add `size` prop to allow setting the button size to `small`, `normal`, `large` [\#5767](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5767) \([susnux](https://github.com/susnux)\)
* feat: migrate `NcCollectionList` component from `nextcloud-vue-collections` [\#5757](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5757) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcDialog): Ensure the dialog is correctly labelled by its name [\#5771](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5771) \([susnux](https://github.com/susnux)\)

### 🐛 Fixed bugs
* fix: Migrate SCSS `$clickable-area` to CSS `--default-clickable-area` [\#5694](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5694) \([marcoambrosini](https://github.com/marcoambrosini)\)
* fix(NcMentionBubble): hide selectable mention id from widescreens [\#5753](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5753) \([Antreesy](https://github.com/Antreesy)\)
* style(NcHeaderMenu): pass text-on-background color for header menu [\#5747](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5747) \([Antreesy](https://github.com/Antreesy)\)
* Fix input field label alignment [\#5766](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5766) \([marcoambrosini](https://github.com/marcoambrosini)\)
* fix(NcRichContentEditable): remove overlapping placeholder with tribute trigger [\#5749](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5749) \([DorraJaouad](https://github.com/DorraJaouad)\)
* fix(NcReferenceWidget): pass elements to intersection observer [\#5754](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5754) \([DorraJaouad](https://github.com/DorraJaouad)\)
* fix(NcCheckboxRadioSwitch): only bind aria attributes to the input [\#5777](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5777) \([skjnldsv](https://github.com/skjnldsv)\)

### Changed
* Updated translations

## [v8.13.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.13.0) (2024-06-20)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.12.0...v8.13.0)

### 🚀 Enhancements
* feat(NcDialogButton): Allow to pass `disabled` prop [\#5679](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5679) \([susnux](https://github.com/susnux)\)
* feat(NcRichContenteditable): programmatically show tributes [\#5674](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5674) \([DorraJaouad](https://github.com/DorraJaouad)\)
* feat: Add NcChip component [\#5686](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5686) \([susnux](https://github.com/susnux)\)
* feat(NcAppSidebar): add `toggleAttrs` prop to pass attributes on the toggle button [\#5695](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5695) \([ShGKme](https://github.com/ShGKme)\)
* feat(NcAppSidebar): add noToggle prop to hide the built-in toggle button [\#5702](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5702) \([ShGKme](https://github.com/ShGKme)\)

### 🐛 Fixed bugs
* fix(NcAppSidebar): remove hidden navigation toggle from focus trap [\#5613](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5613) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAppSidebar): make closing animation less glitchy [\#5608](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5608) \([ShGKme](https://github.com/ShGKme)\)
* Update temporary border radius variable [\#5639](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5639) \([marcoambrosini](https://github.com/marcoambrosini)\)
* fix: Adjust license in `package.json` [\#5612](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5612) \([susnux](https://github.com/susnux)\)
* Use variables for input border width [\#5563](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5563) \([marcoambrosini](https://github.com/marcoambrosini)\)
* fix: re-export `NcEllipsisedOption` and `NcInputField` in root export [\#5666](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5666) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcVNodes): add re-export in root export and add docs [\#5664](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5664) \([ShGKme](https://github.com/ShGKme)\)
* fix(richText): do not handle relative links without leading slash as router links [\#5703](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5703) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcModal): Adjust modal header name and actions [\#5656](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5656) \([susnux](https://github.com/susnux)\)
* fix(NcAppSidebar): apply toggle offset transition only on sidebar transition [\#5720](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5720) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAppSidebar): make sidebar a single node again to allow v-show, classes and attributes [\#5627](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5627) \([ShGKme](https://github.com/ShGKme)\)
* fix: Make sidebar buttons pixel perfect [\#3518](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3518) \([CarlSchwan](https://github.com/CarlSchwan)\)

### Changed
* Reduce border radius of components [\#5483](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5483) \([marcoambrosini](https://github.com/marcoambrosini)\)
* refactor: Drop unused files from source [\#5645](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5645) \([susnux](https://github.com/susnux)\)
* refactor: Fix linter issues on test case files [\#5646](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5646) \([susnux](https://github.com/susnux)\)
* chore(CHANGELOG): correct 8.12.0 [\#5618](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5618) \([ShGKme](https://github.com/ShGKme)\)
* chore: Update CI workflow files from template [\#5647](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5647) \([susnux](https://github.com/susnux)\)
* chore(NcEllipsisedOption): add docs [\#5663](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5663) \([ShGKme](https://github.com/ShGKme)\)
* chore(functions): add docs [\#5669](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5669) \([ShGKme](https://github.com/ShGKme)\)
* chore: Add SPDX headers and REUSE CI workflow [\#5650](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5650) \([susnux](https://github.com/susnux)\)
* fix(REUSE): add SPDX header to a new file [\#5709](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5709) \([Antreesy](https://github.com/Antreesy)\)
* chore(directives): add docs [\#5665](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5665) \([ShGKme](https://github.com/ShGKme)\)
* chore(NcUserStatusIcon): remove warn if status is not set [\#5715](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5715) \([ShGKme](https://github.com/ShGKme)\)
* Update translations

## [v8.12.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.12.0) (2024-05-13)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.11.2...v8.12.0)

### 🚀 Enhancements
* feat(NcAppNavigationCaption): Allow to set heading level [\#5567](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5567) \([susnux](https://github.com/susnux)\)
* feat(NcAppNavigationCaption): Add `heading-id` prop to allow setting the ID on the caption itself [\#5565](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5565) \([susnux](https://github.com/susnux)\)
* feat(NcAppSidebar): Allow to set `open` state to prevent focus trap issues on mobile [\#5584](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5584) \([susnux](https://github.com/susnux)\)

### 🐛 Fixed bugs
* fix(NcReferenceWidget): use requestAnimationFrame in observers [\#5561](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5561) \([max-nextcloud](https://github.com/max-nextcloud)\)
* fix(NcAppNavigationCaption): Fix margin [\#5576](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5576) \([Pytal](https://github.com/Pytal)\)
* fix(NcReferenceWidget): useElementSize [\#5587](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5587) \([max-nextcloud](https://github.com/max-nextcloud)\)
* fix(docs): Add missing file extensions to vue-material-design-icons imports [\#5581](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5581) \([susnux](https://github.com/susnux)\)
* fix(NcAppNavigation): restore hiding toggle on mobile [\#5603](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5603) \([szaimen](https://github.com/szaimen)\)
* fix(NcSettingSection): Update design and enforce `limitWidth` option [\#5514](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5514) \([marcoambrosini](https://github.com/marcoambrosini)\)
  * Adjusted in [\#5604](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5604)

### Other Changes
* Updates for project Nextcloud vue library [\#5562](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5562) \([transifex-integration](https://github.com/transifex-integration)\)
* fix: update timezone data and automate future updates [\#5572](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5572) \([st3iny](https://github.com/st3iny)\)
* Updates for project Nextcloud vue library [\#5578](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5578) \([transifex-integration](https://github.com/transifex-integration)\)
* fix(NcIconSvgWrapper): Fix icon size variable being undefined [\#5597](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5597) \([susnux](https://github.com/susnux)\)
* feat(NcAppSidebar): add CSS variables for toggle button offset [\#5599](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5599) \([ShGKme](https://github.com/ShGKme)\)


## [v8.11.3](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.11.3) (2024-05-07)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.11.2...v8.11.3)

## What's Changed
### 🐛 Fixed bugs
* fix(NcReferenceWidget): do not try to render widget when there is no widget [\#5485](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5485) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcDialog): Actions should not overflow the action container [\#5495](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5495) \([susnux](https://github.com/susnux)\)
* fix(NcColorPicker): Allow to submit selected color in simple-view [\#5499](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5499) \([susnux](https://github.com/susnux)\)
* fix(autolink): correctly handle relative links without webroot [\#5487](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5487) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcDateTime): When relative time is disabled return a string and not the reference to it [\#5493](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5493) \([susnux](https://github.com/susnux)\)
* fix(NcCheckboxRadioSwitch): Pass attrs to `input` if available [\#5507](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5507) \([susnux](https://github.com/susnux)\)
* fix(NcCheckboxRadioSwitch): Add background color for button style [\#5509](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5509) \([susnux](https://github.com/susnux)\)
* fix(NcDateTime): Respect language [\#5501](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5501) \([Pytal](https://github.com/Pytal)\)
* fix(NcRichText): adjust display so long texts in checkboxes can be shown correctly [\#5527](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5527) \([DorraJaouad](https://github.com/DorraJaouad)\)
* style(NcSelect): restrict max-height to prevent overflow by component [\#5551](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5551) \([Antreesy](https://github.com/Antreesy)\)
* build(vite): iterate over .ts files in all directories [\#5553](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5553) \([Antreesy](https://github.com/Antreesy)\)
* fix(emoji): index emoji data once for search functions [\#5554](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5554) \([Antreesy](https://github.com/Antreesy)\)
### Other Changes
* chore(widgets): remove unneeded nullish coalescing [\#5484](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5484) \([ShGKme](https://github.com/ShGKme)\)
* Updates for project Nextcloud vue library [\#5494](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5494) \([transifex-integration](https://github.com/transifex-integration)\)
* Updates for project Nextcloud vue library [\#5510](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5510) \([transifex-integration](https://github.com/transifex-integration)\)
* Updates for project Nextcloud vue library [\#5533](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5533) \([transifex-integration](https://github.com/transifex-integration)\)

## [v8.11.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.11.2) (2024-04-10)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.11.1...v8.11.2)

## What's Changed
### 🐛 Fixed bugs
* fix(NcBreadcrumbs): Only render existing hidden breadcrumbs [\#5441](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5441) \([Pytal](https://github.com/Pytal)\)
* fix(NcAppNavigationItem): Fix uncollapsible entry [\#5456](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5456) \([Pytal](https://github.com/Pytal)\)
* fix(NcRichText): include all label items [\#5455](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5455) \([DorraJaouad](https://github.com/DorraJaouad)\)
* fix(sidebar): propagate keydown unless mobile [\#5451](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5451) \([pulsejet](https://github.com/pulsejet)\)
* fix(NcActions): Show last action entry only partial to make it discoverable [\#5448](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5448) \([susnux](https://github.com/susnux)\)
* fix(NcDialog): Set font size to make dialog compatible with Nextcloud 30 [\#5463](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5463) \([susnux](https://github.com/susnux)\)
* fix(NcRichText): more strictly resolve vue router's path [\#5419](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5419) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAvatar): support in-app router links for contact menu [\#5477](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5477) \([ShGKme](https://github.com/ShGKme)\)
### Other Changes
* Updates for project Nextcloud vue library [\#5447](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5447) \([transifex-integration](https://github.com/transifex-integration)\)
* Updates for project Nextcloud vue library [\#5478](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5478) \([transifex-integration](https://github.com/transifex-integration)\)

## New Contributors
* @DorraJaouad made their first contribution in https://github.com/nextcloud-libraries/nextcloud-vue/pull/5455

## [v8.11.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.11.1) (2024-03-21)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.11.0...v8.11.1)

## What's Changed
### 🐛 Fixed bugs
* fix(tribute): provide avatar url correctly for dark mode [\#5420](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5420) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcListItem): decrease font-weight, restore contrast color for subname [\#5421](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5421) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcAppSidebar): fix animation glitch on toggle [\#5389](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5389) \([RayBB](https://github.com/RayBB)\)
* fix(NcAppSidebar): remove always hover styles from actions in non-compact mode [\#5367](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5367) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcActionInput): Add label to docs [\#5432](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5432) \([nickvergessen](https://github.com/nickvergessen)\)
### Other Changes
* Updates for project Nextcloud vue library [\#5417](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5417) \([transifex-integration](https://github.com/transifex-integration)\)
* Updates for project Nextcloud vue library [\#5426](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5426) \([transifex-integration](https://github.com/transifex-integration)\)

## New Contributors
* @RayBB made their first contribution in https://github.com/nextcloud-libraries/nextcloud-vue/pull/5389

## [v8.11.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.11.0) (2024-03-15)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.10.0...v8.11.0)

### 🚀 Enhancements
* feat(NcListItem): add title slot [\#5388](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5388) \([emoral435](https://github.com/emoral435)\)
* feat(NcAppContent): add horizontal split layout [\#5401](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5401) \([GretaD](https://github.com/GretaD)\)
### 🐛 Fixed bugs
* fix(NcListItem): bring back old styling for two-line list items [\#5400](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5400) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcListItem): align indicators at the element bottom [\#5408](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5408) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcReferenceWidget): set timeout to destroy idle widgets outside of viewports [\#5411](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5411) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcAvatar): rendering user status emoji in the menu [\#5409](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5409) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAvatar): handle regex error on initials match [\#5407](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5407) \([kyteinsky](https://github.com/kyteinsky)\)
### Other Changes
* Updates for project Nextcloud vue library [\#5404](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5404) \([transifex-integration](https://github.com/transifex-integration)\)

## New Contributors
* @kyteinsky made their first contribution in https://github.com/nextcloud-libraries/nextcloud-vue/pull/5407

## [v8.10.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.10.0) (2024-03-11)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.9.1...v8.10.0)

### 🚀 Enhancements
* feat(NcAppContent): add no-split layout [\#5209](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5209) \([GretaD](https://github.com/GretaD)\)
* feat(NcListItem): add one-line layout [\#5209](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5209) \([GretaD](https://github.com/GretaD)\)
* feat(NcActions): Allow to manually specify the semantic menu type [\#5336](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5336) \([susnux](https://github.com/susnux)\)

### 🐛 Fixed bugs
* fix(NcAppNavigation): stretch the main content when there is no list slot [\#5360](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5360) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRichContenteditable): capture and stop `Esc` keydown event when closing tribute [\#5353](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5353) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcRelatedResourcesPanel): Adjust styling of team resource images [\#5364](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5364) \([juliushaertl](https://github.com/juliushaertl)\)
* fix(NcRichContentEditable): require leading space to open tributes [\#5378](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5378) \([Antreesy](https://github.com/Antreesy)\)
* fix(richEditor): reference server-scoped regular expression to match complex user mentions [\#5359](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5359) \([Antreesy](https://github.com/Antreesy)\)
* fix(richText): when parse HTML content collapse consecutive spaces [\#5359](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5359) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcListItem): open _blank link by Enter and allow prevent [\#5342](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5342) \([pulsejet](https://github.com/pulsejet)\)
* fix(NcRichText): Allow to pass interactive widget toggle [\#5365](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5365) \([juliushaertl](https://github.com/juliushaertl)\)
* fix(NcActions): correct dialog a11y attrs place [\#5381](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5381) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcUserStatusicon): set status icons size explicitly [\#5390](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5390) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcListItem): change padding for one-line layout [\#5391](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5391) \([GretaD](https://github.com/GretaD)\)
* fix(NcReferenceWidget): Only use composables in `setup` context [\#5394](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5394) \([susnux](https://github.com/susnux)\)

### Other Changes
* Updates for project Nextcloud vue library [\#5358](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5358) \([transifex-integration](https://github.com/transifex-integration)\)
* chore: Remove GitHub Package Registry from publish workflow [\#5357](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5357) \([Pytal](https://github.com/Pytal)\)
* chore(README): remove build:module and watch:module [\#5346](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5346) \([ShGKme](https://github.com/ShGKme)\)
* Updates for project Nextcloud vue library [\#5387](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5387) \([transifex-integration](https://github.com/transifex-integration)\)

## [v8.9.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.9.1) (2024-03-06)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.9.0...v8.9.1)

### 🐛 Fixed bugs
* fix: Revert "fix(NcAppNavigation): Wrap app navigation default slot with scrollable container" [\#5355](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5355) \([Pytal](https://github.com/Pytal)\)

## [v8.9.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.9.0) (2024-03-06)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.8.1...v8.9.0)

### 🚀 Enhancements
* feat(reference): Add opt-in for interactive mode and render widgets lazy once in view [\#5257](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5257) \([juliushaertl](https://github.com/juliushaertl)\)
* feat: List team resources in related resources panel [\#5316](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5316) \([juliushaertl](https://github.com/juliushaertl)\)

### 🐛 Fixed bugs
* fix(NcAppNavigation): Wrap app navigation default slot with scrollable container [\#5347](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5347) \([Pytal](https://github.com/Pytal)\)

### Other Changes
* Updates for project Nextcloud vue library [\#5333](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5333) \([transifex-integration](https://github.com/transifex-integration)\)
* Updates for project Nextcloud vue library [\#5343](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5343) \([transifex-integration](https://github.com/transifex-integration)\)
* fix(NcActions): clear focus trap and move focus only if elements are existing in the DOM [\#5345](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5345) \([Antreesy](https://github.com/Antreesy)\)
* Updates for project Nextcloud vue library [\#5348](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5348) \([transifex-integration](https://github.com/transifex-integration)\)

## [v8.8.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.8.1) (2024-02-29)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.8.0...v8.8.1)

### 🐛 Fixed bugs
* fix(NcSelect): handle text overflow in NcSelect [\#5325](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5325) \([hamza221](https://github.com/hamza221)\)
* fix: scope component breaking NcModal and NcDateTimePickers [\#5331](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5331) \([ShGKme](https://github.com/ShGKme)\)

## [v8.8.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.8.0) (2024-02-29)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.7.1...v8.8.0)

## What's Changed

### 🚀 Enhancements
* feat(NcAppSidebar): Add `subname` slot [\#5285](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5285) \([susnux](https://github.com/susnux)\)
* feat: Add NcAppNavigationList [\#5302](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5302) \([Pytal](https://github.com/Pytal)\)

### 🐛 Fixed bugs
* fix(NcAppNavigationSpacer): Adjust order to make the spacer work again [\#5286](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5286) \([susnux](https://github.com/susnux)\)
* fix(NcResource): use RouterLink where possible for internal shared resources [\#5282](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5282) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcActions): remove `aria-haspopup` and `aria-controls` from navigation menu [\#5300](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5300) \([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)\)
* fix(NcActions): put in order tab and arrow navigation [\#5305](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5305) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcPopover): remove invalid aria-describedby [\#5304](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5304) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcActions): provide a label in dialog role [\#5308](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5308) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcActions): focus first checked item on open [\#5313](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5313) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRichContenteditable): respect forward slash as user mention character [\#5323](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5323) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcPopover): add aria-modal to some popover-based dialog components [\#5309](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5309) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcPopover): make popupRole non-required [\#5306](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5306) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRichContenteditable): disable global allowSpaces tribute option [\#5321](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5321) \([Antreesy](https://github.com/Antreesy)\)

### Other Changes
* Updates for project Nextcloud vue library [\#5289](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5289) \([transifex-integration](https://github.com/transifex-integration)\)
* Revert "fix(NcReferenceList): Resolve relative URLs before fetching references" [\#5291](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5291) \([mejo-](https://github.com/mejo-)\)

## [v8.7.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.7.1) (2024-02-21)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.7.0...v8.7.1)

## What's Changed

### 🐛 Fixed bugs
* fix(NcRichContenteditable): register props globally for new Tribute [\#5268](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5268) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcReferenceList): Resolve relative URLs before fetching references [\#5272](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5272) \([mejo-](https://github.com/mejo-)\)
* fix(NcDashboardWidgetItem): Center dashboard list items when there is no subtext [\#5271](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5271) \([juliushaertl](https://github.com/juliushaertl)\)

## [v8.7.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.7.0) (2024-02-20)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.6.2...v8.7.0)

## What's Changed

### 🚀 Enhancements
* feat: Split reference and smart picker functions from components [\#5218](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5218) \([juliushaertl](https://github.com/juliushaertl)\)
* feat(NcSelect): Add `required` attribute for native form validation [\#5225](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5225) \([Pytal](https://github.com/Pytal)\)
* feat(NcRichText): handle internal links with Vue Router [\#5246](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5246) \([Antreesy](https://github.com/Antreesy)\)
* enh: added option to render icon and text for breadcrumb [\#5216](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5216) \([emoral435](https://github.com/emoral435)\)

### 🐛 Fixed bugs
* fix(NcRichContenteditable): adjust styles and use CSS Modules to avoid global styles leak [\#5235](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5235) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcActionButton): Forward `disabled` state to native button element [\#5237](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5237) \([susnux](https://github.com/susnux)\)
* fix(NcModal): scope modal-container size to current modal, don't propagate it on nested [\#5244](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5244) \([Antreesy](https://github.com/Antreesy)\)
* Fix timezone dropdown [\#5251](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5251) \([GretaD](https://github.com/GretaD)\)
* fix(NcReferenceWidget): `useResizeObserver` [\#5240](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5240) \([max-nextcloud](https://github.com/max-nextcloud)\)
* fix(NcListItem): compensate added margin for list items [\#5260](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5260) \([Antreesy](https://github.com/Antreesy)\)

## [v8.6.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.6.2) (2024-02-07)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.6.1...v8.6.2)

### 📝 Notes
* In `NcRichContenteditable` properties `autoComplete.title`/`userData.title` were renamed back to `label` to be in line with server API. The `title` property is still working as a fallback, but deprecated. See https://github.com/nextcloud-libraries/nextcloud-vue/pull/5215

### 🐛 Fixed bugs
* fix(NcHeaderMenu): button size regression on small viewports fixed [\#5149](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5149) \([emoral435](https://github.com/emoral435)\)
* fix(NcListItem): Remove actions from within `a` which caused invalid HTML output [\#5198](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5198) \([susnux](https://github.com/susnux)\)
* fix(NcRichContenteditable): make autocomplete accessible [\#4904](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4904) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRichContenteditable): unify styles and add contrast border on keyboard navigation [\#5214](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5214) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRichContenteditable): bring back label for autocomplete [\#5215](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5215) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAppSidebar): move focus to sidebar on open and auto return focus on close [\#5219](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5219) \([ShGKme](https://github.com/ShGKme)\)

### Other Changes
* chore(NcSelect): Mention labelOutside for external label use [\#5211](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5211) \([Pytal](https://github.com/Pytal)\)

## [v8.6.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.6.1) (2024-02-01)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.6.0...v8.6.1)

### 🐛 Fixed bugs
* fix(NcAppNavigationNewItem): bring back correct CSS class [\#5194](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5194) \([raimund-schluessler](https://github.com/raimund-schluessler)\)
* revert: fix(NcActions): use new slots api [\#5196](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5196) \([ShGKme](https://github.com/ShGKme)\)

### Other Changes
* Updated translations
* fix(CI): Adjust npm-publish to work with GPR [\#5183](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5183) \([susnux](https://github.com/susnux)\)
* chore(CHANGELOG): Add missing entry for 8.6.0 release [\#5192](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5192) \([susnux](https://github.com/susnux)\)

## [v8.6.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.6.0) (2024-01-30)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.5.1...v8.6.0)

### 🚀 Enhancements
* feat: Implement widget flag for requesting interactive view [\#5144](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5144) \([juliushaertl](https://github.com/juliushaertl)\)
* feat(NcListItem): introduce 'details' slot [\#5146](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5146) \([Antreesy](https://github.com/Antreesy)\)
* feat(NcNoteCard): provide a slot for inserting a custom icon instead of default [\#4894](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4894) \([Antreesy](https://github.com/Antreesy)\)
* feat(NcActionButton): support boolean value for radio type [\#5134](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5134) \([ShGKme](https://github.com/ShGKme)\)

### 🐛 Fixed bugs
* fix(NcActions): keyboard navigation [\#5153](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5153) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcSelect): list width on page scaling [\#5162](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5162) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcColorPicker): define a container prop [\#5172](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5172) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcActions): intercept into current focus trap stack [\#4953](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4953) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcRichText): Make URL_PATTERN match localhost and URLs with ports [\#5176](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5176) \([mejo-](https://github.com/mejo-)\)
* fix(NcActions): hotfix for custom children [\#5178](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5178) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcDateTimePickerNative): create possibility to change a color theme on system default [\#5182](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5182) \([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)\)

### Other Changes
* Updates for project Nextcloud vue library [\#5157](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5157) \([transifex-integration](https://github.com/transifex-integration)\)
* chore: Fix missing PR from changelog [\#5175](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5175) \([Pytal](https://github.com/Pytal)\)
* chore(NcAppNavigationToggle): add comments [\#5148](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5148) \([emoral435](https://github.com/emoral435)\)
* chore: Update workflows [\#5148](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5148) \([susnux](https://github.com/susnux)\)

## [v8.5.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.5.1) (2024-01-24)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.5.0...v8.5.1)

### 🐛 Fixed bugs
* fix(NcPopover): a11y attrs provide-inject reactivity [\#5142](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5142) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcCheckboxRadioSwitch): On button style align the text vertically [\#5151](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5151) \([susnux](https://github.com/susnux)\)
* fix: removed groupings in timezone picker [\#5130](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5130) \([emoral435](https://github.com/emoral435)\)
* fix(fields): adjust label line-height [\#5133](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5133) \([ShGKme](https://github.com/ShGKme)\)
* fix(header): width regression fixed [\#5129](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5129) \([emoral435](https://github.com/emoral435)\)
* fix(NcCheckboxRadioSwitch): Make sure to include current value in checked array [\#5150](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5150) \([susnux](https://github.com/susnux)\)
* fix: Ensure no double scrollbars for NcDialog and NcAppNavigationSettings [\#5139](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5139) \([susnux](https://github.com/susnux)\)
* fix(NcAvatar): Remove span wrapper button semantics in favour of internal button components [\#5131](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5131) \([Pytal](https://github.com/Pytal)\)

### Other Changes
* Updated translation
* chore: Fix missing PR from changelog [\#5125](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5125) \([Pytal](https://github.com/Pytal)\)
* chore: Migrate cypress config to vite instead of webpack [\#4961](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4961) \([susnux](https://github.com/susnux)\)
* chore(styleguide): set line-height from server styles [\#5132](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5132) \([ShGKme](https://github.com/ShGKme)\)

## [v8.5.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.5.0) (2024-01-23)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.4.0...v8.5.0)

### 🚀 Enhancements
* enh(NcSelect): Add visible input label [\#4963](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4963) \([Pytal](https://github.com/Pytal)\)
* feat(NcModal): Set return focus element on focus trap deactivation [\#5025](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5025) \([Pytal](https://github.com/Pytal)\)
* Harmonize focus-visible styles for vue-navigation item with none-vue navigation item [\#5022](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5022) \([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)\)
* feat(NcActionInput): allow to append `NcSelect` to body [\#5017](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5017) \([raimund-schluessler](https://github.com/raimund-schluessler)\)
* enh(NcSelect): Improve accessibility [\#5036](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5036) \([Pytal](https://github.com/Pytal)\)
* enh: Make the date time formatting reusable for applications [\#5046](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5046) \([susnux](https://github.com/susnux)\)
* enh(NcHeaderMenu): Close navigation header menu on focusout [\#5064](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5064) \([Pytal](https://github.com/Pytal)\)
* enh(a11y): added aria-label that matches title attr on icon [\#5078](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5078) \([emoral435](https://github.com/emoral435)\)
* feat: Add NcUserStatusIcon [\#5059](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5059) \([Pytal](https://github.com/Pytal)\)
* enh(breadcrumb): conditionally renders button when no redirection link given [\#5077](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5077) \([emoral435](https://github.com/emoral435)\)
* feat(NcPopover): provide a11y attributes to the trigger [\#5086](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5086) \([ShGKme](https://github.com/ShGKme)\)
* feat(NcDialog): add navigationAriaLabel and navigationAriaLabelledBy props [\#5083](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5083) \([ShGKme](https://github.com/ShGKme)\)
* enh(NcContent): Add skip content buttons [\#4983](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4983) \([susnux](https://github.com/susnux)\)
* enh(NcInputField): Support numeric values - if numeric also emit numeric [\#4926](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4926) \([susnux](https://github.com/susnux)\)
* feat(NcProgressBar): add circular progress bar [\#5100](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5100) \([raimund-schluessler](https://github.com/raimund-schluessler)\)
* feat(NcReferenceList): Add support for a fallback reference widget [\#5092](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5092) \([mejo-](https://github.com/mejo-)\)
* enh(NcEmojiPicker): Always show skin tone selector + save selection [\#5103](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5103) \([susnux](https://github.com/susnux)\)
* feat(NcActionButton): Allow pressed state on NcActionButton - similar to NcButton [\#4744](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4744) \([susnux](https://github.com/susnux)\)
* feat(`NcRichText`) add support of GFM (extended markdown) [\#4365](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4365) \([Antreesy](https://github.com/Antreesy)\)

### 🐛 Fixed bugs
* fix(NcCheckboxRadioSwitch): fix shift+click on firefox [\#4999](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4999) \([skjnldsv](https://github.com/skjnldsv)\)
* fix(NcCheckboxRadioSwitch): use correct padding [\#5009](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5009) \([raimund-schluessler](https://github.com/raimund-schluessler)\)
* fix(NcCheckboxRadioSwitch): improve rendering and prevent unecessary elements [\#5001](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5001) \([skjnldsv](https://github.com/skjnldsv)\)
* fix(NcAppNavigation): change h2 to span [\#5020](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5020) \([emoral435](https://github.com/emoral435)\)
* fix(NcDateTimePicker): Use ISO week numbers if `showWeekNumber` is set [\#5045](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5045) \([susnux](https://github.com/susnux)\)
* fix(NcActions): In case of inline actions make sure to support icon as URL [\#5053](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5053) \([susnux](https://github.com/susnux)\)
* fix(NcDialog): allow to close NcDialog on click outside [\#5062](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5062) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcRelatedResourcesPanel): Fix invalid URL query params [\#5065](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5065) \([Pytal](https://github.com/Pytal)\)
* fix(NcBreadcrumbs): improve the breadcrumbs shrinking behaviour [\#5069](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5069) \([raimund-schluessler](https://github.com/raimund-schluessler)\)
* fix(NcInput): input disabled appearance [\#5000](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5000) \([marcoambrosini](https://github.com/marcoambrosini)\)
* fix(NcButton): use `a` as tag for router-link [\#5091](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5091) \([raimund-schluessler](https://github.com/raimund-schluessler)\)
* fix(NcSelect): remove visual gap on top of the list [\#5095](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5095) \([ShGKme](https://github.com/ShGKme)\)
* Remove unneeded `tab`, `tablist` and `aria-selected` roles from navigation [\#5075](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5075) \([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)\)
* fix(NcCheckboxRadioSwitch): Fix invalid indeterminate checkbox semantics [\#5096](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5096) \([Pytal](https://github.com/Pytal)\)
* Remove inaccessible opacity from SettingsSection [\#5109](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5109) \([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)\)
* fix(NcPopover): fix docs example [\#5111](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5111) \([raimund-schluessler](https://github.com/raimund-schluessler)\)
* fix(NcPopover): check trigger a11y compatible with Vue 3 [\#5110](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5110) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcHeaderMenu): mouse in now pointer [\#5101](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5101) \([emoral435](https://github.com/emoral435)\)
* fix(NcActions): use new slots api [\#5118](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5118) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcButton): pressed state a11y [\#5119](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5119) \([ShGKme](https://github.com/ShGKme)\)
* Fix additionalTrapElements to accept HTMLelements as well [\#5120](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5120) \([GretaD](https://github.com/GretaD)\)

### Other Changes
* refactor(NcCheckboxRadioSwitch): move comment to have a single root node [\#5018](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5018) \([ShGKme](https://github.com/ShGKme)\)
* refactor(NcActionButtonGroup): replace computed of constant with constant [\#5023](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5023) \([ShGKme](https://github.com/ShGKme)\)
* chore(docs): correct list types values for styleguidist in NcCheckboxRadioSwitch [\#5079](https://github.com/nextcloud-libraries/nextcloud-vue/pull/5079) \([ShGKme](https://github.com/ShGKme)\)

## [v8.4.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.4.0) (2023-12-22)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.4.0...v8.3.0)

### Notes
* NcRichContenteditable: new visual label feature might break layout if you have custom contenteditable styles
* `isMobile` and `isFullscreen` mixins are now deprecated, use `useIsMobile` and `useIsFullscreen` composables instead

### 🚀 Enhancements
* enh: Split translations by components to only include needed strings in app bundles [\#4861](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4861) \([susnux](https://github.com/susnux)\)
* enh(NcCheckboxRadioSwitch): Allow to set `aria-label` [\#4903](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4903) \([susnux](https://github.com/susnux)\)
* enh(NcRichContenteditable): Add optional visual label for content editable [\#4907](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4907) \([susnux](https://github.com/susnux)\)
* enh(NcBreadcrumbs): Allow setting aria-label on nav [\#4913](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4913) \([Pytal](https://github.com/Pytal)\)
* feat: add small mobile breakpoint [\#4919](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4919) \([ShGKme](https://github.com/ShGKme)\)
* Add target prop for NcListItem [\#4923](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4923) \([Fenn-CS](https://github.com/Fenn-CS)\)
* Make modal mask dark if some icons are shown outside [\#4916](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4916) \([szaimen](https://github.com/szaimen)\)
* enh: Add a full labelled color palette to be used as the default for the color picker [\#4902](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4902) \([susnux](https://github.com/susnux)\)

### 🐛 Fixed bugs
* fix(NcAppNavigationItem): fix style when using `active` prop [\#4989](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4989) \([raimund-schluessler](https://github.com/raimund-schluessler)\)
* fix(NcDialog): Increase specificity for modal-content selector [\#4897](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4897) \([susnux](https://github.com/susnux)\)
* Prevent NcBreadcrumb from automatically inheriting attributes [\#4918](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4918) \([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)\)
* fix(NcAvatar): Increase contrast of avatar status icon [\#4912](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4912) \([Pytal](https://github.com/Pytal)\)
* fix(utils/UserStatus): typo in "invisible" translation key [\#4931](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4931) \([ShGKme](https://github.com/ShGKme)\)
* enh(NcDialog): Label dialog nav [\#4928](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4928) \([Pytal](https://github.com/Pytal)\)
* fix(NcAppNavigationSettings): remove incorrect aria-label [\#4932](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4932) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAppSidebar): add focus trap on mobile [\#4909](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4909) \([ShGKme](https://github.com/ShGKme)\)
* feat(NcRichContenteditable): put caret in the end when focus input [\#4924](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4924) \([Antreesy](https://github.com/Antreesy)\)
* fix(package): specify exports for composables [\#4951](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4951) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcActions): provide `aria-expanded="false"` when menu is closed instead of removing it [\#4946](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4946) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcListItem): Ensure list item does not overflow wrapper [\#4956](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4956) \([susnux](https://github.com/susnux)\)
* fix(NcActionX): Allow relative icon URL [\#4955](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4955) \([susnux](https://github.com/susnux)\)
* fix(NcAppSettingsDialog): respect showNavigation prop [\#4954](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4954) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAppNavigation): Bring back hover state for active element [\#4960](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4960) \([susnux](https://github.com/susnux)\)
* enh(aria): changed check color to adhere to 3:1 ratio [\#4958](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4958) \([emoral435](https://github.com/emoral435)\)
* Use logical style for NcHeaderMenu [\#4965](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4965) \([ahangarha](https://github.com/ahangarha)\)
* Equalize `TextArea` styles with `TextField` styles [\#4971](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4971) \([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)\)
* Increase contrast on input field for `NcRichContenteditable` [\#4975](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4975) \([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)\)
* enh(breadcrumbs): changed aria label for voice control on a-tag [\#4973](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4973) \([emoral435](https://github.com/emoral435)\)
* Differentiate between dark and light theme for NcDateTimePickerNative [\#4981](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4981) \([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)\)

### Other Changes
* refactor(NcAppSidebar): remove unneeded debug log [\#4952](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4952) \([ShGKme](https://github.com/ShGKme)\)
* chore(ci): make Jest output colorful [\#4966](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4966) \([ShGKme](https://github.com/ShGKme)\)
* Update translations

## [v8.3.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.3.0) (2023-11-30)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.3.0...v8.2.0)

### 🚀 Enhancements
* feat(NcInputField): add optional pill form appearance to the component [\#4876](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4876) \([Antreesy](https://github.com/Antreesy)\)

### 🐛 Fixed bugs
* fix(NcCheckboxContent): Make sure text can wrap [\#4862](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4862) \([susnux](https://github.com/susnux)\)
* fix(NcAppNavigation): make toggle button not the first element for focus-trap [\#4864](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4864) \([Antreesy](https://github.com/Antreesy)\)
* fix(NcAppNavigation): closed on mobile initially [\#4869](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4869) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAppSettingsDialog): Remove navigation instead of hiding and fix styles [\#4865](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4865) \([susnux](https://github.com/susnux)\)
* Remove server styles from action menu [\#4875](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4875) \([marcoambrosini](https://github.com/marcoambrosini)\)
* fix(NcCheckboxRadioSwitch): visually hidden input position [\#4882](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4882) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcDialog): Add slighly more padding on the bottom and fix example button order [\#4881](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4881) \([susnux](https://github.com/susnux)\)
* docs(NcAppNavigation): Add docs for slots and remove private components from styleguide [\#4883](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4883) \([susnux](https://github.com/susnux)\)
* fix(NcAppNavigationCaption): Make color `main-text` for accessibility [\#4885](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4885) \([susnux](https://github.com/susnux)\)
* fix(NcColorPicker): correct aria-label [\#4889](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4889) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcActions): typo in aria-haspopup [\#4887](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4887) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcAppNavigation): replace custom `v-tooltip` with native `title` [\#4888](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4888) \([ShGKme](https://github.com/ShGKme)\)

### Other Changes
* chore(lint): use valid JSDoc for literal type union [\#4989](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4989) \([ShGKme](https://github.com/ShGKme)\)
* Update translations

## [v8.2.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.2.0) (2023-11-17)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.2.0...v8.1.0)

### :rocket: Enhancements
* feat(NcColorPicker): palette now can have color names [\#4611](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4611) [\(ShGKme\)](https://github.com/ShGKme)

### :bug: Fixed bugs
* fix: export composables [\#4829](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4829) [\(raimund-schluessler\)](https://github.com/raimund-schluessler)
* fix(NcAppSidebarTabs): override tabs styles only tablist navigation [\#4823](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4823) [\(ShGKme\)](https://github.com/ShGKme)
* Improve relative time handling [\#4832](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4832) [\(nickvergessen\)](https://github.com/nickvergessen)
* fix(cypress): delete unused files [\#4837](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4837) [\(raimund-schluessler\)](https://github.com/raimund-schluessler)
* fix(NcActions): fix role and aria attributes [\#4835](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4835) [\(ShGKme\)](https://github.com/ShGKme)
* fix(NcAppSettingsDialog): `unregisterSection` should remove the section instead of remove all other [\#4798](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4798) [\(susnux\)](https://github.com/susnux)
* fix(NcRichcontenteditable): remove placeholder attr [\#4843](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4843) [\(ShGKme\)](https://github.com/ShGKme)
* fix(NcDateTime): Also use months for relative date time [\#4845](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4845) [\(nickvergessen\)](https://github.com/nickvergessen)
* fix(NcActions): adjust keyboard navigation [\#4841](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4841) [\(ShGKme\)](https://github.com/ShGKme)
* fix checkbox sizing [\#4760](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4760) [\(szaimen\)](https://github.com/szaimen)
* fix(NcActions): only search for items to focus on in the current menu [\#4846](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4846) [\(ShGKme\)](https://github.com/ShGKme)
* Create scrollable content via `min-height` over sidebar and settings … [\#4825](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4825) [\(JuliaKirschenheuter\)](https://github.com/JuliaKirschenheuter)
* Create scrollable content via `min-height` over sidebar and settings dialog on small screens [\#4836](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4836) [\(JuliaKirschenheuter\)](https://github.com/JuliaKirschenheuter)
* Correct styles for focused NcTextArea [\#4848](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4848) [\(JuliaKirschenheuter\)](https://github.com/JuliaKirschenheuter)

### Other Changes
* Update translations

## [v8.1.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.1.0) (2023-11-14)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.0.1...v8.1.0)

### :rocket: Enhancements
* feat: introduce `useIsMobile` and `useIsFullscreen` composables [\#4761](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4761) [\(@ShGKme\)](https://github.com/ShGKme)

### :bug: Fixed bugs
* Fix tabs appearance [\#4815](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4815) [\(@marcoambrosini\)](https://github.com/marcoambrosini)
* fix(NcTextField): Align default label for trailing button with used icon [\#4805](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4805) [\(@susnux\)](https://github.com/susnux)
* fix single-select design [\#4817](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4817) [\(@szaimen\)](https://github.com/szaimen)

### Other Changes
* Update translations

## [v8.0.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.0.1) (2023-11-09)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v8.0.0...v8.0.1)

### :bug: Fixed bugs
* fix(NcModal): Adjust `aria-label` of close button [\#4778](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4778) \([susnux](https://github.com/susnux)\)
* fix(NcCounterBubble): Fix color of highlighted/outlined items when no… [\#4781](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4781) \([nickvergessen](https://github.com/nickvergessen)\)
* fix(NcTimezonePicker): add missing `t` method [\#4790](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4790) \([ShGKme](https://github.com/ShGKme)\)
* fix(NcCheckboxRadioSwitch): Fix contrast of Radio switches using butt… [\#4791](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4791) \([nickvergessen](https://github.com/nickvergessen)\)

### Other Changes
* Updates for project Nextcloud vue library [\#4780](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4780) \([transifex-integration](https://github.com/transifex-integration)\)
* Updates for project Nextcloud vue library [\#4784](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4784) \([transifex-integration](https://github.com/transifex-integration)\)

## [v8.0.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v8.0.0) (2023-11-08)
[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.11.2...v8.0.0)

### :boom: Breaking changes
- Update node engines to next LTS (node 20 / npm 9)
- The deprecated `NcMultiselect` and `NcMultiselectTags` components were removed [\#4281](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4281) ([susnux](https://github.com/susnux))
  - Migration: Use the `NcSelect` and `NcSelectTags` components instead
- The deprecated `NcPopoverMenu` component was removed [\#4081](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4081) ([raimund-schluessler](https://github.com/raimund-schluessler))
  - Migration: Use the `NcActions` component instead
- The deprecated `NcAppNavigationCounter` component was removed [\#4096](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4096) ([raimund-schluessler](https://github.com/raimund-schluessler))
  - Migration: Use the `NcCounterBubble` component instead
- The deprecated `excludeClickOutsideClasses` property was removed from `clickOutsideOptions` [\#4088](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4088) ([raimund-schluessler](https://github.com/raimund-schluessler))
  - Migration: Use the `excludeClickOutsideSelectors` property, which takes an array of css selectors, instead
- The `label` property of `NcAutoCompleteResult` was renamed to `title` [\#4222](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4222) ([susnux](https://github.com/susnux))
- The deprecated `title` property was removed, every occurrence of `title` was renamed to `name` [\#4106](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4106) ([raimund-schluessler](https://github.com/raimund-schluessler)), [\#4052](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4052) ([raimund-schluessler](https://github.com/raimund-schluessler))
  - `label` property was renamed to `name` for `NcMentionBubble`
  - `name` propery is now required for `NcActions*`, `NcAppNavigationItem` and `NcBreadcrumb*`
  - See linked pull request for full migration guide
- chore: Drop `install` entry point and replace it with an Vue Plugin [\#4349](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4349) ([susnux](https://github.com/susnux))
- `NcInputField`: The `labelVisible` property was removed for accessibility it is required to always show a label.
  You can still use the `labelOutside` property to remove the inner label from the component.
- feat(NcEmptyContent)!: make empty content centered by default instead of 20vh margin [\#4506](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4506) ([ShGKme](https://github.com/ShGKme))
- chore!: Rename `Datetime` to `DateTime` in component names [\#4560](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4560) ([susnux](https://github.com/susnux))
- feat(NcIconSvgWrapper)!: remove ID from svg [\#4607](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4607) ([ShGKme](https://github.com/ShGKme))

### :rocket: Enhancements
- feat(NcAppSettingsDialog): Allow to add icons to the navigation sections [\#4745](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4745) ([susnux](https://github.com/susnux))
- feat(NcButton): Allow to format text of button [\#4367](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4367) ([susnux](https://github.com/susnux))
- enh\(NcDatetime\): New component for displaying timestamps as time relative from now [\#4219](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4219) ([susnux](https://github.com/susnux))
- feat\(NcInputField\): Append custom aria-describedby to input field [\#4225](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4225) ([Pytal](https://github.com/Pytal))
- feat\(NcNoteCard\): Add new 'info' version to display informational messaged [\#4063](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4063) ([moan0s](https://github.com/moan0s))
- feat\(NcEmptyContent\): Add slot for description [\#3895](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3895) ([susnux](https://github.com/susnux))
- feat\(NcActions\): Improve readability of action menu entries [\#4049](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4049) ([Pytal](https://github.com/Pytal))
- feat\(NcReferencePickerModal\): Allow setting modal size when registering a custom picker component [\#3866](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3866) ([julien-nc](https://github.com/julien-nc))
- feat: Migrate `NcAvatar` to use `NcActions` [\#4017](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4017) ([raimund-schluessler](https://github.com/raimund-schluessler))
- feat\(a11y\): Export a11y activation util [\#4166](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4166) ([Pytal](https://github.com/Pytal))
- NcButton: Add alignment property to change icon and text ordering [\#4366](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4366) ([susnux](https://github.com/susnux))
- Add accessible label to textarea [\#4448](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4448) ([Pytal](https://github.com/Pytal))
- Remove border from sidebar tabs [\#4449](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4449) ([marcoambrosini](https://github.com/marcoambrosini))
- Make smart picker modal close button tertiary [\#4441](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4441) ([julien-nc](https://github.com/julien-nc))
- Add menuitem role to action link [\#4436](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4436) ([Pytal](https://github.com/Pytal))
- feat\(NcModal\): Allow to configure if the modal is closed when clicked outside [\#4454](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4454) ([susnux](https://github.com/susnux))
- Feature: Add visible inner label for `NcInputField` on border [\#4394](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4394) ([susnux](https://github.com/susnux))
- Bring back label outside of the input for NcActionInput [\#4484](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4484) ([juliushaertl](https://github.com/juliushaertl))
- feat(`NcRichContenteditable`) - add different output appearance in examples  [\#4485](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4485) ([Antreesy](https://github.com/Antreesy))
- perf(NcEmojiPicker): decrease mounting time and memory by moving large constants initialization and storing out from instance's reactive data [\#4479](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4479) ([ShGKme](https://github.com/ShGKme))
- enh(NcAppNavigationCaption): Forward listeners [\#4494](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4494) ([Pytal](https://github.com/Pytal))
- enh(a11y): Use button as header menu trigger [\#4481](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4481) ([Pytal](https://github.com/Pytal))
- enh(a11y): Add nav to header menu [\#4487](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4487) ([Pytal](https://github.com/Pytal))
- feat(NcIconSvgWrapper): allow to render raw svg paths [\#4643](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4643) ([raimund-schluessler](https://github.com/raimund-schluessler))
- feat(NcDialog): New component (moved from `@nextcloud/dialogs`) [\#4550](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4550) ([susnux](https://github.com/susnux))
- feat(NcSelect): Allow to filter users by email notation [\#4653](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4653) ([susnux](https://github.com/susnux))
- enh(NcAppSidebarTabs): Make tab navigation accessible [\#4663](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4663) ([Pytal](https://github.com/Pytal))
- Add the resource type on RelatedResourcesPanel [\#4662](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4662) ([GretaD](https://github.com/GretaD))
- feat(NcTextArea): implement new textarea component [\#4605](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4605) ([st3iny](https://github.com/st3iny))
- Add header prop to NcRelatedResourcesPanel [\#4703](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4703) ([GretaD](https://github.com/GretaD)
- feat(NcAppNavigationItem): Add `active` property to set active state & use `aria-current` [\#4716](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4716) ([susnux](https://github.com/susnux)
- feat(NcActionButton): support menu styling  [\#4724](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4724) ([skjnldsv](https://github.com/skjnldsv)
- Made description dynamic on related resources [\#4729](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4729) ([GretaD](https://github.com/GretaD)
- fix(NcTimezonePicker): Allow to set ID of inner select component [\#4734](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4734) ([susnux](https://github.com/susnux)
- Allow preventing link insertion in RichContentEditable [\#3890](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3890) ([julien-nc](https://github.com/julien-nc)

### :bug: Fixed bugs
- fix\(NcSettingsSelectGroup\): Migrate from deprecated `NcMultiselect` to `NcSelect` [\#4120](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4120) ([susnux](https://github.com/susnux))
- fix\(NcRichtext\): Migrate from deprecated `NcMultiselect` to `NcSelect` [\#4247](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4247) ([julien-nc](https://github.com/julien-nc))
- fix\(NcAppNavigation\): Prevent tabbing into closed navigation [\#3114](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3114) ([PVince81](https://github.com/PVince81))
- fix\(NcDatetimePicker\): Make sure all l10n strings are extracted [\#4272](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4272) ([susnux](https://github.com/susnux))
- fix\(NcAppNavigationCaption\): Align actions with other navigation action [\#4220](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4220) ([susnux](https://github.com/susnux))
- fix\(NcInputField\): Increase input field helper text contrast [\#4188](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4188) ([Pytal](https://github.com/Pytal))
- fix\(NcSelect\): Hide clear and deselect button when disabled [\#4212](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4212) ([Pytal](https://github.com/Pytal))
- fix\(NcSelect\): Fix disabled colors to distinguish the disabled state from the regular state [\#4217](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4217) ([Pytal](https://github.com/Pytal))
- fix\(NcProviderList\): Add padding around provider list [\#4175](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4175) ([juliushaertl](https://github.com/juliushaertl))
- fix\(NcModal\): Fix focus-trap fallback if content is empty [\#4266](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4266) ([skjnldsv](https://github.com/skjnldsv))
- fix\(NcActionInput\): Show trailing button even for empty input [\#4251](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4251) ([susnux](https://github.com/susnux))
- fix\(NcRichContenteditable\): Fix mentioning users with `@` in username [\#4222](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4222) ([susnux](https://github.com/susnux))
- fix\(NcProgressBar\): Fix design on chromium browsers [\#4238](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4238) ([szaimon](https://github.com/szaimon))
- fix\(NcReferencePicker\): Fix padding in the *any link* preview component [\#4248](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4248) ([julien-nc](https://github.com/julien-nc))
- fix\(NcModal\): Set background **and** text color [\#4221](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4221) ([susnux](https://github.com/))
- fix\(NcSelect\): Keep dropdown open while loading [\#4209](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4166) ([Pytal](https://github.com/Pytal))
- fix\(NcCheckboxRadioSwitch\): Add focus-visible style [\#4176](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4176) ([Fenn-CS](https://github.com/Fenn-CS))
- fix\(NcAppNavigationSettings\): Add `aria-expanded` attribute to settings accordion button [\#4109](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4109) ([Fenn-CS](https://github.com/Fenn-CS))
- fix\(clickOutsideOptions\): Fix handling of ignored css selectors [\#4046](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4046) ([susnux](https://github.com/susnux))
- fix\(NcResource\): Fix item alignment in the right sidebar [\#4121](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4121) ([Pytal](https://github.com/Pytal))
- fix\(NcAppSidebarTabs\): Fix rendering tabs with CSS icon [\#4111](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4111) ([ShGKme](https://github.com/ShGKme))
- fix\(NcAppNavigationItem\): Left panel dropdown improvement [\#4103](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4103) ([Jerome-Herbinet](https://github.com/Jerome-Herbinet))
- fix\(NcSettingsSection\): Add target blank and no ref info [\#4099](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4099) ([Rello](https://github.com/Rello))
- fix: Use the color-primary-element* variables in components [\#4067](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4067) ([szaimon](https://github.com/szaimon))
- fix\(NcListItem\): Fix wrong bold class [\#4083](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4083) ([julien-nc](https://github.com/julien-nc))
- fix\(NcSelect\): Fix disabled state of NcSelect with dark mode [\#4079](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4079) ([nickvergessen](https://github.com/nickvergessen))
- fix\(NcSelect\): Action input usage [\#4066](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4066) ([Pytal](https://github.com/Pytal))
- fix\(NcRichContenteditable\): Fix avatar overlayed with empty space when offline [\#4043](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4043) ([nickvergessen](https://github.com/nickvergessen))
- fix\(l10n\): Add language mappings like server does so gettext uses the same locale [\#4412](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4412) ([susnux](https://github.com/susnux))
- fix\(l10n\): Remove quoting character  [\#4396](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4396) ([rakekniven](https://github.com/rakekniven))
- fix\(NcModal\): prev/next color and sizing fix [\#4368](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4368) ([skjnldsv](https://github.com/skjnldsv))
- fix\(NcListItem\) - define a single place for NcActions to render [\#4356](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4356) ([Antreesy](https://github.com/Antreesy))
- fix\(NcModal\): Close button should be visible even if modal content is scrolled [\#4350](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4350) ([susnux](https://github.com/susnux))
- fix\(NcButton\): Improve alignment documentation to show all variants. [\#4392](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4392) ([susnux](https://github.com/susnux))
- try to fix header size on mobile [\#4420](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4420) ([szaimen](https://github.com/szaimen))
- fix\(NcButton\): correctly emit click event [\#4398](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4398) ([raimund-schluessler](https://github.com/raimund-schluessler))
- feat\(NcButton\): Add `pressed` state for stateful buttons [\#4344](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4344) ([susnux](https://github.com/susnux))
- NcCheckboxRadioSwitch - adjust border color [\#4427](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4427) ([szaimen](https://github.com/szaimen))
- fix\(NcRichContenteditable\): Add aria-placeholder [\#4407](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4407) ([ShGKme](https://github.com/ShGKme))
- fix\(NcModal\): Fix modal focus trap with additional elements and arrow navigation [\#4406](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4406) ([ShGKme](https://github.com/ShGKme))
- Fix contrast for selected item [\#4434](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4434) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- fix\(`NcListItem`\) - remove empty wrapper for additional elements from DOM if not needed [\#4438](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4438) ([Antreesy](https://github.com/Antreesy))
- fix: `exports` field of package used deprecated syntax [\#4437](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4437) ([susnux](https://github.com/susnux))
- Prevent accessible name conflicts on action menu [\#4447](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4447) ([Pytal](https://github.com/Pytal))
- fix: adjust active element visibility in nclistitem [\#4158](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4158) ([szaimen](https://github.com/szaimen))
- fix: adjust breadcrumbs component [\#4416](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4416) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix\(NcSelect\): Use named export of VueSelect to prevent issues when imported in ESM projects [\#4451](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4451) ([susnux](https://github.com/susnux))
- fix\(NcCheckboxRadioSwitch\): If no text is provided the element should be a circle [\#4453](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4453) ([susnux](https://github.com/susnux))
- fix\(`NcListItem`\) don't force blur action menu on tab [\#4458](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4458) ([Antreesy](https://github.com/Antreesy))
- fix\(`NcRichText`\) - keep newlines in rendered Markdown  [\#4461](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4461) ([Antreesy](https://github.com/Antreesy))
- fix\(`NcRichText`\) - don't populate a first newline to properly parse blockqoute tags [\#4470](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4470) ([Antreesy](https://github.com/Antreesy))
- fix\(a11y\): Remove nav and radios in sidebar tabs [\#4456](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4456) ([Pytal](https://github.com/Pytal))
- fix\(NcSelect\): Do not add border to single select option [\#4475](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4475) ([Pytal](https://github.com/Pytal))
- feat and fix: `NcCheckboxRadioSwitch` `required` prop and input position fix [\#4488](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4488) ([skjnldsv](https://github.com/skjnldsv))
- Align NcCheckboxRadioSwitch labels [\#4490](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4490) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix(EmptyContent): svg max size [\#4496](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4496) ([skjnldsv](https://github.com/skjnldsv))
- fix(NcRichContenteditable): make the default placeholder short [\#4408](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4408) ([ShGKme](https://github.com/ShGKme))
- Stop propagation of keyboard navigation in a number of components [\#4501](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4501) ([ShGKme](https://github.com/ShGKme))
- fix(NcRichText) - don't strip `<tag>`-like content when parsing markdown [\#4486](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4486) ([Antreesy](https://github.com/Antreesy))
- fix(NcAppNavigation): Make the navigation toggle accessible again when closed [\#4546](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4546) ([susnux](https://github.com/susnux))
- fix: Replace sanitize-svg with dompurify [\#4557](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4557) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix(NcEmojiPicker): Do not set padding for the search input label [\#4577](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4577) ([susnux](https://github.com/susnux))
- fix(NcEmojiPicker): Set type to `native` for selected emoji [\#4575](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4575) ([mejo-](https://github.com/mejo-))
- fix: also export NcSettings* components [\#4586](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4586) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix(NcSettingsSection): remove incorrect role=note on doc link [\#4594](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4594) ([ShGKme](https://github.com/ShGKme))
- fix(utils): Make `isMobileState` PURE so it can be treeshaken if not used [\#4595](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4595) ([susnux](https://github.com/susnux))
- allow type property for NcAppNavigationNew [\#4555](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4555) ([dartcafe](https://github.com/dartcafe))
- fix(EmptyContent): ensure proper custom icon size [\#4584](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4584) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Properly align AppNavigationToggle with first navigation item [\#3278](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3278) ([susnux](https://github.com/susnux))
- fix: Remove unused id from trigger [\#4602](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4602) ([Pytal](https://github.com/Pytal))
- fix(NcSelect): make id truly uniqual [\#4606](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4606) ([ShGKme](https://github.com/ShGKme))
- fix: handling of empty values in NcDateTimePickerNative [\#4540](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4540) ([st3iny](https://github.com/st3iny))
- fix(NcIconSvgWrapper): remove new keepId prop [\#4609](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4609) ([ShGKme](https://github.com/ShGKme))
- fix(NcInputField): Adjust styling of the internal label [\#4578](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4578) ([susnux](https://github.com/susnux))
- fix: invert datepicker buttons on dark mode [\#4618](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4618) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix(NcListItem): adjust paddings and hover styles for list items [\#4628](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4628) ([Antreesy](https://github.com/Antreesy))
- fix(NcActionInput): Set default trailing button label [\#4632](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4632) ([Pytal](https://github.com/Pytal))
- fix(NcAvatar): Ensure the aria label includes the status if there is any visible status indicator [\#4593](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4593) ([susnux](https://github.com/susnux))
- fix(NcAppNavigationItem): Ensure primary styling when the item is active [\#4650](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4650) ([susnux](https://github.com/susnux))
- fix(NcModal): Some modal improvments [\#4645](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4645) ([susnux](https://github.com/susnux))
- fix(NcActions): Various accessibility improvements [\#4648](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4648) ([Pytal](https://github.com/Pytal))
- Fix NcBreadcrumbs styles to wrap buttons [\#4640](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4640) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- fix(NcDashboardWidgetItem): do not assign href="" with empty link [\#4672](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4672) ([ShGKme](https://github.com/ShGKme))
- fix(NcActions): do not pass popoverBaseClass as an attr to NcPopover [\#4673](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4673) ([ShGKme](https://github.com/ShGKme))
- fix(NcActions): Allow to set attributes to inline actions [\#4671](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4671) ([susnux](https://github.com/susnux))
- fix(NcAvatar): make it a span phrasing element [\#4674](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4674) ([ShGKme](https://github.com/ShGKme))
- fix: Avoid closing all modals on escape if multiple are present [\#4677](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4677) ([juliushaertl](https://github.com/juliushaertl))
- fix: If a aria-selected button is present we focus on this one instead of the first entry [\#4678](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4678) ([juliushaertl](https://github.com/juliushaertl))
- fix(NcCheckboxRadioSwitch): Restore wrapper element prop [\#4679](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4679) ([Pytal](https://github.com/Pytal))
- fix(Nc*Field): do not pass all props to InputField BY filtering $props [\#4666](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4666) ([ShGKme](https://github.com/ShGKme))
- fix(NcDialog): NcModal registration [\#4682](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4682) ([Pytal](https://github.com/Pytal))
- fix: remove empty attributes values [\#4686](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4686) ([ShGKme](https://github.com/ShGKme))
- fix(dialog): fix component registration [\#4685](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4685) ([ShGKme](https://github.com/ShGKme))
- fix(NcCheckboxRadioSwitch): fix circular import [\#4691](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4691) ([raimund-schluessler](https://github.com/raimund-schluessler)
- fix(NcCheckboxRadioSwitch): forward indeterminate prop [\#4690](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4690) ([raimund-schluessler](https://github.com/raimund-schluessler)
- Change heading in EmptyContent to `span` [\#4702](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4702) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)
- fix(NcRelatedResourcesPanel): t is not defined [\#4705](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4705) ([raimund-schluessler](https://github.com/raimund-schluessler)
- fix(NcAppNavigationItem): Do not include `aria-expanded` attribute if there are no children [\#4715](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4715) ([susnux](https://github.com/susnux)
- fix(NcDialog): register components in NcDialogButton [\#4725](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4725) ([ShGKme](https://github.com/ShGKme)
- fix(NcActions): Detect navigation menu links correctly [\#4707](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4707) ([Pytal](https://github.com/Pytal)
- fix(NcSelect): Ensure selected option has enough contrast when the menu is opened [\#4733](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4733) ([susnux](https://github.com/susnux)
- fix(NcEmptyContent): Fix regression that changed the color of the description text [\#4735](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4735) ([susnux](https://github.com/susnux)
- fix(NcAppContent): Set normal scrollbar width on resizeable NcAppContentList [\#4710](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4710) ([mejo-](https://github.com/mejo-)
- fix(NcAvatar): Improve initials generation to filter out special characters [\#4737](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4737) ([susnux](https://github.com/susnux)
- fix(NcAvatar): remove alt attr from span[role=img] [\#4748](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4748) ([ShGKme](https://github.com/ShGKme)
- fix(NcSidebarTab): Ensure there is an `aria-label` if the `aria-labelledby` element does not exist [\#4736](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4736) ([susnux](https://github.com/susnux)
- add scoped to all ncappnavigation components [\#4730](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4730) ([szaimen](https://github.com/szaimen)
- Create outline for `focus-within` on RadioSwitch [\#4699](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4699) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)
- fix: NcUserBubble properties [\#4743](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4743) ([susnux](https://github.com/susnux)
- fix(NcUserBubble): only forward necessary props [\#4756](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4756) ([raimund-schluessler](https://github.com/raimund-schluessler)
- fix(NcInputField): Bring input field height to 44px and fixes its focus feedback [\#4718](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4718) ([marcoambrosini](https://github.com/marcoambrosini)
- fix(NcTimezonePicker): Add correct `aria-label` [\#4762](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4762) ([susnux](https://github.com/susnux)
- Fix input field trailing button alignment [\#4770](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4770) ([marcoambrosini](https://github.com/marcoambrosini)
- fix(NcSelectTags): Allow object type value [\#4771](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4771) ([Pytal](https://github.com/Pytal)
- fix(NcAppNavigation): Ensure `--app-navigation-padding` is set also on app-content [\#4776](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4776) ([susnux](https://github.com/susnux)
- fix(NcAppNavigation): add focus trap on mobile and improve a11y [\#4633](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4633) ([ShGKme](https://github.com/ShGKme)
- fix(NcAppNavigation): small screen support [\#4767](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4767) ([ShGKme](https://github.com/ShGKme)
### Other Changes
- Updates for project Nextcloud vue library [\#4757](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4757) ([transifex-integration](https://github.com/transifex-integration)
- Change styles for focused Select [\#4728](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4728) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter)
- feat(NcActions): focus the first action again if no action have a focus after render [\#4775](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4775) ([skjnldsv](https://github.com/skjnldsv)
- fix(NcAppNavigation): remove background square connecting toggle and navigation [\#4779](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4779) ([ShGKme](https://github.com/ShGKme)

## [v7.11.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.11.2) (2023-05-05)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.11.1...v7.11.2)

### :bug: Fixed bugs

- fix: Fix regression to still display references [\#4039](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4039) ([juliushaertl](https://github.com/juliushaertl))
- fix: Avoid showing the reference list if no results were found [\#4036](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4036) ([juliushaertl](https://github.com/juliushaertl))
- fix\(NcAppNavigation\): fix flex element styles causing resizing sidebar [\#4035](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4035) ([ShGKme](https://github.com/ShGKme))

## [v7.11.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.11.1) (2023-05-04)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.11.0...v7.11.1)

### :bug: Fixed bugs

- fix\(NcRichContenteditable\): Also quote ids containing a slash [\#4031](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4031) ([nickvergessen](https://github.com/nickvergessen))

## [v7.11.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.11.0) (2023-05-03)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.10.0...v7.11.0)

### :rocket: Enhancements

- feat\(NcRichContenteditable\): Allow to pass in an icon URL [\#3984](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3984) ([nickvergessen](https://github.com/nickvergessen))

### :bug: Fixed bugs

- Properly style timezone select in NcDatetimePicker [\#4014](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4014) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix\(NcAvatar\): Use correct prop to track "open" aka. "shown" state [\#4009](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4009) ([nickvergessen](https://github.com/nickvergessen))
- feat\(NcRichContenteditable\): Support iconUrl on mention bubbles [\#4007](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4007) ([nickvergessen](https://github.com/nickvergessen))
- NcAppSidebarTabs: fix activating the tab being added [\#4004](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4004) ([ShGKme](https://github.com/ShGKme))
- Disable wrap on overflow [\#3996](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3996) ([Pytal](https://github.com/Pytal))

### Closed pull requests

- Adjust breadcrumb CSS to new html structure [\#4026](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4026) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add aria-hidden attr to the whole navigation depending on a sidebar state [\#4016](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4016) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Allow to override showTrailingButton from an NcAction [\#4010](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4010) ([artonge](https://github.com/artonge))
- Use NcSelect in NcAppSidebar example [\#4003](https://github.com/nextcloud-libraries/nextcloud-vue/pull/4003) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Improve breadcrumbs accessibility [\#3990](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3990) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Update CHANGELOG for 7.10.0 [\#3986](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3986) ([Pytal](https://github.com/Pytal))

## [v7.10.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.10.0) (2023-04-18)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.9.0...v7.10.0)

### :rocket: Enhancements

- adjust sidebar to go full-screen earlier at 768px [\#3972](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3972) ([szaimen](https://github.com/szaimen))
- feat\(NcSelectTags\): Disable internal v-model and options handling [\#3968](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3968) ([Pytal](https://github.com/Pytal))
- Remove the smart picker modal padding [\#3962](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3962) ([julien-nc](https://github.com/julien-nc))
- Adjust some smart picker strings [\#3961](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3961) ([julien-nc](https://github.com/julien-nc))

### :bug: Fixed bugs

- Fix inverted validate label check in NcInputField [\#3980](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3980) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix\(NcHeaderMenu\): fix unnecessary filter invert [\#3974](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3974) ([skjnldsv](https://github.com/skjnldsv))
- Don't overwrite router-link href in NcBreadcrumb [\#3973](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3973) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Split Bootstrap version reference in Tooltip .scss [\#3979](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3979) ([danxuliu](https://github.com/danxuliu))
- Remove unused tooltip directive [\#3967](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3967) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add placeholder for heading inside of app content [\#3957](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3957) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Fix native open in a new tab in components with a custom router link [\#3954](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3954) ([ShGKme](https://github.com/ShGKme))

## [v7.9.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.9.0) (2023-04-04)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.8.5...v7.9.0)

### :rocket: Enhancements

- Add additionalTrapElements prop to settingsDialog [\#3947](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3947) ([hamza221](https://github.com/hamza221))
- enh\(NcDatetimePicker\): convert lang computed value to prop [\#3941](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3941) ([st3iny](https://github.com/st3iny))
- Add `aria-hidden` to icons of different components [\#3931](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3931) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Add accessible search field to emoji picker [\#3900](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3900) ([Pytal](https://github.com/Pytal))

### :bug: Fixed bugs

- fix\(NcButton\): ellipsis text on small width [\#3936](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3936) ([skjnldsv](https://github.com/skjnldsv))
- fix\(NcBreadcrumb\): cursor and native title and inline actions rendering text [\#3927](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3927) ([skjnldsv](https://github.com/skjnldsv))

## [v7.8.5](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.8.5) (2023-03-28)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.8.4...v7.8.5)

### :bug: Fixed bugs

- fix\(NcRichContenteditable\): Completely stop event propagation for keyup events [\#3937](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3937) ([nickvergessen](https://github.com/nickvergessen))
- fix\(NcRichText\): Match IP addresses as links [\#3935](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3935) ([nickvergessen](https://github.com/nickvergessen))
- fix\(NcRichText\): Fix NcRichText style [\#3932](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3932) ([julien-nc](https://github.com/julien-nc))

## [v7.8.4](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.8.4) (2023-03-24)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.8.3...v7.8.4)

### :bug: Fixed bugs

- Fix styles inheritance in `NcAvatar` when being mounted [\#3925](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3925) ([Antreesy](https://github.com/Antreesy))
- fix\(NcRichContenteditable\): Fix tribute emoji complete interfering unexpectedly aka. 🇨🇨  [\#3924](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3924) ([nickvergessen](https://github.com/nickvergessen))
- feat\(Emoji\): Suggest emojis based on text smiles [\#3923](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3923) ([mejo-](https://github.com/mejo-))
- fix\(NcListItem\): Bring back correct href for router-link links [\#3922](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3922) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v7.8.3](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.8.3) (2023-03-23)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.8.2...v7.8.3)

### :bug: Fixed bugs

- fix\(NcRichContenteditable\): prevent tribute from opening on keyup [\#3917](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3917) ([skjnldsv](https://github.com/skjnldsv))
- fix\(NcRichContenteditable\): Fix pasting XML and HTML content [\#3915](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3915) ([nickvergessen](https://github.com/nickvergessen))

## [v7.8.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.8.2) (2023-03-22)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.8.1...v7.8.2)

### :bug: Fixed bugs

- Fix missing NcVNodes import in NcListItem [\#3907](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3907) ([julien-nc](https://github.com/julien-nc))
- Fix doubling attrs in `NcPopover` and improve docs [\#3876](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3876) ([ShGKme](https://github.com/ShGKme))

### Closed pull requests

- Add missing trailing comma [\#3898](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3898) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v7.8.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.8.1) (2023-03-15)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.8.0...v7.8.1)

### :bug: Fixed bugs

- feat\(NcRichText\): Support icon class for smart picker integrations [\#3882](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3882) ([nickvergessen](https://github.com/nickvergessen))
- Fix navigate handler call [\#3878](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3878) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix select styles [\#3854](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3854) ([Pytal](https://github.com/Pytal))

### Closed pull requests

- Call the link picker "smart picker" and translate more strings [\#3888](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3888) ([julien-nc](https://github.com/julien-nc))
- Adjust excludeClickOutsideClasses type definition [\#3863](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3863) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove unused parseUrl parameter [\#3862](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3862) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Make NcLink non-functional [\#3861](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3861) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use single quotes in SCSS code [\#3860](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3860) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove superfluous input close icon template [\#3859](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3859) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Translate strings in `NcRich\*` components [\#3858](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3858) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Don't use deprecated v-deep [\#3857](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3857) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove empty beforeDestroy block in `NcReferencePicker` [\#3856](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3856) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add emits event sections for `NcRichText\*` components [\#3855](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3855) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Only transform necessary packages for jest [\#3849](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3849) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Migrate from `router-link`'s `tag` prop to `v-slot` [\#3775](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3775) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v7.8.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.8.0) (2023-03-02)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.7.2...v7.8.0)

### Closed pull requests

- Merge `@nextcloud/vue-richtext` into `@nextcloud/vue` [\#3841](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3841) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v7.7.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.7.2) (2023-02-28)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.7.1...v7.7.2)

### :bug: Fixed bugs

- Fix circular dependency with `@nextcloud/vue-richtext` [\#3834](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3834) ([julien-nc](https://github.com/julien-nc))
- Fix `NcRichContenteditable` placeholder position [\#3832](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3832) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Don't fail if `NcButton` default slot contains not only text [\#3827](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3827) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Adjust `NcDateTimePickerNative` icon position [\#3826](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3826) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Only hide search input in `NcSelect` if disabled and an element was selected [\#3833](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3833) ([susnux](https://github.com/susnux))
- Make `NcSelect` dropdown options rounded [\#3818](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3818) ([Pytal](https://github.com/Pytal))
- Make `NcVNodes` component non-functional [\#3816](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3816) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix high contrast mode optimization [\#3756](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3756) ([susnux](https://github.com/susnux))

## [v7.7.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.7.1) (2023-02-24)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.7.0...v7.7.1)

### :bug: Fixed bugs

- fix\(NcSelect\): Do not squash selected items with `no-wrap` set [\#3811](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3811) ([susnux](https://github.com/susnux))

### Closed pull requests

- Unify datetimepicker opacity in NcActionInput [\#3814](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3814) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Adjust `NcDatetimePicker` styling [\#3813](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3813) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use `NcTextField` for `NcActionInput` [\#3784](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3784) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v7.7.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.7.0) (2023-02-22)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.6.1...v7.7.0)

### :rocket: Enhancements

- Allow to add class to native datepicker input [\#3806](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3806) ([raimund-schluessler](https://github.com/raimund-schluessler))
- NcAppNavigation - change toggle icon for opened sidebar [\#3800](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3800) ([Antreesy](https://github.com/Antreesy))
- Use `NcSelect` for `NcTimezonePicker` [\#3781](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3781) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Allow using v-show for `NcModal`, fix modal-wrapper transition [\#3769](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3769) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add link picker in RichContentEditable with tribute [\#3708](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3708) ([julien-nc](https://github.com/julien-nc))

### :bug: Fixed bugs

- fix\(NcSelect\): Do not squash selected items with `no-wrap` set [\#3811](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3811) ([susnux](https://github.com/susnux))
- Allow value of type array for NcActionInput [\#3804](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3804) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix prop type check for NcPopover setReturnFocus [\#3803](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3803) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Show round corners for scrolling NcActions [\#3797](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3797) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Make datetimepicker full width in NcActionInput [\#3796](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3796) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix clipped background color for NcDatetimePicker [\#3794](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3794) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use `NcSelect` for `NcActionInput` type multiselect [\#3760](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3760) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Add missing trailing comma [\#3805](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3805) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use `NcTextField` for `NcActionInput` [\#3784](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3784) ([raimund-schluessler](https://github.com/raimund-schluessler))
- `NcSelect`: Selected options should not overflow the container [\#3759](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3759) ([susnux](https://github.com/susnux))

## [v7.6.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.6.1) (2023-02-20)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.6.0...v7.6.1)

### :rocket: Enhancements

- RichContent autocomplete not required [\#3757](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3757) ([jotoeri](https://github.com/jotoeri))

### :bug: Fixed bugs

- Fix hover for ActionInput datepicker native [\#3786](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3786) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix focused select border color with top placement [\#3782](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3782) ([Pytal](https://github.com/Pytal))
- Fix NcButton router-link [\#3777](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3777) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix nativeOn is only valid on components error, make rootElement computed [\#3771](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3771) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Don't regard 1024px width viewport as mobile [\#3768](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3768) ([mejo-](https://github.com/mejo-))
- NcPopover: Fix `setReturnFocus` property [\#3761](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3761) ([susnux](https://github.com/susnux))
- fix: Add a webpackrule to resolve module js files in `node\_modules` [\#3754](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3754) ([susnux](https://github.com/susnux))

### Closed pull requests

- Show NcDateTimePickerNative in NcPickers section [\#3787](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3787) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add examples for more ActionInput types [\#3785](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3785) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Migrate from deprecated `title` to `name` prop in docs [\#3776](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3776) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use component with :is [\#3774](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3774) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Adjust emits option [\#3773](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3773) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add node-polyfill-webpack-plugin [\#3752](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3752) ([GretaD](https://github.com/GretaD))

## [v7.6.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.6.0) (2023-02-15)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.5.0...v7.6.0)

### :rocket: Enhancements

- Add keyboard focus border to select options [\#3711](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3711) ([Pytal](https://github.com/Pytal))

### :bug: Fixed bugs

- Fix tag search [\#3747](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3747) ([Pytal](https://github.com/Pytal))
- Fix throw when header menu contains no tabbable nodes [\#3733](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3733) ([Pytal](https://github.com/Pytal))
- Fix hidden select [\#3732](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3732) ([Pytal](https://github.com/Pytal))
- fix\(package\): export more components to main package [\#3729](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3729) ([juliushaertl](https://github.com/juliushaertl))
- Fix `NcButton` cursor style [\#3728](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3728) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use proper default actions aria label in `NcListItem` [\#3714](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3714) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix dashboard padding with half-empty content view [\#3712](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3712) ([nickvergessen](https://github.com/nickvergessen))
- Fix setting trailingButtonLabel for PasswordField [\#3710](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3710) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix NcAppNavigationItem hasUtils computed [\#3709](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3709) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix\(ncselect\): Fix styling if a custom theme is applied [\#3707](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3707) ([susnux](https://github.com/susnux))
- Fix: update transition styles for NcButton [\#3697](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3697) ([Antreesy](https://github.com/Antreesy))
- Fix keyboard navigation of modal slides [\#3690](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3690) ([Pytal](https://github.com/Pytal))
- Add aria-labels to colorpicker buttons [\#3680](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3680) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Remove outdated and unused menu-align attributes [\#3749](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3749) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Allow custom target names for the link target [\#3745](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3745) ([susnux](https://github.com/susnux))
- Remove last usage of ´--color-primary-element-lighter` [\#3742](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3742) ([susnux](https://github.com/susnux))
- Allow inline actions for appnavigationitem [\#3741](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3741) ([marcoambrosini](https://github.com/marcoambrosini))
- Add missing space in NcMultiselect ternary expression [\#3739](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3739) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Move NcButton to render function [\#3726](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3726) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Simplify the render function of NcBreadcrumbs [\#3725](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3725) ([raimund-schluessler](https://github.com/raimund-schluessler))
- No background for `tertiary-no-background` `NcActions` [\#3724](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3724) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add missing trailing comma [\#3718](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3718) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add aria-labels to example buttons in docs [\#3713](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3713) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Adjust style of NcSelect to match other input elements [\#3701](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3701) ([susnux](https://github.com/susnux))
- Small cleanup of the NcActions docs [\#3700](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3700) ([raimund-schluessler](https://github.com/raimund-schluessler))
- chore\(l10n\): update l10n readme [\#3686](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3686) ([skjnldsv](https://github.com/skjnldsv))
- Replace custom toolip with native one on Avatar component [\#3678](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3678) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))

## [v7.5.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.5.0) (2023-01-19)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.4.0...v7.5.0)

### :rocket: Enhancements

- Set placement of select dropdown [\#3656](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3656) ([Pytal](https://github.com/Pytal))
- Breadcrumb: add exact prop and fix style [\#3654](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3654) ([skjnldsv](https://github.com/skjnldsv))

## [v7.4.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.4.0) (2023-01-11)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.3.0...v7.4.0)

### :rocket: Enhancements

- Add NcIconSvgWrapper to public API [\#3630](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3630) ([Pytal](https://github.com/Pytal))
- feat\(AppNavigationItem\): Add href support [\#3612](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3612) ([skjnldsv](https://github.com/skjnldsv))
- Add `NcSavingIndicatorIcon` [\#3575](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3575) ([susnux](https://github.com/susnux))
- feat\(AppNavigationItem\): Allow native title attribute control [\#3617](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3617) ([skjnldsv](https://github.com/skjnldsv))

### :bug: Fixed bugs

- Do not add aria-label when avatar is not interactive [\#3618](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3618) ([Pytal](https://github.com/Pytal))
- Fix action input styles [\#3614](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3614) ([Pytal](https://github.com/Pytal))
- fix\(ProgressBar\): Fix progress rounded corners [\#3613](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3613) ([skjnldsv](https://github.com/skjnldsv))
- fix\(NcAppNavigationItem\): Make sure that icon-collapse styles take precendense over NcButton styles [\#3608](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3608) ([juliushaertl](https://github.com/juliushaertl))
- Fix appNavigationItem collapse labels [\#3598](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3598) ([skjnldsv](https://github.com/skjnldsv))
- Adjust border thickness of NcRichContenteditable [\#3637](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3637) ([Chartman123](https://github.com/Chartman123))
- Create `aria-label` for icon link [\#3597](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3597) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))

### Closed pull requests

- Add console warning messages for deprecated multiselect components [\#3573](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3573) ([Pytal](https://github.com/Pytal))

## [v7.3.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.3.0) (2022-12-23)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.2.0...v7.3.0)

### :rocket: Enhancements

- Add title prop to components for native tooltips [\#3569](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3569) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Allow accessible labels for NcActionInput [\#3517](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3517) ([Pytal](https://github.com/Pytal))

### :bug: Fixed bugs

- Fix CheckboxHeight [\#3584](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3584) ([jotoeri](https://github.com/jotoeri))
- Add more space for unread counter so its aligned with action menu [\#3572](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3572) ([GretaD](https://github.com/GretaD))


## [v7.2.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.2.0) (2022-12-09)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.1.0...v7.2.0)

### :rocket: Enhancements

- Add NcHeaderMenu [\#3489](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3489) ([skjnldsv](https://github.com/skjnldsv))

### :bug: Fixed bugs

- Add button role for NcButton with href [\#3532](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3532) ([Pytal](https://github.com/Pytal))
- Fix focus returning to top of page instead of actions toggle button [\#3530](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3530) ([Pytal](https://github.com/Pytal))
- Fix icon repeat and position for AppNavigationItem [\#3539](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3539) ([skjnldsv](https://github.com/skjnldsv))
- Fix jsdoc: Add missing documentation for events [\#3545](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3545) ([susnux](https://github.com/susnux))
- Increase input field border contrast [\#3551](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3551) ([Pytal](https://github.com/Pytal))
- Increase NcSelect border contrast [\#3552](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3552) ([Pytal](https://github.com/Pytal))
- Revert "fix sidebar scrolling for small displays" [\#3559](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3559) ([skjnldsv](https://github.com/skjnldsv))
- Scope global \#content styles via extra class [\#3537](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3537) ([st3iny](https://github.com/st3iny))

## [v7.1.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.1.0) (2022-11-29)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.0.1...v7.1.0)

### :rocket: Enhancements

- Add accessible NcSelect and NcSelectTags components [\#3435](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3435) ([Pytal](https://github.com/Pytal))
- Extend NcInputField props and forward $attrs to NcPasswordField and NcTextField [\#3485](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3485) ([skjnldsv](https://github.com/skjnldsv))
- Move loadState to data for better mockability [\#3502](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3502) ([skjnldsv](https://github.com/skjnldsv))
- Widen container prop type passed to NcPopover [\#3462](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3462) ([Pytal](https://github.com/Pytal))
- Allow querying for resources with complex item ids [\#3404](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3404) ([Pytal](https://github.com/Pytal))
- Allow to provide a custom palette to the ColorPicker [\#3384](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3384) ([skjnldsv](https://github.com/skjnldsv))
- Export NcMentionBubble and NcAutoCompleteResult [\#3373](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3373) ([vinicius73](https://github.com/vinicius73))
- Add guest content component [\#3369](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3369) ([ChristophWurst](https://github.com/ChristophWurst))

### :bug: Fixed bugs

- Fix multiselect checkmark and plus icon [\#3513](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3513) ([skjnldsv](https://github.com/skjnldsv))
- Make gap in NcAppNavigation consistent in nested lists [\#3506](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3506) ([juliushaertl](https://github.com/juliushaertl))
- Fix value type for DateTimePickerNative [\#3491](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3491) ([skjnldsv](https://github.com/skjnldsv))
- Define global focus trap [\#3478](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3478) ([skjnldsv](https://github.com/skjnldsv))
- fix the size of the popper element [\#3445](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3445) ([szaimen](https://github.com/szaimen))
- fix sidebar scrolling for small displays [\#3444](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3444) ([szaimen](https://github.com/szaimen))
- Fix dark themed color picker and use button component [\#3411](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3411) ([Pytal](https://github.com/Pytal))
- Fix password\_policy fallback handling [\#3408](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3408) ([nickvergessen](https://github.com/nickvergessen))
- Fix missing half-empty dashboard empty content view [\#3407](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3407) ([nickvergessen](https://github.com/nickvergessen))
- Fix DateTimePicker example and translation [\#3405](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3405) ([skjnldsv](https://github.com/skjnldsv))
- Fix outdated variables [\#3367](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3367) ([jancborchardt](https://github.com/jancborchardt))
- Comment placeholder wording fix [\#3454](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3454) ([Jerome-Herbinet](https://github.com/Jerome-Herbinet))
- Expand color picker width only when using advanced fields [\#3410](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3410) ([Pytal](https://github.com/Pytal))
- Fix empty content height in NcDashboardWidget in N in N in N [\#3372](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3372) ([CarlSchwan](https://github.com/CarlSchwan))

### Closed pull requests

- Finish emoji focus cleaning [\#3504](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3504) ([skjnldsv](https://github.com/skjnldsv))

## [v7.0.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.0.1) (2022-10-14)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v7.0.0...v7.0.1)

### :bug: Fixed bugs

- use @nextcloud/focus-trap instead of focus-trap [\#3347](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3347) ([vinicius73](https://github.com/vinicius73))

### :rocket: Enhancements

- Migrate to use `:deep` selector instead of deprecated `::v-deep` [\#3348](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3348) ([susnux](https://github.com/susnux))

## [v7.0.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v7.0.0) - 2022-10-12

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v6.0.0...v7.0.0)

### :boom: Breaking changes

- This component library release requires Nextcloud 25 or later
- We changed the container layout to adapt to the design changes with Nextcloud 25
- The body is no longer the main scroll area but instead the app content
	- Please do careful testing of your user interface, especially in regards to the following components and scroll behaviour:
		- NcContent
		- NcAppNavigation
		- NcAppContent
		- NcAppSidebar
- Properties and slot names of NcEmptyContent changed. Also, everything outside a slot is ignored now
- Inside NcActions, only Vue components are considered as children

#### Migration guide

- Scroll listeners need to be adapted to watch for the scroll on the NcAppContent container instead of the main document
- If you are using sticky headers in your app you might need to adjust the css top property as the app content container is now the scrollable element. For any contained sticky that had a header height top spacing before you should be able to set that to 0
- Make sure that everything in NcEmptyContent is in one of the supported slots
- Make sure that NcActions contain only Vue components. If they contain plain HTML, move this into a separate Vue component

### :rocket: Enhancements

- Add advanced fields to color picker [#3324](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3324) ([@Pytal](https://github.com/Pytal))
- Enables ESM Modules [#3283](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3283) ([@vinicius73](https://github.com/vinicius73))
- Add styleguide example for non-user avatar [\#3270](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3270) ([ChristophWurst](https://github.com/ChristophWurst))
- Live refresh image and displayname based avatar on update [\#3266](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3266) ([Pytal](https://github.com/Pytal))
- Forward the autofocus attribute to input field component [\#3245](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3245) ([kesselb](https://github.com/kesselb))
- Allow 'search' as type prop for NcTextField [\#3190](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3190) ([artonge](https://github.com/artonge))
- Add gap between nav entry [\#3235](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3235) ([CarlSchwan](https://github.com/CarlSchwan))
- Fix for border-radius being too large for 3-line entries like in Mail [\#3136](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3136) ([jancborchardt](https://github.com/jancborchardt))
- Add related resources panel component [\#3081](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3081) ([Pytal](https://github.com/Pytal))
- Add a native datetime picker [\#3063](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3063) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Always show NcAppSettingsDialog title [\#3074](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3074) ([raimund-schluessler](https://github.com/raimund-schluessler))

### :bug: Fixed bugs

- Also use menuOpen state in NcAppNavigationItem [#3350](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3350) ([@st3iny](https://github.com/st3iny))
- Update cypress base snapshots after changes to server [#3352](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3352) ([@raimund-schluessler](https://github.com/raimund-schluessler))
- Fix app content growing too wide [#3329](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3329) ([@st3iny](https://github.com/st3iny))
- Fix SCSS to CSS variable assignment [#3261](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3261) ([@susnux](https://github.com/susnux))
- Fix non-user avatar on complex background [\#3272](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3272) ([ChristophWurst](https://github.com/ChristophWurst))
- Fix initials color of new non-user avatars [\#3271](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3271) ([ChristophWurst](https://github.com/ChristophWurst))
- Mark resource button styles as important to fix styles in some contexts [\#3259](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3259) ([Pytal](https://github.com/Pytal))
- Make app navigation settings pixel perfect-ish [\#3256](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3256) ([ChristophWurst](https://github.com/ChristophWurst))
- Move the close button to the end of the content [\#3230](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3230) ([marcoambrosini](https://github.com/marcoambrosini))
- Fix NcEmptyContent used inside NcModal [\#3253](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3253) ([nickvergessen](https://github.com/nickvergessen))
- Add proper margin to the counter [\#3250](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3250) ([marcoambrosini](https://github.com/marcoambrosini))
- Fix avatar border color [\#3244](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3244) ([nickvergessen](https://github.com/nickvergessen))
- Fix single action detection [\#3212](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3212) ([st3iny](https://github.com/st3iny))
- Fix loading avatar status [\#3204](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3204) ([CarlSchwan](https://github.com/CarlSchwan))
- Fix overwriting placeholder property in NcDatetimePicker [\#3202](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3202) ([Chartman123](https://github.com/Chartman123))
- Fix scrolling in styleguide [\#3200](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3200) ([marcoambrosini](https://github.com/marcoambrosini))
- Right-align nav item utils [\#3178](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3178) ([ChristophWurst](https://github.com/ChristophWurst))
- Fix active and focus frame [\#3201](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3201) ([CarlSchwan](https://github.com/CarlSchwan))
- Fix app navigation backdrop blur [\#3189](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3189) ([ChristophWurst](https://github.com/ChristophWurst))
- AppNavigationItem actions visibility [\#3165](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3165) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Spacing in app navigation and make the setting pill style [\#3158](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3158) ([juliushaertl](https://github.com/juliushaertl))
- Actions positioning [\#3157](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3157) ([juliushaertl](https://github.com/juliushaertl))
- .active state of app list items [\#3147](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3147) ([ChristophWurst](https://github.com/ChristophWurst))

### Closed pull requests

- Allow opting out of automatic NcModal remounting [\#3219](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3219) ([Pytal](https://github.com/Pytal))
- Fix multiselect background color spilling outside the component [\#3252](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3252) ([ChristophWurst](https://github.com/ChristophWurst))
- Update design of related resources panel [\#3236](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3236) ([Pytal](https://github.com/Pytal))
- Fix a word puzzle in NcDashboardWidget component [\#3225](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3225) ([CarlSchwan](https://github.com/CarlSchwan))
- Fix NcAppNavigationItem, pass correct boundaries-element NcActions [\#3197](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3197) ([eneiluj](https://github.com/eneiluj))
- Limit max width of the settings [\#3192](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3192) ([CarlSchwan](https://github.com/CarlSchwan))
- Fix the NcPopoverMenu component [\#3191](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3191) ([CarlSchwan](https://github.com/CarlSchwan))
- fix comments border-radius [\#3175](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3175) ([szaimen](https://github.com/szaimen))
- \[PoC\] Use github source css for styleguide [\#3139](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3139) ([skjnldsv](https://github.com/skjnldsv))
- Use dark themed avatar on dark theme [\#3119](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3119) ([CarlSchwan](https://github.com/CarlSchwan))
- Use events provided by floating-vue [\#3149](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3149) ([raimund-schluessler](https://github.com/raimund-schluessler))


## v6.0.0 (unreleased)

### :boom: Breaking Changes
* [#2600](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2600) Migrate to floating-vue ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2867](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2867) Accessible EmptyContent component ([@Pytal](https://github.com/Pytal))
* [#2630](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2630) show the action buttons on top of the modal always by default ([@szaimen](https://github.com/szaimen))
* [#1946](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1946) Properly align appnavigationtoggle ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2738](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2738) Move close button within modal boundaries ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2720](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2720) Add icon slot to AppNavigationNew component ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2603](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2603) Comply with eslint for event name ([@artonge](https://github.com/artonge))
* [#2704](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2704) Put the children of AppNavigationItem outside of the main item ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2980](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2980) Bump @nextcloud/eslint-config from 8.0.0 to 8.1.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
* ~~[#2911](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2911) Use render function in Actions component ([@raimund-schluessler](https://github.com/raimund-schluessler))~~ No more breaking after [#3006](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3006) in beta.2
* [#2929](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2929) Bump vue from 2.6.14 to 2.7.8 ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2923](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2923) Enforce setting section ids ([@nickvergessen](https://github.com/nickvergessen))
* [\#3058](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3058) Add Nc prefix to all components ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3106](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3106) Fix emptyContent once more ([jotoeri](https://github.com/jotoeri))
* [\#3090](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3090) Fix EmptyContent Reactivity ([jotoeri](https://github.com/jotoeri))

### :rocket: Enhancements
* [#2875](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2875) Adjust loading icon style, replace `fillColor` prop ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2879](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2879) Turn the button into router-link when to is there ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2565](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2565) Improve SettingsInputText component ([@quentinguidee](https://github.com/quentinguidee))
* [#2808](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2808) Add a11y utility ([@Pytal](https://github.com/Pytal))
* [#2715](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2715) Augment keyboard accessibility of AppSidebar ([@Pytal](https://github.com/Pytal))
* [#2757](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2757) Alternative style for CheckboxRadioSwitch (radio type) ([@eneiluj](https://github.com/eneiluj))
* [#2779](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2779) Keep text in `InputConfirmCancel` static ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2776](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2776) Improve CheckboxRadioSwitch accessibility ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2727](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2727) Add material design loading icon ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2747](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2747) make the sidebare full-width on small screens ([@szaimen](https://github.com/szaimen))
* [#2630](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2630) show the action buttons on top of the modal always by default ([@szaimen](https://github.com/szaimen))
* [#2738](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2738) Move close button within modal boundaries ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2577](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2577) Add ColorPicker feedback on selection ([@quentinguidee](https://github.com/quentinguidee))
* [#2719](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2719) Add title section to settingsdialog ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2718](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2718) Add actions slot to dashboard widget item ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2571](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2571) Use large border-radius in AppNavigation ([@quentinguidee](https://github.com/quentinguidee))
* [#2713](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2713) Use large border-radius in Action Button ([@GretaD](https://github.com/GretaD))
* [#2704](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2704) Put the children of AppNavigationItem outside of the main item ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2552](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2552) Make emojis selectable by tab ([@skjnldsv](https://github.com/skjnldsv))
* [#2668](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2668) Merge Dashboard components into repository ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2654](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2654) add handle keyboard focus for accessibility ([@vanpertsch](https://github.com/vanpertsch))
* [#2629](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2629) small cleanup of small modal size ([@szaimen](https://github.com/szaimen))
* [#2911](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2911) Use render function in Actions component ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2998](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2998) Import tooltip directive only locally ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2983](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2983) Simplify webpack configuration ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2973](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2973) Allow to filter the available tags ([@nickvergessen](https://github.com/nickvergessen))
* [#2868](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2868) Create TextField component ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2856](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2856) Fix ListItem css & add compact mode ([@jotoeri](https://github.com/jotoeri))
* [\#3060](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3060) Allow to render x items outside an Actions menu ([skjnldsv](https://github.com/skjnldsv))
* [\#3040](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3040) Allow ListItem components to link to external links ([tcitworld](https://github.com/tcitworld))
* [\#3082](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3082) Allow more than text on EmptyContent description ([jotoeri](https://github.com/jotoeri))
* [\#3078](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3078) Add ref to NcInputField in NcTextField ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3056](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3056) 📰 Update AppNavigationItem design ([marcoambrosini](https://github.com/marcoambrosini))
* [\#3055](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3055) ListItem Design update  ([marcoambrosini](https://github.com/marcoambrosini))
* [\#3100](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3100) Improve multiselect ([CarlSchwan](https://github.com/CarlSchwan))
* [\#3057](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3057) 🥛 Make app navigation semi-transparent ([GretaD](https://github.com/GretaD))
* [\#3070](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3070) Make unread counter primary colour ([GretaD](https://github.com/GretaD))
* [\#3142](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3142) Make the app content list 300px min ([ChristophWurst](https://github.com/ChristophWurst))

### :bug: Fixed bugs
* [#2878](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2878) Fix single action validation ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2877](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2877) Bring back AppNavigationToggle tooltip ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2895](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2895) Fix issues with Multiselect component ([@nickvergessen](https://github.com/nickvergessen))
* [#2882](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2882) Fix box shadow colour of "tertiary-on-primary" button ([@danxuliu](https://github.com/danxuliu))
* [#2871](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2871) Add a button style for being used on primary like in the header ([@nickvergessen](https://github.com/nickvergessen))
* [#2865](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2865) Make captions real headings for improved a11y ([@nickvergessen](https://github.com/nickvergessen))
* [#2855](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2855) Fix invalid setting section IDs ([@nickvergessen](https://github.com/nickvergessen))
* [#2695](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2695) Change Prev/next links to buttons ([@vanpertsch](https://github.com/vanpertsch))
* [#2845](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2845) Add headline to sidebar sections to improve landmarks ([@nickvergessen](https://github.com/nickvergessen))
* [#2846](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2846) Fix HTML validation of AppNavigationToggle ([@nickvergessen](https://github.com/nickvergessen))
* [#2840](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2840) Fix invalid tabindex and role ([@nickvergessen](https://github.com/nickvergessen))
* [#2841](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2841) Remove invalid test-attr ([@nickvergessen](https://github.com/nickvergessen))
* [#2833](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2833) Fix vue material design icons HTML validation ([@nickvergessen](https://github.com/nickvergessen))
* [#1946](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1946) Properly align appnavigationtoggle ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2738](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2738) Move close button within modal boundaries ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2576](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2576) Increase padding of ColorPicker ([@quentinguidee](https://github.com/quentinguidee))
* [#2638](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2638) Fix lifecycle hook name in Avatar ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2628](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2628) Fix styleguide serve ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2533](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2533) [MultiSelect] pass the #noResult slot to the underlying component ([@eneiluj](https://github.com/eneiluj))
* [#2999](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2999) Also export tooltip options ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2997](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2997) Fix regressions from floating-vue migration ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2991](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2991) Fix Actions styling in Breadcrumbs ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2984](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2984) Fix button import in modal example ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2981](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2981) Add aria-label to single action button ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2911](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2911) Use render function in Actions component ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2961](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2961) Fix focusing last action with page-down ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2946](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2946) Make sure modal ids are unique ([@nickvergessen](https://github.com/nickvergessen))
* [#2883](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2883) Do not treat an avatar as a button if there is no menu ([@danxuliu](https://github.com/danxuliu))
* [#2929](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2929) Bump vue from 2.6.14 to 2.7.8 ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2938](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2938) Revert "Bump vue-styleguidist from 4.48.0 to 4.50.0" ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2912](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2912) Fix missing icon in actions custom icon slot ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2856](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2856) Fix ListItem css & add compact mode ([@jotoeri](https://github.com/jotoeri))
* [#2894](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2894) Add more explicit title to the sidebar close button ([@juliushaertl](https://github.com/juliushaertl))
* [#3017](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3017) Fix icon-class, re-add default-icon support for Actions ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#3006](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3006) Fix single button action icon attribute ([@PVince81](https://github.com/PVince81))
* [\#3059](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3059) Fix breadcrumbs dropdown icon alignment ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3046](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3046) Add missing trailing comma ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3035](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3035) Correctly overwrite app-settings modal style ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3034](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3034) Implement empty content icon slot in DashboardWidget ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3031](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3031) Fix reference to closed menu in "aria-controls" ([danxuliu](https://github.com/danxuliu))
* [\#3030](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3030) Don't return focus after close-after-click ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3023](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3023) Dismis focus trap when component gets destroyed ([juliushaertl](https://github.com/juliushaertl))
* [\#3022](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3022) Allow click outside for Popover focus trap ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3021](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3021) Disable focus-trap for Popover by default ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3020](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3020)  Fix issues with focus trap on modal ([juliushaertl](https://github.com/juliushaertl))
* [\#3037](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3037) ```aria-expanded``` was fixed for Multiselect.vue ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
* [\#3077](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3077) Make input field button style take precedence ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3076](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3076) Fix NcAppNavigationItem docs ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3075](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3075) Fix listitem tabbed navigation ([marcoambrosini](https://github.com/marcoambrosini))
* [\#3074](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3074) Always show NcAppSettingsDialog title ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3071](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3071) Fix link in docs to NcCounterBubble ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3069](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3069) Only set target and rel attributes when href != '\#' ([tcitworld](https://github.com/tcitworld))
* [\#3065](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3065) Fix margin for Modal inline actions ([skjnldsv](https://github.com/skjnldsv))
* [\#2970](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2970) Fix InputField focus state ([marcoambrosini](https://github.com/marcoambrosini))
* [\#3066](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3066) Fix Modal closing ([skjnldsv](https://github.com/skjnldsv))
* [\#3111](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3111) Ensure proper actions menu styling ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests
* [\#3019](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3019) Add note about pre-releases to the readme ([juliushaertl](https://github.com/juliushaertl))
* [\#3089](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3089) Fix EmptyContent comments example in docs ([Pytal](https://github.com/Pytal))
* [\#3072](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3072) Remove debug log statement ([st3iny](https://github.com/st3iny))
* [\#3113](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3113) Add aria-modal to Modal dialog ([PVince81](https://github.com/PVince81))
* [\#3080](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3080) Fix contrast of next/prev modal buttons ([Pytal](https://github.com/Pytal))
* [\#3141](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3141) Simplify exports ([Pytal](https://github.com/Pytal))
* [\#3140](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3140) Improve text fields ([CarlSchwan](https://github.com/CarlSchwan))
* [\#3137](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3137) Remove unused \#counter template from ListItem docs ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3135](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3135) Polish password field component ([CarlSchwan](https://github.com/CarlSchwan))
* [\#3132](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3132) Add slot for dot indicator in NcListItem.vue ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
* [\#3130](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3130) Add missing tab in NcModal CSS ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3122](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3122) Use correct Nc components prefix everywhere ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3112](https://github.com/nextcloud-libraries/nextcloud-vue/pull/3112) Update variables.css from nextcloud server ([vinicius73](https://github.com/vinicius73))


## [v5.3.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v5.3.1) (2022-04-08)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v5.3.0...v5.3.1)

### Fixed bugs

- Fix button disable state and reactivity [\#2622](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2622) ([skjnldsv](https://github.com/skjnldsv))
- Fix border radius for small progress bar [\#2618](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2618) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Revert "Use large corner radius for the Popover component" [\#2611](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2611) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- fix positioning of content text [\#2601](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2601) ([szaimen](https://github.com/szaimen))
- Fix EmptyContent svg size [\#2592](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2592) ([skjnldsv](https://github.com/skjnldsv))
- Fix visual issue of the settings tab in the documentation [\#2573](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2573) ([quentinguidee](https://github.com/quentinguidee))
- Don't give normal and large modals a fixed height [\#2610](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2610) ([szaimen](https://github.com/szaimen))
- Cleanup tooltip and popover CSS [\#2602](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2602) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Ensure l10n check uses right node and npm version [\#2596](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2596) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Action button vue class [\#2586](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2586) ([CarlSchwan](https://github.com/CarlSchwan))
- Replace deprecated String.prototype.substr\(\) [\#2579](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2579) ([CommanderRoot](https://github.com/CommanderRoot))
- Only show actions if actions given for breadcrumbs [\#2559](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2559) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v5.3.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v5.3.0) (2022-03-31)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v5.2.1...v5.3.0)

### Fixed bugs

- Fix tertiary no background button color [\#2589](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2589) ([marcoambrosini](https://github.com/marcoambrosini))
- Fix tertiary buttons hover feedback [\#2583](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2583) ([marcoambrosini](https://github.com/marcoambrosini))
- Fix the ProgressBar display in the documentation [\#2564](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2564) ([quentinguidee](https://github.com/quentinguidee))

### Closed pull requests

- Add tertiary buttons with background and make them the default [\#2585](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2585) ([marcoambrosini](https://github.com/marcoambrosini))
- Update variables.css [\#2574](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2574) ([skjnldsv](https://github.com/skjnldsv))


## [v5.2.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v5.2.1) (2022-03-24)
Releasing this patch to re-trigger an npm package build since last release github was down


## [v5.2.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v5.2.0) (2022-03-23)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v5.1.1...v5.2.0)

### Enhancements

- Use large corner radius for the Popover component [\#2566](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2566) ([quentinguidee](https://github.com/quentinguidee))
- Inherit attrs and forward listeners in the emojipicker's popover [\#2563](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2563) ([marcoambrosini](https://github.com/marcoambrosini))
- Add aria-description to AppNavigationItem [\#2548](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2548) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))

### Fixed bugs

- Fix secondary button with old style as temporary solution [\#2562](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2562) ([nickvergessen](https://github.com/nickvergessen))
- Pass in a boolean instead of a string in the 'wide' prop [\#2556](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2556) ([marcoambrosini](https://github.com/marcoambrosini))


## [v5.1.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v5.1.1) (2022-03-16)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v5.1.0...v5.1.1)

### Fixed bugs

- Fix error spam of icon only buttons part2 [\#2547](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2547) ([nickvergessen](https://github.com/nickvergessen))
- Fix error spam from buttons [\#2540](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2540) ([nickvergessen](https://github.com/nickvergessen))
- 🐛 \(\#2529\): fix missing firstAction [\#2532](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2532) ([vinicius73](https://github.com/vinicius73))

## [v5.1.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v5.1.0) (2022-02-28)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v4.4.0...v5.1.0)

### Enhancements

- Add button native type prop on \<Button\> [\#2516](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2516) ([tcitworld](https://github.com/tcitworld))
- increase the small modal width [\#2496](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2496) ([szaimen](https://github.com/szaimen))
- Allow Breadcrumbs "to" prop to be an object [\#2491](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2491) ([tcitworld](https://github.com/tcitworld))

### Fixed bugs

- Change appearance of the slot "icon" at AppNavigationItem [\#2506](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2506) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Fix shrinking of last breadcrumb for narrow width [\#2492](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2492) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- fix: imports from emoji-mart-vue-fast [\#2521](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2521) ([max-nextcloud](https://github.com/max-nextcloud))

## [v5.0.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v5.0.0) (2022-02-10)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v4.3.0...v5.0.0)

### Enhancements

- Implement showing global crumb actions [\#2444](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2444) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add option to always show actions [\#2419](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2419) ([marcoambrosini](https://github.com/marcoambrosini))
- Move crumb Actions into hover background area [\#2416](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2416) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Allow custom action menu icon for breadcrumb [\#2414](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2414) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use MD icon for hidden crumbs action button icons [\#2413](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2413) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Adjust breadcrumb appearance [\#2411](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2411) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Automatically use Nextcloud translated months, days and years [\#2397](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2397) ([skjnldsv](https://github.com/skjnldsv))

### Fixed bugs

- AppNavigationItem.vue: updating of this.$slots [\#2483](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2483) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Fix md icon position for Actions with title [\#2435](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2435) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix dragging onto hidden crumbs [\#2412](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2412) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Limit avatar request sizes to 64 and 512 pixel [\#2486](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2486) ([nickvergessen](https://github.com/nickvergessen))
- Add aria label to the ActionInput component [\#2472](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2472) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Add variable for crumb class name [\#2450](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2450) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Show menu title for single Action [\#2436](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2436) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Set sidebar tab content height to be 100 percent [\#2431](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2431) ([kiranparajuli589](https://github.com/kiranparajuli589))
- Free closeOnSelect [\#2391](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2391) ([jotoeri](https://github.com/jotoeri))
## [v4.3.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v4.3.0) (2021-12-01)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v4.2.0...v4.3.0)

### Fixed bugs

- Change background style target for tab icons [\#2374](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2374) ([artonge](https://github.com/artonge))

### Closed pull requests

- Reduce size of status icons in Avatar component [\#2323](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2323) ([CarlSchwan](https://github.com/CarlSchwan))
- Free closeOnSelect [\#2391](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2391) ([jotoeri](https://github.com/jotoeri)))

## [v4.2.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v4.1.1) (2021-09-28)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v4.1.1...v4.2.0)

### Enhancements

- Use material design icon for AppSidebar star [\#2265](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2265) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Bump vue-material-design-icons from 4.12.1 to 4.13.0 [\#2269](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2269)
- Allow material design icons for appnavigationitem [\#2276](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2276) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Unify linkify usage, move to linkify-string [\#2281](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2281) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Unify linkify usage, move to linkify-string [\#2281](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2281) ([raimund-schluessler](https://github.com/raimund-schluessler))### Fixed bugs
- Add outlined counter [\#2287](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2268) ([marcoambrosini](https://github.com/marcoambrosini))

### Fixed bugs

- Set material design icon size to 20 [\#2268](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2268) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix missing icon [\#2297](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2297#event-5378397330) ([Pytal](https://github.com/Pytal))

## [v4.1.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v4.1.1) (2021-09-16)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v4.1.0...v4.1.1)

### Enhancements

- Use material design icon for appsidebar close [\#2212](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2212) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use material design icon for settings icon [\#2213](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2213) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Bump @nextcloud/calendar-js from 1.1.1 to 2.0.0 [\#2204](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2204)

### Fixed bugs

- Do not duplicate character in Highlight directive, only highlight first match occurence [\#2226](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2226) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Disable actions when the only action is disabeld [\#2227](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2227) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Make timestamp of unread msg not bold [\#2228](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2228) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix empty user bubble [\#2241](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2241) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Stop filtering Actions in $slots [\#2254](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2254) ([skjnldsv](https://github.com/skjnldsv))
- Don't rely on Vue.prototype.t and properly extract all strings [\#2231](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2231) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v4.1.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v4.1.0) (2021-08-23)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v4.0.3...v4.1.0)

### Enhancements

- Set default slideshowdelay to 5000 ms [\#2122](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2122) ([szaimen](https://github.com/szaimen))
- Optionally make the DatetimePicker timezone-aware [\#2100](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2100) ([ChristophWurst](https://github.com/ChristophWurst))
- Fix videoplayer controls in viewer [\#2099](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2099) ([szaimen](https://github.com/szaimen))
- Add timezone picker [\#2095](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2095) ([ChristophWurst](https://github.com/ChristophWurst))

### Fixed bugs

- Check that userId is defined before querying [\#2159](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2159) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Use new named slot syntax [\#2160](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2160) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add a hint about the tooltip directive [\#2151](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2151) ([nickvergessen](https://github.com/nickvergessen))
- Fix typo on registering the directive [\#2150](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2150) ([nickvergessen](https://github.com/nickvergessen))
- Simplify release process [\#2085](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2085) ([skjnldsv](https://github.com/skjnldsv))

## [v4.0.3](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v4.0.3) (2021-07-05)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v4.0.2...v4.0.3)

### Enhancements

- Fix ActionCaption layout [\#2043](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2043) ([marcoambrosini](https://github.com/marcoambrosini))

### Fixed bugs

- Add type=button attribute to buttons [\#2069](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2069) ([Pytal](https://github.com/Pytal))
- Fix AppContent mobile display [\#2048](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2048) ([skjnldsv](https://github.com/skjnldsv))

### Closed pull requests

- v4.0.2 [\#2041](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2041) ([marcoambrosini](https://github.com/marcoambrosini))

## [v4.0.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v4.0.2) (2021-06-16)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v4.0.1...v4.0.2)

### Fixed bugs

- Safely check the global appName and handle its inexistence [\#2028](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2028) ([ChristophWurst](https://github.com/ChristophWurst))
- Fix settings navigation  layout [\#2033](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2033) ([marcoambrosini](https://github.com/marcoambrosini))

## [v4.0.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v4.0.1) (2021-06-14)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v4.0.0...v4.0.1)

### Fixed bugs

- Do not use app-content-wrapper if no list is provided [\#2026](nextcloud/nextcloud-vue/pull/2026) ([skjnldsv](@skjnldsv))

### Closed pull requests

- Fix settings navigation  layout [\#2033](nextcloud/nextcloud-vue/pull/2033) ([marcoambrosini](@marcoambrosini))
- Set AppNavigation examples' width to 300px [\#2030](nextcloud/nextcloud-vue/pull/2030) ([korelstar](@korelstar))

## [v4.0.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v4.0.0) (2021-06-04)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.10.1...v4.0.0)

### Breaking

- Remove deprecated legacy avatar user status [\#1945](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1945) ([skjnldsv](https://github.com/skjnldsv))
- Fix vue material icons [\#1816](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1816) ([skjnldsv](https://github.com/skjnldsv))
- Resizable columns [\#1759](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1759) ([brueckner](https://github.com/brueckner))
- Bump @nextcloud/browserslist-config from 1.0.0 to 2.1.0 [\#1786](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1786) ([dependabot](https://github.com/dependabot))

### Enhancements

- Add CheckboxRadio component [\#1875](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1875) ([skjnldsv](https://github.com/skjnldsv))
- Add disabled state to RichContenteditable and clean not-working v-model [\#1894](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1894) ([skjnldsv](https://github.com/skjnldsv))
- Add loading state to CheckboxRadio [\#1889](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1889) ([skjnldsv](https://github.com/skjnldsv))
- Add proper opening/opened/closing/closed events & fix events docs [\#1914](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1914) ([skjnldsv](https://github.com/skjnldsv))
- Add slot for third line in listitem component [\#1888](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1888) ([ma12-co](https://github.com/ma12-co))
- Allow material design icon in breadcrumb [\#1938](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1938) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Allow material design icons in AppSidebarTab [\#1939](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1939) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Create ActionCaption component [\#1739](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1739) ([ma12-co](https://github.com/ma12-co))
- Create ListItem component [\#616](https://github.com/nextcloud-libraries/nextcloud-vue/pull/616) ([ma12-co](https://github.com/ma12-co))
- Create ListItem component [\#616](https://github.com/nextcloud-libraries/nextcloud-vue/pull/616) ([ma12-co](https://github.com/ma12-co))
- Fix alignment of md icons in single action [\#1886](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1886) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Implement switch mode to CheckboxRadioSwitch [\#1890](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1890) ([skjnldsv](https://github.com/skjnldsv))
- Improve documentation sections [\#1883](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1883) ([skjnldsv](https://github.com/skjnldsv))
- Make avatar menu focusable with keyboard [\#1854](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1854) ([PVince81](https://github.com/PVince81))
- Replace AppNavigationCounter with CounterBubble [\#1895](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1895) ([PVince81](https://github.com/PVince81))
- Update appnavigationcaption [\#1863](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1863) ([ma12-co](https://github.com/ma12-co))
- Wrap icon span in icon slot for ActionButton [\#1930](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1930) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Fixed bugs

- Add id prop to ListItemIcon to prevent v-binding to the Avatar [\#1833](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1833) ([skjnldsv](https://github.com/skjnldsv))
- Allow to append datepicker to body [\#1880](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1880) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Check slots on updated hook [\#2015](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2015) ([ma12-co](https://github.com/ma12-co))
- Correctly align md icon in ActionRouter component [\#1927](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1927) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix Actions css [\#1834](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1834) ([jotoeri](https://github.com/jotoeri))
- Fix appnavigationitem layout [\#1897](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1897) ([ma12-co](https://github.com/ma12-co))
- Fix counter margin [\#1912](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1912) ([ma12-co](https://github.com/ma12-co))
- Fix datepicker overflow when week numbers are shown [\#1917](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1917) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix first and last action input padding [\#1967](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1967) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix first-action icon class not showing when Actions icon-slot is def… [\#1879](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1879) ([nickvergessen](https://github.com/nickvergessen))
- Fix flex order of AppNavigationCaption [\#2024](https://github.com/nextcloud-libraries/nextcloud-vue/pull/2024) ([skjnldsv](https://github.com/skjnldsv))
- Fix ListItemIcon listeners [\#1870](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1870) ([skjnldsv](https://github.com/skjnldsv))
- Fix md icon size in ActionInput [\#1966](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1966) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix user bubble when username contains a space [\#1948](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1948) ([artonge](https://github.com/artonge))
- Prevent overflow of action-link in Firefox [\#1934](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1934) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove AppNavigationItem flex order for AppNavigationCaption [\#1911](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1911) ([skjnldsv](https://github.com/skjnldsv))
- Use ActionButton for AppNavigationToggle [\#1844](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1844) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v3.9.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.9.0) (2021-04-07)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.8.0...v3.9.0)

### Enhancements

- Add icon slot to emptycontent [\#1806](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1806) ([skjnldsv](https://github.com/skjnldsv))

### Fixed bugs

- Make sure to pass all props and attributes to single-action Actions [\#1809](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1809) ([skjnldsv](https://github.com/skjnldsv))
- Ensure that crumbs to hide have correct class [\#1807](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1807) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix compact sidebar subtitle not visible [\#1767](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1767) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Fix translation extraction [\#1776](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1776) ([jotoeri](https://github.com/jotoeri))
- Minimize bundled translations [\#1775](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1775) ([jotoeri](https://github.com/jotoeri))

## [v3.8.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.8.0) (2021-03-26)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.7.2...v3.8.0)

### Added

- Actions now forward the focus and blur events on trigger - [\#1757](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1757) ([Vincent Petry](vincent@nextcloud.com))

### Changed

- Updated translations - [\#1755](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1755) [\#1758](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1758) [\#1782](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1782) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Bump @babel/core from 7.13.8 to 7.13.10 - [\#1748](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1748) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/preset-env from 7.13.9 to 7.13.12 - [\#1747](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1747) [\#1778](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1778) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump css-loader from 5.1.1 to 5.2.0 - [\#1764](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1764) [\#1785](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1785) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump cypress from 6.6.0 to 6.8.0 - [\#1765](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1765) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump elliptic from 6.5.3 to 6.5.4 - [\#1747](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1746) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump string-length from 4.0.1 to 4.0.2 - [\#1766](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1766) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump v-tooltip from 2.1.2 to 2.1.3 - [\#1773](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1773) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-styleguidist from 4.35.0 to 4.36.1 - [\#1772](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1772) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

### Fixed

- Fix actions dropdown focus timing - [\#1761](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1761) ([Vincent Petry](vincent@nextcloud.com))
- Update AppNavigationCounter styles - [\#1769](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1769) ([ma12-co](https://github.com/ma12-co))
- Fix settings css - [\#1770](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1770) ([jotoeri](https://github.com/jotoeri))
- Allow last crumb to shrink if all crumbs collapsed - [\#1771](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1771) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix multiselect listitemicon docs - [\#1787](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1787) ([skjnldsv](https://github.com/skjnldsv))

## [v3.7.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.7.2) (2021-03-10)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.7.1...v3.7.2)

### Fixed

- Render the first action icon slot if single action - [\#1753](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1753) ([skjnldsv](https://github.com/skjnldsv))
- Fix formattedOptions var in multiselect docs - [\#1744](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1744) ([skjnldsv](https://github.com/skjnldsv))

## [v3.7.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.7.1) (2021-03-10)

### Added
- Fix ActionButton icon slot - [\#1741](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1741) ([ma12-co](https://github.com/ma12-co))
- Improve multiselect tag [\#1718](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1718) ([GretaD](https://github.com/GretaD))

### Changed
- Bump debounce from 1.2.0 to 1.2.1 - [\#1754](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1754) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump stylelint from 13.11.0 to 13.12.0 - [\#1743](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1743) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.7.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.7.0) (2021-03-03)

### Added

- Allow to inject preloaded user statuses - [\#1433](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1433) ([nickvergessen](https://github.com/nickvergessen))
- Add a container property to popup components - [\#1734](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1734) ([Vincent Petry](vincent@nextcloud.com))

### Changed

- Bump vue-eslint-parser from 7.5.0 to 7.6.0 - [\#1737](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1737) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump pug from 3.0.0 to 3.0.2 - [\#1736](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1736) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump pug-code-gen from 3.0.1 to 3.0.2 - [\#1735](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1735) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump css-loader from 5.0.2 to 5.1.1 - [\#1731](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1731) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump cypress from 6.5.0 to 6.6.0 - [\#1730](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1730) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/preset-env from 7.13.8 to 7.13.9 - [\#1732](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1732) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump core-js from 3.9.0 to 3.9.1 - [\#1729](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1729) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/preset-env from 7.13.5 to 7.13.8 - [\#1728](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1728) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/core from 7.13.1 to 7.13.8 - [\#1727](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1727) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.6.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.6.0) (2021-02-25)

### Added

- Add disabled state to actions - [\#1724](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1724) ([ma12-co](https://github.com/ma12-co))
- Add support for material design icons - [\#1714](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1714) ([ma12-co](https://github.com/ma12-co))

### Changed

- Bump @babel/core from 7.12.17 to 7.13.1 - [\#1721](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1721) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/preset-env from 7.12.17 to 7.13.5 - [\#1725](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1725) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump babel-loader-exclude-node-modules-except from 1.0.3 to 1.1.2 - [\#1702](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1702) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump core-js from 3.8.3 to 3.9.0 - [\#1717](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1717) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump cypress from 5.6.0 to 6.5.0 - [\#1712](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1712) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump eslint-plugin-promise from 4.2.1 to 4.3.1 - [\#1704](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1704) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump stylelint from 13.9.0 to 13.11.0 - [\#1719](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1719) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue2-datepicker from 3.8.2 to 3.9.0 - [\#1699](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1699) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-eslint-parser from 7.4.1 to 7.5.0 - [\#1711](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1711) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

### Fixed

- Use data of parent component in InputConfirmCanel subcomponent - [\#1697](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1697) ([christianlupus](github@christianwolf.email))

## [v3.5.5](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.5.5) (2021-02-24)

### Added

- Improve settings dialog layout [\#1708](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1708) ([ma12-co](https://github.com/ma12-co))
- Make settings navigation list scrollable [\#1684](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1684) ([ma12-co](https://github.com/ma12-co))

### Fixed

- Make sure we can check the classList on the node [\#1723](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1723) ([skjnldsv](https://github.com/skjnldsv))
- Fix settings navigation layout [\#1713](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1713) ([ma12-co](https://github.com/ma12-co))
- Update action hover feedback [\#1692](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1692) ([ma12-co](https://github.com/ma12-co))

## [v3.5.4](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.5.4) (2021-01-27)

### Fixed

- Revert workaround for popper glitch, fix regression - [\#1685](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1685) ([Vincent Petry](vincent@nextcloud.com))

### Added

- Translate '/l10n/messages.pot' in 'zh_HK' - [\#1682](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1682) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))

### Changed

- Bump cypress-visual-regression from 1.5.5 to 1.5.6 - [\#1620](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1620) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-cli from 4.3.1 to 4.4.0 - [\#1672](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1672) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump stylelint from 13.8.0 to 13.9.0 - [\#1673](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1673) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-eslint-parser from 7.3.0 to 7.4.1 - [\#1676](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1676) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-styleguidist from 4.34.2 to 4.35.0 - [\#1686](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1686) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.5.3](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.5.3) (2021-01-25)

### Fixed

- Replace linkify-urls with linkifyjs to fix Safari incompatibility issues - [\#1678](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1678) ([Vincent Petry](vincent@nextcloud.com))

## [v3.5.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.5.2) (2021-01-22)

### Fixed

- Increase max width of action button - [\#1677](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1677) ([Vincent Petry](vincent@nextcloud.com))

## [v3.5.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.5.1) (2021-01-20)

### Fixed

- Fix longtext appearance for avatar popover menu - [\#1675](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1675) ([Vincent Petry](vincent@nextcloud.com))
- Make the popover menu more easily addressable - [\#1674](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1674) ([Vincent Petry](vincent@nextcloud.com))

## [v3.5.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.5.0) (2021-01-20)

### Changed

- Avatar component now uses the popover component - [\#831](https://github.com/nextcloud-libraries/nextcloud-vue/issues/831) ([ma12-co](https://github.com/ma12-co)) ([Vincent Petry](vincent@nextcloud.com))
- Bump core-js from 3.8.2 to 3.8.3 - [\#1671](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1671) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.4.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.4.0) (2021-01-18)

### Added

- Add multiselect type to ActionInput - [\#1250](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1250) ([korelstar](korelstar@users.noreply.github.com>))
- Add link support to richcontenteditor and fix various issues - [\#1669](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1669) ([John Molakvoæ](skjnldsv@users.noreply.github.com))
- Allow ActionInput type=email - [\#1667](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1667) ([tcitworld](tcit@tcit.fr))
- Allow ActionInput type=color - [\#1662](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1662) ([ChristophWurst](https://github.com/ChristophWurst))

### Changed

- Bump axios from 0.21.0 to 0.21.1 - [\#1655](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1655) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump core-js from 3.8.1 to 3.8.2 - [\#1654](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1654) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump fontsource-roboto from 3.1.5 to 4.0.0 - [\#1648](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1648) ([Julius Härtl](jus@bitgrid.net))
- Bump @nextcloud/axios from 1.5.0 to 1.6.0 - [\#1657](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1657) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump sass-loader from 10.1.0 to 10.1.1 - [\#1663](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1663) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump v-tooltip from 2.0.3 to 2.1.0 - [\#1651](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1651) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump v-tooltip from 2.1.0 to 2.1.1 - [\#1653](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1653) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump v-tooltip from 2.1.1 to 2.1.2 - [\#1656](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1656) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-color from 2.8.0 to 2.8.1 - [\#1649](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1649) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-loader from 15.9.5 to 15.9.6 - [\#1642](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1642) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-cli from 4.2.0 to 4.3.0 - [\#1650](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1650) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-cli from 4.3.0 to 4.3.1 - [\#1652](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1652) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack from 4.44.2 to 4.45.0 - [\#1661](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1661) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack from 4.45.0 to 4.46.0 - [\#1664](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1664) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-merge from 5.7.0 to 5.7.2 - [\#1641](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1641) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-merge from 5.7.2 to 5.7.3 - [\#1646](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1646) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Translate '/l10n/messages.pot' in 'zh_TW' - [\#1659](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1659) ([Julius Härtl](jus@bitgrid.net))
- Translate '/l10n/messages.pot' in 'sv' - [\#1658](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1658) ([Julius Härtl](jus@bitgrid.net))
- Translate '/l10n/messages.pot' in 'eo' - [\#1644](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1644) ([Julius Härtl](jus@bitgrid.net))
- Translate '/l10n/messages.pot' in 'de' - [\#1643](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1643) ([Julius Härtl](jus@bitgrid.net))

### Fixed

- Don't close modal on mouseup - [\#1647](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1647) ([ma12-co](https://github.com/ma12-co))

## [v3.3.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.3.2) (2020-12-16)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.3.1...v3.3.2)

### Changed

- Translate '/l10n/messages.pot' in 'nl' - [\#1621](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1621) ([Julius Härtl](jus@bitgrid.net))
- Translate '/l10n/messages.pot' in 'es' - [\#1630](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1630) ([Julius Härtl](jus@bitgrid.net))

### Fixed

- Fix avatar menu click handler - [\#1639](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1639) ([PVince81](vincent@nextcloud.com))
- Fix export of AppNavigationNewItem - [\#1638](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1638) ([John Molakvoæ](skjnldsv@users.noreply.github.com))

### Version bumps

- Bump @babel/core from 7.12.9 to 7.12.10 - [\#1626](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1626) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/preset-env from 7.12.7 to 7.12.11 - [\#1627](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1627) [\#1640](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1640) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump core-js from 3.8.0 to 3.8.1 - [\#1623](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1623) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump fontsource-roboto from 3.0.3 to 3.1.5 - [\#1628](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1628) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump ini from 1.3.5 to 1.3.7 - [\#1631](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1631) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue2-datepicker from 3.8.1 to 3.8.2 - [\#1624](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1624) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-color from 2.7.1 to 2.8.0 - [\#1635](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1635) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-eslint-parser from 7.2.0 to 7.3.0 - [\#1619](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1619) [\#1636](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1636) ([Julius Härtl](jus@bitgrid.net))
- Bump vue-styleguidist from 4.34.1 to 4.34.2 - [\#1622](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1622) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @vue/test-utils from 1.1.1 to 1.1.2 - [\#1637](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1637) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-merge from 5.4.0 to 5.7.0 - [\#1625](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1625) [\#1632](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1632) [\#1634](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1634) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.3.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.3.1) (2020-12-02)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.3.0...v3.3.1)

### Fixed

- Quickfix for action button and material design icon - [\#1614](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1614) ([Vincent Petry](vincent@nextcloud.com))

### Changed

- Translate '/l10n/messages.pot' in 'fr' - [\#1606](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1606)

### Version bumps

- Bump vue-styleguidist from 4.34.0 to 4.34.1 - [\#1615](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1615) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump babel-loader from 8.2.1 to 8.2.2 - [\#1612](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1612) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.3.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.3.0) (2020-11-26)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.2.0...v3.3.0)

### Added

- Add ListItemIcon component - [\#1578](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1578) ([PVince81](https://github.com/pvince81))
- Richcontenteditable: bind event listeners - [\#1592](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1592) ([ma12-co](https://github.com/ma12-co))
- Add notes about styleguide command in README - [\#1596](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1596) ([PVince81](https://github.com/pvince81))
- AppNavigationItem improved editing mode and AppNavigationNewItem component - [\#1277](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1277) ([JonathanTreffler](https://github.com/JonathanTreffler))

### Fixed

- Remove sidebar actions slot max height - [\#1566](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1566) ([ma12-co](https://github.com/ma12-co))
- Fix contenteditable state at first load - [\#1584](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1584) ([ma12-co](https://github.com/ma12-co))
- Fix rich-contenteditor default value init and small code cleanup - [\#1570](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1570) ([skjnldsv](https://github.com/skjnldsv))
- Fix action button text for long translations - [\#1576](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1576) ([GretaD](gretadoci@gmail.com))
- Fix default multiselect height - [\#1579](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1579) ([skjnldsv](https://github.com/skjnldsv))
- Aria-expanded must be a false string, not absent - [\#1599](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1599) ([PVince81](https://github.com/pvince81))
- Set navigation role and aria label on app navigation - [\#1585](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1585) ([PVince81](https://github.com/pvince81))
- Remove semantics of h6 in user bubble - [\#1586](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1586) ([PVince81](https://github.com/pvince81))
- Fix labelledby in tab section - [\#1583](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1583) ([PVince81](https://github.com/pvince81))
- Do not check l10n comments - [\#1597](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1597) ([skjnldsv](https://github.com/skjnldsv))
- Disable avatar menu click event when menu disabled - [\#1587](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1587) ([PVince81](https://github.com/pvince81))
- Improve testability + small code changes of AppSideBarTabs - [\#1515](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1515) ([LiquidITGuy](https://github.com/LiquidITGuy))
- Proxy avatar to fixed image in the documentation - [\#1580](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1580) ([skjnldsv](https://github.com/skjnldsv))
- Fix sizing of modal container and app settings dialog - [\#1573](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1573) ([PVince81](https://github.com/pvince81))

### Changed

- Translate '/l10n/messages.pot' in 'da' - [\#1575](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1575) ([juliushaertl](https://github.com/juliushaertl))

### Version bumps

- Bump @babel/core from 7.12.3 to 7.12.9- [\#1594](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1594) [\#1602](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1602) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump babel-loader from 8.1.0 to 8.2.1 - [\#1565](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1565) ([juliushaertl](https://github.com/juliushaertl))
- Bump @babel/preset-env from 7.12.1 to 7.12.7 - [\#1595](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1595) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump core-js from 3.7.0 to 3.8.0 - [\#1608](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1608) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump cypress from 5.5.0 to 5.6.0 - [\#1562](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1562) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump cypress-visual-regression from 1.5.2 to 1.5.5 - [\#1588](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1588) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump eslint-plugin-standard from 4.0.2 to 4.1.0 - [\#1564](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1564) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump @nextcloud/dialogs from 3.0.0 to 3.1.1 - [\#1563](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1563) [\#1571](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1571) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump sass-loader from 10.0.5 to 10.1.0 - [\#1568](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1568) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump stylelint from 13.7.2 to 13.8.0 - [\#1577](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1577) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump vue2-datepicker from 3.7.0 to 3.8.1 - [\#1589](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1589) [\#1609](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1609) ([PVince81](https://github.com/pvince81))
- Bump vue-styleguidist from 4.33.6 to 4.33.7 - [\#1572](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1572) [\#1574](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1574) [\#1593](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1593) [\#1607](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1607) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-merge from 5.3.0 to 5.4.0 - [\#1569](https://github.com/nextcloud-libraries/nextcloud-vue/issues/1569) ([juliushaertl](https://github.com/juliushaertl))

## [v3.2.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.2.0) (2020-11-09)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.1.2...v3.2.0)

### Added
- Add default font and line size [\#1542](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1542) ([GretaD](gretadoci@gmail.com))
- Add tooltips in app sidebar header [\#1555](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1555) ([PVince81](https://github.com/PVince81))

### Fixed
- Fix RichEditor rendering of unknown mention, undefined checks and fix default value init [\#1504](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1504)  ([skjnldsv](https://github.com/skjnldsv))
- Fix menu font for apps [\#1543](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1543) ([GretaD](gretadoci@gmail.com))
- Reverted "Also set Modal height/width to allow children to define their height/width and not only max-height/width" [\#1558](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1558) ([skjnldsv](https://github.com/skjnldsv))
- Fix action text margin for long texts [\#1525](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1525) ([st3iny](https://github.com/st3iny))

### Version bumps
- Bump cypress config and split into two specs [\#1548](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1548) ([skjnldsv](https://github.com/skjnldsv))
- Bump core-js from 3.6.5 to 3.7.0 [\#1557](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1557)
- Bump vue-styleguidist from 4.33.5 to 4.33.6 [\#1553](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1553)
- Bump css-loader from 3.6.0 to 5.0.1 [\#1537](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1537) [\#1552](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1552)
- Bump webpack-cli from 4.1.0 to 4.2.0 [\#1546](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1546)
- Bump jest from 26.6.1 to 26.6.3 [\#1541](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1541) [\#1545](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1545)
- Bump babel-jest from 26.6.2 to 26.6.3 [\#1544](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1544)
- Bump vue-loader from 15.9.4 to 15.9.5 [\#1536](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1536)
- Bump node-sass from 4.14.1 to 5.0.0 and sass-loader to 10.0.5 [\#1534](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1534)
- Translations updates

## [v2.9.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.9.0) (2020-11-09)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.8.2...v2.9.0)

### Added
- Add default font and line size [\#1549](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1549) ([GretaD](gretadoci@gmail.com))
- Add tooltips in app sidebar header [\#1560](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1560) ([PVince81](https://github.com/PVince81))

## [v0.13.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v0.13.1) (2020-11-06)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v0.13.0...v0.13.1)

### Fixed

- Add ability to choose popovermenu alignment in avatar component #1554

## [v3.1.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.1.2) (2020-11-02)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.1.1...v3.1.2)

### Fixed
- Use static emoji picker to solve performance issue with background CPU usage [\#1526](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1526) ([PVince81](https://github.com/PVince81))
- Fix setting navigation item blur [\#1503](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1503) ([ma12-co](https://github.com/ma12-co))
- Translations update [\#1519](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1519)

### Version bumps
- Bump @vue/test-utils from 1.1.0 to 1.1.1 [\#1530](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1530)
- Bump webpack-merge from 5.2.0 to 5.3.0 [\#1528](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1528)
- Bump emoji-mart-vue-fast from 7.0.6 to 7.0.7 [\#1527](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1527)
- Bump cypress from 5.4.0 to 5.5.0 [\#1523](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1523)
- Bump @nextcloud/axios from 1.4.0 to 1.5.0 [\#1522](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1522)
- Bump file-loader from 6.1.1 to 6.2.0 [\#1521](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1521)
- Bump vue-loader from 15.9.3 to 15.9.4 [\#1520](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1520)

## [v2.8.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.8.2) (2020-11-02)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.8.1...v2.8.2)

### Fixed
- Use static emoji picker to solve performance issue with background CPU usage [\#1526](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1526) ([PVince81](https://github.com/PVince81))

## [v3.1.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.1.1) (2020-10-27)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.1.0...v3.1.1)

### Fixed

- Also set Modal height/width to allow children to define their height/width and not only max-height/width [\#1518](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1518) ([skjnldsv](https://github.com/skjnldsv))
- Don't show navigation of settings modal by default [\#1509](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1509) ([ma12-co](https://github.com/ma12-co))
- Adapt to new vue2-datepicker format props [\#1517](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1517) ([eneiluj](https://github.com/eneiluj))

## [v3.1.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.1.0) (2020-10-21)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v3.0.0...v3.1.0)

### Fixed

- Do not show letter if we have an icon and keep image ratio [\#1501](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1501) ([skjnldsv](https://github.com/skjnldsv))
- Allow an "extra" slot for the AppNavigationItem [\##1493](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1493) ([ChristophWurst](https://github.com/ChristophWurst))
- Fix avatar caching for non-user rendering [\#1491](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1491) ([skjnldsv](https://github.com/skjnldsv))

## [v3.0.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v3.0.0) (2020-10-20)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.8.1...v3.0.0)

### Fixed
- Make appSidebar scrollable inside [\#1485](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1485) ([skjnldsv](https://github.com/skjnldsv))

## [v2.8.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.8.1) (2020-10-19)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.8.0...v2.8.1)

### Fixed
- Fix avatar caching for non-user rendering [\#1491](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1491) ([skjnldsv](https://github.com/skjnldsv))

## [v2.8.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.8.0) (2020-10-19)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.7.0...v2.8.0)

### Added
- Add submit, multiline and maxlength support [\#1465](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1465) ([skjnldsv](https://github.com/skjnldsv))
- Cache hasAvatar info in sessionStorage to avoid flicker [\#1457](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1457) ([PVince81](https://github.com/PVince81))
- Adds information to README.md file how to use vue-devtools [\#1446](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1446) ([StCyr](https://github.com/StCyr))
- Add RichContenteditable component [\#1433](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1433) ([skjnldsv](https://github.com/skjnldsv))
- Snapshot test for usernameToColor function [\#1346](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1346) ([juliushaertl](https://github.com/juliushaertl))
- Add SettingsInputText compontents [\#650](https://github.com/nextcloud-libraries/nextcloud-vue/pull/650) ([GretaD](https://github.com/GretaD))

### Changed
- Translations updates

### Fixed
- Fix multiLine prop [\#1490](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1490) ([skjnldsv](https://github.com/skjnldsv))
- Fix autocomplete popup size and shadow [\#1481](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1481) ([skjnldsv](https://github.com/skjnldsv))
- Make mention inlined and ellipsised [\#1475](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1475) ([skjnldsv](https://github.com/skjnldsv))
- Fix npm run build by removing obsolete command [\#1456](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1456) ([PVince81](https://github.com/PVince81))
- Cleanup avatar fetching methods [\#1489](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1489) ([skjnldsv](https://github.com/skjnldsv))
- Fix padding of sidebar without secondary actions [\#1362](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1362) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v2.7.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.7.0) (2020-10-08)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.6.9...v2.7.0)

### Added
- New app settings [\#1286](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1286) ([ma12-co](https://github.com/ma21-co))

## [v2.6.9](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.6.9) (2020-10-07)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.6.8...v2.6.9)

### Added

- Add loading state on AppSidebar and remove unwanted slot bind [\#1429](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1429) ([skjnldsv](https://github.com/skjnldsv))

### Fixed

- Fix modal freeze [\#1432](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1432) ([st3iny](https://github.com/st3iny))
- Allow spaces in the name of a AppSidebarTab [\#1431](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1431) ([juliushaertl](https://github.com/juliushaertl))

## [v2.6.8](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.6.8) (2020-10-02)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.6.7...v2.6.8)

### Fixed

- Only use the icon on the avatar when there is one [\#1423](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1423) ([nickvergessen](https://github.com/nickvergessen))

## [v2.6.7](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.6.7) (2020-10-02)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.6.6...v2.6.7)

### Fixed

- Introduce a compact mode (default) for the user status on the avatar in case it is used without presenting the status information [\#1405](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1405) ([juliushaertl](https://github.com/juliushaertl))


## [v2.6.6](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.6.6) (2020-09-30)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.6.5...v2.6.6)

### Fixed

- Listen to user status events to update the status on avatars [\#1405](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1405) ([nickvergessen](https://github.com/nickvergessen))

## [v2.6.5](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.6.5) (2020-09-11)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.6.4...v2.6.5)

### Fixed

- Allow to set popover container  [\#1389](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1389) (Thanks to [raimund-schluessler](https://github.com/raimund-schluessler))
- Fix ActionInput label height [\#1361](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1361) (Thanks to [tcitworld](https://github.com/tcitworld))
- Fix status on different active/hover states [\#1399](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1399)
- Fix custom avatar handling in user bubble [\#1392](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1392)

## [v2.6.4](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.6.4) (2020-09-03)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.6.3...v2.6.4)

### Fixed

- Do not fetch user status if current user is a guest [\#1379](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1379) ([danxuliu](https://github.com/danxuliu))
- Fetch user status in avatar only if it is going to be shown [\#1380](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1380) ([danxuliu](https://github.com/danxuliu))

## [v2.6.3](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.6.3) (2020-09-01)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.6.2...v2.6.3)

### Fixed

- Fix active tab prop [\#1368](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1368) ([skjnldsv](https://github.com/skjnldsv))

## [v2.6.2](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.6.2) (2020-09-01)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.6.1...v2.6.2)

### Fixed

- Disable spell checking for cypress [\#1363](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1363) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Added

- Cover more cases in AppSidebare visual test [\#1357](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1357) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove unwanted files leftovers [\#1356](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1356) ([skjnldsv](https://github.com/skjnldsv))
- Feature/cypress visual regression [\#1355](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1355) ([skjnldsv](https://github.com/skjnldsv))
- Translate '/l10n/messages.pot' in 'is' [\#1354](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1354) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))

## [v2.6.1](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.6.1) (2020-08-27)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.6.0...v2.6.1)

#### Fixed bugs:

- Allow to toggle linkification by prop [\#1337](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1337) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix sidebar layout in compact mode [\#1338](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1338) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Update status icons  [\#1341](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1341)
- Do not fetch user-status if user prop does not represent a user [\#1348](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1348)
- Allow to choose boundariesElement for actions popover [\#1351](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1351)

## [v2.6.0](https://github.com/nextcloud-libraries/nextcloud-vue/tree/v2.6.0) (2020-08-21)

[Full Changelog](https://github.com/nextcloud-libraries/nextcloud-vue/compare/v2.5.0...v2.6.0)

### Implemented enhancements:

- Allow to specify a custom action instead of the star [\#1310](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1310) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Allow to toggle editable title by click [\#1288](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1288) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Feature/641/use popover component for actions [\#832](https://github.com/nextcloud-libraries/nextcloud-vue/pull/832) ([ma12-co](https://github.com/ma12-co))

#### Fixed bugs:

- Add `background-repeat:no-repeat` to icons [\#1330](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1330) ([dk1a](https://github.com/dk1a))
- Fix tabs & lint [\#1303](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1303) ([skjnldsv](https://github.com/skjnldsv))
- Do not display offline \(and invisible\) as a status [\#1312](https://github.com/nextcloud-libraries/nextcloud-vue/pull/1312) ([georgehrke](https://github.com/georgehrke))

## Older releases

See [the Github Releases page](https://github.com/nextcloud-libraries/nextcloud-vue/releases) for older changelog entries.
