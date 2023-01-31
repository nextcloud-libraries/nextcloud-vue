import DefaultTheme from 'vitepress/theme'
import VueLiveWithLayout from './components/vue-live-with-layout'

import './assets/apps.css';
import './assets/default.css';
import './assets/icons.css';
import '../../../dist/style.css';

export default {
	...DefaultTheme,
	enhanceApp(ctx) {
		DefaultTheme.enhanceApp(ctx)
		ctx.app.component('VueLive', VueLiveWithLayout)
	}
}