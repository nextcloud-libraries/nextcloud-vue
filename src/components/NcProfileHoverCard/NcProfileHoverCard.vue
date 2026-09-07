<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'
import { getCapabilities } from '@nextcloud/capabilities'
import { getCanonicalLocale } from '@nextcloud/l10n'
import { generateOcsUrl, generateUrl } from '@nextcloud/router'
import { computed, onMounted, ref, watch } from 'vue'
import BriefcaseIcon from 'vue-material-design-icons/BriefcaseOutline.vue'
import ClockIcon from 'vue-material-design-icons/ClockOutline.vue'
import MapMarkerIcon from 'vue-material-design-icons/MapMarkerOutline.vue'
import PencilIcon from 'vue-material-design-icons/PencilOutline.vue'
import NcActionButton from '../NcActionButton/NcActionButton.vue'
import NcActionLink from '../NcActionLink/NcActionLink.vue'
import NcActionRouter from '../NcActionRouter/NcActionRouter.vue'
import NcActions from '../NcActions/NcActions.vue'
import NcAvatar from '../NcAvatar/NcAvatar.vue'
import NcButton from '../NcButton/NcButton.vue'
import NcLoadingIcon from '../NcLoadingIcon/NcLoadingIcon.vue'
import NcRichText from '../NcRichText/NcRichText.vue'
import { useIsSmallMobile } from '../../composables/useIsMobile/index.ts'
import { t } from '../../l10n.ts'
import { logger } from '../../utils/logger.ts'
import NcIconSvgWrapper from '../NcIconSvgWrapper/index.ts'
import { fetchProfileCached, getCachedProfile, setCachedProfile } from './profileCache.ts'

export interface IProfileAction {
	id: string
	appId?: string
	icon: string
	title: string
	target: string | null
}

export interface IProfileData {
	userId: string
	address?: string | null
	biography?: string | null
	displayname?: string | null
	headline?: string | null
	isUserAvatarVisible?: boolean
	organisation?: string | null
	pronouns?: string | null
	role?: string | null
	timezone?: string | null
	timezoneOffset?: number | null
	actions: IProfileAction[]
}

/**
 * Action shown in the hover card sidebar (typically from NcAvatar's contacts menu).
 */
export interface IProfileHoverCardAction {
	id?: string
	appId?: string
	text: string
	href?: string
	to?: RouteLocationRaw
	target?: string
	rel?: string
	icon?: string
	iconSvg?: string
	onClick?: (event: MouseEvent) => void
}

export interface IUserStatus {
	icon?: string | null
	message?: string | null
	status?: string | null
}

const props = withDefaults(defineProps<{
	/**
	 * User id whose profile to show.
	 */
	user?: string | null

	/**
	 * Optional display name when already known (skips `/displaynames` for limited profiles).
	 * When omitted and the full profile is unavailable, the card looks the name up itself.
	 */
	displayName?: string | null

	/**
	 * Optional preloaded profile data (skips the profile API request when set).
	 */
	profile?: IProfileData | null

	/**
	 * Optional preloaded user status (skips the status API request when set).
	 * Pass an object with `status`, `icon`, and `message` set to null for a known empty status.
	 */
	preloadedUserStatus?: IUserStatus | null

	/**
	 * Whether the popover that hosts this card is currently shown.
	 * Profile data and user status are loaded when this becomes true.
	 */
	open?: boolean

	/**
	 * Actions to show in the card (e.g. NcAvatar contacts menu actions).
	 * When omitted or empty, actions from the profile API are used.
	 */
	actions?: IProfileHoverCardAction[] | null

	/**
	 * True while parent actions (e.g. contacts menu) are still loading.
	 */
	actionsLoading?: boolean
}>(), {
	user: null,
	displayName: null,
	profile: null,
	preloadedUserStatus: null,
	open: false,
	actions: null,
	actionsLoading: false,
})

