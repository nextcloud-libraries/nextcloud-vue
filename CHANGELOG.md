# Changelog

All notable changes to this project will be documented in this file.

## [v3.10.1](https://github.com/nextcloud/nextcloud-vue/tree/v3.10.1) (2021-06-02)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.10.0...v3.10.1)
## Fixed bugs

- Ensure the closed event is dispatched in AppSidebar [\#1993](https://github.com/nextcloud/nextcloud-vue/pull/1993) ([artonge](https://github.com/artonge))
- AppNavigationItem: hide utils if edit mode is active [\#1996](https://github.com/nextcloud/nextcloud-vue/pull/1996) ([korelstar](https://github.com/korelstar))
## [v3.10.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.10.0) (2021-05-27)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.9.0...v3.10.0)

## Enhancements

- \[stable3\] Add proper opening/opened/closing/closed events & fix events docs [\#1923](https://github.com/nextcloud/nextcloud-vue/pull/1923) ([backportbot-nextcloud[bot]](https://github.com/apps/backportbot-nextcloud))
- Add timestamp tooltip [\#1971](https://github.com/nextcloud/nextcloud-vue/pull/1971) ([Pytal](https://github.com/Pytal))
## Fixed bugs

- \[stable3\] Fix counter margin [\#1933](https://github.com/nextcloud/nextcloud-vue/pull/1933) ([backportbot-nextcloud[bot]](https://github.com/apps/backportbot-nextcloud))
- Allow to append datepicker to body [\#1921](https://github.com/nextcloud/nextcloud-vue/pull/1921) ([skjnldsv](https://github.com/skjnldsv))
- \[backport-1880-stable3\] Fix datepicker overflow when week numbers are shown [\#1920](https://github.com/nextcloud/nextcloud-vue/pull/1920) ([backportbot-nextcloud[bot]](https://github.com/apps/backportbot-nextcloud))
- Fix datepicker overflow when week numbers are shown [\#1917](https://github.com/nextcloud/nextcloud-vue/pull/1917) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Remove AppNavigationItem flex order for AppNavigationCaption [\#1911](https://github.com/nextcloud/nextcloud-vue/pull/1911) ([skjnldsv](https://github.com/skjnldsv))
- \[stable3\] Fix appnavigationitem layout [\#1902](https://github.com/nextcloud/nextcloud-vue/pull/1902) ([backportbot-nextcloud[bot]](https://github.com/apps/backportbot-nextcloud))
- \[stable3\] Fix first-action icon class not showing when Actions icon-slot is def… [\#1885](https://github.com/nextcloud/nextcloud-vue/pull/1885) ([backportbot-nextcloud[bot]](https://github.com/apps/backportbot-nextcloud))
- \[stable3\] Fix ListItemIcon listeners [\#1871](https://github.com/nextcloud/nextcloud-vue/pull/1871) ([backportbot-nextcloud[bot]](https://github.com/apps/backportbot-nextcloud))

## [v3.9.0](https://github.com/nextcloud/nextcloud-vue/tree/v3.9.0) (2021-04-07)

[Full Changelog](https://github.com/nextcloud/nextcloud-vue/compare/v3.8.0...v3.9.0)

## Enhancements

- Add icon slot to emptycontent [\#1806](https://github.com/nextcloud/nextcloud-vue/pull/1806) ([skjnldsv](https://github.com/skjnldsv))

## Fixed bugs

- Make sure to pass all props and attributes to single-action Actions [\#1809](https://github.com/nextcloud/nextcloud-vue/pull/1809) ([skjnldsv](https://github.com/skjnldsv))
- Ensure that crumbs to hide have correct class [\#1807](https://github.com/nextcloud/nextcloud-vue/pull/1807) ([raimund-schluessler](https://github.com/raimund-schluessler))
- Fix compact sidebar subtitle not visible [\#1767](https://github.com/nextcloud/nextcloud-vue/pull/1767) ([raimund-schluessler](https://github.com/raimund-schluessler))

## Closed pull requests

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
- Bump vue-eslint-parser from 7.1.1 to 7.3.0 - [\#1619](https://github.com/nextcloud/nextcloud-vue/issues/1619) [\#1636](https://github.com/nextcloud/nextcloud-vue/issues/1636) ([Julius Härtl](jus@bitgrid.net))
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

### Fixed bugs:

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

### Fixed bugs:

- Add `background-repeat:no-repeat` to icons [\#1330](https://github.com/nextcloud/nextcloud-vue/pull/1330) ([dk1a](https://github.com/dk1a))
- Fix tabs & lint [\#1303](https://github.com/nextcloud/nextcloud-vue/pull/1303) ([skjnldsv](https://github.com/skjnldsv))
- Do not display offline \(and invisible\) as a status [\#1312](https://github.com/nextcloud/nextcloud-vue/pull/1312) ([georgehrke](https://github.com/georgehrke))

## Older releases

See [the Github Releases page](https://github.com/nextcloud/nextcloud-vue/releases) for older changelog entries.
