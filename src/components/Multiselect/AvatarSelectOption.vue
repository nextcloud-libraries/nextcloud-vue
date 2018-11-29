<template>
	<span class="option">
		<avatar :display-name="option.displayName" :user="option.user" :disable-tooltip="true"
			:is-no-user="option.isNoUser" class="option__avatar" />
		<div class="option__desc">
			<span class="option__desc--lineone">
				{{ option.displayName }}
			</span>
			<span v-if="option.desc" class="option__desc--linetwo">
				{{ option.desc }}
			</span>
		</div>
		<span v-if="option.icon" class="icon option__icon" :class="option.icon" />
	</span>
</template>

<script>
import Avatar from 'Components/Avatar'

export default {
	name: 'AvatarSelectOption',
	components: {
		Avatar
	},
	props: {
		option: {
			type: Object,
			default() {
				return {
					desc: '',
					displayName: 'Admin',
					icon: 'icon-user',
					user: 'admin',
					isNoUser: false
				}
			},
			validator: (option) => {
				// minimum required is displayName
				return 'displayName' in option
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.option {
	display: flex;
	align-items: center;
	height: 32px;
	width: 100%;
	&__avatar {
		flex: 0 0 32px;
		width: 32px;
		height: 32px;
		margin-right: 6px;
	}
	&__desc {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1 1;
		&--lineone {
			color: var(--color-text-light);
			&--highlight {
				font-weight: 600;
			}
		}
		&--linetwo {
			opacity: .7;
		}
	}
	&__icon {
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		margin: -6px;
		opacity: .5;
	}
}
</style>