const loading = ref(false)
const error = ref(false)
const profileData = ref<IProfileData | null>(props.profile)
const userStatus = ref<IUserStatus>(props.preloadedUserStatus ?? {})
/**
 * False when the full profile is disabled or unavailable; card shows avatar + name only.
 */
const profileEnabled = ref(!!props.profile)
/**
 * True once status is known for the current user (preloaded or fetched, including empty).
 * The card stays on the loading state until this is true to avoid a status flash.
 */
const userStatusReady = ref(props.preloadedUserStatus !== null)
const isMobile = useIsSmallMobile()

/**
 * Show the spinner until profile (or limited fallback) and status are both ready.
 */
const showLoading = computed(() => loading.value
	|| (!!profileData.value && !error.value && !userStatusReady.value))

if (props.user && props.profile) {
	setCachedProfile(props.user, props.profile)
}

const isCurrentUser = computed(() => !!props.user && getCurrentUser()?.uid === props.user)
const settingsUrl = generateUrl('/settings/user')

/**
 * Full profile page URL — only when the profile is enabled and reachable.
 */
const profileUrl = computed(() => {
	if (!profileEnabled.value) {
		return null
	}
	const userId = profileData.value?.userId || props.user
	if (!userId) {
		return null
	}
	return generateUrl('/u/{userId}', { userId })
})

/**
 * Display name for the header (full profile, prop, or user id).
 */
const resolvedDisplayName = computed(() => profileData.value?.displayname
	|| props.displayName
	|| profileData.value?.userId
	|| props.user
	|| '')

/**
 * Props for avatar wrappers that link to the full profile when available.
 */
const profileLinkProps = computed(() => {
	if (!profileUrl.value) {
		return {}
	}
	return {
		href: profileUrl.value,
		'aria-label': t('View profile'),
	}
})

/**
 * Drop actions that do not belong in the hover-card sidebar
 * (timezone info and the separate "View profile" entry).
 *
 * @param action - Hover card or profile API action
 */
function isSidebarAction(action: Pick<IProfileHoverCardAction, 'appId' | 'id'>) {
	return action.appId !== 'timezone'
		&& action.appId !== 'profile'
		&& action.id !== 'profile'
}

/**
 * Display label for an action (short Talk labels without the redundant name).
 *
 * @param action - Hover card action
 */
function actionDisplayText(action: IProfileHoverCardAction) {
	// Keep self-profile labels such as "Open Talk" unchanged
	if (isCurrentUser.value) {
		return action.text
	}
	if (action.id === 'talk-call' || isSpreedDirectCallAction(action)) {
		return t('Start call')
	}
	if (action.id === 'talk' || action.appId === 'spreed') {
		return t('Send message')
	}
	return action.text
}

/**
 * Contacts-menu Talk "direct call" action (vs chat), identified by URL fragment.
 *
 * @param action - Hover card action
 */
function isSpreedDirectCallAction(action: IProfileHoverCardAction) {
	if (action.appId !== 'spreed') {
		return false
	}
	const href = action.href ?? (typeof action.to === 'string' ? action.to : '')
	return typeof href === 'string' && href.includes('#direct-call')
}

/**
 * Actions shown in the card sidebar, excluding timezone and View profile.
 */
const resolvedActions = computed((): IProfileHoverCardAction[] => {
	if (props.actions && props.actions.length > 0) {
		return props.actions.filter(isSidebarAction)
	}
	return (profileData.value?.actions ?? [])
		.filter(isSidebarAction)
		.map((action) => ({
			id: action.id,
			appId: action.appId,
			text: action.title,
			href: action.target || undefined,
			icon: action.icon,
			target: action.id === 'phone' ? '_self' : '_blank',
			rel: action.id === 'fediverse' ? 'me' : undefined,
		}))
})

/**
 * Local clock for the profile user (same format as Talk's right sidebar).
 */
const localTimeLabel = computed(() => {
	const time = formatProfileLocalTime(new Date())
	if (!time) {
		return null
	}
	return t('Local time: {time}', { time })
})

