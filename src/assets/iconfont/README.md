# Automated icons font builder
If you want to use an icon as a background on the components you need to use this tool.

1. Put any 16x16 icon in this folder with a proper filename
2. On your component scss import the font scss: `@import '../../fonts/scss/iconfont-vue';`
3. On your scss rule, use the `iconfont` mixin:
	``` scss
	.icon-test {
		@include iconfont('arrow-right-double');
	}
	```

# Informations
- Your svg must not have strokes. This is not compatible with fonts.
  Please convert them to path instead
- If you encounter the 'Undefined Iconfont Glyph' error, please close make and run it again
  The webpack config needs to refresh the svg list

# Results
- Your scss selector will now use the `:before` pseudo-element with the unicode content matching your icon.
	``` scss
	.icon-test:before {
		font-family: 'iconfont-vue';
		font-style: normal;
		font-weight: 400;
		content: "\EA03";
	}
	```

- The font will automatically be embeded on the library.
