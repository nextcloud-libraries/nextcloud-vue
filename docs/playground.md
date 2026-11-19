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

const NcPlayground = defineAsyncComponent(() => import('./.vitepress/theme/NcPlayground.vue'))
</script>

<ClientOnly>
	<NcPlayground />
</ClientOnly>
