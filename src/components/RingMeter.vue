<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{ value: number }>()

const pop = ref(0)
watch(
  () => props.value,
  () => {
    pop.value += 1
  },
)

const radius = 30
const circ = 2 * Math.PI * radius
const offset = computed(() => circ * (1 - Math.min(100, Math.max(0, props.value)) / 100))

const color = computed(() => {
  const stops: Array<[number, number[]]> = [
    [0, [95, 122, 104]],
    [0.55, [104, 132, 98]],
    [0.78, [196, 146, 74]],
    [1, [178, 58, 46]],
  ]
  const t = Math.min(1, Math.max(0, props.value / 100))
  let index = 0
  while (index < stops.length - 2 && t > stops[index + 1][0]) index += 1
  const [start, from] = stops[index]
  const [end, to] = stops[index + 1]
  const amount = (t - start) / (end - start)
  const rgb = from.map((channel, channelIndex) =>
    Math.round(channel + (to[channelIndex] - channel) * amount),
  )
  return `rgb(${rgb.join(',')})`
})
</script>

<template>
  <div class="relative h-[78px] w-[78px] shrink-0" :aria-label="`防线指数 ${value}%`">
    <svg viewBox="0 0 76 76" class="h-full w-full" aria-hidden="true">
      <circle cx="38" cy="38" r="30" fill="none" stroke="#e6eee6" stroke-width="6" />
      <circle
        class="ring-value"
        cx="38"
        cy="38"
        r="30"
        fill="none"
        stroke-width="6"
        stroke-linecap="round"
        :stroke="color"
        :stroke-dasharray="circ"
        :stroke-dashoffset="offset"
        transform="rotate(-90 38 38)"
      />
    </svg>
    <div class="absolute inset-0 grid place-items-center">
      <p class="leading-none tabular" :style="{ color }">
        <span :key="pop" class="num-pop text-[20px] font-medium">{{ value }}</span>
        <span class="text-[10px]">%</span>
      </p>
    </div>
  </div>
</template>
