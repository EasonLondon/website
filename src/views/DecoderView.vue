<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import {
  SHORTCUTS,
  decodeUtterance,
  readScreenshot,
  type DecodeResult,
  type OcrLine,
  type ShortcutId,
} from '../services/ai'
import { useProfile } from '../composables/useProfile'
import { useWarmth } from '../composables/useWarmth'
import { copyText } from '../utils/copy'
import Mark from '../components/Mark.vue'

defineOptions({ name: 'DecoderView' })

const { tags, summary } = useProfile()
const { noteScene } = useWarmth()

const text = ref('')
const shortcut = ref<ShortcutId | null>(null)
const lastText = ref('')
const loading = ref(false)
const hint = ref('')
const result = ref<DecodeResult | null>(null)
const ocrLines = ref<OcrLine[] | null>(null)
const previewUrl = ref('')
const copiedType = ref('')
const fileRef = ref<HTMLInputElement | null>(null)
let ticket = 0

const shortcutIcon: Record<ShortcutId, string> = {
  silent: 'quiet',
  grades: 'paper',
  phone: 'phone',
}

function toggleShortcut(id: ShortcutId) {
  shortcut.value = shortcut.value === id ? null : id
}

function templateIcon(type: string) {
  if (type === '共情句') return 'heart'
  if (type === '探询句') return 'chat'
  return 'back'
}

async function run(record: boolean) {
  if (!lastText.value && !shortcut.value) {
    hint.value = '先写一句你刚才说的，或者点一个上面的场景。'
    return
  }
  const current = ++ticket
  loading.value = true
  hint.value = ''
  const decoded = await decodeUtterance({
    text: lastText.value,
    shortcut: shortcut.value,
    tags: [...tags.value],
  })
  if (current !== ticket) return
  result.value = decoded
  loading.value = false
  if (record) noteScene(decoded.trigger)
}

async function onDecodeClick() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  ocrLines.value = null
  lastText.value = text.value.trim()
  await run(true)
}

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    hint.value = '请选一张图片。识别只在这台手机上演示，图片不会上传。'
    return
  }
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
  ocrLines.value = null
  loading.value = true
  hint.value = ''
  const current = ++ticket
  const shot = await readScreenshot({ shortcut: shortcut.value, byteSize: file.size })
  if (current !== ticket) return
  ocrLines.value = shot.lines
  lastText.value = shot.transcript
  await run(true)
}

async function copyTemplate(content: string, type: string) {
  const ok = await copyText(content)
  if (!ok) return
  copiedType.value = type
  window.setTimeout(() => {
    if (copiedType.value === type) copiedType.value = ''
  }, 1600)
}