const primaryAction = computed(() => resolvedActions.value[0])
const otherActions = computed(() => resolvedActions.value.slice(1))

const primaryActionButtonProps = computed(() => {
	const action = primaryAction.value
	if (!action) {
		return {}
	}
	if (action.to) {
		return { to: action.to }
	}
	if (action.href) {
		return {
			href: action.href,
			target: action.target ?? (action.href.startsWith('tel:') ? '_self' : '_blank'),
			rel: action.rel,
		}
	}
	return {}
})

/**
 * Pass status to NcAvatar so the badge matches the loaded status.
 * Always pass an object (null fields if empty) so NcAvatar does not fetch again.
 */
const avatarUserStatus = computed(() => ({
	status: userStatus.value.status ?? null,
	icon: userStatus.value.icon ?? null,
	message: userStatus.value.message ?? null,
}))

/**
 * Format the profile user's current time like Talk (`HH:MM` in their timezone)
 *
 * @param date - Instant to format
 */
function formatProfileLocalTime(date: Date): string | null {
	const timeZone = profileData.value?.timezone
	if (timeZone) {
		try {
			return new Intl.DateTimeFormat(getCanonicalLocale(), {
				timeZone,
				hour: '2-digit',
				minute: '2-digit',
			}).format(date)
		} catch {
			// Invalid timezone id from the server
		}
	}

	if (typeof profileData.value?.timezoneOffset === 'number') {
		const shifted = new Date(date.getTime() + profileData.value.timezoneOffset * 1000)
		return new Intl.DateTimeFormat(getCanonicalLocale(), {
			timeZone: 'UTC',
			hour: '2-digit',
			minute: '2-digit',
		}).format(shifted)
	}

	return null
}

/**
 * Whether an action icon is an image URL rather than a CSS class
 *
 * @param icon - Icon value
 */
