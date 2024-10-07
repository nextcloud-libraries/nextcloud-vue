<template>
	<div style="display: flex; flex-direction: column; gap: 12px;">
		<NcButton aria-label="center (default)" type="secondary" wide>
			<template #icon>
				<IconLeft :size="20" />
			</template>
			center (default)
		</NcButton>
		<NcButton alignment="center-reverse"
			aria-label="center-reverse"
			type="secondary"
			wide>
			<template #icon>
				<IconRight :size="20" />
			</template>
			center-reverse
		</NcButton>
		<div style="display: flex; gap: 12px;">
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="start"
					aria-label="start"
					type="secondary"
					wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
					start
				</NcButton>
				<NcButton alignment="start-reverse"
					aria-label="start-reverse"
					type="secondary"
					wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
					start-reverse
				</NcButton>
			</div>
			<div style="display: flex; flex-direction: column; gap: 12px; flex: 1">
				<NcButton alignment="end"
					aria-label="end"
					type="secondary"
					wide>
					<template #icon>
						<IconLeft :size="20" />
					</template>
					end
				</NcButton>
				<NcButton alignment="end-reverse"
					aria-label="end-reverse"
					type="secondary"
					wide>
					<template #icon>
						<IconRight :size="20" />
					</template>
					end-reverse
				</NcButton>
			</div>
		</div>
	</div>
</template>

<script>
import NcButton from '../NcButton.vue'
import IconLeft from 'vue-material-design-icons/ArrowLeft.vue'
import IconRight from 'vue-material-design-icons/ArrowRight.vue'

export default {
	components: {
		IconLeft,
		IconRight,
		NcButton,
	},
}
</script>
