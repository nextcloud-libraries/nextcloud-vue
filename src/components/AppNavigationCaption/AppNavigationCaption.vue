<template>
	<li class="app-navigation-caption">
		{{ title }}
	</li>
</template>

<script>

export default {
	name: 'AppNavigationCaption',
	props: {
		title: {
			type: String,
			required: true,
		},
	},
}
</script>

<style lang="scss" scoped>
.app-navigation-caption {
	font-weight: bold;
	color: var(--color-text-maxcontrast);
	line-height: $clickable-area;
	padding-left: $clickable-area;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	opacity: 0.7;
	box-shadow: none !important;
	order: 1;
	flex-shrink: 0;
}

// extra top space if it's not the first item on the list
.app-navigation-caption:not(:first-child) {
	margin-top: $clickable-area / 2;
}
</style>