function isIconUrl(icon?: string) {
	return !!icon && (/^(https?:)?\/\//.test(icon) || icon.startsWith('/') || icon.startsWith('data:'))
}

/**
 * Resolve the NcAction component for a secondary hover-card action
 *
 * @param action - Hover card action
 */
function otherActionComponent(action: IProfileHoverCardAction) {
	if (action.to) {
		return NcActionRouter
	}
	if (action.onClick && !action.href) {
		return NcActionButton
	}
	return NcActionLink
}

/**
 * Props for a secondary hover-card action component
 *
 * @param action - Hover card action
 */
function otherActionProps(action: IProfileHoverCardAction) {
	if (action.to) {
		return { to: action.to, closeAfterClick: true }
	}
	if (action.onClick && !action.href) {
		return { onClick: action.onClick, closeAfterClick: true }
	}
	return {
		href: action.href,
		target: action.target ?? (action.href?.startsWith('tel:') ? '_self' : '_blank'),
		rel: action.rel,
		closeAfterClick: true,
	}
}

watch(() => props.profile, (value) => {
	if (value) {
		profileData.value = value
		profileEnabled.value = true
		if (props.user) {
			setCachedProfile(props.user, value)
		}
		error.value = false
	}
})

watch(() => props.preloadedUserStatus, (value) => {
	if (value) {
		userStatus.value = value
		userStatusReady.value = true
	}
})

watch(() => props.displayName, (value) => {
	if (value && profileData.value && !profileEnabled.value) {
		profileData.value = { ...profileData.value, displayname: value }
	}
})

watch(() => props.user, () => {
	profileData.value = props.profile
	userStatus.value = props.preloadedUserStatus ?? {}
	userStatusReady.value = props.preloadedUserStatus !== null
	profileEnabled.value = !!props.profile
	error.value = false
	if (props.user && props.profile) {
		setCachedProfile(props.user, props.profile)
	}
	if (props.open) {
		loadProfile()
	}
})

watch(() => props.open, (isOpen) => {
	if (isOpen) {
		loadProfile()
	}
})

onMounted(() => {
	if (props.open) {
		loadProfile()
	}
})

/**
 * Resolve a display name for limited profiles: prop first, then `/displaynames`.
 *
 * @param userId - User id
 */
async function resolveDisplayName(userId: string): Promise<string> {
	if (props.displayName) {
		return props.displayName
	}
	try {
		const { data } = await axios.post(generateUrl('/displaynames'), { users: [userId] })
		return data?.users?.[userId] || userId
	} catch (e) {
		logger.debug('Failed to load display name for hovercard', { error: e, userId })
		return userId
	}
}

/**
 * Minimal profile when the full profile is disabled or unavailable.
 * Matches Talk / sharing sidebars: avatar + display name (+ status/actions).
 *
 * @param userId - User id
 */
async function createLimitedProfile(userId: string): Promise<IProfileData> {
	return {
		userId,
		displayname: await resolveDisplayName(userId),
		actions: [],
		isUserAvatarVisible: true,
	}
}

/**
 * Ensure user status is loaded when missing.
 *
 * @param userId - User id
 */
async function ensureUserStatus(userId: string) {
	// Skip the status request when already known (e.g. from NcAvatar)
	if (!userStatusReady.value) {
		userStatus.value = await fetchUserStatus(userId)
		userStatusReady.value = true
	}
}

/**
 * Load profile fields and user status when the hovercard opens
 */
async function loadProfile() {
	if (!props.user || loading.value) {
		return
	}

	const userId = props.user

	// Use preloaded, instance, or shared-cache profile; only refresh status if needed
	if (!profileData.value) {
		const cached = getCachedProfile(userId)
		if (cached) {
			profileData.value = cached
			profileEnabled.value = true
		}
	}
	if (profileData.value && profileEnabled.value) {
		if (!userStatusReady.value) {
			loading.value = true
			try {
				await ensureUserStatus(userId)
			} finally {
				loading.value = false
			}
		}
		return
	}

	loading.value = true
	error.value = false

	const statusPromise = userStatusReady.value
		? Promise.resolve(userStatus.value)
		: fetchUserStatus(userId)

	try {
		const profile = await fetchProfileCached(userId, async () => {
			const { data } = await axios.get(generateOcsUrl('/profile/{userId}', { userId }))
			return data.ocs?.data ?? null
		})
		if (profile) {
			profileData.value = profile
			profileEnabled.value = true
		} else {
			// Profile disabled or empty — show avatar + name like Talk / sharing
			profileData.value = await createLimitedProfile(userId)
			profileEnabled.value = false
		}
	} catch (e) {
		logger.debug('Failed to load profile for hovercard, showing limited info', { error: e, user: userId })
		profileData.value = await createLimitedProfile(userId)
		profileEnabled.value = false
	}

	try {
		userStatus.value = await statusPromise
		userStatusReady.value = true
	} finally {
		loading.value = false
	}
}

/**
 * Fetch user status for the given user
 *
 * @param userId - User id
 */
async function fetchUserStatus(userId: string): Promise<IUserStatus> {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (!(getCapabilities() as any)?.user_status?.enabled || !getCurrentUser()) {
			return {}
		}
		const { data } = await axios.get(generateOcsUrl('/apps/user_status/api/v1/statuses/{userId}', { userId }))
		return data.ocs?.data ?? {}
	} catch (e) {
		logger.debug('Failed to load user status for hovercard', { error: e, userId })
		return {}
	}
}
</script>

