<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { formatToday, getDailyIcebreaker } from '../services/ai'
import { useWarmth } from '../composables/useWarmth'
import { copyText } from '../utils/copy'

defineOptions({ name: 'HomeView' })

const { today } = useWarmth()
const dateLabel = formatToday()
const shift = ref(0)
const copied = ref(false)
const card = computed(() => getDailyIcebreaker(shift.value))

async function useLine() {
  const ok = await copyText(card.value.question)
  copied.value = ok
  window.setTimeout(() => {
    copied.value = false
  }, 1800)
}
</script>

<template>
  <main class="px-5 pb-28 pt-6">
    <p class="caption">{{ dateLabel }}</p>
    <h1 class="mt-2 text-[26px] leading-tight">AI亲子理解助手</h1>
    <p class="mt-2 text-[16px] leading-relaxed text-ink/75">把一句重话，译成你听得懂的意思。</p>

    <section class="soft-card mt-5" aria-label="今天的亲子温度">
      <p class="caption">今天的亲子温度</p>
      <p class="mt-2 text-[56px] leading-none tabular">
        {{ today.degrees }}<span class="ml-1 text-[20px]">°C</span>
      </p>
      <p class="mt-3 text-[17px] leading-relaxed">{{ today.reading }}</p>
      <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-mist" aria-hidden="true">
        <div class="h-full rounded-full bg-moss" :style="{ width: `${today.degrees}%` }" />
      </div>
      <p class="mt-3 text-[14px] leading-relaxed text-ink/70">温度高一点，表示话还热着；低一点，就先别谈事情。</p>
    </section>

    <RouterLink
      to="/cooldown"
      class="mt-4 flex min-h-[76px] flex-col justify-center rounded-[22px] bg-emergency px-5 py-4 text-white shadow-[0_12px_28px_rgba(178,58,46,0.24)] active:brightness-95"
    >
      <span class="text-[18px]">我快要说重话了</span>
      <span class="mt-1 text-[15px] leading-relaxed text-white/90">先离开三十秒，再决定要不要开口</span>
    </RouterLink>

    <section class="soft-card mt-4" aria-label="今日破冰">
      <p class="caption">今日破冰</p>
      <p class="mt-2 text-[20px] leading-snug">{{ card.question }}</p>
      <p class="mt-2 text-[14px] leading-relaxed text-ink/70">{{ card.hint }}</p>
      <div class="mt-4 grid grid-cols-[1fr_auto] gap-3">
        <button type="button" class="min-h-12 rounded-2xl bg-moss-deep px-3 text-white" @click="useLine">
          {{ copied ? '已放进剪贴板' : '今晚就用这句' }}
        </button>
        <button type="button" class="min-h-12 rounded-2xl bg-mist px-4" @click="shift += 1">再看一句</button>
      </div>
    </section>
  </main>
</template>
