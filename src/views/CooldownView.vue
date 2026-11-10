<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getMicroAction } from '../services/ai'
import { useWarmth } from '../composables/useWarmth'
import Mark from '../components/Mark.vue'

const TOTAL = 30
const PHASE = 4

const { nudge } = useWarmth()
const action = getMicroAction(Date.now())
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const left = ref(TOTAL)
const phase = ref<'inhale' | 'exhale'>('inhale')
const scale = ref(1)
const running = ref(false)
const done = ref(false)
let startedAt = 0
let frame = 0
let credited = false

const phaseLabel = computed(() => (phase.value === 'inhale' ? '吸气' : '呼气'))

function tick(now: number) {
  const elapsed = (now - startedAt) / 1000
  const remain = Math.max(0, TOTAL - elapsed)
  left.value = remain <= 0 ? 0 : Math.ceil(remain)
  const cycle = elapsed % (PHASE * 2)
  const inhaling = cycle < PHASE
  phase.value = inhaling ? 'inhale' : 'exhale'
  const progress = inhaling ? cycle / PHASE : 1 - (cycle - PHASE) / PHASE
  scale.value = reduceMotion ? 1 : 0.86 + progress * 0.22
  if (remain <= 0) {
    finish()
    return
  }
  frame = requestAnimationFrame(tick)
}

function start() {
  if (running.value) return
  done.value = false
  running.value = true
  left.value = TOTAL
  startedAt = performance.now()
  frame = requestAnimationFrame(tick)
}

function finish() {
  running.value = false
  done.value = true
  left.value = 0
  cancelAnimationFrame(frame)
  if (!credited) {
    credited = true
    nudge(2)
  }
}

function replay() {
  cancelAnimationFrame(frame)
  running.value = false
  phase.value = 'inhale'
  scale.value = 1
  start()
}

onUnmounted(() => cancelAnimationFrame(frame))
</script>

<template>
  <main class="flex min-h-dvh flex-col px-5 pb-8 pt-6">
    <RouterLink to="/" class="inline-flex min-h-10 items-center gap-0.5 self-start text-[14px] text-moss-deep">
      <Mark name="chevron-left" :size="16" />
      先回首页
    </RouterLink>

    <p :class="running ? 'mt-5 text-[16px] leading-relaxed text-ink/70' : 'mt-6 text-[26px] font-medium leading-snug'">
      人在极度愤怒时的伤人话语，需要 3 个月来修复信任。
    </p>

    <div v-if="!running && !done" class="mt-8">
      <p class="lede">给身体三十秒。吸气四秒，呼气四秒。先别把那句话说出去。</p>
      <button type="button" class="btn-primary mt-8 w-full text-[18px]" @click="start">开始这 30 秒</button>
    </div>

    <div v-else-if="running" class="flex flex-1 flex-col items-center justify-center">
      <div class="relative grid h-64 w-64 place-items-center">
        <span
          class="absolute inset-0 rounded-full bg-moss/10"
          :style="{ transform: `scale(${scale})` }"
        />
        <span
          class="absolute inset-8 rounded-full bg-moss/15"
          :style="{ transform: `scale(${0.92 + (scale - 0.86) * 0.6})` }"
        />
        <span class="relative grid h-40 w-40 place-items-center rounded-full bg-card shadow-[0_20px_40px_-24px_rgba(62,86,72,0.7)]">
          <span class="text-[40px] font-medium">{{ phaseLabel }}</span>
        </span>
      </div>
      <p class="mt-8 text-[18px] tabular text-moss-deep" aria-live="polite">还剩 {{ left }} 秒</p>
    </div>

    <div v-else class="mt-8">
      <p class="eyebrow">三十秒，到了</p>
      <h1 class="page-title">一件很小的事</h1>
      <section class="soft-card mt-5">
        <p class="text-[22px] font-medium leading-snug">{{ action.title }}</p>
        <p class="mt-2 text-[17px] leading-relaxed">{{ action.detail }}</p>
      </section>
      <RouterLink to="/" class="btn-primary mt-5 w-full text-[17px]">我做完了，回到首页</RouterLink>
      <button type="button" class="btn-text mt-2 w-full" @click="replay">再呼吸一轮</button>
    </div>
  </main>
</template>
