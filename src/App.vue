<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()
const showNav = computed(() => route.name !== 'cooldown')
</script>

<template>
  <div class="min-h-dvh bg-[#d5ddd0]">
    <div class="relative mx-auto min-h-dvh w-full max-w-[430px] bg-paper">
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="['HomeView', 'DecoderView', 'SandboxChatView', 'DictView', 'ProfileView']">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
      <BottomNav v-if="showNav" />
    </div>
  </div>
</template>
