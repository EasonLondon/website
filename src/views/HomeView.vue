<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { formatToday, getDailyIcebreaker } from '../services/ai'
import { useWarmth } from '../composables/useWarmth'
import { copyText } from '../utils/copy'
import ArcMeter from '../components/ArcMeter.vue'
import Mark from '../components/Mark.vue'

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
  <main class="page rise">
    <header>
      <p class="eyebrow">{{ dateLabel }}</p>
      <h1 class="page-title">AI亲子理解助手</h1>
      <p class="lede">把一句重话，译成你听得懂的意思。</p>
    </header>

    <section class="soft-card mt-8" aria-label="今天的亲子温度">
      <p class="eyebrow">
        <Mark name="droplet" :size="14" />
        今天的亲子温度
      </p>
      <ArcMeter class="mt-2" :value="today.degrees" />
      <p class="mt-2 text-center text-[18px] leading-relaxed">{{ today.reading }}</p>
      <p class="caption mt-2 text-center">温度高一点，表示话还热着；低一点，就先别谈事情。</p>
    </section>

    <RouterLink to="/cooldown" class="btn-emergency mt-6 gap-4">
      <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/15">
        <Mark name="pause" :size="22" />
      </span>
      <span class="min-w-0 flex-1 text-left">
        <span class="block text-[18px]">我快要说重话了</span>
        <span class="mt-0.5 block text-[14px] leading-relaxed text-white/85">先离开三十秒，再决定要不要开口</span>
      </span>
    </RouterLink>

    <section class="soft-card mt-6" aria-label="今日破冰">
      <p class="eyebrow">
        <Mark name="spark" :size="14" />
        今日破冰
      </p>
      <p class="mt-4 text-[22px] font-medium leading-snug">{{ card.question }}</p>
      <p class="caption mt-3">{{ card.hint }}</p>
      <button type="button" class="btn-primary mt-5 w-full" @click="useLine">
        {{ copied ? '已放进剪贴板' : '今晚就用这句' }}
      </button>
      <button type="button" class="btn-text mt-2 w-full" @click="shift += 1">再看一句</button>
    </section>
  </main>
</template>
