<!--
 - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

All applications must to be wrapped in one of the provided app containers.
Those containers provide base styling and context for all components.

### Available containers
#### `NcContent`
This is the main container useable for all apps that provide app content.
Often you would use then `NcAppContent` and maybe `NcAppNavigation` within it.

#### `NcGuestContent`
This is the main container for guest content like the login box of Nextcloud.
It should only be used as the main container when rendering a page as `OCP\AppFramework\Http\TemplateResponse::RENDER_AS_GUEST`.

<!-- TODO: Missing container for settings -->
