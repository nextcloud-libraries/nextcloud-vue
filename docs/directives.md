## Tooltip


The tooltip directive is based on v-tooltip. For a full feature list see the projects [README](https://github.com/Akryum/v-tooltip/blob/master/README.md#directive)

In the template, use the `v-tooltip` directive:
```vue
<button v-tooltip="'You have new messages.'" />
```
Of course, you can use a reactive property:

```vue
    <template>
        <button v-tooltip="tooltipContent" />
    </template>
    <script>
        export default {
            computed: {
                count() => return 'You have new messages.'
            }
        }
    </script>
```
You can specify the tooltip position as a modifier:
```vue
<button v-tooltip.bottom="'You have new messages.'" />
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

```vue
<button v-tooltip="{content: 'I\'m a tooltip', show: true, placement: 'right'}">I'm a button with a tooltip</button>
```