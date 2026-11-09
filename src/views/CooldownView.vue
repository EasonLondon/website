<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getMicroAction } from '../services/ai'
import { useWarmth } from '../composables/useWarmth'

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
  scale.value = reduceMotion ? 1 : 0.86 + progress * 0.24
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
    <RouterLink to="/" class="min-h-10 self-start text-[15px] leading-10 text-ink/70">先回首页</RouterLink>

    <p
      class="mt-4 leading-snug"
      :class="running ? 'text-[18px]' : 'text-[28px]'"
    >
      人在极度愤怒时的伤人话语，需要 3 个月来修复信任。
    </p>

    <div v-if="!running && !done" class="mt-8">
      <p class="text-[17px] leading-relaxed text-ink/75">给身体三十秒。吸气四秒，呼气四秒。先别把那句话说出去。</p>
      <button type="button" class="mt-8 min-h-14 w-full rounded-2xl bg-moss-deep text-[18px] text-white" @click="start">
        开始这 30 秒
      </button>
    </div>

    <div v-else-if="running" class="flex flex-1 flex-col items-center justify-center">
      <div
        class="grid h-56 w-56 place-items-center rounded-full bg-[#e7eee4]"
        :style="{ transform: `scale(${scale})` }"
      >
        <span class="text-[48px]">{{ phaseLabel }}</span>
      </div>
      <p class="mt-8 text-[18px] tabular" aria-live="polite">还剩 {{ left }} 秒</p>
    </div>

    <div v-else class="mt-8">
      <p class="caption">三十秒，到了</p>
      <h1 class="mt-3 text-[28px] leading-tight">一件很小的事</h1>
      <section class="soft-card mt-4">
        <p class="text-[22px]">{{ action.title }}</p>
        <p class="mt-2 text-[17px] leading-relaxed">{{ action.detail }}</p>
      </section>
      <RouterLink
        to="/"
        class="mt-4 flex min-h-14 items-center justify-center rounded-2xl bg-moss-deep text-[18px] text-white"
      >
        我做完了，回到首页
      </RouterLink>
      <button type="button" class="mt-3 min-h-12 w-full rounded-2xl bg-mist" @click="replay">再呼吸一轮</button>
    </div>
  </main>
</template>
