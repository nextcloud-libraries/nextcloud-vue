<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div v-if="appEnabled && isVisible" class="team-resources">
		<h5 class="team-resources__header">
			{{ t('Related team resources') }}
		</h5>
		<details v-for="team in teamResources"
			:key="team.teamId"
			name="Team resources"
			class="related-team"
			:open="open(team.teamId)"
			@toggle="(event) => toggleOpen(team.teamId, event.target.open)">
			<summary class="related-team__header">
				<h5 class="related-team__name">
					<AccountGroup :size="20" />
					{{ team.displayName }}
				</h5>
				<NcButton type="tertiary"
					:href="team.link"
					:aria-label="t('View team')"
					:title="t('View team')">
					<template #icon>
						<OpenInNew :size="20" />
					</template>
				</NcButton>

				<ChevronUp v-if="open(team.teamId)"
					:size="20" />
				<ChevronDown v-else
					:size="20" />
			</summary>

			<div>
				<div v-for="provider in teamProviders(team.teamId)"
					:key="provider.id"
					class="related-team-provider">
					<h6 v-if="provider.resources.length > 0">
						{{ provider.name }}
					</h6>
					<ul>
						<li v-for="resource in provider.resources" :key="resource.url" class="related-team-resource">
							<a :href="resource.url" class="related-team-resource__link">
								<span v-if="resource.iconEmoji" class="resource__icon">
									{{ resource.iconEmoji }}
								</span>
								<NcIconSvgWrapper v-else-if="resource.iconSvg"
									class="resource__icon"
									:svg="resource.iconSvg"
									:size="20" />
								<span v-else-if="resource.iconURL" class="resource__icon">
									<img :src="resource.iconURL" alt="">
								</span>
								<span class="resource__name">
									{{ resource.label }}
								</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</details>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'
import { getCapabilities } from '@nextcloud/capabilities'
import AccountGroup from 'vue-material-design-icons/AccountGroup.vue'
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import ChevronUp from 'vue-material-design-icons/ChevronUp.vue'
import OpenInNew from 'vue-material-design-icons/OpenInNew.vue'
import NcButton from '../NcButton/NcButton.vue'
import NcIconSvgWrapper from '../NcIconSvgWrapper/NcIconSvgWrapper.vue'

import { t } from '../../l10n.js'

const teamResourceProviders = getCapabilities()?.circles?.teamResourceProviders ?? []

export default {
	name: 'NcTeamResources',

	components: {
		AccountGroup,
		ChevronDown,
		ChevronUp,
		OpenInNew,
		NcButton,
		NcIconSvgWrapper,
	},

	props: {
		providerId: {
			type: String,
			default: null,
		},
		itemId: {
			type: [String, Number],
			default: null,
		},
	},

	data() {
		return {
			appEnabled: OC?.appswebroots?.circles !== undefined && (OC.config.version.split('.')[0] ?? 0) >= 29,
			loading: false,
			teamResources: null,
			teamOpen: [],
		}
	},

	computed: {
		isVisible() {
			return !this.loading && this.teamResources?.length > 0
		},
		teamProviders() {
			return (teamId) => {
				const team = this.teamResources.find(t => t.teamId === teamId)
				return team.resources?.reduce((acc, resource) => {
					if (resource.provider.id === this.providerId && resource.id === String(this.itemId)) {
						return acc
					}

					if (!acc[resource.provider.id]) {
						acc[resource.provider.id] = resource.provider
						acc[resource.provider.id].resources = []
					}

					if (resource.provider.id === this.providerId && resource.id === String(this.itemId)) {
						return acc
					}

					acc[resource.provider.id].resources.push(resource)
					return acc
				}, {})
			}
		},
		open() {
			return (teamId) => {
				return this.teamOpen.indexOf(teamId) !== -1
			}
		},
	},

	watch: {
		providerId() {
			this.fetchTeamResources()
		},
		itemId() {
			this.fetchTeamResources()
		},
	},

	created() {
		this.fetchTeamResources()
	},

	methods: {
		t,
		async fetchTeamResources() {
			if (!teamResourceProviders.includes(this.providerId)) {
				return
			}
			try {
				this.loading = true
				const response = await axios.get(generateOcsUrl(`/teams/resources/${this.providerId}/${this.itemId}`))
				this.teamResources = response.data.ocs.data.teams
				this.teamOpen = [this.teamResources[0]?.teamId]
			} catch (e) {
				this.teamResources = null
				console.error(e)
			} finally {
				this.loading = false
			}
		},
		toggleOpen(teamId, open) {
			if (open) {
				this.teamOpen.push(teamId)
			} else {
				this.teamOpen.splice(this.teamOpen.indexOf(teamId), 1)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.team-resources__header {
	font-weight: bold;
	margin-bottom: 6px;
}

.related-team {
	border-radius: var(--border-radius-rounded);
	border: 2px solid var(--color-border-dark);
	margin-bottom: 6px;

	&__open {
		border-color: var(--color-primary-element);
	}

	&__header {
		padding: 6px;
		padding-right: 24px;
		display: flex;
		gap: 12px;
	}

	&__name {
		display: flex;
		flex-grow: 1;
		align-items: center;
		gap: 12px;
		padding: 6px 12px;
		font-weight: bold;
		margin: 0;
	}

	.related-team-provider {
		padding: 6px 12px;

		&__name {
			font-weight: bold;
			margin-bottom: 3px;
		}

		&__link {
			display: flex;
			gap: 12px;
			padding: 6px 12px;
			font-weight: bold;
		}
	}

	.related-team-resource {
		&__link {
			display: flex;
			gap: 12px;
			height: var(--default-clickable-area);
			align-items: center;
			border-radius: var(--border-radius-large);

			&:hover {
				background-color: var(--color-background-hover);
			}
			&:focus {
				background-color: var(--color-background-hover);
				outline: 2px solid var(--color-primary-element);
			}
		}
		.resource__icon {
			width: var(--default-clickable-area);
			height: var(--default-clickable-area);
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;

			& > img {
				border-radius: var(--border-radius-pill);
				overflow: hidden;
				width: 32px;
				height: 32px;
			}
		}
	}
}
</style>
