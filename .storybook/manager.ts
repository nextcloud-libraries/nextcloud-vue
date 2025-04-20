import { addons } from '@storybook/manager-api'
import nextcloudTheme from './nextcloudTheme.ts'
 
addons.setConfig({
	theme: nextcloudTheme,
})
