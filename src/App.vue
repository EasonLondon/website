<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()
const showNav = computed(() => route.name !== 'cooldown')
</script>

<template>
  <div class="min-h-dvh bg-[radial-gradient(900px_420px_at_50%_-10%,#e4eee4,transparent),#c5d0c2]">
    <div class="relative mx-auto min-h-dvh w-full max-w-[430px] overflow-x-clip bg-paper shadow-[0_0_80px_rgba(62,86,72,0.16)]">
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(255,255,255,0.95),transparent)]"
      />
      <div class="relative">
        <RouterView v-slot="{ Component }">
          <KeepAlive :include="['HomeView', 'DecoderView', 'SandboxChatView', 'DictView', 'ProfileView']">
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </div>
      <BottomNav v-if="showNav" />
    </div>
  </div>
</template>
