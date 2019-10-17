module.exports = {
	plugins: [
		'@babel/plugin-transform-runtime',
		'@babel/plugin-transform-react-jsx'
	],
	presets: [
		[
			'@babel/preset-env',
			{
				forceAllTransforms: true,
				modules: false
			}
		]
	]
};
