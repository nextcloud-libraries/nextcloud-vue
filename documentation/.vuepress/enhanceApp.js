import VueCodeExample from './components/VueCodeExample'

export default async ({
    Vue, // the version of Vue being used in the VuePress app
    options, // the options for the root Vue instance
    router, // the router instance for the app
    siteData // site metadata
}) => {
    window.t = function(a, b) {
        return b;
    } 
    window.n = () => {}
    window.OC = {
        generateUrl: (url) => { return url },
        getCurrentUser: () => ({ uid: 'admin', displayname: 'Administrator' }),
    }
    window.OCA = {}
    
    const NcComponents = await require('../../dist/ncvuecomponents');
    Vue.use(NextcloudVue.default)
    Vue.component(VueCodeExample)

}