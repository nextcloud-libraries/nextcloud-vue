<template xmlns:>
	<div class="popovermenu-wrapper">
		<a class="button icon-more" @click="isOpen = !isOpen" />
		<popover-menu :is-open="isOpen" :menu="menu" />
	</div>
</template>

<script>
import popoverMenu from '../PopoverMenu'

export default {
	name: 'PopoverMenuButton',
	components: {
		popoverMenu
	},
	props: {
		menu: {
			type: Array,
			default: () => [
				{
					icon: 'icon-delete',
					text: 'Delete item',
					action: () => {
						alert('Deleted!')
					}
				},
				{
					icon: 'icon-external',
					text: 'Nextcloud website',
					href: 'https://nextcloud.com'
				},
				{
					icon: 'icon-details',
					longtext: 'Add item',
					href: 'https://nextcloud.com'
				}
			]
		}
	},
	data: function() {
		return {
			isOpen: false
		}
	}
}
</script>

<style lang="scss" scoped>
	.popovermenu-wrapper {
		position: relative;
		display: inline-block;
	}
</style>
