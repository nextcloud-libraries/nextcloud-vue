<template>
	<li class="app-navigation-caption--item">
		{{ text }}
	</li>
</template>

<script>

export default {
	name: 'AppNavigationCaption',
	props: {
		text: {
			type: String,
			required: true
		}
	}
}
</script>
<style lang="scss" scoped>
.app-navigation-caption--item {
	font-weight: bold;
	color: var(--color-text-maxcontrast);
	line-height: $clickable-area;
	padding-left: $clickable-area;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	opacity: 0.7;
	box-shadow: none !important;
	pointer-events: none;
}

.app-navigation-caption--item:not(:first-child) {
	margin-top: $clickable-area / 2;
}
</style>
