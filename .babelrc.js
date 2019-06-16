module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					browsers: ['last 2 versions', 'ie >= 11']
				},
				forceAllTransforms: true,
				modules: false
			},
		]
	],
	plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-react-jsx'],
}
