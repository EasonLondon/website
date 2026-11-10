<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import Mark from './Mark.vue'

const route = useRoute()

const items = [
  { to: '/', label: '首页', icon: 'home' },
  { to: '/decode', label: '解码', icon: 'decode' },
  { to: '/sandbox', label: '沙盘', icon: 'sandbox' },
  { to: '/dict', label: '词典', icon: 'dict' },
  { to: '/me', label: '我的', icon: 'me' },
] as const

function active(to: string) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <nav
    class="fixed bottom-[max(10px,env(safe-area-inset-bottom))] left-1/2 z-30 w-[min(398px,calc(100%-28px))] -translate-x-1/2 rounded-full border border-white/80 bg-card/92 shadow-[0_16px_40px_-20px_rgba(62,86,72,0.55)] backdrop-blur"
    aria-label="页面"
  >
    <ul class="grid grid-cols-5 px-1.5 py-1.5">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          :to="item.to"
          class="relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-full text-[12px]"
          :class="active(item.to) ? 'text-moss-deep' : 'text-ink/40'"
          :aria-current="active(item.to) ? 'page' : undefined"
        >
          <span
            v-if="active(item.to)"
            class="absolute inset-x-1 inset-y-1 rounded-full bg-mist"
          />
          <Mark class="relative" :name="item.icon" :size="20" />
          <span class="relative">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