<template>
	<div
		class="profile-hover-card"
		:class="{ 'profile-hover-card--limited': !showLoading && !!profileData && !error && !profileEnabled }"
		role="dialog"
		:aria-label="t('Profile of {user}', { user: resolvedDisplayName })">
		<div v-if="showLoading" class="profile-hover-card__loading">
			<NcLoadingIcon :size="32" :name="t('Loading profile')" />
		</div>

		<template v-else-if="profileData && !error">
			<!-- Header band: name, pronouns, status (mirrors ProfileApp.vue) -->
			<div class="profile-hover-card__header">
				<NcButton
					v-if="isCurrentUser"
					class="profile-hover-card__header__edit"
					variant="tertiary"
					:aria-label="t('Edit profile')"
					:title="t('Edit profile')"
					:href="settingsUrl"
					target="_blank">
					<template #icon>
						<PencilIcon :size="20" />
					</template>
				</NcButton>
				<div class="profile-hover-card__header__container">
					<component
						:is="profileUrl ? 'a' : 'div'"
						v-if="isMobile"
						class="profile-hover-card__header__container__avatar"
						:class="{ 'profile-hover-card__profile-link': !!profileUrl }"
						v-bind="profileLinkProps">
						<NcAvatar
							class="avatar"
							:user="profileData.userId"
							:displayName="resolvedDisplayName"
							:size="96"
							disableMenu
							disableTooltip
							:preloadedUserStatus="avatarUserStatus"
							:isNoUser="!profileData.isUserAvatarVisible" />
					</component>
					<div
						v-else
						class="profile-hover-card__header__container__placeholder" />
					<div class="profile-hover-card__header__container__identity">
						<div class="profile-hover-card__header__container__displayname">
							<a
								v-if="profileUrl"
								class="profile-hover-card__profile-link"
								:href="profileUrl">
								<h2>{{ resolvedDisplayName }}</h2>
							</a>
							<h2 v-else>{{ resolvedDisplayName }}</h2>
							<span
								v-if="profileData.pronouns"
								class="profile-hover-card__header__container__pronoun-separator">·</span>
							<span
								v-if="profileData.pronouns"
								class="profile-hover-card__header__container__pronouns">{{ profileData.pronouns }}</span>
						</div>
						<div
							v-if="userStatus.icon || userStatus.message"
							class="profile-hover-card__header__container__status">
							<span class="profile-hover-card__header__container__status-content">
								<span>{{ userStatus.icon }} {{ userStatus.message }}</span>
							</span>
						</div>
					</div>
				</div>
			</div>

			<div class="profile-hover-card__body">
				<div class="profile-hover-card__content">
					<!-- Sidebar: avatar + actions (mirrors ProfileApp.vue) -->
					<div class="profile-hover-card__sidebar">
						<component
							:is="profileUrl ? 'a' : 'div'"
							v-if="!isMobile"
							:class="{ 'profile-hover-card__profile-link': !!profileUrl }"
							v-bind="profileLinkProps">
							<NcAvatar
								class="avatar"
								:user="profileData.userId"
								:displayName="resolvedDisplayName"
								:size="135"
								disableMenu
								disableTooltip
								:preloadedUserStatus="avatarUserStatus"
								:isNoUser="!profileData.isUserAvatarVisible" />
						</component>

						<div class="user-actions">
							<div
								v-if="actionsLoading && resolvedActions.length === 0"
								class="user-actions__loading">
								<NcLoadingIcon :size="20" :name="t('Loading actions')" />
							</div>
							<template v-else>
								<NcButton
									v-if="primaryAction"
									variant="primary"
									class="user-actions__primary"
									v-bind="primaryActionButtonProps"
									@click="primaryAction.onClick">
									<template v-if="primaryAction.iconSvg || primaryAction.icon" #icon>
										<NcIconSvgWrapper
											v-if="primaryAction.iconSvg"
											:svg="primaryAction.iconSvg" />
										<img
											v-else-if="isIconUrl(primaryAction.icon)"
											:src="primaryAction.icon"
											alt=""
											class="user-actions__primary__icon">
										<span
											v-else
											aria-hidden="true"
											class="user-actions__primary__icon-class"
											:class="primaryAction.icon" />
									</template>
									{{ actionDisplayText(primaryAction) }}
								</NcButton>
								<NcActions
									v-if="otherActions.length > 0"
									class="user-actions__other"
									:inline="isMobile ? 5 : 4">
									<component
										:is="otherActionComponent(action)"
										v-for="(action, index) in otherActions"
										:key="action.id || action.href || index"
										v-bind="otherActionProps(action)">
										<template v-if="action.iconSvg || action.icon" #icon>
											<NcIconSvgWrapper
												v-if="action.iconSvg"
												:svg="action.iconSvg" />
											<img
												v-else-if="isIconUrl(action.icon)"
												:src="action.icon"
												alt=""
												class="user-actions__other__icon">
											<span
												v-else
												aria-hidden="true"
												class="user-actions__other__icon-class"
												:class="action.icon" />
										</template>
										{{ actionDisplayText(action) }}
									</component>
								</NcActions>
							</template>
						</div>
					</div>

					<!-- Content blocks: details + bio (mirrors ProfileApp.vue) -->
					<div
						v-if="profileEnabled"
						class="profile-hover-card__blocks">
						<div
							v-if="profileData.organisation || profileData.role || profileData.address || localTimeLabel"
							class="profile-hover-card__blocks-details">
							<div v-if="profileData.organisation || profileData.role" class="detail">
								<p>
									<BriefcaseIcon
										class="detail-icon"
										:size="16"
										title="" />
									{{ profileData.organisation }} <span v-if="profileData.organisation && profileData.role">•</span> {{ profileData.role }}
								</p>
							</div>
							<div v-if="profileData.address" class="detail">
								<p>
									<MapMarkerIcon
										class="detail-icon"
										:size="16"
										title="" />
									{{ profileData.address }}
								</p>
							</div>
							<div v-if="localTimeLabel" class="detail">
								<p>
									<ClockIcon
										class="detail-icon"
										:size="16"
										title="" />
									{{ localTimeLabel }}
								</p>
							</div>
						</div>
						<template v-if="profileData.headline || profileData.biography">
							<h3 v-if="profileData.headline" class="profile-hover-card__blocks-headline">
								{{ profileData.headline }}
							</h3>
							<div v-if="profileData.biography" class="profile-hover-card__blocks-biography">
								<NcRichText :text="profileData.biography" useExtendedMarkdown />
							</div>
						</template>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
