<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 22 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="block shrink-0"
    aria-hidden="true"
  >
    <template v-if="name === 'home'">
      <path d="M4 11.2 12 4.8l8 6.4V20a1 1 0 0 1-1 1h-5v-5.5H10V21H5a1 1 0 0 1-1-1v-8.8Z" />
    </template>
    <template v-else-if="name === 'decode' || name === 'chat'">
      <path d="M5 6.2h14v8.4H9.2L5 18.4V6.2Z" />
      <path d="M8.2 9.6h7.6M8.2 12.4h5" />
    </template>
    <template v-else-if="name === 'sandbox'">
      <circle cx="12" cy="12" r="8" />
      <path d="m14.8 9.2-1.7 4.6-4.6 1.7 1.7-4.6 4.6-1.7Z" />
    </template>
    <template v-else-if="name === 'dict'">
      <path d="M12 6v13" />
      <path d="M12 6H7.2A2.2 2.2 0 0 0 5 8.2V17A2 2 0 0 1 7.2 16H12" />
      <path d="M12 6h4.8A2.2 2.2 0 0 1 19 8.2V17a2 2 0 0 0-2.2-1H12" />
    </template>
    <template v-else-if="name === 'me'">
      <circle cx="12" cy="8.5" r="2.6" />
      <path d="M6.2 19c.7-2.7 2.8-4.2 5.8-4.2s5.1 1.5 5.8 4.2" />
    </template>
    <template v-else-if="name === 'droplet'">
      <path d="M12 3.2S17.2 8.6 17.2 12.4a5.2 5.2 0 0 1-10.4 0C6.8 8.6 12 3.2 12 3.2Z" />
    </template>
    <template v-else-if="name === 'leaf'">
      <path d="M5 19c7-.6 11-6.5 13.5-13.5C12 7 7 11.5 5 19Z" />
      <path d="M9 15c1.6-1.6 3.4-3.2 5.5-4.6" />
    </template>
    <template v-else-if="name === 'spark'">
      <path d="M12 3.5c.4 3.2 1.6 5 4.8 5.6-3.2.6-4.4 2.4-4.8 5.6-.4-3.2-1.6-5-4.8-5.6 3.2-.6 4.4-2.4 4.8-5.6Z" />
    </template>
    <template v-else-if="name === 'pause'">
      <circle cx="12" cy="12" r="8" />
      <path d="M10 9.5v5M14 9.5v5" />
    </template>
    <template v-else-if="name === 'image'">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <path d="m4.5 16 4-3.4 2.7 2.3 2.3-1.9 5.8 4.4" />
    </template>
    <template v-else-if="name === 'chevron'">
      <path d="m9 5 7 7-7 7" />
    </template>
    <template v-else-if="name === 'chevron-left'">
      <path d="m15 5-7 7 7 7" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6" />
      <path d="m15.5 15.5 3.5 3.5" />
    </template>
    <template v-else-if="name === 'send'">
      <path d="M5 12h12" />
      <path d="m13 7 5 5-5 5" />
    </template>
    <template v-else-if="name === 'moon'">
      <path d="M16 14.6A6.4 6.4 0 0 1 9.4 6 6.6 6.6 0 1 0 16 14.6Z" />
    </template>
    <template v-else-if="name === 'paper'">
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.6V8h4.2" />
      <path d="M9 12h6M9 16h4" />
    </template>
    <template v-else-if="name === 'phone'">
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M11 18h2" />
    </template>
    <template v-else-if="name === 'quiet'">
      <path d="M5 6.5h14v8.2H9.2L5 18.2V6.5Z" />
      <path d="M8.4 10.6h1.4M11.3 10.6h1.4M14.2 10.6h1.4" />
    </template>
    <template v-else-if="name === 'mood'">
      <circle cx="12" cy="12" r="8" />
      <circle cx="9" cy="10.5" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10.5" r="0.7" fill="currentColor" stroke="none" />
      <path d="M8.8 14.2c.9 1.3 2 2 3.2 2s2.3-.7 3.2-2" />
    </template>
    <template v-else-if="name === 'game'">
      <rect x="3.5" y="8" width="17" height="9" rx="4.5" />
      <path d="M8 11v4M6 13h4" />
      <circle cx="15.4" cy="12" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="17.3" cy="14.1" r="0.7" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'star'">
      <path d="m12 3.8 2.1 4.8 5.1.5-3.9 3.5 1.2 5-4.5-2.5-4.5 2.5 1.2-5L4.8 9.1l5.1-.5L12 3.8Z" />
    </template>
    <template v-else-if="name === 'campus'">
      <path d="m3 10 9-5 9 5-9 5-9-5Z" />
      <path d="M7 12v3.8c1.5 1.1 3.1 1.7 5 1.7s3.5-.6 5-1.7V12" />
    </template>
    <template v-else-if="name === 'people'">
      <circle cx="9" cy="9" r="2.2" />
      <circle cx="16" cy="9.5" r="1.7" />
      <path d="M4.8 18.2c.5-2.3 2.2-3.5 4.2-3.5s3.7 1.2 4.2 3.5" />
      <path d="M13.2 15.2c.7-.4 1.5-.6 2.4-.6 1.5 0 2.8.8 3.4 2.4" />
    </template>
    <template v-else-if="name === 'pen'">
      <path d="m14.5 4.5 5 5L9 20H4v-5l10.5-10.5Z" />
      <path d="m12.5 6.5 5 5" />
    </template>
    <template v-else-if="name === 'door'">
      <path d="M8 3.8h8.2V16H8Z" />
      <path d="M5 19.5h14" />
      <circle cx="14.2" cy="10" r="0.7" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'coin'">
      <circle cx="12" cy="12" r="8" />
      <path d="m9 10.5 3 3 3-3" />
      <path d="M12 13.5V17M9.5 14.6h5M9.5 16.2h5" />
    </template>
    <template v-else-if="name === 'balance'">
      <path d="M4 17h16" />
      <path d="M6 17V12h2.4V17M10.8 17V7h2.4V17M15.6 17v-5h2.4V17" />
    </template>
    <template v-else-if="name === 'heart'">
      <path d="M12 18.2s-6-3.5-6-7.6a3.3 3.3 0 0 1 6-1.7 3.3 3.3 0 0 1 6 1.7c0 4.1-6 7.6-6 7.6Z" />
    </template>
    <template v-else-if="name === 'back'">
      <path d="M15 12H7" />
      <path d="m10 8-4 4 4 4" />
    </template>
    <template v-else-if="name === 'alert'">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5" />
      <circle cx="12" cy="15.6" r="0.7" fill="currentColor" stroke="none" />
    </template>
  </svg>
</template>
