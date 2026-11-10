<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    min?: number
    max?: number
    unit?: string
    size?: 'lg' | 'sm'
  }>(),
  { min: 50, max: 90, unit: '°C', size: 'lg' },
)

const pop = ref(0)
watch(
  () => props.value,
  () => {
    pop.value += 1
  },
)

const cx = 120
const cy = 118
const radius = 86
const length = Math.PI * radius

const ratio = computed(() => {
  const span = props.max - props.min || 1
  return Math.min(1, Math.max(0, (props.value - props.min) / span))
})

const offset = computed(() => length * (1 - ratio.value))

const ticks = computed(() => {
  const marks = []
  for (let mark = props.min; mark <= props.max; mark += 10) {
    const t = (mark - props.min) / (props.max - props.min)
    const angle = Math.PI * (1 - t)
    const inner = radius + 10
    const outer = radius + 18
    const label = radius + 28
    marks.push({
      mark,
      label: mark === props.min || mark === props.max || mark === 70,
      x1: cx + inner * Math.cos(angle),
      y1: cy - inner * Math.sin(angle),
      x2: cx + outer * Math.cos(angle),
      y2: cy - outer * Math.sin(angle),
      lx: cx + label * Math.cos(angle),
      ly: cy - label * Math.sin(angle) + 4,
    })
  }
  return marks
})
</script>

<template>
  <div class="relative mx-auto w-full" :class="size === 'lg' ? 'max-w-[320px]' : 'max-w-[230px]'">
    <svg viewBox="-8 0 256 164" class="w-full overflow-visible" aria-hidden="true">
      <path
        d="M34 118A86 86 0 0 1 206 118"
        fill="none"
        stroke="#e4ece6"
        stroke-width="12"
        stroke-linecap="round"
      />
      <path
        class="arc-value"
        d="M34 118A86 86 0 0 1 206 118"
        fill="none"
        stroke="#5f7a68"
        stroke-width="12"
        stroke-linecap="round"
        :stroke-dasharray="length"
        :stroke-dashoffset="offset"
      />
      <line
        v-for="tick in ticks"
        :key="tick.mark"
        :x1="tick.x1"
        :y1="tick.y1"
        :x2="tick.x2"
        :y2="tick.y2"
        stroke="#9aafa2"
        stroke-width="1.4"
        stroke-linecap="round"
      />
      <text
        v-for="tick in ticks.filter((item) => item.label)"
        :key="`label-${tick.mark}`"
        :x="tick.lx"
        :y="tick.ly"
        text-anchor="middle"
        fill="#5f7a68"
        font-size="11"
      >
        {{ tick.mark }}
      </text>
    </svg>
    <div
      class="pointer-events-none absolute inset-x-0 text-center"
      :class="size === 'lg' ? 'top-[46%]' : 'top-[44%]'"
    >
      <p
        class="font-medium leading-none tabular text-ink"
        :class="size === 'lg' ? 'text-[64px]' : 'text-[40px]'"
      >
        <span :key="pop" class="num-pop">{{ value }}</span>
      </p>
      <p class="mt-1 text-[12px] tracking-[0.2em] text-moss">{{ unit }}</p>
    </div>
  </div>
</template>