// Card-scaled mirror of apps/profile ProfileApp.vue layout
$card-width: 560px;
$card-height: 300px;
$header-height: 127px;
$sidebar-width: 180px;

.profile-hover-card {
	box-sizing: border-box;
	position: relative;
	width: $card-width;
	max-width: min(#{$card-width}, 90vw);
	min-height: $card-height;
	overflow: hidden;
	color: var(--color-main-text);
	background-color: var(--color-main-background);
	border-radius: var(--border-radius-large);
	display: flex;
	flex-direction: column;

	&__profile-link {
		color: inherit;
		text-decoration: none;
		outline-offset: 2px;

		&:hover,
		&:focus-visible {
			h2 {
				text-decoration: underline;
			}
		}
	}

	&__header {
		display: flex;
		flex-shrink: 0;
		position: relative;
		height: $header-height;
		background-color: var(--color-primary-element-light);

		&__edit {
			position: absolute;
			inset-block-start: 8px;
			inset-inline-end: 8px;
			z-index: 1;
		}

		&__container {
			align-self: flex-end;
			display: flex;
			align-items: flex-end;
			// Match sidebar margin-inline-end so name/status line up with role/bio
			gap: 12px;
			width: 100%;
			margin: 8px 0;
			padding-inline: 16px;
			box-sizing: border-box;

			&__placeholder {
				flex: 0 0 $sidebar-width;
				width: $sidebar-width;
			}

			&__avatar {
				flex-shrink: 0;
			}

			&__identity {
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: flex-start;
				gap: 4px;
				min-width: 0;
				flex: 1;
				padding-inline: 0;
			}

			&__displayname {
				display: flex;
				align-items: baseline;
				gap: 8px;
				min-width: 0;

				h2 {
					font-size: 24px;
					margin: 0;
					overflow-wrap: anywhere;
				}
			}

			&__pronouns {
				font-size: 15px;
				color: var(--color-text-maxcontrast);
			}

			&__status {
				min-width: 0;
			}

			&__status-content {
				display: flex;
				align-items: center;
				gap: 8px;
				font-size: 14px;
				overflow-wrap: anywhere;
			}
		}
	}

	&__body {
		flex: 1;
		min-height: 0;
		background-color: var(--color-main-background);
	}

	&__content {
		display: flex;
		width: 100%;
		height: 100%;
		padding-inline: 16px 16px;
		box-sizing: border-box;
	}

	&__sidebar {
		align-self: flex-start;
		padding-top: 8px;
		width: $sidebar-width;
		min-width: $sidebar-width;
		margin-block: -100px 0;
		margin-inline: 0 12px;
	}

	&__header,
	&__sidebar {
		// Specificity hack is needed to override Avatar component styles
		:deep(.avatar.avatardiv) {
			text-align: center;
			margin: auto;
			display: block;
			padding: 8px;

			.avatardiv__user-status {
				inset-inline-end: 10px;
				bottom: 10px;
				width: 26px;
				height: 26px;
				background-size: 22px;
				border: none;
				background-color: var(--color-main-background);
				line-height: 26px;
				font-size: 16px;
			}
		}
	}

	&__blocks {
		margin: 12px 0 12px 0;
		display: grid;
		gap: 8px 0;
		min-width: 0;
		flex: 1;
		overflow: hidden;
		align-content: start;

		p, h3 {
			overflow-wrap: anywhere;
		}

		&-details {
			display: flex;
			flex-direction: column;
			gap: 2px 0;

			.detail {
				display: inline-block;
				color: var(--color-text-maxcontrast);
				font-size: 14px;

				p .detail-icon {
					display: inline-block;
					vertical-align: middle;
				}
			}
		}

		&-headline {
			margin-inline: 0;
			margin-block: 4px 0;
			font-weight: bold;
			font-size: 16px;
		}

		&-biography {
			overflow: hidden;
			font-size: 14px;
			line-height: 1.4;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 4;
			line-clamp: 4;
			text-overflow: ellipsis;
			overflow-wrap: anywhere;

			:deep(p) {
				margin: 0;
			}
		}
	}

	&__loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: $card-height;
		padding: 16px;
		color: var(--color-text-maxcontrast);
	}

	// Avatar + name (+ actions) only — drop the empty content column height
	&--limited {
		min-height: 0;

		.profile-hover-card__body {
			flex: 0 0 auto;
		}

		.profile-hover-card__content {
			height: auto;
			padding-block-end: 24px;
		}

		.profile-hover-card__sidebar {
			margin-block-end: 0;
		}

		.user-actions {
			margin-top: 8px;
		}
	}
}