watch(
  tags,
  () => {
    if (result.value) void run(false)
  },
  { deep: true },
)

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<template>
  <main class="page">
    <header class="rise-item">
      <h1 class="page-title">解码</h1>
      <p class="lede">一句重话、一段沉默，都可以放进来。这里不评判谁对谁错。</p>
    </header>

    <textarea
      v-model="text"
      rows="4"
      maxlength="600"
      placeholder="写下你刚才说的，或他回你的那句。"
      class="field mt-8 min-h-36 resize-none rounded-[24px]"
    />

    <div class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="item in SHORTCUTS"
        :key="item.id"
        type="button"
        class="chip"
        :class="shortcut === item.id ? 'chip-on' : ''"
        :aria-pressed="shortcut === item.id"
        @click="toggleShortcut(item.id)"
      >
        <Mark :name="shortcutIcon[item.id]" :size="16" />
        {{ item.label }}
      </button>
    </div>

    <input ref="fileRef" class="sr-only" type="file" accept="image/*" @change="onFile" />
    <button type="button" class="btn-quiet mt-4 w-full gap-2" @click="fileRef?.click()">
      <Mark name="image" :size="18" />
      {{ previewUrl ? '换一张截图' : '上传微信截图' }}
    </button>

    <button type="button" class="btn-primary mt-3 w-full" :disabled="loading" @click="onDecodeClick">
      {{ loading ? '在看这段话' : '帮我看懂' }}
    </button>
    <p v-if="hint" class="mt-3 text-[15px] leading-relaxed text-ink/75">{{ hint }}</p>

    <section v-if="previewUrl" class="soft-card mt-8">
      <img :src="previewUrl" alt="你选中的截图" class="max-h-48 w-full rounded-2xl object-cover" />
      <p class="caption mt-3">识别在这台手机上演示，图片不会上传。</p>
      <div v-if="ocrLines" class="mt-4 space-y-2">
        <p
          v-for="(line, index) in ocrLines"
          :key="index"
          class="max-w-[88%] rounded-2xl px-3 py-2 text-[15px] leading-relaxed"
          :class="line.role === '家长' ? 'ml-auto bg-mist' : 'bg-paper'"
        >
          <span class="mb-0.5 block text-[12px] tracking-wide text-moss">{{ line.role }}</span>
          {{ line.text }}
        </p>
      </div>
    </section>

    <div v-if="result" class="rise mt-8 space-y-5" aria-live="polite">
      <article class="soft-card">
        <p class="eyebrow">
          <Mark name="leaf" :size="14" />
          表面行为
        </p>
        <p class="mt-3 text-[17px] leading-relaxed">{{ result.surface_behavior }}</p>
      </article>

      <article class="soft-card">
        <p class="eyebrow">水面上 · 你看得见的</p>
        <p class="mt-3 text-[17px] leading-relaxed">{{ result.iceberg_model.water_line_above }}</p>
        <div class="relative mt-4 overflow-hidden rounded-[22px]">
          <svg viewBox="0 0 320 214" class="block h-auto w-full" aria-hidden="true">
            <rect width="320" height="102" fill="#f4f7f1" />
            <rect y="102" width="320" height="112" fill="#d3e4db" />
            <path d="M164 28 222 104H114Z" fill="rgba(62,86,72,0.08)" />
            <path d="M160 22 216 102H104Z" fill="#ffffff" stroke="#d3e0d4" />
            <path d="M160 40 192 102H160Z" fill="#e7efe8" />
            <path d="M104 102h112l38 96H68Z" fill="#8eae9c" />
            <path d="M160 102h56l38 96H168Z" fill="#7b9d8b" />
            <path d="M0 102c28-13 56-13 84 0s56 13 84 0 56-13 84 0 56 13 68 0" fill="none" stroke="#6e8f7c" stroke-width="1.6" />
            <path d="M0 112c32-8 60-8 92 0s60 8 92 0 60-8 92 0 44 8 44 0" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="1.3" />
            <circle cx="92" cy="142" r="3.2" fill="#fbfcf8" opacity="0.85" />
            <circle cx="108" cy="168" r="2.1" fill="#fbfcf8" opacity="0.6" />
            <circle cx="84" cy="182" r="1.5" fill="#fbfcf8" opacity="0.45" />
          </svg>
          <span class="absolute left-5 top-[45%] rounded-full bg-card/95 px-2.5 py-0.5 text-[11px] tracking-[0.16em] text-moss">水面</span>
        </div>
        <p class="eyebrow mt-4 text-moss-deep">水面下 · 还没说出口的</p>
        <p class="mt-3 text-[17px] leading-relaxed">{{ result.iceberg_model.water_line_below }}</p>
      </article>

      <div class="sheet">
        <article v-for="item in result.communication_templates" :key="item.type" class="px-5 py-4">
          <div class="flex items-center justify-between gap-3">
            <p class="eyebrow">
              <Mark :name="templateIcon(item.type)" :size="14" />
              {{ item.type }}
            </p>
            <button type="button" class="btn-text" @click="copyTemplate(item.content, item.type)">
              {{ copiedType === item.type ? '已复制' : '用这句' }}
            </button>
          </div>
          <p class="mt-2 text-[17px] leading-relaxed">{{ item.content }}</p>
        </article>
      </div>

      <RouterLink to="/me" class="block rounded-[28px] border border-moss/10 bg-card/70 px-5 py-4">
        <p class="eyebrow">
          <Mark name="me" :size="14" />
          这些句子已按孩子的性格调整
        </p>
        <p class="mt-2 text-[15px] leading-relaxed text-ink/80">{{ summary }}</p>
      </RouterLink>
    </div>
  </main>
</template>
