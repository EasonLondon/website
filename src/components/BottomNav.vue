<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

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
    class="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-ink/10 bg-paper/95 backdrop-blur"
    aria-label="页面"
  >
    <ul class="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          :to="item.to"
          class="flex min-h-16 flex-col items-center justify-center gap-1 text-[14px]"
          :class="active(item.to) ? 'text-ink' : 'text-ink/45'"
          :aria-current="active(item.to) ? 'page' : undefined"
        >
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <template v-if="item.icon === 'home'">
              <path d="M4 11.2 12 4.5l8 6.7V20a1 1 0 0 1-1 1h-5.2v-5.6h-3.6V21H5a1 1 0 0 1-1-1v-8.8Z" />
            </template>
            <template v-else-if="item.icon === 'decode'">
              <path d="M5 6.5h14v8.2H9.2L5 18.2V6.5Z" />
              <path d="M8.2 10h7.6M8.2 12.6h5" />
            </template>
            <template v-else-if="item.icon === 'sandbox'">
              <path d="M12 19a7 7 0 1 1 7-7" />
              <path d="M12 12l4.2-3.2" />
              <path d="M12 12h.01" />
            </template>
            <template v-else-if="item.icon === 'dict'">
              <path d="M12 5.2v13.6" />
              <path d="M12 5.2H7.6A2.6 2.6 0 0 0 5 7.8v8.2A2.4 2.4 0 0 1 7.4 18.8H12" />
              <path d="M12 5.2h4.4A2.6 2.6 0 0 1 19 7.8v8.2a2.4 2.4 0 0 0-2.4 2.8H12" />
            </template>
            <template v-else>
              <circle cx="12" cy="9" r="2.7" />
              <path d="M6.4 18.8c.7-2.5 2.8-3.9 5.6-3.9s4.9 1.4 5.6 3.9" />
            </template>
          </svg>
          <span>{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