.user-actions {
	display: flex;
	flex-direction: column;
	gap: 8px 0;
	margin-top: 12px;
	max-width: $sidebar-width;

	&__loading {
		display: flex;
		justify-content: center;
		padding: 8px 0;
	}

	&__primary {
		margin: 0 auto;
		width: $sidebar-width !important;

		&__icon {
			height: 20px;
			width: 20px;
			object-fit: contain;
			filter: var(--primary-invert-if-dark);
		}

		&__icon-class {
			display: block;
			height: 20px;
			width: 20px;
			background-size: 20px;
			background-repeat: no-repeat;
			background-position: center;
			filter: var(--primary-invert-if-dark);
		}
	}

	&__other {
		display: flex;
		justify-content: center;
		gap: 0 4px;

		&__icon {
			height: 20px;
			width: 20px;
			object-fit: contain;
			filter: var(--background-invert-if-dark);
			align-self: center;
			margin: 8px; // compact 44px-ish hit target for the card
		}

		&__icon-class {
			display: block;
			height: 20px;
			width: 20px;
			margin: 8px;
			background-size: 20px;
			background-repeat: no-repeat;
			background-position: center;
			filter: var(--background-invert-if-dark);
		}
	}
}

// Mobile layout — uses MOBILE_SMALL_BREAKPOINT (512px), same as useIsSmallMobile()
@media only screen and (max-width: 512px) {
	.profile-hover-card {
		width: min(#{$card-width}, calc(100vw - 24px));
		max-width: calc(100vw - 24px);
		height: auto;
		min-height: 0;
		max-height: min(80vh, 520px);
		overflow: auto;

		&__header {
			height: auto;
			min-height: 112px;

			&__container {
				align-self: flex-end;
				align-items: flex-end;
				gap: 16px;
				margin: 12px auto;
				padding-inline: 12px;

				&__avatar {
					align-self: flex-end;
				}

				&__identity {
					gap: 6px;
					padding-inline: 0;
					// Stack from the bottom: name, then pronouns, then status
					justify-content: flex-end;
				}

				&__displayname {
					flex-direction: column;
					align-items: flex-start;
					gap: 4px;

					h2 {
						font-size: 20px;
					}
				}

				&__pronouns {
					font-size: 16px;
				}

				&__pronoun-separator {
					display: none;
				}

				&__status-content {
					font-size: 16px;
				}
			}
		}

		&__content {
			display: block;
			height: auto;
			padding-inline: 12px;
			padding-block-end: 12px;
		}

		&__sidebar {
			margin: unset;
			width: auto;
			min-width: 0;
			padding-top: 0;
		}

		&__blocks {
			width: unset;
			margin: 0;
			padding: 8px 4px 12px;
		}

		&__header,
		&__sidebar {
			:deep(.avatar.avatardiv) {
				.avatardiv__user-status {
					inset-inline-end: 0;
					bottom: 0;
				}
			}
		}

		&__loading {
			min-height: 200px;
		}

		// Disabled profile: avatar + name are in the header; no content blocks
		&--limited {
			.profile-hover-card__body {
				display: none;
			}
		}
	}

	.user-actions {
		width: unset;
		max-width: none;
		margin: 8px auto 0;
		padding: 0 4px;

		&__primary {
			width: 100% !important;
			max-width: 220px;
		}

		&__other {
			flex-wrap: wrap;
		}
	}
}

@media only screen and (max-width: 480px) {
	.profile-hover-card {
		width: calc(100vw - 16px);
		max-width: calc(100vw - 16px);
		border-radius: var(--border-radius);

		&__header {
			&__container {
				gap: 8px;
				padding-inline: 8px;
			}
		}
	}
}
</style>

<docs>

### Description

`NcProfileHoverCard` is the **content** of a profile popover. It is not a trigger and does not wrap `NcPopover`.

When `open` becomes `true`, the card loads the user's profile and user status itself.
The card content is shown only after both are ready (or preloaded), so status does not flash in late.
If the profile is disabled or unavailable, the card still shows avatar, display name, status, and actions
instead of an error.
Pass `profile` to skip the profile request.
Pass `displayName` when already known to skip the `/displaynames` lookup for limited profiles;
otherwise the card fetches it when the full profile cannot be loaded.
Pass `preloadedUserStatus` to skip the status request (e.g. when `NcAvatar` already loaded it).

`NcAvatar` already hosts this card on hover or focus for real users (unless `disable-menu` is set)
and can pass contacts menu actions via `actions` / `actions-loading`.
If `actions` is omitted, actions from the profile API are used.

### With NcAvatar

```vue
	<NcAvatar user="alice" display-name="Alice" />
```

### Standalone as popover content

Bind `open` to the popover visibility so data is loaded only while the card is shown.

```vue
<template>
	<NcPopover v-model:shown="shown"
		:triggers="['hover', 'focus', 'click']"
		:popover-triggers="['hover']"
		:delay="{ show: 400, hide: 200 }"
		no-focus-trap
		popup-role="dialog">
		<template #trigger>
			<span tabindex="0">Hover me</span>
		</template>
		<NcProfileHoverCard user="alice" :open="shown" />
	</NcPopover>
</template>
<script>
export default {
	data() {
		return {
			shown: false,
		}
	},
}
</script>
```

</docs>
