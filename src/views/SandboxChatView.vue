<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { defenseNote, getConflict, replyAsTeen, toneLabel, type ConflictDetail } from '../services/ai'
import { useProfile } from '../composables/useProfile'
import { useWarmth } from '../composables/useWarmth'
import Mark from '../components/Mark.vue'
import RingMeter from '../components/RingMeter.vue'

defineOptions({ name: 'SandboxChatView' })

interface Bubble {
  id: number
  role: 'child' | 'parent'
  text: string
  landmine?: string
}

const route = useRoute()
const { tags } = useProfile()
const { nudge } = useWarmth()

const scene = ref<ConflictDetail | null>(null)
const messages = ref<Bubble[]>([])
const defense = ref(0)
const defenseText = ref('')
const draft = ref('')
const loading = ref(false)
const eased = ref(false)
const scroller = ref<HTMLElement | null>(null)
let ticket = 0
let seed = 0

const sceneId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const tone = computed(() => toneLabel(tags.value))
const rehearsed = computed(() => messages.value.filter((item) => item.landmine).length)
const sent = computed(() => messages.value.some((item) => item.role === 'parent'))

function uid() {
  seed += 1
  return seed
}

function reset() {
  ticket += 1
  loading.value = false
  eased.value = false
  draft.value = ''
  const current = getConflict(sceneId.value)
  scene.value = current ?? null
  defense.value = current?.startDefense ?? 0
  defenseText.value = current ? defenseNote(current.startDefense) : ''
  messages.value = current ? [{ id: uid(), role: 'child', text: current.opening }] : []
}

async function speak(line: string) {
  if (!scene.value || loading.value) return
  const parentLine = line.trim()
  if (!parentLine) return
  const current = ++ticket
  const turnIndex = messages.value.filter((item) => item.role === 'parent').length
  const baseline = scene.value.startDefense
  messages.value.push({ id: uid(), role: 'parent', text: parentLine })
  draft.value = ''
  loading.value = true
  const result = await replyAsTeen({
    sceneId: scene.value.id,
    parentLine,
    turnIndex,
    defense: defense.value,
    tags: [...tags.value],
  })
  if (current !== ticket) return
  loading.value = false
  defense.value = result.defense
  defenseText.value = result.defenseNote
  messages.value.push({
    id: uid(),
    role: 'child',
    text: result.reply,
    landmine: result.landmine,
  })
  if (!eased.value && result.defense + 8 < baseline) {
    eased.value = true
    nudge(1)
  }
}

watch(sceneId, () => reset(), { immediate: true })

watch(
  () => messages.value.length + (loading.value ? 1 : 0),
  async () => {
    await nextTick()
    const el = scroller.value
    if (el) el.scrollTop = el.scrollHeight
  },
)
</script>

<template>
  <div v-if="scene" class="flex h-dvh flex-col overflow-hidden">
    <header class="shrink-0 border-b border-moss/10 px-4 pb-3 pt-4">
      <div class="flex items-start gap-3">
        <div class="min-w-0 flex-1">
          <RouterLink to="/sandbox" class="inline-flex min-h-10 items-center gap-0.5 text-[14px] text-moss-deep">
            <Mark name="chevron-left" :size="16" />
            场景
          </RouterLink>
          <h1 class="truncate text-[22px] font-medium leading-tight">{{ scene.title }}</h1>
          <p class="caption mt-1">防线指数</p>
          <p class="mt-0.5 text-[15px] leading-snug">{{ defenseText }}</p>
          <p class="mt-1 text-[12px] text-moss">{{ tone }}</p>
          <RouterLink v-if="defense >= 82" to="/cooldown" class="mt-1 inline-block text-[14px] text-emergency underline">
            防线很高，可以先停三十秒
          </RouterLink>
        </div>
        <RingMeter class="mt-2" :value="defense" />
      </div>
    </header>

    <div ref="scroller" class="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
      <p class="text-[14px] leading-relaxed text-ink/65">{{ scene.setting }}</p>
      <template v-for="item in messages" :key="item.id">
        <div
          class="bubble-in max-w-[85%] rounded-[20px] px-4 py-3 leading-relaxed"
          :class="
            item.role === 'parent'
              ? 'ml-auto rounded-br-md bg-[#e5efe6]'
              : 'rounded-bl-md bg-card shadow-[0_10px_24px_-18px_rgba(62,86,72,0.7)]'
          "
        >
          {{ item.text }}
        </div>
        <div v-if="item.landmine" class="bubble-in max-w-[92%] rounded-2xl border border-clay/20 bg-sand px-4 py-3">
          <p class="eyebrow text-clay">
            <Mark name="alert" :size="14" />
            话术踩雷点
          </p>
          <p class="mt-1.5 text-[15px] leading-relaxed">{{ item.landmine }}</p>
        </div>
      </template>
      <div v-if="loading" class="max-w-[40%] rounded-[18px] bg-card px-4 py-3 text-ink/45">……</div>
      <p v-if="rehearsed >= 5" class="text-[14px] leading-relaxed text-ink/70">
        这一场可以先停在这里。
        <RouterLink to="/cooldown" class="text-moss-deep underline">如果话已经说重了，先去停三十秒。</RouterLink>
      </p>
    </div>

    <div
      class="shrink-0 border-t border-moss/10 bg-paper/95 px-4 pt-3 backdrop-blur"
      style="padding-bottom: calc(92px + env(safe-area-inset-bottom))"
    >
      <button
        v-if="!sent"
        type="button"
        class="mb-3 flex w-full items-start gap-3 rounded-[22px] border border-moss/10 bg-card px-4 py-3 text-left"
        :disabled="loading"
        @click="speak(scene.suggest)"
      >
        <Mark name="leaf" :size="18" class="mt-0.5 text-moss" />
        <span>
          <span class="eyebrow">如果不知道怎么开口</span>
          <span class="mt-1 block text-[15px] leading-relaxed">{{ scene.suggest }}</span>
        </span>
      </button>
      <form class="flex items-center gap-2" @submit.prevent="speak(draft)">
        <input
          v-model="draft"
          enterkeyhint="send"
          maxlength="200"
          autocomplete="off"
          placeholder="写下你可能会说的那句"
          class="field min-h-12 min-w-0 flex-1 rounded-full"
        />
        <button class="btn-primary min-h-12 shrink-0 px-5" :disabled="!draft.trim() || loading">发送</button>
      </form>
    </div>
  </div>

  <main v-else class="page">
    <h1 class="page-title">这个场景没有了</h1>
    <RouterLink to="/sandbox" class="btn-quiet mt-6 w-full">回到场景列表</RouterLink>
  </main>
</template>
