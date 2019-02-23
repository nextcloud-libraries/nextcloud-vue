/**
 * @copyright Copyright (c) 2019 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import { VTooltip } from 'v-tooltip'
import './index.scss'

// force scope the tooltip and use .vue-tooltip
// instead of .tooltip to avoid server compatibility
// issues and the use of !important
VTooltip.options.defaultTemplate = `<div class="vue-tooltip" role="tooltip" data-v-${SCOPE_VERSION}><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>`

/**
 * @vuepress
 * ---
 * title: Tooltip
 * ---
 */

/**
 * ::: tip
 * The tooltip directive is based on v-tooltip. For a full feature list see the projects [README](https://github.com/Akryum/v-tooltip/blob/master/README.md#directive)
 * :::
 * 
 * 
 * 
 * 
 * 
In the template, use the `v-tooltip` directive:

```html
<button v-tooltip="'You have ' + count + ' new messages.'">
```

Of course, you can use a reactive property:

```html
<button v-tooltip="tooltipContent">
```

You can specify the tooltip position as a modifier:

```html
<button v-tooltip.bottom-start="'You have ' + count + ' new messages.'">
```

The available positions are:

 - `'auto'`
 - `'auto-start'`
 - `'auto-end'`
 - `'top'`
 - `'top-start'`
 - `'top-end'`
 - `'right'`
 - `'right-start'`
 - `'right-end'`
 - `'bottom'`
 - `'bottom-start'`
 - `'bottom-end'`
 - `'left'`
 - `'left-start'`
 - `'left-end'`

 * 
 * <VueCodeExample title="Show tooltip">
 *    ``` vue
 *    <button v-tooltip="'I\'m a tooltip'">I'm a button with a tooltip</button>
 *    ```
 * </VueCodeExample>
 */
export const directive = VTooltip
export default directive
