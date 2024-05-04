declare const PRODUCTION: boolean

declare const SCOPE_VERSION: string

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const TRANSLATIONS: { locale: string; translations: any }[]

declare module '*?raw' {
	const content: string
	export default content
}
