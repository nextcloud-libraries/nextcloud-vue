<template>
	<div class="wrapper">
		<!-- Style selector -->
		<div class="grid">
			<NcCheckboxRadioSwitch v-model="style"
				value="text"
				name="style"
				type="radio">
				Text only
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="style"
				value="icon"
				name="style"
				type="radio">
				Icon only
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="style"
				value="icontext"
				name="style"
				type="radio">
				Icon and text
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="disabled" type="checkbox">
				Disabled
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="size"
				value="small"
				name="size"
				type="radio">
				Small
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="size"
				value="normal"
				name="size"
				type="radio">
				Normal (default)
			</NcCheckboxRadioSwitch>
			<NcCheckboxRadioSwitch v-model="size"
				value="large"
				name="size"
				type="radio">
				Large
			</NcCheckboxRadioSwitch>
		</div>

		<h5>Standard buttons</h5>
		<div class="grid">
			<p>Tertiary, no background</p>
			<p>Tertiary</p>
			<p>Secondary</p>
			<p>Primary</p>
			<NcButton aria-label="Example text"
				:disabled="disabled"
				:size="size"
				type="tertiary-no-background">
				<template v-if="style.indexOf('icon') !== -1" #icon>
					<IconVideo :size="20" />
				</template>
				<template v-if="style.indexOf('text') !== -1">
					Example text
				</template>
			</NcButton>
			<NcButton aria-label="Example text"
				:disabled="disabled"
				:size="size"
				type="tertiary">
				<template v-if="style.indexOf('icon') !== -1" #icon>
					<IconVideo :size="20" />
				</template>
				<template v-if="style.indexOf('text') !== -1">
					Example text
				</template>
			</NcButton>
			<NcButton aria-label="Example text"
				:disabled="disabled"
				:size="size">
				<template v-if="style.indexOf('icon') !== -1" #icon>
					<IconVideo :size="20" />
				</template>
				<template v-if="style.indexOf('text') !== -1">
					Example text
				</template>
			</NcButton>
			<NcButton aria-label="Example text"
				:disabled="disabled"
				:size="size"
				type="primary">
				<template v-if="style.indexOf('icon') !== -1" #icon>
					<IconVideo :size="20" />
				</template>
				<template v-if="style.indexOf('text') !== -1">
					Example text
				</template>
			</NcButton>
		</div>

		<!-- Wide button -->
		<h5>Wide button</h5>
		<NcButton :disabled="disabled"
			:size="size"
			:wide="true"
			text="Example text">
			<template #icon>
				<IconVideo :size="20" />
			</template>
			Example text
		</NcButton>

		<!-- Special buttons -->
		<h5>Special buttons</h5>
		<div class="grid">
			<p>Success</p>
			<p>Warning</p>
			<p>Error</p>
			<p> - </p>
			<NcButton :disabled="disabled"
				:size="size"
				type="success">
				<template #icon>
					<IconVideo :size="20" />
				</template>
				Example text
			</NcButton>
			<NcButton :disabled="disabled"
				:size="size"
				type="warning">
				<template #icon>
					<IconVideo :size="20" />
				</template>
				Example text
			</NcButton>
			<NcButton :disabled="disabled"
				:size="size"
				type="error">
				<template #icon>
					<IconVideo :size="20" />
				</template>
				Example text
			</NcButton>
			<p> - </p>
		</div>
	</div>
</template>
<script>
import NcButton from '../NcButton.vue'
import NcCheckboxRadioSwitch from '../../NcCheckboxRadioSwitch/index.js'
import IconVideo from 'vue-material-design-icons/Video.vue'

export default {
	components: {
		IconVideo,
		NcButton,
		NcCheckboxRadioSwitch,
	},
	data() {
		return {
			toggled: false,
			disabled: false,
			size: 'normal',
			style: 'icontext',
		}
	},
}
</script>

<style lang="scss" scoped>
.wrapper {
    padding: 0 12px;
}

.grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: repeat(auto-fill, auto);
    position: relative;
    margin: 12px 0;
}

h5 {
    font-weight: bold;
    margin: 40px 0 20px 0;
}

p {
    text-align: center;
    margin: 4px 0 12px 0;
    color: var(--color-text-maxcontrast)
}

button {
    margin: auto;
}
</style>
