<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<li class="collection-list-item">
		<NcAvatar :display-name="collection.name" allow-placeholder class="collection-avatar" />
		<span
			v-if="newName === null"
			class="collection-item-name"
			title=""
			@click="showDetails">{{ collection.name }}</span>
		<form v-else :class="{ 'should-shake': error }" @submit.prevent="renameCollection">
			<input
				v-model="newName"
				type="text"
				autocomplete="off"
				autocapitalize="off">
			<input type="submit" value="" class="icon-confirm">
		</form>
		<div v-if="!detailsOpen && newName === null" class="linked-icons">
			<component
				:is="getComponent(resource).component"
				v-for="resource in resources.slice(0, 2)"
				:key="resource.type + '|' + resource.id"
				:title="resource.name"
				:to="getComponent(resource).to"
				:href="getComponent(resource).href"
				:class="typeClass(resource)">
				<img :src="iconUrl(resource)" :alt="resource.name">
			</component>
		</div>

		<span v-if="newName === null" class="sharingOptionsGroup">
			<NcActions>
				<NcActionButton
					icon="icon-info"
					@click.prevent="toggleDetails">
					{{ detailsOpen ? t('Hide details') : t('Show details') }}
				</NcActionButton>
				<NcActionButton
					icon="icon-rename"
					@click.prevent="openRename">
					{{ t('Rename project') }}
				</NcActionButton>
			</NcActions>
		</span>

		<transition name="fade">
			<div v-if="error" class="error">
				{{ error }}
			</div>
		</transition>
		<transition name="fade">
			<ul v-if="detailsOpen" class="resource-list-details">
				<li
					v-for="resource in resources"
					:key="resource.type + '|' + resource.id"
					:class="typeClass(resource)">
					<component
						:is="getComponent(resource).component"
						:to="getComponent(resource).to"
						:href="getComponent(resource).href">
						<img :src="iconUrl(resource)" :alt="resource.name">
						<span class="resource-name">{{ resource.name || '' }}</span>
					</component>
					<span class="icon-close" @click="removeResource(collection, resource)" />
				</li>
			</ul>
		</transition>
	</li>
</template>

<script>
import { t } from '../../l10n.ts'
import NcActionButton from '../NcActionButton/index.js'
import NcActions from '../NcActions/index.js'
import NcAvatar from '../NcAvatar/index.js'
import { getRoute } from '../NcRichText/autolink.ts'

export default {
	name: 'NcCollectionListItem',

	components: {
		NcAvatar,
		NcActions,
		NcActionButton,
	},

	props: {
		/**
		 * The collection
		 */
		collection: {
			type: Object,
			default: null,
		},

		/**
		 * Current error if any
		 */
		error: {
			type: String,
			default: undefined,
		},
	},

	emits: [
		'removeResource',
		'renameCollection',
	],

	data() {
		return {
			detailsOpen: false,
			newName: null,
		}
	},

	computed: {
		getIcon() {
			return (resource) => [resource.iconClass]
		},

		typeClass() {
			return (resource) => 'resource-type-' + resource.type
		},

		resources() {
			// invalid resources come from server as empty array ([]) and not an object
			return this.collection.resources?.filter((resource) => !Array.isArray(resource)) ?? []
		},

		getComponent() {
			return (resource) => {
				const route = getRoute(this.$router, resource.link)

				return route
					? { component: 'router-link', to: route, href: undefined }
					: { component: 'a', to: undefined, href: resource.link }
			}
		},

		iconUrl() {
			return (resource) => {
				if (resource.mimetype) {
					return OC.MimeType.getIconUrl(resource.mimetype)
				}
				if (resource.iconUrl) {
					return resource.iconUrl
				}
				return ''
			}
		},
	},

	methods: {
		t,

		toggleDetails() {
			this.detailsOpen = !this.detailsOpen
		},

		showDetails() {
			this.detailsOpen = true
		},

		removeResource(collection, resource) {
			this.$emit('removeResource', {
				collectionId: collection.id,
				resourceType: resource.type,
				resourceId: resource.id,
			})
		},

		openRename() {
			this.newName = this.collection.name
		},

		renameCollection() {
			if (this.newName) {
				this.$emit('renameCollection', {
					collectionId: this.collection.id,
					name: this.newName,
				})
			}
			this.newName = null
		},
	},
}
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
	transition: opacity .3s ease;
}

.fade-enter, .fade-leave-to
	/* .fade-leave-active below version 2.1.8 */
{
	opacity: 0;
}

.linked-icons {
	display: flex;

	img {
		padding: 12px;
		height: var(--default-clickable-area);
		display: block;
		background-repeat: no-repeat;
		background-position: center;
		opacity: 0.7;

		&:hover {
			opacity: 1;
		}
	}
}

.popovermenu {
	display: none;

	&.open {
		display: block;
	}
}

li.collection-list-item {
	flex-wrap: wrap;
	height: auto;
	cursor: pointer;
	margin-bottom: 0 !important;

	.collection-avatar {
		margin-top: 0;
	}

	form, .collection-item-name {
		flex-basis: 10%;
		flex-grow: 1;
		display: flex;
	}

	.collection-item-name {
		padding: 12px 9px;
	}

	input {
		margin-top: 4px;
		border-color: var(--color-border-maxcontrast);

		&[type=text] {
			flex-grow: 1;
		}
	}

	.error {
		flex-basis: 100%;
		width: 100%;
	}

	.resource-list-details {
		flex-basis: 100%;
		width: 100%;

		li {
			display: flex;
			margin-inline-start: var(--default-clickable-area);
			border-radius: 3px;
			cursor: pointer;

			&:hover {
				background-color: var(--color-background-dark);
			}

			a {
				flex-grow: 1;
				padding: 3px;
				max-width: calc(100% - 30px);
				display: flex;
			}
		}

		span {
			display: inline-block;
			vertical-align: top;
			margin-inline-end: 10px;
		}

		span.resource-name {
			text-overflow: ellipsis;
			overflow: hidden;
			position: relative;
			vertical-align: top;
			white-space: nowrap;
			flex-grow: 1;
			padding: 4px;
		}

		img {
			width: 24px;
			height: 24px;
		}

		.icon-close {
			opacity: .7;

			&:hover, &:focus {
				opacity: 1;
			}
		}
	}
}

.should-shake {
	animation: shake 0.6s 1 linear;
}

@keyframes shake {
	0% {
		transform: translate(15px);
	}
	20% {
		transform: translate(-15px);
	}
	40% {
		transform: translate(7px);
	}
	60% {
		transform: translate(-7px);
	}
	80% {
		transform: translate(3px);
	}
	100% {
		transform: translate(0px);
	}
}
</style>
