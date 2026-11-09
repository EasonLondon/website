import { computed, ref, watch } from 'vue'
import { getTodayTemperature } from '../services/ai'

const STORAGE_KEY = 'qinzi-warmth'

interface WarmthState {
  date: string
  delta: number
  counts: Record<string, number>
}

function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function fresh(): WarmthState {
  return {
    date: dayKey(),
    delta: 0,
    counts: { 成绩催促: 2, 手机管理: 2 },
  }
}

function read(): WarmthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fresh()
    const parsed = JSON.parse(raw) as WarmthState
    if (!parsed || parsed.date !== dayKey() || typeof parsed.delta !== 'number' || !parsed.counts) {
      return fresh()
    }
    return parsed
  } catch {
    return fresh()
  }
}

const state = ref<WarmthState>(read())

watch(
  state,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

function topTriggers(counts: Record<string, number>) {
  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh'))
    .slice(0, 2)
    .map(([label]) => label)
}

export function useWarmth() {
  const today = computed(() => getTodayTemperature(state.value.delta))
  const triggers = computed(() => topTriggers(state.value.counts))

  function nudge(amount: number) {
    state.value.delta = Math.max(-8, Math.min(8, state.value.delta + amount))
  }

  function noteScene(label: string) {
    if (!label) return
    state.value.counts[label] = (state.value.counts[label] ?? 0) + 1
  }

  return { today, triggers, nudge, noteScene }
}
