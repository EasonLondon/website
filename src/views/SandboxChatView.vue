<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { defenseNote, getConflict, replyAsTeen, toneLabel, type ConflictDetail } from '../services/ai'
import { useProfile } from '../composables/useProfile'
import { useWarmth } from '../composables/useWarmth'

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
    <header class="shrink-0 border-b border-ink/10 px-4 pb-3 pt-4">
      <div class="flex items-center gap-2">
        <RouterLink to="/sandbox" class="min-h-10 shrink-0 px-1 text-[15px] leading-10">场景</RouterLink>
        <h1 class="min-w-0 flex-1 truncate text-center text-[18px]">{{ scene.title }}</h1>
        <p class="w-16 shrink-0 text-right text-[18px] tabular">{{ defense }}%</p>
      </div>
      <p class="text-center text-[13px] text-ink/65">防线指数</p>
      <div class="mt-2 h-2 overflow-hidden rounded-full bg-mist" aria-hidden="true">
        <div
          class="h-full rounded-full bg-ink/70 transition-[width] duration-500"
          :style="{ width: `${defense}%` }"
        />
      </div>
      <p class="mt-2 text-center text-[15px]">{{ defenseText }}</p>
      <p class="text-center text-[13px] text-ink/65">{{ tone }}</p>
      <RouterLink v-if="defense >= 82" to="/cooldown" class="mt-1 block text-center text-[14px] underline">
        防线很高，可以先停三十秒
      </RouterLink>
    </header>

    <div ref="scroller" class="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
      <p class="text-[14px] leading-relaxed text-ink/70">{{ scene.setting }}</p>
      <template v-for="item in messages" :key="item.id">
        <div
          class="max-w-[85%] rounded-[18px] px-4 py-3 leading-relaxed"
          :class="
            item.role === 'parent'
              ? 'ml-auto bg-[#e3ebe3]'
              : 'bg-card shadow-[0_6px_16px_rgba(44,62,53,0.04)]'
          "
        >
          {{ item.text }}
        </div>
        <div v-if="item.landmine" class="max-w-[92%] rounded-2xl bg-mist px-4 py-3">
          <p class="caption">话术踩雷点</p>
          <p class="mt-1 text-[15px] leading-relaxed">{{ item.landmine }}</p>
        </div>
      </template>
      <div v-if="loading" class="max-w-[40%] rounded-[18px] bg-card px-4 py-3 text-ink/50">……</div>
      <p v-if="rehearsed >= 5" class="text-[14px] leading-relaxed text-ink/70">
        这一场可以先停在这里。
        <RouterLink to="/cooldown" class="underline">如果话已经说重了，先去停三十秒。</RouterLink>
      </p>
    </div>

    <div
      class="shrink-0 border-t border-ink/10 bg-paper px-4 pt-3"
      style="padding-bottom: calc(76px + env(safe-area-inset-bottom))"
    >
      <button
        v-if="!sent"
        type="button"
        class="mb-3 w-full rounded-2xl bg-mist px-4 py-3 text-left"
        :disabled="loading"
        @click="speak(scene.suggest)"
      >
        <span class="caption">如果不知道怎么开口</span>
        <span class="mt-1 block text-[15px] leading-relaxed">{{ scene.suggest }}</span>
      </button>
      <form class="flex items-center gap-2" @submit.prevent="speak(draft)">
        <input
          v-model="draft"
          enterkeyhint="send"
          maxlength="200"
          autocomplete="off"
          placeholder="写下你可能会说的那句"
          class="min-h-12 min-w-0 flex-1 rounded-2xl bg-mist px-4 outline-none"
        />
        <button
          class="min-h-12 shrink-0 rounded-2xl bg-moss-deep px-4 text-white disabled:opacity-40"
          :disabled="!draft.trim() || loading"
        >
          发送
        </button>
      </form>
    </div>
  </div>

  <main v-else class="px-5 pb-28 pt-7">
    <h1 class="text-[26px]">这个场景没有了</h1>
    <RouterLink to="/sandbox" class="mt-4 inline-flex min-h-12 items-center text-[17px] underline">回到场景列表</RouterLink>
  </main>
</template>
