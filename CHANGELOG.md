# Changelog

All notable changes to this project will be documented in this file.

# Changelog

## [v7.12.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.12.0) (2023-06-08)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.11.6...v7.12.0)

### :rocket: Enhancements
* make navigation-collapsible always visible [\#4161](https://github.com/nextcloud/nextcloud-vue/pull/4161) ([szaimen](https://github.com/szaimen))
* enh\(NcActions\): Navigation link actions [\#4160](https://github.com/nextcloud/nextcloud-vue/pull/4160) ([Pytal](https://github.com/Pytal))
* Export dist a11y activation util [\#4167](https://github.com/nextcloud/nextcloud-vue/pull/4167) ([Pytal](https://github.com/Pytal))
* feat: Add slot for description of `NcEmptyContent` [\#4170](https://github.com/nextcloud/nextcloud-vue/pull/4170) ([susnux](https://github.com/susnux))

### :bug: Fixed bugs
* Fix alignment of nav contents [\#4148](https://github.com/nextcloud/nextcloud-vue/pull/4148) ([pulsejet](https://github.com/pulsejet))
* fix toggle overlapping other stuff [\#4149](https://github.com/nextcloud/nextcloud-vue/pull/4149) ([szaimen](https://github.com/szaimen))
* Use `display: flex` in app-content-list on mobile as well [\#4192](https://github.com/nextcloud/nextcloud-vue/pull/4192) ([mejo-](https://github.com/mejo-))

## [v7.11.6](https://github.com/nextcloud/nextcloud-vue/tree/v7.11.6) (2023-05-16)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.11.5...v7.11.6)

### :bug: Fixed bugs

- fix\(NcResource\): Fix item alignment in the right sidebar [\#4124](https://github.com/nextcloud/nextcloud-vue/pull/4124) ([Pytal](https://github.com/Pytal))

## [v7.11.5](https://github.com/nextcloud/nextcloud-vue/tree/v7.11.5) (2023-05-15)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.11.4...v7.11.5)

### :bug: Fixed bugs

- fix\(NcAppSidebarTabs\): Fix rendering tabs with CSS icon in OCA.Files.Sidebar [\#4112](https://github.com/nextcloud/nextcloud-vue/pull/4112) ([ShGKme](https://github.com/ShGKme))
- fix\(NcAppNavigationItem\): Left panel dropdown improvement [\#4105](https://github.com/nextcloud/nextcloud-vue/pull/4105) ([Jerome-Herbinet](https://github.com/Jerome-Herbinet))
- fix\(NcSettingsSection\): Add target blank and no ref info [\#4100](https://github.com/nextcloud/nextcloud-vue/pull/4100) ([Rello](https://github.com/Rello))
- fix: Use the color-primary-element* variables in components [\#4098](https://github.com/nextcloud/nextcloud-vue/pull/4098) ([szaimon](https://github.com/szaimon))

## [v7.11.4](https://github.com/nextcloud/nextcloud-vue/tree/v7.11.4) (2023-05-12)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.11.3...v7.11.4)

### :rocket: Enhancements

- feat\(NcActions\): Improve readability of action menu entries [\#4049](https://github.com/nextcloud/nextcloud-vue/pull/4049) ([Pytal](https://github.com/Pytal))
- feat\(NcReferencePickerModal\): Allow setting modal size when registering a custom picker component [\#3866](https://github.com/nextcloud/nextcloud-vue/pull/3866) ([julien-nc](https://github.com/julien-nc))

### :bug: Fixed bugs

- fix\(NcListItem\): Fix wrong bold class [\#4083](https://github.com/nextcloud/nextcloud-vue/pull/4083) ([julien-nc](https://github.com/julien-nc))
- fix\(NcSelect\): Fix disabled state of NcSelect with dark mode [\#4079](https://github.com/nextcloud/nextcloud-vue/pull/4079) ([nickvergessen](https://github.com/nickvergessen))
- fix\(NcSelect\): Action input usage [\#4066](https://github.com/nextcloud/nextcloud-vue/pull/4066) ([Pytal](https://github.com/Pytal))

## [v7.11.3](https://github.com/nextcloud/nextcloud-vue/tree/v7.11.3) (2023-05-08)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.11.2...v7.11.3)

### :bug: Fixed bugs

- fix\(NcAppSidebarTabs\): Revert major UI change (moved to version 8.0.x) [\#4044](https://github.com/nextcloud/nextcloud-vue/pull/4044) ([skjnldsv](https://github.com/skjnldsv))
- fix\(NcRichContenteditable\): Fix avatar overlayed with empty space whe… [\#4043](https://github.com/nextcloud/nextcloud-vue/pull/4043) ([nickvergessen](https://github.com/nickvergessen))

### Closed pull requests

- Fix regression of click-outside-options mixin not working since using `@vueuse` [\#4046](https://github.com/nextcloud/nextcloud-vue/pull/4046) ([susnux](https://github.com/susnux))

## [v7.11.2](https://github.com/nextcloud/nextcloud-vue/tree/v7.11.2) (2023-05-05)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.11.1...v7.11.2)

### :bug: Fixed bugs

- fix: Fix regression to still display references [\#4039](https://github.com/nextcloud/nextcloud-vue/pull/4039) ([juliushaertl](https://github.com/juliushaertl))
- fix: Avoid showing the reference list if no results were found [\#4036](https://github.com/nextcloud/nextcloud-vue/pull/4036) ([juliushaertl](https://github.com/juliushaertl))
- fix\(NcAppNavigation\): fix flex element styles causing resizing sidebar [\#4035](https://github.com/nextcloud/nextcloud-vue/pull/4035) ([ShGKme](https://github.com/ShGKme))

## [v7.11.1](https://github.com/nextcloud/nextcloud-vue/tree/v7.11.1) (2023-05-04)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.11.0...v7.11.1)

### :bug: Fixed bugs

- fix\(NcRichContenteditable\): Also quote ids containing a slash [\#4031](https://github.com/nextcloud/nextcloud-vue/pull/4031) ([nickvergessen](https://github.com/nickvergessen))

## [v7.11.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.11.0) (2023-05-03)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.10.0...v7.11.0)

### :rocket: Enhancements

- feat\(NcRichContenteditable\): Allow to pass in an icon URL [\#3984](https://github.com/nextcloud/nextcloud-vue/pull/3984) ([nickvergessen](https://github.com/nickvergessen))

### :bug: Fixed bugs

- Properly style timezone select in NcDatetimePicker [\#4014](https://github.com/nextcloud/nextcloud-vue/pull/4014) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix\(NcAvatar\): Use correct prop to track "open" aka. "shown" state [\#4009](https://github.com/nextcloud/nextcloud-vue/pull/4009) ([nickvergessen](https://github.com/nickvergessen))
- feat\(NcRichContenteditable\): Support iconUrl on mention bubbles [\#4007](https://github.com/nextcloud/nextcloud-vue/pull/4007) ([nickvergessen](https://github.com/nickvergessen))
- NcAppSidebarTabs: fix activating the tab being added [\#4004](https://github.com/nextcloud/nextcloud-vue/pull/4004) ([ShGKme](https://github.com/ShGKme))
- Disable wrap on overflow [\#3996](https://github.com/nextcloud/nextcloud-vue/pull/3996) ([Pytal](https://github.com/Pytal))

### Closed pull requests

- Adjust breadcrumb CSS to new html structure [\#4026](https://github.com/nextcloud/nextcloud-vue/pull/4026) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add aria-hidden attr to the whole navigation depending on a sidebar state [\#4016](https://github.com/nextcloud/nextcloud-vue/pull/4016) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Allow to override showTrailingButton from an NcAction [\#4010](https://github.com/nextcloud/nextcloud-vue/pull/4010) ([artonge](https://github.com/artonge))
- Use NcSelect in NcAppSidebar example [\#4003](https://github.com/nextcloud/nextcloud-vue/pull/4003) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Improve breadcrumbs accessibility [\#3990](https://github.com/nextcloud/nextcloud-vue/pull/3990) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Update CHANGELOG for 7.10.0 [\#3986](https://github.com/nextcloud/nextcloud-vue/pull/3986) ([Pytal](https://github.com/Pytal))

## [v7.10.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.10.0) (2023-04-18)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.9.0...v7.10.0)

### :rocket: Enhancements

- adjust sidebar to go full-screen earlier at 768px [\#3972](https://github.com/nextcloud/nextcloud-vue/pull/3972) ([szaimen](https://github.com/szaimen))
- feat\(NcSelectTags\): Disable internal v-model and options handling [\#3968](https://github.com/nextcloud/nextcloud-vue/pull/3968) ([Pytal](https://github.com/Pytal))
- Remove the smart picker modal padding [\#3962](https://github.com/nextcloud/nextcloud-vue/pull/3962) ([julien-nc](https://github.com/julien-nc))
- Adjust some smart picker strings [\#3961](https://github.com/nextcloud/nextcloud-vue/pull/3961) ([julien-nc](https://github.com/julien-nc))

### :bug: Fixed bugs

- Fix inverted validate label check in NcInputField [\#3980](https://github.com/nextcloud/nextcloud-vue/pull/3980) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix\(NcHeaderMenu\): fix unnecessary filter invert [\#3974](https://github.com/nextcloud/nextcloud-vue/pull/3974) ([skjnldsv](https://github.com/skjnldsv))
- Don't overwrite router-link href in NcBreadcrumb [\#3973](https://github.com/nextcloud/nextcloud-vue/pull/3973) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Split Bootstrap version reference in Tooltip .scss [\#3979](https://github.com/nextcloud/nextcloud-vue/pull/3979) ([danxuliu](https://github.com/danxuliu))
- Remove unused tooltip directive [\#3967](https://github.com/nextcloud/nextcloud-vue/pull/3967) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add placeholder for heading inside of app content [\#3957](https://github.com/nextcloud/nextcloud-vue/pull/3957) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Fix native open in a new tab in components with a custom router link [\#3954](https://github.com/nextcloud/nextcloud-vue/pull/3954) ([ShGKme](https://github.com/ShGKme))

## [v7.9.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.9.0) (2023-04-04)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.8.5...v7.9.0)

### :rocket: Enhancements

- Add additionalTrapElements prop to settingsDialog [\#3947](https://github.com/nextcloud/nextcloud-vue/pull/3947) ([hamza221](https://github.com/hamza221))
- enh\(NcDatetimePicker\): convert lang computed value to prop [\#3941](https://github.com/nextcloud/nextcloud-vue/pull/3941) ([st3iny](https://github.com/st3iny))
- Add `aria-hidden` to icons of different components [\#3931](https://github.com/nextcloud/nextcloud-vue/pull/3931) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Add accessible search field to emoji picker [\#3900](https://github.com/nextcloud/nextcloud-vue/pull/3900) ([Pytal](https://github.com/Pytal))

### :bug: Fixed bugs

- fix\(NcButton\): ellipsis text on small width [\#3936](https://github.com/nextcloud/nextcloud-vue/pull/3936) ([skjnldsv](https://github.com/skjnldsv))
- fix\(NcBreadcrumb\): cursor and native title and inline actions rendering text [\#3927](https://github.com/nextcloud/nextcloud-vue/pull/3927) ([skjnldsv](https://github.com/skjnldsv))

## [v7.8.5](https://github.com/nextcloud/nextcloud-vue/tree/v7.8.5) (2023-03-28)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.8.4...v7.8.5)

### :bug: Fixed bugs

- fix\(NcRichContenteditable\): Completely stop event propagation for keyup events [\#3937](https://github.com/nextcloud/nextcloud-vue/pull/3937) ([nickvergessen](https://github.com/nickvergessen))
- fix\(NcRichText\): Match IP addresses as links [\#3935](https://github.com/nextcloud/nextcloud-vue/pull/3935) ([nickvergessen](https://github.com/nickvergessen))
- fix\(NcRichText\): Fix NcRichText style [\#3932](https://github.com/nextcloud/nextcloud-vue/pull/3932) ([julien-nc](https://github.com/julien-nc))

## [v7.8.4](https://github.com/nextcloud/nextcloud-vue/tree/v7.8.4) (2023-03-24)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.8.3...v7.8.4)

### :bug: Fixed bugs

- Fix styles inheritance in `NcAvatar` when being mounted [\#3925](https://github.com/nextcloud/nextcloud-vue/pull/3925) ([Antreesy](https://github.com/Antreesy))
- fix\(NcRichContenteditable\): Fix tribute emoji complete interfering unexpectedly aka. 🇨🇨  [\#3924](https://github.com/nextcloud/nextcloud-vue/pull/3924) ([nickvergessen](https://github.com/nickvergessen))
- feat\(Emoji\): Suggest emojis based on text smiles [\#3923](https://github.com/nextcloud/nextcloud-vue/pull/3923) ([mejo-](https://github.com/mejo-))
- fix\(NcListItem\): Bring back correct href for router-link links [\#3922](https://github.com/nextcloud/nextcloud-vue/pull/3922) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v7.8.3](https://github.com/nextcloud/nextcloud-vue/tree/v7.8.3) (2023-03-23)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.8.2...v7.8.3)

### :bug: Fixed bugs

- fix\(NcRichContenteditable\): prevent tribute from opening on keyup [\#3917](https://github.com/nextcloud/nextcloud-vue/pull/3917) ([skjnldsv](https://github.com/skjnldsv))
- fix\(NcRichContenteditable\): Fix pasting XML and HTML content [\#3915](https://github.com/nextcloud/nextcloud-vue/pull/3915) ([nickvergessen](https://github.com/nickvergessen))

## [v7.8.2](https://github.com/nextcloud/nextcloud-vue/tree/v7.8.2) (2023-03-22)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.8.1...v7.8.2)

### :bug: Fixed bugs

- Fix missing NcVNodes import in NcListItem [\#3907](https://github.com/nextcloud/nextcloud-vue/pull/3907) ([julien-nc](https://github.com/julien-nc))
- Fix doubling attrs in `NcPopover` and improve docs [\#3876](https://github.com/nextcloud/nextcloud-vue/pull/3876) ([ShGKme](https://github.com/ShGKme))

### Closed pull requests

- Add missing trailing comma [\#3898](https://github.com/nextcloud/nextcloud-vue/pull/3898) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v7.8.1](https://github.com/nextcloud/nextcloud-vue/tree/v7.8.1) (2023-03-15)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.8.0...v7.8.1)

### :bug: Fixed bugs

- feat\(NcRichText\): Support icon class for smart picker integrations [\#3882](https://github.com/nextcloud/nextcloud-vue/pull/3882) ([nickvergessen](https://github.com/nickvergessen))
- Fix navigate handler call [\#3878](https://github.com/nextcloud/nextcloud-vue/pull/3878) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix select styles [\#3854](https://github.com/nextcloud/nextcloud-vue/pull/3854) ([Pytal](https://github.com/Pytal))

### Closed pull requests

- Call the link picker "smart picker" and translate more strings [\#3888](https://github.com/nextcloud/nextcloud-vue/pull/3888) ([julien-nc](https://github.com/julien-nc))
- Adjust excludeClickOutsideClasses type definition [\#3863](https://github.com/nextcloud/nextcloud-vue/pull/3863) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove unused parseUrl parameter [\#3862](https://github.com/nextcloud/nextcloud-vue/pull/3862) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Make NcLink non-functional [\#3861](https://github.com/nextcloud/nextcloud-vue/pull/3861) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use single quotes in SCSS code [\#3860](https://github.com/nextcloud/nextcloud-vue/pull/3860) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove superfluous input close icon template [\#3859](https://github.com/nextcloud/nextcloud-vue/pull/3859) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Translate strings in `NcRich\*` components [\#3858](https://github.com/nextcloud/nextcloud-vue/pull/3858) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Don't use deprecated v-deep [\#3857](https://github.com/nextcloud/nextcloud-vue/pull/3857) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove empty beforeDestroy block in `NcReferencePicker` [\#3856](https://github.com/nextcloud/nextcloud-vue/pull/3856) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add emits event sections for `NcRichText\*` components [\#3855](https://github.com/nextcloud/nextcloud-vue/pull/3855) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Only transform necessary packages for jest [\#3849](https://github.com/nextcloud/nextcloud-vue/pull/3849) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Migrate from `router-link`'s `tag` prop to `v-slot` [\#3775](https://github.com/nextcloud/nextcloud-vue/pull/3775) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v7.8.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.8.0) (2023-03-02)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.7.2...v7.8.0)

### Closed pull requests

- Merge `@nextcloud/vue-richtext` into `@nextcloud/vue` [\#3841](https://github.com/nextcloud/nextcloud-vue/pull/3841) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v7.7.2](https://github.com/nextcloud/nextcloud-vue/tree/v7.7.2) (2023-02-28)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.7.1...v7.7.2)

### :bug: Fixed bugs

- Fix circular dependency with `@nextcloud/vue-richtext` [\#3834](https://github.com/nextcloud/nextcloud-vue/pull/3834) ([julien-nc](https://github.com/julien-nc))
- Fix `NcRichContenteditable` placeholder position [\#3832](https://github.com/nextcloud/nextcloud-vue/pull/3832) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Don't fail if `NcButton` default slot contains not only text [\#3827](https://github.com/nextcloud/nextcloud-vue/pull/3827) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Adjust `NcDateTimePickerNative` icon position [\#3826](https://github.com/nextcloud/nextcloud-vue/pull/3826) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Only hide search input in `NcSelect` if disabled and an element was selected [\#3833](https://github.com/nextcloud/nextcloud-vue/pull/3833) ([susnux](https://github.com/susnux))
- Make `NcSelect` dropdown options rounded [\#3818](https://github.com/nextcloud/nextcloud-vue/pull/3818) ([Pytal](https://github.com/Pytal))
- Make `NcVNodes` component non-functional [\#3816](https://github.com/nextcloud/nextcloud-vue/pull/3816) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix high contrast mode optimization [\#3756](https://github.com/nextcloud/nextcloud-vue/pull/3756) ([susnux](https://github.com/susnux))

## [v7.7.1](https://github.com/nextcloud/nextcloud-vue/tree/v7.7.1) (2023-02-24)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.7.0...v7.7.1)

### :bug: Fixed bugs

- fix\(NcSelect\): Do not squash selected items with `no-wrap` set [\#3811](https://github.com/nextcloud/nextcloud-vue/pull/3811) ([susnux](https://github.com/susnux))

### Closed pull requests

- Unify datetimepicker opacity in NcActionInput [\#3814](https://github.com/nextcloud/nextcloud-vue/pull/3814) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Adjust `NcDatetimePicker` styling [\#3813](https://github.com/nextcloud/nextcloud-vue/pull/3813) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use `NcTextField` for `NcActionInput` [\#3784](https://github.com/nextcloud/nextcloud-vue/pull/3784) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v7.7.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.7.0) (2023-02-22)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.6.1...v7.7.0)

### :rocket: Enhancements

- Allow to add class to native datepicker input [\#3806](https://github.com/nextcloud/nextcloud-vue/pull/3806) ([raimund-schluessler](https://github.com/raimund-schluessler))
- NcAppNavigation - change toggle icon for opened sidebar [\#3800](https://github.com/nextcloud/nextcloud-vue/pull/3800) ([Antreesy](https://github.com/Antreesy))
- Use `NcSelect` for `NcTimezonePicker` [\#3781](https://github.com/nextcloud/nextcloud-vue/pull/3781) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Allow using v-show for `NcModal`, fix modal-wrapper transition [\#3769](https://github.com/nextcloud/nextcloud-vue/pull/3769) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add link picker in RichContentEditable with tribute [\#3708](https://github.com/nextcloud/nextcloud-vue/pull/3708) ([julien-nc](https://github.com/julien-nc))

### :bug: Fixed bugs

- fix\(NcSelect\): Do not squash selected items with `no-wrap` set [\#3811](https://github.com/nextcloud/nextcloud-vue/pull/3811) ([susnux](https://github.com/susnux))
- Allow value of type array for NcActionInput [\#3804](https://github.com/nextcloud/nextcloud-vue/pull/3804) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix prop type check for NcPopover setReturnFocus [\#3803](https://github.com/nextcloud/nextcloud-vue/pull/3803) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Show round corners for scrolling NcActions [\#3797](https://github.com/nextcloud/nextcloud-vue/pull/3797) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Make datetimepicker full width in NcActionInput [\#3796](https://github.com/nextcloud/nextcloud-vue/pull/3796) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix clipped background color for NcDatetimePicker [\#3794](https://github.com/nextcloud/nextcloud-vue/pull/3794) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use `NcSelect` for `NcActionInput` type multiselect [\#3760](https://github.com/nextcloud/nextcloud-vue/pull/3760) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Add missing trailing comma [\#3805](https://github.com/nextcloud/nextcloud-vue/pull/3805) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use `NcTextField` for `NcActionInput` [\#3784](https://github.com/nextcloud/nextcloud-vue/pull/3784) ([raimund-schluessler](https://github.com/raimund-schluessler))
- `NcSelect`: Selected options should not overflow the container [\#3759](https://github.com/nextcloud/nextcloud-vue/pull/3759) ([susnux](https://github.com/susnux))

## [v7.6.1](https://github.com/nextcloud/nextcloud-vue/tree/v7.6.1) (2023-02-20)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.6.0...v7.6.1)

### :rocket: Enhancements

- RichContent autocomplete not required [\#3757](https://github.com/nextcloud/nextcloud-vue/pull/3757) ([jotoeri](https://github.com/jotoeri))

### :bug: Fixed bugs

- Fix hover for ActionInput datepicker native [\#3786](https://github.com/nextcloud/nextcloud-vue/pull/3786) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix focused select border color with top placement [\#3782](https://github.com/nextcloud/nextcloud-vue/pull/3782) ([Pytal](https://github.com/Pytal))
- Fix NcButton router-link [\#3777](https://github.com/nextcloud/nextcloud-vue/pull/3777) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix nativeOn is only valid on components error, make rootElement computed [\#3771](https://github.com/nextcloud/nextcloud-vue/pull/3771) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Don't regard 1024px width viewport as mobile [\#3768](https://github.com/nextcloud/nextcloud-vue/pull/3768) ([mejo-](https://github.com/mejo-))
- NcPopover: Fix `setReturnFocus` property [\#3761](https://github.com/nextcloud/nextcloud-vue/pull/3761) ([susnux](https://github.com/susnux))
- fix: Add a webpackrule to resolve module js files in `node\_modules` [\#3754](https://github.com/nextcloud/nextcloud-vue/pull/3754) ([susnux](https://github.com/susnux))

### Closed pull requests

- Show NcDateTimePickerNative in NcPickers section [\#3787](https://github.com/nextcloud/nextcloud-vue/pull/3787) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add examples for more ActionInput types [\#3785](https://github.com/nextcloud/nextcloud-vue/pull/3785) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Migrate from deprecated `title` to `name` prop in docs [\#3776](https://github.com/nextcloud/nextcloud-vue/pull/3776) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use component with :is [\#3774](https://github.com/nextcloud/nextcloud-vue/pull/3774) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Adjust emits option [\#3773](https://github.com/nextcloud/nextcloud-vue/pull/3773) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add node-polyfill-webpack-plugin [\#3752](https://github.com/nextcloud/nextcloud-vue/pull/3752) ([GretaD](https://github.com/GretaD))

## [v7.6.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.6.0) (2023-02-15)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.5.0...v7.6.0)

### :rocket: Enhancements

- Add keyboard focus border to select options [\#3711](https://github.com/nextcloud/nextcloud-vue/pull/3711) ([Pytal](https://github.com/Pytal))

### :bug: Fixed bugs

- Fix tag search [\#3747](https://github.com/nextcloud/nextcloud-vue/pull/3747) ([Pytal](https://github.com/Pytal))
- Fix throw when header menu contains no tabbable nodes [\#3733](https://github.com/nextcloud/nextcloud-vue/pull/3733) ([Pytal](https://github.com/Pytal))
- Fix hidden select [\#3732](https://github.com/nextcloud/nextcloud-vue/pull/3732) ([Pytal](https://github.com/Pytal))
- fix\(package\): export more components to main package [\#3729](https://github.com/nextcloud/nextcloud-vue/pull/3729) ([juliushaertl](https://github.com/juliushaertl))
- Fix `NcButton` cursor style [\#3728](https://github.com/nextcloud/nextcloud-vue/pull/3728) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use proper default actions aria label in `NcListItem` [\#3714](https://github.com/nextcloud/nextcloud-vue/pull/3714) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix dashboard padding with half-empty content view [\#3712](https://github.com/nextcloud/nextcloud-vue/pull/3712) ([nickvergessen](https://github.com/nickvergessen))
- Fix setting trailingButtonLabel for PasswordField [\#3710](https://github.com/nextcloud/nextcloud-vue/pull/3710) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix NcAppNavigationItem hasUtils computed [\#3709](https://github.com/nextcloud/nextcloud-vue/pull/3709) ([raimund-schluessler](https://github.com/raimund-schluessler))
- fix\(ncselect\): Fix styling if a custom theme is applied [\#3707](https://github.com/nextcloud/nextcloud-vue/pull/3707) ([susnux](https://github.com/susnux))
- Fix: update transition styles for NcButton [\#3697](https://github.com/nextcloud/nextcloud-vue/pull/3697) ([Antreesy](https://github.com/Antreesy))
- Fix keyboard navigation of modal slides [\#3690](https://github.com/nextcloud/nextcloud-vue/pull/3690) ([Pytal](https://github.com/Pytal))
- Add aria-labels to colorpicker buttons [\#3680](https://github.com/nextcloud/nextcloud-vue/pull/3680) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Remove outdated and unused menu-align attributes [\#3749](https://github.com/nextcloud/nextcloud-vue/pull/3749) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Allow custom target names for the link target [\#3745](https://github.com/nextcloud/nextcloud-vue/pull/3745) ([susnux](https://github.com/susnux))
- Remove last usage of ´--color-primary-element-lighter` [\#3742](https://github.com/nextcloud/nextcloud-vue/pull/3742) ([susnux](https://github.com/susnux))
- Allow inline actions for appnavigationitem [\#3741](https://github.com/nextcloud/nextcloud-vue/pull/3741) ([marcoambrosini](https://github.com/marcoambrosini))
- Add missing space in NcMultiselect ternary expression [\#3739](https://github.com/nextcloud/nextcloud-vue/pull/3739) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Move NcButton to render function [\#3726](https://github.com/nextcloud/nextcloud-vue/pull/3726) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Simplify the render function of NcBreadcrumbs [\#3725](https://github.com/nextcloud/nextcloud-vue/pull/3725) ([raimund-schluessler](https://github.com/raimund-schluessler))
- No background for `tertiary-no-background` `NcActions` [\#3724](https://github.com/nextcloud/nextcloud-vue/pull/3724) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add missing trailing comma [\#3718](https://github.com/nextcloud/nextcloud-vue/pull/3718) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add aria-labels to example buttons in docs [\#3713](https://github.com/nextcloud/nextcloud-vue/pull/3713) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Adjust style of NcSelect to match other input elements [\#3701](https://github.com/nextcloud/nextcloud-vue/pull/3701) ([susnux](https://github.com/susnux))
- Small cleanup of the NcActions docs [\#3700](https://github.com/nextcloud/nextcloud-vue/pull/3700) ([raimund-schluessler](https://github.com/raimund-schluessler))
- chore\(l10n\): update l10n readme [\#3686](https://github.com/nextcloud/nextcloud-vue/pull/3686) ([skjnldsv](https://github.com/skjnldsv))
- Replace custom toolip with native one on Avatar component [\#3678](https://github.com/nextcloud/nextcloud-vue/pull/3678) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))

## [v7.5.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.5.0) (2023-01-19)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.4.0...v7.5.0)

### :rocket: Enhancements

- Set placement of select dropdown [\#3656](https://github.com/nextcloud/nextcloud-vue/pull/3656) ([Pytal](https://github.com/Pytal))
- Breadcrumb: add exact prop and fix style [\#3654](https://github.com/nextcloud/nextcloud-vue/pull/3654) ([skjnldsv](https://github.com/skjnldsv))

## [v7.4.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.4.0) (2023-01-11)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.3.0...v7.4.0)

### :rocket: Enhancements

- Add NcIconSvgWrapper to public API [\#3630](https://github.com/nextcloud/nextcloud-vue/pull/3630) ([Pytal](https://github.com/Pytal))
- feat\(AppNavigationItem\): Add href support [\#3612](https://github.com/nextcloud/nextcloud-vue/pull/3612) ([skjnldsv](https://github.com/skjnldsv))
- Add `NcSavingIndicatorIcon` [\#3575](https://github.com/nextcloud/nextcloud-vue/pull/3575) ([susnux](https://github.com/susnux))
- feat\(AppNavigationItem\): Allow native title attribute control [\#3617](https://github.com/nextcloud/nextcloud-vue/pull/3617) ([skjnldsv](https://github.com/skjnldsv))

### :bug: Fixed bugs

- Do not add aria-label when avatar is not interactive [\#3618](https://github.com/nextcloud/nextcloud-vue/pull/3618) ([Pytal](https://github.com/Pytal))
- Fix action input styles [\#3614](https://github.com/nextcloud/nextcloud-vue/pull/3614) ([Pytal](https://github.com/Pytal))
- fix\(ProgressBar\): Fix progress rounded corners [\#3613](https://github.com/nextcloud/nextcloud-vue/pull/3613) ([skjnldsv](https://github.com/skjnldsv))
- fix\(NcAppNavigationItem\): Make sure that icon-collapse styles take precendense over NcButton styles [\#3608](https://github.com/nextcloud/nextcloud-vue/pull/3608) ([juliushaertl](https://github.com/juliushaertl))
- Fix appNavigationItem collapse labels [\#3598](https://github.com/nextcloud/nextcloud-vue/pull/3598) ([skjnldsv](https://github.com/skjnldsv))
- Adjust border thickness of NcRichContenteditable [\#3637](https://github.com/nextcloud/nextcloud-vue/pull/3637) ([Chartman123](https://github.com/Chartman123))
- Create `aria-label` for icon link [\#3597](https://github.com/nextcloud/nextcloud-vue/pull/3597) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))

### Closed pull requests

- Add console warning messages for deprecated multiselect components [\#3573](https://github.com/nextcloud/nextcloud-vue/pull/3573) ([Pytal](https://github.com/Pytal))

## [v7.3.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.3.0) (2022-12-23)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.2.0...v7.3.0)

### :rocket: Enhancements

- Add title prop to components for native tooltips [\#3569](https://github.com/nextcloud/nextcloud-vue/pull/3569) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Allow accessible labels for NcActionInput [\#3517](https://github.com/nextcloud/nextcloud-vue/pull/3517) ([Pytal](https://github.com/Pytal))

### :bug: Fixed bugs

- Fix CheckboxHeight [\#3584](https://github.com/nextcloud/nextcloud-vue/pull/3584) ([jotoeri](https://github.com/jotoeri))
- Add more space for unread counter so its aligned with action menu [\#3572](https://github.com/nextcloud/nextcloud-vue/pull/3572) ([GretaD](https://github.com/GretaD))


## [v7.2.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.2.0) (2022-12-09)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.1.0...v7.2.0)

### :rocket: Enhancements

- Add NcHeaderMenu [\#3489](https://github.com/nextcloud/nextcloud-vue/pull/3489) ([skjnldsv](https://github.com/skjnldsv))

### :bug: Fixed bugs

- Add button role for NcButton with href [\#3532](https://github.com/nextcloud/nextcloud-vue/pull/3532) ([Pytal](https://github.com/Pytal))
- Fix focus returning to top of page instead of actions toggle button [\#3530](https://github.com/nextcloud/nextcloud-vue/pull/3530) ([Pytal](https://github.com/Pytal))
- Fix icon repeat and position for AppNavigationItem [\#3539](https://github.com/nextcloud/nextcloud-vue/pull/3539) ([skjnldsv](https://github.com/skjnldsv))
- Fix jsdoc: Add missing documentation for events [\#3545](https://github.com/nextcloud/nextcloud-vue/pull/3545) ([susnux](https://github.com/susnux))
- Increase input field border contrast [\#3551](https://github.com/nextcloud/nextcloud-vue/pull/3551) ([Pytal](https://github.com/Pytal))
- Increase NcSelect border contrast [\#3552](https://github.com/nextcloud/nextcloud-vue/pull/3552) ([Pytal](https://github.com/Pytal))
- Revert "fix sidebar scrolling for small displays" [\#3559](https://github.com/nextcloud/nextcloud-vue/pull/3559) ([skjnldsv](https://github.com/skjnldsv))
- Scope global \#content styles via extra class [\#3537](https://github.com/nextcloud/nextcloud-vue/pull/3537) ([st3iny](https://github.com/st3iny))

## [v7.1.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.1.0) (2022-11-29)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.0.1...v7.1.0)

### :rocket: Enhancements

- Add accessible NcSelect and NcSelectTags components [\#3435](https://github.com/nextcloud/nextcloud-vue/pull/3435) ([Pytal](https://github.com/Pytal))
- Extend NcInputField props and forward $attrs to NcPasswordField and NcTextField [\#3485](https://github.com/nextcloud/nextcloud-vue/pull/3485) ([skjnldsv](https://github.com/skjnldsv))
- Move loadState to data for better mockability [\#3502](https://github.com/nextcloud/nextcloud-vue/pull/3502) ([skjnldsv](https://github.com/skjnldsv))
- Widen container prop type passed to NcPopover [\#3462](https://github.com/nextcloud/nextcloud-vue/pull/3462) ([Pytal](https://github.com/Pytal))
- Allow querying for resources with complex item ids [\#3404](https://github.com/nextcloud/nextcloud-vue/pull/3404) ([Pytal](https://github.com/Pytal))
- Allow to provide a custom palette to the ColorPicker [\#3384](https://github.com/nextcloud/nextcloud-vue/pull/3384) ([skjnldsv](https://github.com/skjnldsv))
- Export NcMentionBubble and NcAutoCompleteResult [\#3373](https://github.com/nextcloud/nextcloud-vue/pull/3373) ([vinicius73](https://github.com/vinicius73))
- Add guest content component [\#3369](https://github.com/nextcloud/nextcloud-vue/pull/3369) ([ChristophWurst](https://github.com/ChristophWurst))

### :bug: Fixed bugs

- Fix multiselect checkmark and plus icon [\#3513](https://github.com/nextcloud/nextcloud-vue/pull/3513) ([skjnldsv](https://github.com/skjnldsv))
- Make gap in NcAppNavigation consistent in nested lists [\#3506](https://github.com/nextcloud/nextcloud-vue/pull/3506) ([juliushaertl](https://github.com/juliushaertl))
- Fix value type for DateTimePickerNative [\#3491](https://github.com/nextcloud/nextcloud-vue/pull/3491) ([skjnldsv](https://github.com/skjnldsv))
- Define global focus trap [\#3478](https://github.com/nextcloud/nextcloud-vue/pull/3478) ([skjnldsv](https://github.com/skjnldsv))
- fix the size of the popper element [\#3445](https://github.com/nextcloud/nextcloud-vue/pull/3445) ([szaimen](https://github.com/szaimen))
- fix sidebar scrolling for small displays [\#3444](https://github.com/nextcloud/nextcloud-vue/pull/3444) ([szaimen](https://github.com/szaimen))
- Fix dark themed color picker and use button component [\#3411](https://github.com/nextcloud/nextcloud-vue/pull/3411) ([Pytal](https://github.com/Pytal))
- Fix password\_policy fallback handling [\#3408](https://github.com/nextcloud/nextcloud-vue/pull/3408) ([nickvergessen](https://github.com/nickvergessen))
- Fix missing half-empty dashboard empty content view [\#3407](https://github.com/nextcloud/nextcloud-vue/pull/3407) ([nickvergessen](https://github.com/nickvergessen))
- Fix DateTimePicker example and translation [\#3405](https://github.com/nextcloud/nextcloud-vue/pull/3405) ([skjnldsv](https://github.com/skjnldsv))
- Fix outdated variables [\#3367](https://github.com/nextcloud/nextcloud-vue/pull/3367) ([jancborchardt](https://github.com/jancborchardt))
- Comment placeholder wording fix [\#3454](https://github.com/nextcloud/nextcloud-vue/pull/3454) ([Jerome-Herbinet](https://github.com/Jerome-Herbinet))
- Expand color picker width only when using advanced fields [\#3410](https://github.com/nextcloud/nextcloud-vue/pull/3410) ([Pytal](https://github.com/Pytal))
- Fix empty content height in NcDashboardWidget in N in N in N [\#3372](https://github.com/nextcloud/nextcloud-vue/pull/3372) ([CarlSchwan](https://github.com/CarlSchwan))

### Closed pull requests

- Finish emoji focus cleaning [\#3504](https://github.com/nextcloud/nextcloud-vue/pull/3504) ([skjnldsv](https://github.com/skjnldsv))

## [v7.0.1](https://github.com/nextcloud/nextcloud-vue/tree/v7.0.1) (2022-10-14)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v7.0.0...v7.0.1)

### :bug: Fixed bugs

- use @nextcloud/focus-trap instead of focus-trap [\#3347](https://github.com/nextcloud/nextcloud-vue/pull/3347) ([vinicius73](https://github.com/vinicius73))

### :rocket: Enhancements

- Migrate to use `:deep` selector instead of deprecated `::v-deep` [\#3348](https://github.com/nextcloud/nextcloud-vue/pull/3348) ([susnux](https://github.com/susnux))

## [v7.0.0](https://github.com/nextcloud/nextcloud-vue/tree/v7.0.0) - 2022-10-12

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v6.0.0...v7.0.0)

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

- Add advanced fields to color picker [#3324](https://github.com/nextcloud/nextcloud-vue/pull/3324) ([@Pytal](https://github.com/Pytal))
- Enables ESM Modules [#3283](https://github.com/nextcloud/nextcloud-vue/pull/3283) ([@vinicius73](https://github.com/vinicius73))
- Add styleguide example for non-user avatar [\#3270](https://github.com/nextcloud/nextcloud-vue/pull/3270) ([ChristophWurst](https://github.com/ChristophWurst))
- Live refresh image and displayname based avatar on update [\#3266](https://github.com/nextcloud/nextcloud-vue/pull/3266) ([Pytal](https://github.com/Pytal))
- Forward the autofocus attribute to input field component [\#3245](https://github.com/nextcloud/nextcloud-vue/pull/3245) ([kesselb](https://github.com/kesselb))
- Allow 'search' as type prop for NcTextField [\#3190](https://github.com/nextcloud/nextcloud-vue/pull/3190) ([artonge](https://github.com/artonge))
- Add gap between nav entry [\#3235](https://github.com/nextcloud/nextcloud-vue/pull/3235) ([CarlSchwan](https://github.com/CarlSchwan))
- Fix for border-radius being too large for 3-line entries like in Mail [\#3136](https://github.com/nextcloud/nextcloud-vue/pull/3136) ([jancborchardt](https://github.com/jancborchardt))
- Add related resources panel component [\#3081](https://github.com/nextcloud/nextcloud-vue/pull/3081) ([Pytal](https://github.com/Pytal))
- Add a native datetime picker [\#3063](https://github.com/nextcloud/nextcloud-vue/pull/3063) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Always show NcAppSettingsDialog title [\#3074](https://github.com/nextcloud/nextcloud-vue/pull/3074) ([raimund-schluessler](https://github.com/raimund-schluessler))

### :bug: Fixed bugs

- Also use menuOpen state in NcAppNavigationItem [#3350](https://github.com/nextcloud/nextcloud-vue/pull/3350) ([@st3iny](https://github.com/st3iny))
- Update cypress base snapshots after changes to server [#3352](https://github.com/nextcloud/nextcloud-vue/pull/3352) ([@raimund-schluessler](https://github.com/raimund-schluessler))
- Fix app content growing too wide [#3329](https://github.com/nextcloud/nextcloud-vue/pull/3329) ([@st3iny](https://github.com/st3iny))
- Fix SCSS to CSS variable assignment [#3261](https://github.com/nextcloud/nextcloud-vue/pull/3261) ([@susnux](https://github.com/susnux))
- Fix non-user avatar on complex background [\#3272](https://github.com/nextcloud/nextcloud-vue/pull/3272) ([ChristophWurst](https://github.com/ChristophWurst))
- Fix initials color of new non-user avatars [\#3271](https://github.com/nextcloud/nextcloud-vue/pull/3271) ([ChristophWurst](https://github.com/ChristophWurst))
- Mark resource button styles as important to fix styles in some contexts [\#3259](https://github.com/nextcloud/nextcloud-vue/pull/3259) ([Pytal](https://github.com/Pytal))
- Make app navigation settings pixel perfect-ish [\#3256](https://github.com/nextcloud/nextcloud-vue/pull/3256) ([ChristophWurst](https://github.com/ChristophWurst))
- Move the close button to the end of the content [\#3230](https://github.com/nextcloud/nextcloud-vue/pull/3230) ([marcoambrosini](https://github.com/marcoambrosini))
- Fix NcEmptyContent used inside NcModal [\#3253](https://github.com/nextcloud/nextcloud-vue/pull/3253) ([nickvergessen](https://github.com/nickvergessen))
- Add proper margin to the counter [\#3250](https://github.com/nextcloud/nextcloud-vue/pull/3250) ([marcoambrosini](https://github.com/marcoambrosini))
- Fix avatar border color [\#3244](https://github.com/nextcloud/nextcloud-vue/pull/3244) ([nickvergessen](https://github.com/nickvergessen))
- Fix single action detection [\#3212](https://github.com/nextcloud/nextcloud-vue/pull/3212) ([st3iny](https://github.com/st3iny))
- Fix loading avatar status [\#3204](https://github.com/nextcloud/nextcloud-vue/pull/3204) ([CarlSchwan](https://github.com/CarlSchwan))
- Fix overwriting placeholder property in NcDatetimePicker [\#3202](https://github.com/nextcloud/nextcloud-vue/pull/3202) ([Chartman123](https://github.com/Chartman123))
- Fix scrolling in styleguide [\#3200](https://github.com/nextcloud/nextcloud-vue/pull/3200) ([marcoambrosini](https://github.com/marcoambrosini))
- Right-align nav item utils [\#3178](https://github.com/nextcloud/nextcloud-vue/pull/3178) ([ChristophWurst](https://github.com/ChristophWurst))
- Fix active and focus frame [\#3201](https://github.com/nextcloud/nextcloud-vue/pull/3201) ([CarlSchwan](https://github.com/CarlSchwan))
- Fix app navigation backdrop blur [\#3189](https://github.com/nextcloud/nextcloud-vue/pull/3189) ([ChristophWurst](https://github.com/ChristophWurst))
- AppNavigationItem actions visibility [\#3165](https://github.com/nextcloud/nextcloud-vue/pull/3165) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Spacing in app navigation and make the setting pill style [\#3158](https://github.com/nextcloud/nextcloud-vue/pull/3158) ([juliushaertl](https://github.com/juliushaertl))
- Actions positioning [\#3157](https://github.com/nextcloud/nextcloud-vue/pull/3157) ([juliushaertl](https://github.com/juliushaertl))
- .active state of app list items [\#3147](https://github.com/nextcloud/nextcloud-vue/pull/3147) ([ChristophWurst](https://github.com/ChristophWurst))

### Closed pull requests

- Allow opting out of automatic NcModal remounting [\#3219](https://github.com/nextcloud/nextcloud-vue/pull/3219) ([Pytal](https://github.com/Pytal))
- Fix multiselect background color spilling outside the component [\#3252](https://github.com/nextcloud/nextcloud-vue/pull/3252) ([ChristophWurst](https://github.com/ChristophWurst))
- Update design of related resources panel [\#3236](https://github.com/nextcloud/nextcloud-vue/pull/3236) ([Pytal](https://github.com/Pytal))
- Fix a word puzzle in NcDashboardWidget component [\#3225](https://github.com/nextcloud/nextcloud-vue/pull/3225) ([CarlSchwan](https://github.com/CarlSchwan))
- Fix NcAppNavigationItem, pass correct boundaries-element NcActions [\#3197](https://github.com/nextcloud/nextcloud-vue/pull/3197) ([eneiluj](https://github.com/eneiluj))
- Limit max width of the settings [\#3192](https://github.com/nextcloud/nextcloud-vue/pull/3192) ([CarlSchwan](https://github.com/CarlSchwan))
- Fix the NcPopoverMenu component [\#3191](https://github.com/nextcloud/nextcloud-vue/pull/3191) ([CarlSchwan](https://github.com/CarlSchwan))
- fix comments border-radius [\#3175](https://github.com/nextcloud/nextcloud-vue/pull/3175) ([szaimen](https://github.com/szaimen))
- \[PoC\] Use github source css for styleguide [\#3139](https://github.com/nextcloud/nextcloud-vue/pull/3139) ([skjnldsv](https://github.com/skjnldsv))
- Use dark themed avatar on dark theme [\#3119](https://github.com/nextcloud/nextcloud-vue/pull/3119) ([CarlSchwan](https://github.com/CarlSchwan))
- Use events provided by floating-vue [\#3149](https://github.com/nextcloud/nextcloud-vue/pull/3149) ([raimund-schluessler](https://github.com/raimund-schluessler))


## v6.0.0 (unreleased)

### :boom: Breaking Changes
* [#2600](https://github.com/nextcloud/nextcloud-vue/pull/2600) Migrate to floating-vue ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2867](https://github.com/nextcloud/nextcloud-vue/pull/2867) Accessible EmptyContent component ([@Pytal](https://github.com/Pytal))
* [#2630](https://github.com/nextcloud/nextcloud-vue/pull/2630) show the action buttons on top of the modal always by default ([@szaimen](https://github.com/szaimen))
* [#1946](https://github.com/nextcloud/nextcloud-vue/pull/1946) Properly align appnavigationtoggle ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2738](https://github.com/nextcloud/nextcloud-vue/pull/2738) Move close button within modal boundaries ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2720](https://github.com/nextcloud/nextcloud-vue/pull/2720) Add icon slot to AppNavigationNew component ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2603](https://github.com/nextcloud/nextcloud-vue/pull/2603) Comply with eslint for event name ([@artonge](https://github.com/artonge))
* [#2704](https://github.com/nextcloud/nextcloud-vue/pull/2704) Put the children of AppNavigationItem outside of the main item ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2980](https://github.com/nextcloud/nextcloud-vue/pull/2980) Bump @nextcloud/eslint-config from 8.0.0 to 8.1.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
* ~~[#2911](https://github.com/nextcloud/nextcloud-vue/pull/2911) Use render function in Actions component ([@raimund-schluessler](https://github.com/raimund-schluessler))~~ No more breaking after [#3006](https://github.com/nextcloud/nextcloud-vue/pull/3006) in beta.2
* [#2929](https://github.com/nextcloud/nextcloud-vue/pull/2929) Bump vue from 2.6.14 to 2.7.8 ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2923](https://github.com/nextcloud/nextcloud-vue/pull/2923) Enforce setting section ids ([@nickvergessen](https://github.com/nickvergessen))
* [\#3058](https://github.com/nextcloud/nextcloud-vue/pull/3058) Add Nc prefix to all components ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3106](https://github.com/nextcloud/nextcloud-vue/pull/3106) Fix emptyContent once more ([jotoeri](https://github.com/jotoeri))
* [\#3090](https://github.com/nextcloud/nextcloud-vue/pull/3090) Fix EmptyContent Reactivity ([jotoeri](https://github.com/jotoeri))

### :rocket: Enhancements
* [#2875](https://github.com/nextcloud/nextcloud-vue/pull/2875) Adjust loading icon style, replace `fillColor` prop ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2879](https://github.com/nextcloud/nextcloud-vue/pull/2879) Turn the button into router-link when to is there ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2565](https://github.com/nextcloud/nextcloud-vue/pull/2565) Improve SettingsInputText component ([@quentinguidee](https://github.com/quentinguidee))
* [#2808](https://github.com/nextcloud/nextcloud-vue/pull/2808) Add a11y utility ([@Pytal](https://github.com/Pytal))
* [#2715](https://github.com/nextcloud/nextcloud-vue/pull/2715) Augment keyboard accessibility of AppSidebar ([@Pytal](https://github.com/Pytal))
* [#2757](https://github.com/nextcloud/nextcloud-vue/pull/2757) Alternative style for CheckboxRadioSwitch (radio type) ([@eneiluj](https://github.com/eneiluj))
* [#2779](https://github.com/nextcloud/nextcloud-vue/pull/2779) Keep text in `InputConfirmCancel` static ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2776](https://github.com/nextcloud/nextcloud-vue/pull/2776) Improve CheckboxRadioSwitch accessibility ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2727](https://github.com/nextcloud/nextcloud-vue/pull/2727) Add material design loading icon ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2747](https://github.com/nextcloud/nextcloud-vue/pull/2747) make the sidebare full-width on small screens ([@szaimen](https://github.com/szaimen))
* [#2630](https://github.com/nextcloud/nextcloud-vue/pull/2630) show the action buttons on top of the modal always by default ([@szaimen](https://github.com/szaimen))
* [#2738](https://github.com/nextcloud/nextcloud-vue/pull/2738) Move close button within modal boundaries ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2577](https://github.com/nextcloud/nextcloud-vue/pull/2577) Add ColorPicker feedback on selection ([@quentinguidee](https://github.com/quentinguidee))
* [#2719](https://github.com/nextcloud/nextcloud-vue/pull/2719) Add title section to settingsdialog ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2718](https://github.com/nextcloud/nextcloud-vue/pull/2718) Add actions slot to dashboard widget item ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2571](https://github.com/nextcloud/nextcloud-vue/pull/2571) Use large border-radius in AppNavigation ([@quentinguidee](https://github.com/quentinguidee))
* [#2713](https://github.com/nextcloud/nextcloud-vue/pull/2713) Use large border-radius in Action Button ([@GretaD](https://github.com/GretaD))
* [#2704](https://github.com/nextcloud/nextcloud-vue/pull/2704) Put the children of AppNavigationItem outside of the main item ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2552](https://github.com/nextcloud/nextcloud-vue/pull/2552) Make emojis selectable by tab ([@skjnldsv](https://github.com/skjnldsv))
* [#2668](https://github.com/nextcloud/nextcloud-vue/pull/2668) Merge Dashboard components into repository ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2654](https://github.com/nextcloud/nextcloud-vue/pull/2654) add handle keyboard focus for accessibility ([@vanpertsch](https://github.com/vanpertsch))
* [#2629](https://github.com/nextcloud/nextcloud-vue/pull/2629) small cleanup of small modal size ([@szaimen](https://github.com/szaimen))
* [#2911](https://github.com/nextcloud/nextcloud-vue/pull/2911) Use render function in Actions component ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2998](https://github.com/nextcloud/nextcloud-vue/pull/2998) Import tooltip directive only locally ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2983](https://github.com/nextcloud/nextcloud-vue/pull/2983) Simplify webpack configuration ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2973](https://github.com/nextcloud/nextcloud-vue/pull/2973) Allow to filter the available tags ([@nickvergessen](https://github.com/nickvergessen))
* [#2868](https://github.com/nextcloud/nextcloud-vue/pull/2868) Create TextField component ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2856](https://github.com/nextcloud/nextcloud-vue/pull/2856) Fix ListItem css & add compact mode ([@jotoeri](https://github.com/jotoeri))
* [\#3060](https://github.com/nextcloud/nextcloud-vue/pull/3060) Allow to render x items outside an Actions menu ([skjnldsv](https://github.com/skjnldsv))
* [\#3040](https://github.com/nextcloud/nextcloud-vue/pull/3040) Allow ListItem components to link to external links ([tcitworld](https://github.com/tcitworld))
* [\#3082](https://github.com/nextcloud/nextcloud-vue/pull/3082) Allow more than text on EmptyContent description ([jotoeri](https://github.com/jotoeri))
* [\#3078](https://github.com/nextcloud/nextcloud-vue/pull/3078) Add ref to NcInputField in NcTextField ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3056](https://github.com/nextcloud/nextcloud-vue/pull/3056) 📰 Update AppNavigationItem design ([marcoambrosini](https://github.com/marcoambrosini))
* [\#3055](https://github.com/nextcloud/nextcloud-vue/pull/3055) ListItem Design update  ([marcoambrosini](https://github.com/marcoambrosini))
* [\#3100](https://github.com/nextcloud/nextcloud-vue/pull/3100) Improve multiselect ([CarlSchwan](https://github.com/CarlSchwan))
* [\#3057](https://github.com/nextcloud/nextcloud-vue/pull/3057) 🥛 Make app navigation semi-transparent ([GretaD](https://github.com/GretaD))
* [\#3070](https://github.com/nextcloud/nextcloud-vue/pull/3070) Make unread counter primary colour ([GretaD](https://github.com/GretaD))
* [\#3142](https://github.com/nextcloud/nextcloud-vue/pull/3142) Make the app content list 300px min ([ChristophWurst](https://github.com/ChristophWurst))

### :bug: Fixed bugs
* [#2878](https://github.com/nextcloud/nextcloud-vue/pull/2878) Fix single action validation ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2877](https://github.com/nextcloud/nextcloud-vue/pull/2877) Bring back AppNavigationToggle tooltip ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2895](https://github.com/nextcloud/nextcloud-vue/pull/2895) Fix issues with Multiselect component ([@nickvergessen](https://github.com/nickvergessen))
* [#2882](https://github.com/nextcloud/nextcloud-vue/pull/2882) Fix box shadow colour of "tertiary-on-primary" button ([@danxuliu](https://github.com/danxuliu))
* [#2871](https://github.com/nextcloud/nextcloud-vue/pull/2871) Add a button style for being used on primary like in the header ([@nickvergessen](https://github.com/nickvergessen))
* [#2865](https://github.com/nextcloud/nextcloud-vue/pull/2865) Make captions real headings for improved a11y ([@nickvergessen](https://github.com/nickvergessen))
* [#2855](https://github.com/nextcloud/nextcloud-vue/pull/2855) Fix invalid setting section IDs ([@nickvergessen](https://github.com/nickvergessen))
* [#2695](https://github.com/nextcloud/nextcloud-vue/pull/2695) Change Prev/next links to buttons ([@vanpertsch](https://github.com/vanpertsch))
* [#2845](https://github.com/nextcloud/nextcloud-vue/pull/2845) Add headline to sidebar sections to improve landmarks ([@nickvergessen](https://github.com/nickvergessen))
* [#2846](https://github.com/nextcloud/nextcloud-vue/pull/2846) Fix HTML validation of AppNavigationToggle ([@nickvergessen](https://github.com/nickvergessen))
* [#2840](https://github.com/nextcloud/nextcloud-vue/pull/2840) Fix invalid tabindex and role ([@nickvergessen](https://github.com/nickvergessen))
* [#2841](https://github.com/nextcloud/nextcloud-vue/pull/2841) Remove invalid test-attr ([@nickvergessen](https://github.com/nickvergessen))
* [#2833](https://github.com/nextcloud/nextcloud-vue/pull/2833) Fix vue material design icons HTML validation ([@nickvergessen](https://github.com/nickvergessen))
* [#1946](https://github.com/nextcloud/nextcloud-vue/pull/1946) Properly align appnavigationtoggle ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2738](https://github.com/nextcloud/nextcloud-vue/pull/2738) Move close button within modal boundaries ([@marcoambrosini](https://github.com/marcoambrosini))
* [#2576](https://github.com/nextcloud/nextcloud-vue/pull/2576) Increase padding of ColorPicker ([@quentinguidee](https://github.com/quentinguidee))
* [#2638](https://github.com/nextcloud/nextcloud-vue/pull/2638) Fix lifecycle hook name in Avatar ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2628](https://github.com/nextcloud/nextcloud-vue/pull/2628) Fix styleguide serve ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2533](https://github.com/nextcloud/nextcloud-vue/pull/2533) [MultiSelect] pass the #noResult slot to the underlying component ([@eneiluj](https://github.com/eneiluj))
* [#2999](https://github.com/nextcloud/nextcloud-vue/pull/2999) Also export tooltip options ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2997](https://github.com/nextcloud/nextcloud-vue/pull/2997) Fix regressions from floating-vue migration ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2991](https://github.com/nextcloud/nextcloud-vue/pull/2991) Fix Actions styling in Breadcrumbs ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2984](https://github.com/nextcloud/nextcloud-vue/pull/2984) Fix button import in modal example ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2981](https://github.com/nextcloud/nextcloud-vue/pull/2981) Add aria-label to single action button ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2911](https://github.com/nextcloud/nextcloud-vue/pull/2911) Use render function in Actions component ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2961](https://github.com/nextcloud/nextcloud-vue/pull/2961) Fix focusing last action with page-down ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2946](https://github.com/nextcloud/nextcloud-vue/pull/2946) Make sure modal ids are unique ([@nickvergessen](https://github.com/nickvergessen))
* [#2883](https://github.com/nextcloud/nextcloud-vue/pull/2883) Do not treat an avatar as a button if there is no menu ([@danxuliu](https://github.com/danxuliu))
* [#2929](https://github.com/nextcloud/nextcloud-vue/pull/2929) Bump vue from 2.6.14 to 2.7.8 ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2938](https://github.com/nextcloud/nextcloud-vue/pull/2938) Revert "Bump vue-styleguidist from 4.48.0 to 4.50.0" ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2912](https://github.com/nextcloud/nextcloud-vue/pull/2912) Fix missing icon in actions custom icon slot ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#2856](https://github.com/nextcloud/nextcloud-vue/pull/2856) Fix ListItem css & add compact mode ([@jotoeri](https://github.com/jotoeri))
* [#2894](https://github.com/nextcloud/nextcloud-vue/pull/2894) Add more explicit title to the sidebar close button ([@juliushaertl](https://github.com/juliushaertl))
* [#3017](https://github.com/nextcloud/nextcloud-vue/pull/3017) Fix icon-class, re-add default-icon support for Actions ([@raimund-schluessler](https://github.com/raimund-schluessler))
* [#3006](https://github.com/nextcloud/nextcloud-vue/pull/3006) Fix single button action icon attribute ([@PVince81](https://github.com/PVince81))
* [\#3059](https://github.com/nextcloud/nextcloud-vue/pull/3059) Fix breadcrumbs dropdown icon alignment ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3046](https://github.com/nextcloud/nextcloud-vue/pull/3046) Add missing trailing comma ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3035](https://github.com/nextcloud/nextcloud-vue/pull/3035) Correctly overwrite app-settings modal style ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3034](https://github.com/nextcloud/nextcloud-vue/pull/3034) Implement empty content icon slot in DashboardWidget ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3031](https://github.com/nextcloud/nextcloud-vue/pull/3031) Fix reference to closed menu in "aria-controls" ([danxuliu](https://github.com/danxuliu))
* [\#3030](https://github.com/nextcloud/nextcloud-vue/pull/3030) Don't return focus after close-after-click ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3023](https://github.com/nextcloud/nextcloud-vue/pull/3023) Dismis focus trap when component gets destroyed ([juliushaertl](https://github.com/juliushaertl))
* [\#3022](https://github.com/nextcloud/nextcloud-vue/pull/3022) Allow click outside for Popover focus trap ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3021](https://github.com/nextcloud/nextcloud-vue/pull/3021) Disable focus-trap for Popover by default ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3020](https://github.com/nextcloud/nextcloud-vue/pull/3020)  Fix issues with focus trap on modal ([juliushaertl](https://github.com/juliushaertl))
* [\#3037](https://github.com/nextcloud/nextcloud-vue/pull/3037) ```aria-expanded``` was fixed for Multiselect.vue ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
* [\#3077](https://github.com/nextcloud/nextcloud-vue/pull/3077) Make input field button style take precedence ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3076](https://github.com/nextcloud/nextcloud-vue/pull/3076) Fix NcAppNavigationItem docs ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3075](https://github.com/nextcloud/nextcloud-vue/pull/3075) Fix listitem tabbed navigation ([marcoambrosini](https://github.com/marcoambrosini))
* [\#3074](https://github.com/nextcloud/nextcloud-vue/pull/3074) Always show NcAppSettingsDialog title ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3071](https://github.com/nextcloud/nextcloud-vue/pull/3071) Fix link in docs to NcCounterBubble ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3069](https://github.com/nextcloud/nextcloud-vue/pull/3069) Only set target and rel attributes when href != '\#' ([tcitworld](https://github.com/tcitworld))
* [\#3065](https://github.com/nextcloud/nextcloud-vue/pull/3065) Fix margin for Modal inline actions ([skjnldsv](https://github.com/skjnldsv))
* [\#2970](https://github.com/nextcloud/nextcloud-vue/pull/2970) Fix InputField focus state ([marcoambrosini](https://github.com/marcoambrosini))
* [\#3066](https://github.com/nextcloud/nextcloud-vue/pull/3066) Fix Modal closing ([skjnldsv](https://github.com/skjnldsv))
* [\#3111](https://github.com/nextcloud/nextcloud-vue/pull/3111) Ensure proper actions menu styling ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests
* [\#3019](https://github.com/nextcloud/nextcloud-vue/pull/3019) Add note about pre-releases to the readme ([juliushaertl](https://github.com/juliushaertl))
* [\#3089](https://github.com/nextcloud/nextcloud-vue/pull/3089) Fix EmptyContent comments example in docs ([Pytal](https://github.com/Pytal))
* [\#3072](https://github.com/nextcloud/nextcloud-vue/pull/3072) Remove debug log statement ([st3iny](https://github.com/st3iny))
* [\#3113](https://github.com/nextcloud/nextcloud-vue/pull/3113) Add aria-modal to Modal dialog ([PVince81](https://github.com/PVince81))
* [\#3080](https://github.com/nextcloud/nextcloud-vue/pull/3080) Fix contrast of next/prev modal buttons ([Pytal](https://github.com/Pytal))
* [\#3141](https://github.com/nextcloud/nextcloud-vue/pull/3141) Simplify exports ([Pytal](https://github.com/Pytal))
* [\#3140](https://github.com/nextcloud/nextcloud-vue/pull/3140) Improve text fields ([CarlSchwan](https://github.com/CarlSchwan))
* [\#3137](https://github.com/nextcloud/nextcloud-vue/pull/3137) Remove unused \#counter template from ListItem docs ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3135](https://github.com/nextcloud/nextcloud-vue/pull/3135) Polish password field component ([CarlSchwan](https://github.com/CarlSchwan))
* [\#3132](https://github.com/nextcloud/nextcloud-vue/pull/3132) Add slot for dot indicator in NcListItem.vue ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
* [\#3130](https://github.com/nextcloud/nextcloud-vue/pull/3130) Add missing tab in NcModal CSS ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3122](https://github.com/nextcloud/nextcloud-vue/pull/3122) Use correct Nc components prefix everywhere ([raimund-schluessler](https://github.com/raimund-schluessler))
* [\#3112](https://github.com/nextcloud/nextcloud-vue/pull/3112) Update variables.css from nextcloud server ([vinicius73](https://github.com/vinicius73))


## [v5.3.1](https://github.com/nextcloud/nextcloud-vue/tree/v5.3.1) (2022-04-08)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v5.3.0...v5.3.1)

### Fixed bugs

- Fix button disable state and reactivity [\#2622](https://github.com/nextcloud/nextcloud-vue/pull/2622) ([skjnldsv](https://github.com/skjnldsv))
- Fix border radius for small progress bar [\#2618](https://github.com/nextcloud/nextcloud-vue/pull/2618) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Revert "Use large corner radius for the Popover component" [\#2611](https://github.com/nextcloud/nextcloud-vue/pull/2611) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- fix positioning of content text [\#2601](https://github.com/nextcloud/nextcloud-vue/pull/2601) ([szaimen](https://github.com/szaimen))
- Fix EmptyContent svg size [\#2592](https://github.com/nextcloud/nextcloud-vue/pull/2592) ([skjnldsv](https://github.com/skjnldsv))
- Fix visual issue of the settings tab in the documentation [\#2573](https://github.com/nextcloud/nextcloud-vue/pull/2573) ([quentinguidee](https://github.com/quentinguidee))
- Don't give normal and large modals a fixed height [\#2610](https://github.com/nextcloud/nextcloud-vue/pull/2610) ([szaimen](https://github.com/szaimen))
- Cleanup tooltip and popover CSS [\#2602](https://github.com/nextcloud/nextcloud-vue/pull/2602) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Ensure l10n check uses right node and npm version [\#2596](https://github.com/nextcloud/nextcloud-vue/pull/2596) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Action button vue class [\#2586](https://github.com/nextcloud/nextcloud-vue/pull/2586) ([CarlSchwan](https://github.com/CarlSchwan))
- Replace deprecated String.prototype.substr\(\) [\#2579](https://github.com/nextcloud/nextcloud-vue/pull/2579) ([CommanderRoot](https://github.com/CommanderRoot))
- Only show actions if actions given for breadcrumbs [\#2559](https://github.com/nextcloud/nextcloud-vue/pull/2559) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v5.3.0](https://github.com/nextcloud/nextcloud-vue/tree/v5.3.0) (2022-03-31)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v5.2.1...v5.3.0)

### Fixed bugs

- Fix tertiary no background button color [\#2589](https://github.com/nextcloud/nextcloud-vue/pull/2589) ([marcoambrosini](https://github.com/marcoambrosini))
- Fix tertiary buttons hover feedback [\#2583](https://github.com/nextcloud/nextcloud-vue/pull/2583) ([marcoambrosini](https://github.com/marcoambrosini))
- Fix the ProgressBar display in the documentation [\#2564](https://github.com/nextcloud/nextcloud-vue/pull/2564) ([quentinguidee](https://github.com/quentinguidee))

### Closed pull requests

- Add tertiary buttons with background and make them the default [\#2585](https://github.com/nextcloud/nextcloud-vue/pull/2585) ([marcoambrosini](https://github.com/marcoambrosini))
- Update variables.css [\#2574](https://github.com/nextcloud/nextcloud-vue/pull/2574) ([skjnldsv](https://github.com/skjnldsv))


## [v5.2.1](https://github.com/nextcloud/nextcloud-vue/tree/v5.2.1) (2022-03-24)
Releasing this patch to re-trigger an npm package build since last release github was down


## [v5.2.0](https://github.com/nextcloud/nextcloud-vue/tree/v5.2.0) (2022-03-23)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v5.1.1...v5.2.0)

### Enhancements

- Use large corner radius for the Popover component [\#2566](https://github.com/nextcloud/nextcloud-vue/pull/2566) ([quentinguidee](https://github.com/quentinguidee))
- Inherit attrs and forward listeners in the emojipicker's popover [\#2563](https://github.com/nextcloud/nextcloud-vue/pull/2563) ([marcoambrosini](https://github.com/marcoambrosini))
- Add aria-description to AppNavigationItem [\#2548](https://github.com/nextcloud/nextcloud-vue/pull/2548) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))

### Fixed bugs

- Fix secondary button with old style as temporary solution [\#2562](https://github.com/nextcloud/nextcloud-vue/pull/2562) ([nickvergessen](https://github.com/nickvergessen))
- Pass in a boolean instead of a string in the 'wide' prop [\#2556](https://github.com/nextcloud/nextcloud-vue/pull/2556) ([marcoambrosini](https://github.com/marcoambrosini))


## [v5.1.1](https://github.com/nextcloud/nextcloud-vue/tree/v5.1.1) (2022-03-16)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v5.1.0...v5.1.1)

### Fixed bugs

- Fix error spam of icon only buttons part2 [\#2547](https://github.com/nextcloud/nextcloud-vue/pull/2547) ([nickvergessen](https://github.com/nickvergessen))
- Fix error spam from buttons [\#2540](https://github.com/nextcloud/nextcloud-vue/pull/2540) ([nickvergessen](https://github.com/nickvergessen))
- 🐛 \(\#2529\): fix missing firstAction [\#2532](https://github.com/nextcloud/nextcloud-vue/pull/2532) ([vinicius73](https://github.com/vinicius73))

## [v5.1.0](https://github.com/nextcloud/nextcloud-vue/tree/v5.1.0) (2022-02-28)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v4.4.0...v5.1.0)

### Enhancements

- Add button native type prop on \<Button\> [\#2516](https://github.com/nextcloud/nextcloud-vue/pull/2516) ([tcitworld](https://github.com/tcitworld))
- increase the small modal width [\#2496](https://github.com/nextcloud/nextcloud-vue/pull/2496) ([szaimen](https://github.com/szaimen))
- Allow Breadcrumbs "to" prop to be an object [\#2491](https://github.com/nextcloud/nextcloud-vue/pull/2491) ([tcitworld](https://github.com/tcitworld))

### Fixed bugs

- Change appearance of the slot "icon" at AppNavigationItem [\#2506](https://github.com/nextcloud/nextcloud-vue/pull/2506) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Fix shrinking of last breadcrumb for narrow width [\#2492](https://github.com/nextcloud/nextcloud-vue/pull/2492) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- fix: imports from emoji-mart-vue-fast [\#2521](https://github.com/nextcloud/nextcloud-vue/pull/2521) ([max-nextcloud](https://github.com/max-nextcloud))

## [v5.0.0](https://github.com/nextcloud/nextcloud-vue/tree/v5.0.0) (2022-02-10)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v4.3.0...v5.0.0)

### Enhancements

- Implement showing global crumb actions [\#2444](https://github.com/nextcloud/nextcloud-vue/pull/2444) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add option to always show actions [\#2419](https://github.com/nextcloud/nextcloud-vue/pull/2419) ([marcoambrosini](https://github.com/marcoambrosini))
- Move crumb Actions into hover background area [\#2416](https://github.com/nextcloud/nextcloud-vue/pull/2416) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Allow custom action menu icon for breadcrumb [\#2414](https://github.com/nextcloud/nextcloud-vue/pull/2414) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use MD icon for hidden crumbs action button icons [\#2413](https://github.com/nextcloud/nextcloud-vue/pull/2413) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Adjust breadcrumb appearance [\#2411](https://github.com/nextcloud/nextcloud-vue/pull/2411) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Automatically use Nextcloud translated months, days and years [\#2397](https://github.com/nextcloud/nextcloud-vue/pull/2397) ([skjnldsv](https://github.com/skjnldsv))

### Fixed bugs

- AppNavigationItem.vue: updating of this.$slots [\#2483](https://github.com/nextcloud/nextcloud-vue/pull/2483) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Fix md icon position for Actions with title [\#2435](https://github.com/nextcloud/nextcloud-vue/pull/2435) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix dragging onto hidden crumbs [\#2412](https://github.com/nextcloud/nextcloud-vue/pull/2412) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Limit avatar request sizes to 64 and 512 pixel [\#2486](https://github.com/nextcloud/nextcloud-vue/pull/2486) ([nickvergessen](https://github.com/nickvergessen))
- Add aria label to the ActionInput component [\#2472](https://github.com/nextcloud/nextcloud-vue/pull/2472) ([JuliaKirschenheuter](https://github.com/JuliaKirschenheuter))
- Add variable for crumb class name [\#2450](https://github.com/nextcloud/nextcloud-vue/pull/2450) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Show menu title for single Action [\#2436](https://github.com/nextcloud/nextcloud-vue/pull/2436) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Set sidebar tab content height to be 100 percent [\#2431](https://github.com/nextcloud/nextcloud-vue/pull/2431) ([kiranparajuli589](https://github.com/kiranparajuli589))
- Free closeOnSelect [\#2391](https://github.com/nextcloud/nextcloud-vue/pull/2391) ([jotoeri](https://github.com/jotoeri))
## [v4.3.0](https://github.com/nextcloud/nextcloud-vue/tree/v4.3.0) (2021-12-01)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v4.2.0...v4.3.0)

### Fixed bugs

- Change background style target for tab icons [\#2374](https://github.com/nextcloud/nextcloud-vue/pull/2374) ([artonge](https://github.com/artonge))

### Closed pull requests

- Reduce size of status icons in Avatar component [\#2323](https://github.com/nextcloud/nextcloud-vue/pull/2323) ([CarlSchwan](https://github.com/CarlSchwan))
- Free closeOnSelect [\#2391](https://github.com/nextcloud/nextcloud-vue/pull/2391) ([jotoeri](https://github.com/jotoeri)))

## [v4.2.0](https://github.com/nextcloud/nextcloud-vue/tree/v4.1.1) (2021-09-28)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v4.1.1...v4.2.0)

### Enhancements

- Use material design icon for AppSidebar star [\#2265](https://github.com/nextcloud/nextcloud-vue/pull/2265) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Bump vue-material-design-icons from 4.12.1 to 4.13.0 [\#2269](https://github.com/nextcloud/nextcloud-vue/pull/2269)
- Allow material design icons for appnavigationitem [\#2276](https://github.com/nextcloud/nextcloud-vue/pull/2276) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Unify linkify usage, move to linkify-string [\#2281](https://github.com/nextcloud/nextcloud-vue/pull/2281) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Unify linkify usage, move to linkify-string [\#2281](https://github.com/nextcloud/nextcloud-vue/pull/2281) ([raimund-schluessler](https://github.com/raimund-schluessler))### Fixed bugs
- Add outlined counter [\#2287](https://github.com/nextcloud/nextcloud-vue/pull/2268) ([marcoambrosini](https://github.com/marcoambrosini))

### Fixed bugs

- Set material design icon size to 20 [\#2268](https://github.com/nextcloud/nextcloud-vue/pull/2268) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix missing icon [\#2297](https://github.com/nextcloud/nextcloud-vue/pull/2297#event-5378397330) ([Pytal](https://github.com/Pytal))

## [v4.1.1](https://github.com/nextcloud/nextcloud-vue/tree/v4.1.1) (2021-09-16)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v4.1.0...v4.1.1)

### Enhancements

- Use material design icon for appsidebar close [\#2212](https://github.com/nextcloud/nextcloud-vue/pull/2212) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Use material design icon for settings icon [\#2213](https://github.com/nextcloud/nextcloud-vue/pull/2213) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Bump @nextcloud/calendar-js from 1.1.1 to 2.0.0 [\#2204](https://github.com/nextcloud/nextcloud-vue/pull/2204)

### Fixed bugs

- Do not duplicate character in Highlight directive, only highlight first match occurence [\#2226](https://github.com/nextcloud/nextcloud-vue/pull/2226) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Disable actions when the only action is disabeld [\#2227](https://github.com/nextcloud/nextcloud-vue/pull/2227) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Make timestamp of unread msg not bold [\#2228](https://github.com/nextcloud/nextcloud-vue/pull/2228) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix empty user bubble [\#2241](https://github.com/nextcloud/nextcloud-vue/pull/2241) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Stop filtering Actions in $slots [\#2254](https://github.com/nextcloud/nextcloud-vue/pull/2254) ([skjnldsv](https://github.com/skjnldsv))
- Don't rely on Vue.prototype.t and properly extract all strings [\#2231](https://github.com/nextcloud/nextcloud-vue/pull/2231) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v4.1.0](https://github.com/nextcloud/nextcloud-vue/tree/v4.1.0) (2021-08-23)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v4.0.3...v4.1.0)

### Enhancements

- Set default slideshowdelay to 5000 ms [\#2122](https://github.com/nextcloud/nextcloud-vue/pull/2122) ([szaimen](https://github.com/szaimen))
- Optionally make the DatetimePicker timezone-aware [\#2100](https://github.com/nextcloud/nextcloud-vue/pull/2100) ([ChristophWurst](https://github.com/ChristophWurst))
- Fix videoplayer controls in viewer [\#2099](https://github.com/nextcloud/nextcloud-vue/pull/2099) ([szaimen](https://github.com/szaimen))
- Add timezone picker [\#2095](https://github.com/nextcloud/nextcloud-vue/pull/2095) ([ChristophWurst](https://github.com/ChristophWurst))

### Fixed bugs

- Check that userId is defined before querying [\#2159](https://github.com/nextcloud/nextcloud-vue/pull/2159) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Use new named slot syntax [\#2160](https://github.com/nextcloud/nextcloud-vue/pull/2160) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Add a hint about the tooltip directive [\#2151](https://github.com/nextcloud/nextcloud-vue/pull/2151) ([nickvergessen](https://github.com/nickvergessen))
- Fix typo on registering the directive [\#2150](https://github.com/nextcloud/nextcloud-vue/pull/2150) ([nickvergessen](https://github.com/nickvergessen))
- Simplify release process [\#2085](https://github.com/nextcloud/nextcloud-vue/pull/2085) ([skjnldsv](https://github.com/skjnldsv))

## [v4.0.3](https://github.com/nextcloud/nextcloud-vue/tree/v4.0.3) (2021-07-05)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v4.0.2...v4.0.3)

### Enhancements

- Fix ActionCaption layout [\#2043](https://github.com/nextcloud/nextcloud-vue/pull/2043) ([marcoambrosini](https://github.com/marcoambrosini))

### Fixed bugs

- Add type=button attribute to buttons [\#2069](https://github.com/nextcloud/nextcloud-vue/pull/2069) ([Pytal](https://github.com/Pytal))
- Fix AppContent mobile display [\#2048](https://github.com/nextcloud/nextcloud-vue/pull/2048) ([skjnldsv](https://github.com/skjnldsv))

### Closed pull requests

- v4.0.2 [\#2041](https://github.com/nextcloud/nextcloud-vue/pull/2041) ([marcoambrosini](https://github.com/marcoambrosini))

## [v4.0.2](https://github.com/nextcloud/nextcloud-vue/tree/v4.0.2) (2021-06-16)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v4.0.1...v4.0.2)

### Fixed bugs

- Safely check the global appName and handle its inexistence [\#2028](https://github.com/nextcloud/nextcloud-vue/pull/2028) ([ChristophWurst](https://github.com/ChristophWurst))
- Fix settings navigation  layout [\#2033](https://github.com/nextcloud/nextcloud-vue/pull/2033) ([marcoambrosini](https://github.com/marcoambrosini))

## [v4.0.1](https://github.com/nextcloud/nextcloud-vue/tree/v4.0.1) (2021-06-14)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v4.0.0...v4.0.1)

### Fixed bugs

- Do not use app-content-wrapper if no list is provided [\#2026](nextcloud/nextcloud-vue/pull/2026) ([skjnldsv](@skjnldsv))

### Closed pull requests

- Fix settings navigation  layout [\#2033](nextcloud/nextcloud-vue/pull/2033) ([marcoambrosini](@marcoambrosini))
- Set AppNavigation examples' width to 300px [\#2030](nextcloud/nextcloud-vue/pull/2030) ([korelstar](@korelstar))

## [v4.0.0](https://github.com/nextcloud/nextcloud-vue/tree/v4.0.0) (2021-06-04)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.10.1...v4.0.0)

### Breaking

- Remove deprecated legacy avatar user status [\#1945](https://github.com/nextcloud/nextcloud-vue/pull/1945) ([skjnldsv](https://github.com/skjnldsv))
- Fix vue material icons [\#1816](https://github.com/nextcloud/nextcloud-vue/pull/1816) ([skjnldsv](https://github.com/skjnldsv))
- Resizable columns [\#1759](https://github.com/nextcloud/nextcloud-vue/pull/1759) ([brueckner](https://github.com/brueckner))
- Bump @nextcloud/browserslist-config from 1.0.0 to 2.1.0 [\#1786](https://github.com/nextcloud/nextcloud-vue/pull/1786) ([dependabot](https://github.com/dependabot))

### Enhancements

- Add CheckboxRadio component [\#1875](https://github.com/nextcloud/nextcloud-vue/pull/1875) ([skjnldsv](https://github.com/skjnldsv))
- Add disabled state to RichContenteditable and clean not-working v-model [\#1894](https://github.com/nextcloud/nextcloud-vue/pull/1894) ([skjnldsv](https://github.com/skjnldsv))
- Add loading state to CheckboxRadio [\#1889](https://github.com/nextcloud/nextcloud-vue/pull/1889) ([skjnldsv](https://github.com/skjnldsv))
- Add proper opening/opened/closing/closed events & fix events docs [\#1914](https://github.com/nextcloud/nextcloud-vue/pull/1914) ([skjnldsv](https://github.com/skjnldsv))
- Add slot for third line in listitem component [\#1888](https://github.com/nextcloud/nextcloud-vue/pull/1888) ([ma12-co](https://github.com/ma12-co))
- Allow material design icon in breadcrumb [\#1938](https://github.com/nextcloud/nextcloud-vue/pull/1938) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Allow material design icons in AppSidebarTab [\#1939](https://github.com/nextcloud/nextcloud-vue/pull/1939) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Create ActionCaption component [\#1739](https://github.com/nextcloud/nextcloud-vue/pull/1739) ([ma12-co](https://github.com/ma12-co))
- Create ListItem component [\#616](https://github.com/nextcloud/nextcloud-vue/pull/616) ([ma12-co](https://github.com/ma12-co))
- Create ListItem component [\#616](https://github.com/nextcloud/nextcloud-vue/pull/616) ([ma12-co](https://github.com/ma12-co))
- Fix alignment of md icons in single action [\#1886](https://github.com/nextcloud/nextcloud-vue/pull/1886) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Implement switch mode to CheckboxRadioSwitch [\#1890](https://github.com/nextcloud/nextcloud-vue/pull/1890) ([skjnldsv](https://github.com/skjnldsv))
- Improve documentation sections [\#1883](https://github.com/nextcloud/nextcloud-vue/pull/1883) ([skjnldsv](https://github.com/skjnldsv))
- Make avatar menu focusable with keyboard [\#1854](https://github.com/nextcloud/nextcloud-vue/pull/1854) ([PVince81](https://github.com/PVince81))
- Replace AppNavigationCounter with CounterBubble [\#1895](https://github.com/nextcloud/nextcloud-vue/pull/1895) ([PVince81](https://github.com/PVince81))
- Update appnavigationcaption [\#1863](https://github.com/nextcloud/nextcloud-vue/pull/1863) ([ma12-co](https://github.com/ma12-co))
- Wrap icon span in icon slot for ActionButton [\#1930](https://github.com/nextcloud/nextcloud-vue/pull/1930) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Fixed bugs

- Add id prop to ListItemIcon to prevent v-binding to the Avatar [\#1833](https://github.com/nextcloud/nextcloud-vue/pull/1833) ([skjnldsv](https://github.com/skjnldsv))
- Allow to append datepicker to body [\#1880](https://github.com/nextcloud/nextcloud-vue/pull/1880) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Check slots on updated hook [\#2015](https://github.com/nextcloud/nextcloud-vue/pull/2015) ([ma12-co](https://github.com/ma12-co))
- Correctly align md icon in ActionRouter component [\#1927](https://github.com/nextcloud/nextcloud-vue/pull/1927) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix Actions css [\#1834](https://github.com/nextcloud/nextcloud-vue/pull/1834) ([jotoeri](https://github.com/jotoeri))
- Fix appnavigationitem layout [\#1897](https://github.com/nextcloud/nextcloud-vue/pull/1897) ([ma12-co](https://github.com/ma12-co))
- Fix counter margin [\#1912](https://github.com/nextcloud/nextcloud-vue/pull/1912) ([ma12-co](https://github.com/ma12-co))
- Fix datepicker overflow when week numbers are shown [\#1917](https://github.com/nextcloud/nextcloud-vue/pull/1917) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix first and last action input padding [\#1967](https://github.com/nextcloud/nextcloud-vue/pull/1967) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix first-action icon class not showing when Actions icon-slot is def… [\#1879](https://github.com/nextcloud/nextcloud-vue/pull/1879) ([nickvergessen](https://github.com/nickvergessen))
- Fix flex order of AppNavigationCaption [\#2024](https://github.com/nextcloud/nextcloud-vue/pull/2024) ([skjnldsv](https://github.com/skjnldsv))
- Fix ListItemIcon listeners [\#1870](https://github.com/nextcloud/nextcloud-vue/pull/1870) ([skjnldsv](https://github.com/skjnldsv))
- Fix md icon size in ActionInput [\#1966](https://github.com/nextcloud/nextcloud-vue/pull/1966) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix user bubble when username contains a space [\#1948](https://github.com/nextcloud/nextcloud-vue/pull/1948) ([artonge](https://github.com/artonge))
- Prevent overflow of action-link in Firefox [\#1934](https://github.com/nextcloud/nextcloud-vue/pull/1934) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove AppNavigationItem flex order for AppNavigationCaption [\#1911](https://github.com/nextcloud/nextcloud-vue/pull/1911) ([skjnldsv](https://github.com/skjnldsv))
- Use ActionButton for AppNavigationToggle [\#1844](https://github.com/nextcloud/nextcloud-vue/pull/1844) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v3.9.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.9.0) (2021-04-07)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.8.0...v3.9.0)

### Enhancements

- Add icon slot to emptycontent [\#1806](https://github.com/nextcloud/nextcloud-vue/pull/1806) ([skjnldsv](https://github.com/skjnldsv))

### Fixed bugs

- Make sure to pass all props and attributes to single-action Actions [\#1809](https://github.com/nextcloud/nextcloud-vue/pull/1809) ([skjnldsv](https://github.com/skjnldsv))
- Ensure that crumbs to hide have correct class [\#1807](https://github.com/nextcloud/nextcloud-vue/pull/1807) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix compact sidebar subtitle not visible [\#1767](https://github.com/nextcloud/nextcloud-vue/pull/1767) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Closed pull requests

- Fix translation extraction [\#1776](https://github.com/nextcloud/nextcloud-vue/pull/1776) ([jotoeri](https://github.com/jotoeri))
- Minimize bundled translations [\#1775](https://github.com/nextcloud/nextcloud-vue/pull/1775) ([jotoeri](https://github.com/jotoeri))

## [v3.8.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.8.0) (2021-03-26)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.7.2...v3.8.0)

### Added

- Actions now forward the focus and blur events on trigger - [\#1757](https://github.com/nextcloud/nextcloud-vue/pull/1757) ([Vincent Petry](vincent@nextcloud.com))

### Changed

- Updated translations - [\#1755](https://github.com/nextcloud/nextcloud-vue/issues/1755) [\#1758](https://github.com/nextcloud/nextcloud-vue/pull/1758) [\#1782](https://github.com/nextcloud/nextcloud-vue/pull/1782) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))
- Bump @babel/core from 7.13.8 to 7.13.10 - [\#1748](https://github.com/nextcloud/nextcloud-vue/pull/1748) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/preset-env from 7.13.9 to 7.13.12 - [\#1747](https://github.com/nextcloud/nextcloud-vue/pull/1747) [\#1778](https://github.com/nextcloud/nextcloud-vue/pull/1778) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump css-loader from 5.1.1 to 5.2.0 - [\#1764](https://github.com/nextcloud/nextcloud-vue/pull/1764) [\#1785](https://github.com/nextcloud/nextcloud-vue/pull/1785) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump cypress from 6.6.0 to 6.8.0 - [\#1765](https://github.com/nextcloud/nextcloud-vue/pull/1765) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump elliptic from 6.5.3 to 6.5.4 - [\#1747](https://github.com/nextcloud/nextcloud-vue/pull/1746) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump string-length from 4.0.1 to 4.0.2 - [\#1766](https://github.com/nextcloud/nextcloud-vue/pull/1766) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump v-tooltip from 2.1.2 to 2.1.3 - [\#1773](https://github.com/nextcloud/nextcloud-vue/pull/1773) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-styleguidist from 4.35.0 to 4.36.1 - [\#1772](https://github.com/nextcloud/nextcloud-vue/pull/1772) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

### Fixed

- Fix actions dropdown focus timing - [\#1761](https://github.com/nextcloud/nextcloud-vue/pull/1761) ([Vincent Petry](vincent@nextcloud.com))
- Update AppNavigationCounter styles - [\#1769](https://github.com/nextcloud/nextcloud-vue/pull/1769) ([ma12-co](https://github.com/ma12-co))
- Fix settings css - [\#1770](https://github.com/nextcloud/nextcloud-vue/pull/1770) ([jotoeri](https://github.com/jotoeri))
- Allow last crumb to shrink if all crumbs collapsed - [\#1771](https://github.com/nextcloud/nextcloud-vue/pull/1771) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix multiselect listitemicon docs - [\#1787](https://github.com/nextcloud/nextcloud-vue/pull/1787) ([skjnldsv](https://github.com/skjnldsv))

## [v3.7.2](https://github.com/nextcloud/nextcloud-vue/tree/v3.7.2) (2021-03-10)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.7.1...v3.7.2)

### Fixed

- Render the first action icon slot if single action - [\#1753](https://github.com/nextcloud/nextcloud-vue/pull/1753) ([skjnldsv](https://github.com/skjnldsv))
- Fix formattedOptions var in multiselect docs - [\#1744](https://github.com/nextcloud/nextcloud-vue/pull/1744) ([skjnldsv](https://github.com/skjnldsv))

## [v3.7.1](https://github.com/nextcloud/nextcloud-vue/tree/v3.7.1) (2021-03-10)

### Added
- Fix ActionButton icon slot - [\#1741](https://github.com/nextcloud/nextcloud-vue/pull/1741) ([ma12-co](https://github.com/ma12-co))
- Improve multiselect tag [\#1718](https://github.com/nextcloud/nextcloud-vue/pull/1718) ([GretaD](https://github.com/GretaD))

### Changed
- Bump debounce from 1.2.0 to 1.2.1 - [\#1754](https://github.com/nextcloud/nextcloud-vue/pull/1754) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump stylelint from 13.11.0 to 13.12.0 - [\#1743](https://github.com/nextcloud/nextcloud-vue/pull/1743) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.7.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.7.0) (2021-03-03)

### Added

- Allow to inject preloaded user statuses - [\#1433](https://github.com/nextcloud/nextcloud-vue/pull/1433) ([nickvergessen](https://github.com/nickvergessen))
- Add a container property to popup components - [\#1734](https://github.com/nextcloud/nextcloud-vue/issues/1734) ([Vincent Petry](vincent@nextcloud.com))

### Changed

- Bump vue-eslint-parser from 7.5.0 to 7.6.0 - [\#1737](https://github.com/nextcloud/nextcloud-vue/issues/1737) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump pug from 3.0.0 to 3.0.2 - [\#1736](https://github.com/nextcloud/nextcloud-vue/issues/1736) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump pug-code-gen from 3.0.1 to 3.0.2 - [\#1735](https://github.com/nextcloud/nextcloud-vue/issues/1735) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump css-loader from 5.0.2 to 5.1.1 - [\#1731](https://github.com/nextcloud/nextcloud-vue/issues/1731) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump cypress from 6.5.0 to 6.6.0 - [\#1730](https://github.com/nextcloud/nextcloud-vue/issues/1730) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/preset-env from 7.13.8 to 7.13.9 - [\#1732](https://github.com/nextcloud/nextcloud-vue/issues/1732) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump core-js from 3.9.0 to 3.9.1 - [\#1729](https://github.com/nextcloud/nextcloud-vue/issues/1729) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/preset-env from 7.13.5 to 7.13.8 - [\#1728](https://github.com/nextcloud/nextcloud-vue/issues/1728) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/core from 7.13.1 to 7.13.8 - [\#1727](https://github.com/nextcloud/nextcloud-vue/issues/1727) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.6.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.6.0) (2021-02-25)

### Added

- Add disabled state to actions - [\#1724](https://github.com/nextcloud/nextcloud-vue/pull/1724) ([ma12-co](https://github.com/ma12-co))
- Add support for material design icons - [\#1714](https://github.com/nextcloud/nextcloud-vue/pull/1714) ([ma12-co](https://github.com/ma12-co))

### Changed

- Bump @babel/core from 7.12.17 to 7.13.1 - [\#1721](https://github.com/nextcloud/nextcloud-vue/issues/1721) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/preset-env from 7.12.17 to 7.13.5 - [\#1725](https://github.com/nextcloud/nextcloud-vue/issues/1725) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump babel-loader-exclude-node-modules-except from 1.0.3 to 1.1.2 - [\#1702](https://github.com/nextcloud/nextcloud-vue/issues/1702) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump core-js from 3.8.3 to 3.9.0 - [\#1717](https://github.com/nextcloud/nextcloud-vue/issues/1717) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump cypress from 5.6.0 to 6.5.0 - [\#1712](https://github.com/nextcloud/nextcloud-vue/issues/1712) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump eslint-plugin-promise from 4.2.1 to 4.3.1 - [\#1704](https://github.com/nextcloud/nextcloud-vue/issues/1704) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump stylelint from 13.9.0 to 13.11.0 - [\#1719](https://github.com/nextcloud/nextcloud-vue/issues/1719) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue2-datepicker from 3.8.2 to 3.9.0 - [\#1699](https://github.com/nextcloud/nextcloud-vue/issues/1699) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-eslint-parser from 7.4.1 to 7.5.0 - [\#1711](https://github.com/nextcloud/nextcloud-vue/issues/1711) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

### Fixed

- Use data of parent component in InputConfirmCanel subcomponent - [\#1697](https://github.com/nextcloud/nextcloud-vue/issues/1697) ([christianlupus](github@christianwolf.email))

## [v3.5.5](https://github.com/nextcloud/nextcloud-vue/tree/v3.5.5) (2021-02-24)

### Added

- Improve settings dialog layout [\#1708](https://github.com/nextcloud/nextcloud-vue/pull/1708) ([ma12-co](https://github.com/ma12-co))
- Make settings navigation list scrollable [\#1684](https://github.com/nextcloud/nextcloud-vue/pull/1684) ([ma12-co](https://github.com/ma12-co))

### Fixed

- Make sure we can check the classList on the node [\#1723](https://github.com/nextcloud/nextcloud-vue/pull/1723) ([skjnldsv](https://github.com/skjnldsv))
- Fix settings navigation layout [\#1713](https://github.com/nextcloud/nextcloud-vue/pull/1713) ([ma12-co](https://github.com/ma12-co))
- Update action hover feedback [\#1692](https://github.com/nextcloud/nextcloud-vue/pull/1692) ([ma12-co](https://github.com/ma12-co))

## [v3.5.4](https://github.com/nextcloud/nextcloud-vue/tree/v3.5.4) (2021-01-27)

### Fixed

- Revert workaround for popper glitch, fix regression - [\#1685](https://github.com/nextcloud/nextcloud-vue/issues/1685) ([Vincent Petry](vincent@nextcloud.com))

### Added

- Translate '/l10n/messages.pot' in 'zh_HK' - [\#1682](https://github.com/nextcloud/nextcloud-vue/issues/1682) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))

### Changed

- Bump cypress-visual-regression from 1.5.5 to 1.5.6 - [\#1620](https://github.com/nextcloud/nextcloud-vue/issues/1620) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-cli from 4.3.1 to 4.4.0 - [\#1672](https://github.com/nextcloud/nextcloud-vue/issues/1672) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump stylelint from 13.8.0 to 13.9.0 - [\#1673](https://github.com/nextcloud/nextcloud-vue/issues/1673) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-eslint-parser from 7.3.0 to 7.4.1 - [\#1676](https://github.com/nextcloud/nextcloud-vue/issues/1676) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-styleguidist from 4.34.2 to 4.35.0 - [\#1686](https://github.com/nextcloud/nextcloud-vue/issues/1686) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.5.3](https://github.com/nextcloud/nextcloud-vue/tree/v3.5.3) (2021-01-25)

### Fixed

- Replace linkify-urls with linkifyjs to fix Safari incompatibility issues - [\#1678](https://github.com/nextcloud/nextcloud-vue/issues/1678) ([Vincent Petry](vincent@nextcloud.com))

## [v3.5.2](https://github.com/nextcloud/nextcloud-vue/tree/v3.5.2) (2021-01-22)

### Fixed

- Increase max width of action button - [\#1677](https://github.com/nextcloud/nextcloud-vue/issues/1677) ([Vincent Petry](vincent@nextcloud.com))

## [v3.5.1](https://github.com/nextcloud/nextcloud-vue/tree/v3.5.1) (2021-01-20)

### Fixed

- Fix longtext appearance for avatar popover menu - [\#1675](https://github.com/nextcloud/nextcloud-vue/issues/1675) ([Vincent Petry](vincent@nextcloud.com))
- Make the popover menu more easily addressable - [\#1674](https://github.com/nextcloud/nextcloud-vue/issues/1674) ([Vincent Petry](vincent@nextcloud.com))

## [v3.5.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.5.0) (2021-01-20)

### Changed

- Avatar component now uses the popover component - [\#831](https://github.com/nextcloud/nextcloud-vue/issues/831) ([ma12-co](https://github.com/ma12-co)) ([Vincent Petry](vincent@nextcloud.com))
- Bump core-js from 3.8.2 to 3.8.3 - [\#1671](https://github.com/nextcloud/nextcloud-vue/issues/1671) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.4.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.4.0) (2021-01-18)

### Added

- Add multiselect type to ActionInput - [\#1250](https://github.com/nextcloud/nextcloud-vue/issues/1250) ([korelstar](korelstar@users.noreply.github.com>))
- Add link support to richcontenteditor and fix various issues - [\#1669](https://github.com/nextcloud/nextcloud-vue/issues/1669) ([John Molakvoæ](skjnldsv@users.noreply.github.com))
- Allow ActionInput type=email - [\#1667](https://github.com/nextcloud/nextcloud-vue/issues/1667) ([tcitworld](tcit@tcit.fr))
- Allow ActionInput type=color - [\#1662](https://github.com/nextcloud/nextcloud-vue/issues/1662) ([ChristophWurst](https://github.com/ChristophWurst))

### Changed

- Bump axios from 0.21.0 to 0.21.1 - [\#1655](https://github.com/nextcloud/nextcloud-vue/issues/1655) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump core-js from 3.8.1 to 3.8.2 - [\#1654](https://github.com/nextcloud/nextcloud-vue/issues/1654) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump fontsource-roboto from 3.1.5 to 4.0.0 - [\#1648](https://github.com/nextcloud/nextcloud-vue/issues/1648) ([Julius Härtl](jus@bitgrid.net))
- Bump @nextcloud/axios from 1.5.0 to 1.6.0 - [\#1657](https://github.com/nextcloud/nextcloud-vue/issues/1657) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump sass-loader from 10.1.0 to 10.1.1 - [\#1663](https://github.com/nextcloud/nextcloud-vue/issues/1663) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump v-tooltip from 2.0.3 to 2.1.0 - [\#1651](https://github.com/nextcloud/nextcloud-vue/issues/1651) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump v-tooltip from 2.1.0 to 2.1.1 - [\#1653](https://github.com/nextcloud/nextcloud-vue/issues/1653) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump v-tooltip from 2.1.1 to 2.1.2 - [\#1656](https://github.com/nextcloud/nextcloud-vue/issues/1656) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-color from 2.8.0 to 2.8.1 - [\#1649](https://github.com/nextcloud/nextcloud-vue/issues/1649) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-loader from 15.9.5 to 15.9.6 - [\#1642](https://github.com/nextcloud/nextcloud-vue/issues/1642) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-cli from 4.2.0 to 4.3.0 - [\#1650](https://github.com/nextcloud/nextcloud-vue/issues/1650) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-cli from 4.3.0 to 4.3.1 - [\#1652](https://github.com/nextcloud/nextcloud-vue/issues/1652) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack from 4.44.2 to 4.45.0 - [\#1661](https://github.com/nextcloud/nextcloud-vue/issues/1661) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack from 4.45.0 to 4.46.0 - [\#1664](https://github.com/nextcloud/nextcloud-vue/issues/1664) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-merge from 5.7.0 to 5.7.2 - [\#1641](https://github.com/nextcloud/nextcloud-vue/issues/1641) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-merge from 5.7.2 to 5.7.3 - [\#1646](https://github.com/nextcloud/nextcloud-vue/issues/1646) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Translate '/l10n/messages.pot' in 'zh_TW' - [\#1659](https://github.com/nextcloud/nextcloud-vue/issues/1659) ([Julius Härtl](jus@bitgrid.net))
- Translate '/l10n/messages.pot' in 'sv' - [\#1658](https://github.com/nextcloud/nextcloud-vue/issues/1658) ([Julius Härtl](jus@bitgrid.net))
- Translate '/l10n/messages.pot' in 'eo' - [\#1644](https://github.com/nextcloud/nextcloud-vue/issues/1644) ([Julius Härtl](jus@bitgrid.net))
- Translate '/l10n/messages.pot' in 'de' - [\#1643](https://github.com/nextcloud/nextcloud-vue/issues/1643) ([Julius Härtl](jus@bitgrid.net))

### Fixed

- Don't close modal on mouseup - [\#1647](https://github.com/nextcloud/nextcloud-vue/issues/1647) ([ma12-co](https://github.com/ma12-co))

## [v3.3.2](https://github.com/nextcloud/nextcloud-vue/tree/v3.3.2) (2020-12-16)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.3.1...v3.3.2)

### Changed

- Translate '/l10n/messages.pot' in 'nl' - [\#1621](https://github.com/nextcloud/nextcloud-vue/issues/1621) ([Julius Härtl](jus@bitgrid.net))
- Translate '/l10n/messages.pot' in 'es' - [\#1630](https://github.com/nextcloud/nextcloud-vue/issues/1630) ([Julius Härtl](jus@bitgrid.net))

### Fixed

- Fix avatar menu click handler - [\#1639](https://github.com/nextcloud/nextcloud-vue/issues/1639) ([PVince81](vincent@nextcloud.com))
- Fix export of AppNavigationNewItem - [\#1638](https://github.com/nextcloud/nextcloud-vue/issues/1638) ([John Molakvoæ](skjnldsv@users.noreply.github.com))

### Version bumps

- Bump @babel/core from 7.12.9 to 7.12.10 - [\#1626](https://github.com/nextcloud/nextcloud-vue/issues/1626) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @babel/preset-env from 7.12.7 to 7.12.11 - [\#1627](https://github.com/nextcloud/nextcloud-vue/issues/1627) [\#1640](https://github.com/nextcloud/nextcloud-vue/issues/1640) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump core-js from 3.8.0 to 3.8.1 - [\#1623](https://github.com/nextcloud/nextcloud-vue/issues/1623) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump fontsource-roboto from 3.0.3 to 3.1.5 - [\#1628](https://github.com/nextcloud/nextcloud-vue/issues/1628) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump ini from 1.3.5 to 1.3.7 - [\#1631](https://github.com/nextcloud/nextcloud-vue/issues/1631) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue2-datepicker from 3.8.1 to 3.8.2 - [\#1624](https://github.com/nextcloud/nextcloud-vue/issues/1624) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-color from 2.7.1 to 2.8.0 - [\#1635](https://github.com/nextcloud/nextcloud-vue/issues/1635) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump vue-eslint-parser from 7.2.0 to 7.3.0 - [\#1619](https://github.com/nextcloud/nextcloud-vue/issues/1619) [\#1636](https://github.com/nextcloud/nextcloud-vue/issues/1636) ([Julius Härtl](jus@bitgrid.net))
- Bump vue-styleguidist from 4.34.1 to 4.34.2 - [\#1622](https://github.com/nextcloud/nextcloud-vue/issues/1622) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump @vue/test-utils from 1.1.1 to 1.1.2 - [\#1637](https://github.com/nextcloud/nextcloud-vue/issues/1637) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-merge from 5.4.0 to 5.7.0 - [\#1625](https://github.com/nextcloud/nextcloud-vue/issues/1625) [\#1632](https://github.com/nextcloud/nextcloud-vue/issues/1632) [\#1634](https://github.com/nextcloud/nextcloud-vue/issues/1634) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.3.1](https://github.com/nextcloud/nextcloud-vue/tree/v3.3.1) (2020-12-02)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.3.0...v3.3.1)

### Fixed

- Quickfix for action button and material design icon - [\#1614](https://github.com/nextcloud/nextcloud-vue/issues/1614) ([Vincent Petry](vincent@nextcloud.com))

### Changed

- Translate '/l10n/messages.pot' in 'fr' - [\#1606](https://github.com/nextcloud/nextcloud-vue/issues/1606)

### Version bumps

- Bump vue-styleguidist from 4.34.0 to 4.34.1 - [\#1615](https://github.com/nextcloud/nextcloud-vue/issues/1615) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump babel-loader from 8.2.1 to 8.2.2 - [\#1612](https://github.com/nextcloud/nextcloud-vue/issues/1612) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))

## [v3.3.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.3.0) (2020-11-26)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.2.0...v3.3.0)

### Added

- Add ListItemIcon component - [\#1578](https://github.com/nextcloud/nextcloud-vue/issues/1578) ([PVince81](https://github.com/pvince81))
- Richcontenteditable: bind event listeners - [\#1592](https://github.com/nextcloud/nextcloud-vue/issues/1592) ([ma12-co](https://github.com/ma12-co))
- Add notes about styleguide command in README - [\#1596](https://github.com/nextcloud/nextcloud-vue/issues/1596) ([PVince81](https://github.com/pvince81))
- AppNavigationItem improved editing mode and AppNavigationNewItem component - [\#1277](https://github.com/nextcloud/nextcloud-vue/issues/1277) ([JonathanTreffler](https://github.com/JonathanTreffler))

### Fixed

- Remove sidebar actions slot max height - [\#1566](https://github.com/nextcloud/nextcloud-vue/issues/1566) ([ma12-co](https://github.com/ma12-co))
- Fix contenteditable state at first load - [\#1584](https://github.com/nextcloud/nextcloud-vue/issues/1584) ([ma12-co](https://github.com/ma12-co))
- Fix rich-contenteditor default value init and small code cleanup - [\#1570](https://github.com/nextcloud/nextcloud-vue/issues/1570) ([skjnldsv](https://github.com/skjnldsv))
- Fix action button text for long translations - [\#1576](https://github.com/nextcloud/nextcloud-vue/issues/1576) ([GretaD](gretadoci@gmail.com))
- Fix default multiselect height - [\#1579](https://github.com/nextcloud/nextcloud-vue/issues/1579) ([skjnldsv](https://github.com/skjnldsv))
- Aria-expanded must be a false string, not absent - [\#1599](https://github.com/nextcloud/nextcloud-vue/issues/1599) ([PVince81](https://github.com/pvince81))
- Set navigation role and aria label on app navigation - [\#1585](https://github.com/nextcloud/nextcloud-vue/issues/1585) ([PVince81](https://github.com/pvince81))
- Remove semantics of h6 in user bubble - [\#1586](https://github.com/nextcloud/nextcloud-vue/issues/1586) ([PVince81](https://github.com/pvince81))
- Fix labelledby in tab section - [\#1583](https://github.com/nextcloud/nextcloud-vue/issues/1583) ([PVince81](https://github.com/pvince81))
- Do not check l10n comments - [\#1597](https://github.com/nextcloud/nextcloud-vue/issues/1597) ([skjnldsv](https://github.com/skjnldsv))
- Disable avatar menu click event when menu disabled - [\#1587](https://github.com/nextcloud/nextcloud-vue/issues/1587) ([PVince81](https://github.com/pvince81))
- Improve testability + small code changes of AppSideBarTabs - [\#1515](https://github.com/nextcloud/nextcloud-vue/issues/1515) ([LiquidITGuy](https://github.com/LiquidITGuy))
- Proxy avatar to fixed image in the documentation - [\#1580](https://github.com/nextcloud/nextcloud-vue/issues/1580) ([skjnldsv](https://github.com/skjnldsv))
- Fix sizing of modal container and app settings dialog - [\#1573](https://github.com/nextcloud/nextcloud-vue/issues/1573) ([PVince81](https://github.com/pvince81))

### Changed

- Translate '/l10n/messages.pot' in 'da' - [\#1575](https://github.com/nextcloud/nextcloud-vue/issues/1575) ([juliushaertl](https://github.com/juliushaertl))

### Version bumps

- Bump @babel/core from 7.12.3 to 7.12.9- [\#1594](https://github.com/nextcloud/nextcloud-vue/issues/1594) [\#1602](https://github.com/nextcloud/nextcloud-vue/issues/1602) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump babel-loader from 8.1.0 to 8.2.1 - [\#1565](https://github.com/nextcloud/nextcloud-vue/issues/1565) ([juliushaertl](https://github.com/juliushaertl))
- Bump @babel/preset-env from 7.12.1 to 7.12.7 - [\#1595](https://github.com/nextcloud/nextcloud-vue/issues/1595) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump core-js from 3.7.0 to 3.8.0 - [\#1608](https://github.com/nextcloud/nextcloud-vue/issues/1608) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump cypress from 5.5.0 to 5.6.0 - [\#1562](https://github.com/nextcloud/nextcloud-vue/issues/1562) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump cypress-visual-regression from 1.5.2 to 1.5.5 - [\#1588](https://github.com/nextcloud/nextcloud-vue/issues/1588) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump eslint-plugin-standard from 4.0.2 to 4.1.0 - [\#1564](https://github.com/nextcloud/nextcloud-vue/issues/1564) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump @nextcloud/dialogs from 3.0.0 to 3.1.1 - [\#1563](https://github.com/nextcloud/nextcloud-vue/issues/1563) [\#1571](https://github.com/nextcloud/nextcloud-vue/issues/1571) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump sass-loader from 10.0.5 to 10.1.0 - [\#1568](https://github.com/nextcloud/nextcloud-vue/issues/1568) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump stylelint from 13.7.2 to 13.8.0 - [\#1577](https://github.com/nextcloud/nextcloud-vue/issues/1577) ([violoncello.ch](22591354+violoncelloCH@users.noreply.github.com))
- Bump vue2-datepicker from 3.7.0 to 3.8.1 - [\#1589](https://github.com/nextcloud/nextcloud-vue/issues/1589) [\#1609](https://github.com/nextcloud/nextcloud-vue/issues/1609) ([PVince81](https://github.com/pvince81))
- Bump vue-styleguidist from 4.33.6 to 4.33.7 - [\#1572](https://github.com/nextcloud/nextcloud-vue/issues/1572) [\#1574](https://github.com/nextcloud/nextcloud-vue/issues/1574) [\#1593](https://github.com/nextcloud/nextcloud-vue/issues/1593) [\#1607](https://github.com/nextcloud/nextcloud-vue/issues/1607) ([dependabot[bot]](49699333+dependabot[bot]@users.noreply.github.com))
- Bump webpack-merge from 5.3.0 to 5.4.0 - [\#1569](https://github.com/nextcloud/nextcloud-vue/issues/1569) ([juliushaertl](https://github.com/juliushaertl))

## [v3.2.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.2.0) (2020-11-09)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.1.2...v3.2.0)

### Added
- Add default font and line size [\#1542](https://github.com/nextcloud/nextcloud-vue/pull/1542) ([GretaD](gretadoci@gmail.com))
- Add tooltips in app sidebar header [\#1555](https://github.com/nextcloud/nextcloud-vue/pull/1555) ([PVince81](https://github.com/PVince81))

### Fixed
- Fix RichEditor rendering of unknown mention, undefined checks and fix default value init [\#1504](https://github.com/nextcloud/nextcloud-vue/pull/1504)  ([skjnldsv](https://github.com/skjnldsv))
- Fix menu font for apps [\#1543](https://github.com/nextcloud/nextcloud-vue/pull/1543) ([GretaD](gretadoci@gmail.com))
- Reverted "Also set Modal height/width to allow children to define their height/width and not only max-height/width" [\#1558](https://github.com/nextcloud/nextcloud-vue/pull/1558) ([skjnldsv](https://github.com/skjnldsv))
- Fix action text margin for long texts [\#1525](https://github.com/nextcloud/nextcloud-vue/pull/1525) ([st3iny](https://github.com/st3iny))

### Version bumps
- Bump cypress config and split into two specs [\#1548](https://github.com/nextcloud/nextcloud-vue/pull/1548) ([skjnldsv](https://github.com/skjnldsv))
- Bump core-js from 3.6.5 to 3.7.0 [\#1557](https://github.com/nextcloud/nextcloud-vue/pull/1557)
- Bump vue-styleguidist from 4.33.5 to 4.33.6 [\#1553](https://github.com/nextcloud/nextcloud-vue/pull/1553)
- Bump css-loader from 3.6.0 to 5.0.1 [\#1537](https://github.com/nextcloud/nextcloud-vue/pull/1537) [\#1552](https://github.com/nextcloud/nextcloud-vue/pull/1552)
- Bump webpack-cli from 4.1.0 to 4.2.0 [\#1546](https://github.com/nextcloud/nextcloud-vue/pull/1546)
- Bump jest from 26.6.1 to 26.6.3 [\#1541](https://github.com/nextcloud/nextcloud-vue/pull/1541) [\#1545](https://github.com/nextcloud/nextcloud-vue/pull/1545)
- Bump babel-jest from 26.6.2 to 26.6.3 [\#1544](https://github.com/nextcloud/nextcloud-vue/pull/1544)
- Bump vue-loader from 15.9.4 to 15.9.5 [\#1536](https://github.com/nextcloud/nextcloud-vue/pull/1536)
- Bump node-sass from 4.14.1 to 5.0.0 and sass-loader to 10.0.5 [\#1534](https://github.com/nextcloud/nextcloud-vue/pull/1534)
- Translations updates

## [v2.9.0](https://github.com/nextcloud/nextcloud-vue/tree/v2.9.0) (2020-11-09)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.8.2...v2.9.0)

### Added
- Add default font and line size [\#1549](https://github.com/nextcloud/nextcloud-vue/pull/1549) ([GretaD](gretadoci@gmail.com))
- Add tooltips in app sidebar header [\#1560](https://github.com/nextcloud/nextcloud-vue/pull/1560) ([PVince81](https://github.com/PVince81))

## [v0.13.1](https://github.com/nextcloud/nextcloud-vue/tree/v0.13.1) (2020-11-06)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v0.13.0...v0.13.1)

### Fixed

- Add ability to choose popovermenu alignment in avatar component #1554

## [v3.1.2](https://github.com/nextcloud/nextcloud-vue/tree/v3.1.2) (2020-11-02)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.1.1...v3.1.2)

### Fixed
- Use static emoji picker to solve performance issue with background CPU usage [\#1526](https://github.com/nextcloud/nextcloud-vue/pull/1526) ([PVince81](https://github.com/PVince81))
- Fix setting navigation item blur [\#1503](https://github.com/nextcloud/nextcloud-vue/pull/1503) ([ma12-co](https://github.com/ma12-co))
- Translations update [\#1519](https://github.com/nextcloud/nextcloud-vue/pull/1519)

### Version bumps
- Bump @vue/test-utils from 1.1.0 to 1.1.1 [\#1530](https://github.com/nextcloud/nextcloud-vue/pull/1530)
- Bump webpack-merge from 5.2.0 to 5.3.0 [\#1528](https://github.com/nextcloud/nextcloud-vue/pull/1528)
- Bump emoji-mart-vue-fast from 7.0.6 to 7.0.7 [\#1527](https://github.com/nextcloud/nextcloud-vue/pull/1527)
- Bump cypress from 5.4.0 to 5.5.0 [\#1523](https://github.com/nextcloud/nextcloud-vue/pull/1523)
- Bump @nextcloud/axios from 1.4.0 to 1.5.0 [\#1522](https://github.com/nextcloud/nextcloud-vue/pull/1522)
- Bump file-loader from 6.1.1 to 6.2.0 [\#1521](https://github.com/nextcloud/nextcloud-vue/pull/1521)
- Bump vue-loader from 15.9.3 to 15.9.4 [\#1520](https://github.com/nextcloud/nextcloud-vue/pull/1520)

## [v2.8.2](https://github.com/nextcloud/nextcloud-vue/tree/v2.8.2) (2020-11-02)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.8.1...v2.8.2)

### Fixed
- Use static emoji picker to solve performance issue with background CPU usage [\#1526](https://github.com/nextcloud/nextcloud-vue/pull/1526) ([PVince81](https://github.com/PVince81))

## [v3.1.1](https://github.com/nextcloud/nextcloud-vue/tree/v3.1.1) (2020-10-27)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.1.0...v3.1.1)

### Fixed

- Also set Modal height/width to allow children to define their height/width and not only max-height/width [\#1518](https://github.com/nextcloud/nextcloud-vue/pull/1518) ([skjnldsv](https://github.com/skjnldsv))
- Don't show navigation of settings modal by default [\#1509](https://github.com/nextcloud/nextcloud-vue/pull/1509) ([ma12-co](https://github.com/ma12-co))
- Adapt to new vue2-datepicker format props [\#1517](https://github.com/nextcloud/nextcloud-vue/pull/1517) ([eneiluj](https://github.com/eneiluj))

## [v3.1.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.1.0) (2020-10-21)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.0.0...v3.1.0)

### Fixed

- Do not show letter if we have an icon and keep image ratio [\#1501](https://github.com/nextcloud/nextcloud-vue/pull/1501) ([skjnldsv](https://github.com/skjnldsv))
- Allow an "extra" slot for the AppNavigationItem [\##1493](https://github.com/nextcloud/nextcloud-vue/pull/1493) ([ChristophWurst](https://github.com/ChristophWurst))
- Fix avatar caching for non-user rendering [\#1491](https://github.com/nextcloud/nextcloud-vue/pull/1491) ([skjnldsv](https://github.com/skjnldsv))

## [v3.0.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.0.0) (2020-10-20)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.8.1...v3.0.0)

### Fixed
- Make appSidebar scrollable inside [\#1485](https://github.com/nextcloud/nextcloud-vue/pull/1485) ([skjnldsv](https://github.com/skjnldsv))

## [v2.8.1](https://github.com/nextcloud/nextcloud-vue/tree/v2.8.1) (2020-10-19)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.8.0...v2.8.1)

### Fixed
- Fix avatar caching for non-user rendering [\#1491](https://github.com/nextcloud/nextcloud-vue/pull/1491) ([skjnldsv](https://github.com/skjnldsv))

## [v2.8.0](https://github.com/nextcloud/nextcloud-vue/tree/v2.8.0) (2020-10-19)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.7.0...v2.8.0)

### Added
- Add submit, multiline and maxlength support [\#1465](https://github.com/nextcloud/nextcloud-vue/pull/1465) ([skjnldsv](https://github.com/skjnldsv))
- Cache hasAvatar info in sessionStorage to avoid flicker [\#1457](https://github.com/nextcloud/nextcloud-vue/pull/1457) ([PVince81](https://github.com/PVince81))
- Adds information to README.md file how to use vue-devtools [\#1446](https://github.com/nextcloud/nextcloud-vue/pull/1446) ([StCyr](https://github.com/StCyr))
- Add RichContenteditable component [\#1433](https://github.com/nextcloud/nextcloud-vue/pull/1433) ([skjnldsv](https://github.com/skjnldsv))
- Snapshot test for usernameToColor function [\#1346](https://github.com/nextcloud/nextcloud-vue/pull/1346) ([juliushaertl](https://github.com/juliushaertl))
- Add SettingsInputText compontents [\#650](https://github.com/nextcloud/nextcloud-vue/pull/650) ([GretaD](https://github.com/GretaD))

### Changed
- Translations updates

### Fixed
- Fix multiLine prop [\#1490](https://github.com/nextcloud/nextcloud-vue/pull/1490) ([skjnldsv](https://github.com/skjnldsv))
- Fix autocomplete popup size and shadow [\#1481](https://github.com/nextcloud/nextcloud-vue/pull/1481) ([skjnldsv](https://github.com/skjnldsv))
- Make mention inlined and ellipsised [\#1475](https://github.com/nextcloud/nextcloud-vue/pull/1475) ([skjnldsv](https://github.com/skjnldsv))
- Fix npm run build by removing obsolete command [\#1456](https://github.com/nextcloud/nextcloud-vue/pull/1456) ([PVince81](https://github.com/PVince81))
- Cleanup avatar fetching methods [\#1489](https://github.com/nextcloud/nextcloud-vue/pull/1489) ([skjnldsv](https://github.com/skjnldsv))
- Fix padding of sidebar without secondary actions [\#1362](https://github.com/nextcloud/nextcloud-vue/pull/1362) ([raimund-schluessler](https://github.com/raimund-schluessler))

## [v2.7.0](https://github.com/nextcloud/nextcloud-vue/tree/v2.7.0) (2020-10-08)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.6.9...v2.7.0)

### Added
- New app settings [\#1286](https://github.com/nextcloud/nextcloud-vue/pull/1286) ([ma12-co](https://github.com/ma21-co))

## [v2.6.9](https://github.com/nextcloud/nextcloud-vue/tree/v2.6.9) (2020-10-07)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.6.8...v2.6.9)

### Added

- Add loading state on AppSidebar and remove unwanted slot bind [\#1429](https://github.com/nextcloud/nextcloud-vue/pull/1429) ([skjnldsv](https://github.com/skjnldsv))

### Fixed

- Fix modal freeze [\#1432](https://github.com/nextcloud/nextcloud-vue/pull/1432) ([st3iny](https://github.com/st3iny))
- Allow spaces in the name of a AppSidebarTab [\#1431](https://github.com/nextcloud/nextcloud-vue/pull/1431) ([juliushaertl](https://github.com/juliushaertl))

## [v2.6.8](https://github.com/nextcloud/nextcloud-vue/tree/v2.6.8) (2020-10-02)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.6.7...v2.6.8)

### Fixed

- Only use the icon on the avatar when there is one [\#1423](https://github.com/nextcloud/nextcloud-vue/pull/1423) ([nickvergessen](https://github.com/nickvergessen))

## [v2.6.7](https://github.com/nextcloud/nextcloud-vue/tree/v2.6.7) (2020-10-02)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.6.6...v2.6.7)

### Fixed

- Introduce a compact mode (default) for the user status on the avatar in case it is used without presenting the status information [\#1405](https://github.com/nextcloud/nextcloud-vue/pull/1405) ([juliushaertl](https://github.com/juliushaertl))


## [v2.6.6](https://github.com/nextcloud/nextcloud-vue/tree/v2.6.6) (2020-09-30)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.6.5...v2.6.6)

### Fixed

- Listen to user status events to update the status on avatars [\#1405](https://github.com/nextcloud/nextcloud-vue/pull/1405) ([nickvergessen](https://github.com/nickvergessen))

## [v2.6.5](https://github.com/nextcloud/nextcloud-vue/tree/v2.6.5) (2020-09-11)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.6.4...v2.6.5)

### Fixed

- Allow to set popover container  [\#1389](https://github.com/nextcloud/nextcloud-vue/pull/1389) (Thanks to [raimund-schluessler](https://github.com/raimund-schluessler))
- Fix ActionInput label height [\#1361](https://github.com/nextcloud/nextcloud-vue/pull/1361) (Thanks to [tcitworld](https://github.com/tcitworld))
- Fix status on different active/hover states [\#1399](https://github.com/nextcloud/nextcloud-vue/pull/1399)
- Fix custom avatar handling in user bubble [\#1392](https://github.com/nextcloud/nextcloud-vue/pull/1392)

## [v2.6.4](https://github.com/nextcloud/nextcloud-vue/tree/v2.6.4) (2020-09-03)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.6.3...v2.6.4)

### Fixed

- Do not fetch user status if current user is a guest [\#1379](https://github.com/nextcloud/nextcloud-vue/pull/1379) ([danxuliu](https://github.com/danxuliu))
- Fetch user status in avatar only if it is going to be shown [\#1380](https://github.com/nextcloud/nextcloud-vue/pull/1380) ([danxuliu](https://github.com/danxuliu))

## [v2.6.3](https://github.com/nextcloud/nextcloud-vue/tree/v2.6.3) (2020-09-01)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.6.2...v2.6.3)

### Fixed

- Fix active tab prop [\#1368](https://github.com/nextcloud/nextcloud-vue/pull/1368) ([skjnldsv](https://github.com/skjnldsv))

## [v2.6.2](https://github.com/nextcloud/nextcloud-vue/tree/v2.6.2) (2020-09-01)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.6.1...v2.6.2)

### Fixed

- Disable spell checking for cypress [\#1363](https://github.com/nextcloud/nextcloud-vue/pull/1363) ([raimund-schluessler](https://github.com/raimund-schluessler))

### Added

- Cover more cases in AppSidebare visual test [\#1357](https://github.com/nextcloud/nextcloud-vue/pull/1357) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove unwanted files leftovers [\#1356](https://github.com/nextcloud/nextcloud-vue/pull/1356) ([skjnldsv](https://github.com/skjnldsv))
- Feature/cypress visual regression [\#1355](https://github.com/nextcloud/nextcloud-vue/pull/1355) ([skjnldsv](https://github.com/skjnldsv))
- Translate '/l10n/messages.pot' in 'is' [\#1354](https://github.com/nextcloud/nextcloud-vue/pull/1354) ([transifex-integration[bot]](https://github.com/apps/transifex-integration))

## [v2.6.1](https://github.com/nextcloud/nextcloud-vue/tree/v2.6.1) (2020-08-27)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.6.0...v2.6.1)

#### Fixed bugs:

- Allow to toggle linkification by prop [\#1337](https://github.com/nextcloud/nextcloud-vue/pull/1337) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix sidebar layout in compact mode [\#1338](https://github.com/nextcloud/nextcloud-vue/pull/1338) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Update status icons  [\#1341](https://github.com/nextcloud/nextcloud-vue/pull/1341)
- Do not fetch user-status if user prop does not represent a user [\#1348](https://github.com/nextcloud/nextcloud-vue/pull/1348)
- Allow to choose boundariesElement for actions popover [\#1351](https://github.com/nextcloud/nextcloud-vue/pull/1351)

## [v2.6.0](https://github.com/nextcloud/nextcloud-vue/tree/v2.6.0) (2020-08-21)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v2.5.0...v2.6.0)

### Implemented enhancements:

- Allow to specify a custom action instead of the star [\#1310](https://github.com/nextcloud/nextcloud-vue/pull/1310) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Allow to toggle editable title by click [\#1288](https://github.com/nextcloud/nextcloud-vue/pull/1288) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Feature/641/use popover component for actions [\#832](https://github.com/nextcloud/nextcloud-vue/pull/832) ([ma12-co](https://github.com/ma12-co))

#### Fixed bugs:

- Add `background-repeat:no-repeat` to icons [\#1330](https://github.com/nextcloud/nextcloud-vue/pull/1330) ([dk1a](https://github.com/dk1a))
- Fix tabs & lint [\#1303](https://github.com/nextcloud/nextcloud-vue/pull/1303) ([skjnldsv](https://github.com/skjnldsv))
- Do not display offline \(and invisible\) as a status [\#1312](https://github.com/nextcloud/nextcloud-vue/pull/1312) ([georgehrke](https://github.com/georgehrke))

## Older releases

See [the Github Releases page](https://github.com/nextcloud/nextcloud-vue/releases) for older changelog entries.
