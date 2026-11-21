---
layout: page
title: Playground
sidebar: false
aside: false
footer: false
---

<!--
 - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup>
import { defineAsyncComponent } from 'vue'

// The playground is only used in the browser, so it is not bundled for the server (SSR)
const NcPlayground = defineAsyncComponent(() => import.meta.env.SSR ? Promise.resolve({ render: () => null }) : import('./.vitepress/theme/NcPlayground.vue'))
</script>

<ClientOnly>
	<NcPlayground />
</ClientOnly>
