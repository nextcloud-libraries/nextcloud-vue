<!--
 - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

All applications **must** be wrapped in one of the provided app containers.
Those containers provide base styling and context for all components.

### Available containers
#### `NcContent`
This is the main container for all apps that provide full web-page interface.
Its usual usage looks like this:

```html static
<NcContent>
	<NcAppNavigation>
		<!--- any in-app navigation -->
	</NcAppNavigation>
	<NcAppContent>
		<!-- you application content -->
	</NcAppContent>
</NcContent>
```

#### `NcGuestContent`
This is the main container for guest content like the login box of Nextcloud.
It should only be used as the main container when rendering a page as `OCP\AppFramework\Http\TemplateResponse::RENDER_AS_GUEST`.

<!-- TODO: Missing container for settings -->
