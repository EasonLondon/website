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

function toggleShortcut(id: ShortcutId) {
  shortcut.value = shortcut.value === id ? null : id
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
  <main class="px-5 pb-28 pt-7">
    <h1 class="text-[26px] leading-tight">解码</h1>
    <p class="mt-2 text-[16px] leading-relaxed text-ink/75">
      一句重话、一段沉默，都可以放进来。这里不评判谁对谁错。
    </p>

    <textarea
      v-model="text"
      rows="4"
      maxlength="600"
      placeholder="写下你刚才说的，或他回你的那句。"
      class="mt-5 min-h-32 w-full resize-none rounded-[22px] bg-card px-4 py-4 shadow-[0_10px_28px_rgba(44,62,53,0.05)] outline-none"
    />

    <div class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="item in SHORTCUTS"
        :key="item.id"
        type="button"
        class="min-h-12 rounded-full px-4 text-[15px]"
        :class="shortcut === item.id ? 'bg-moss-deep text-white' : 'bg-mist'"
        :aria-pressed="shortcut === item.id"
        @click="toggleShortcut(item.id)"
      >
        {{ item.label }}
      </button>
    </div>

    <input ref="fileRef" class="sr-only" type="file" accept="image/*" @change="onFile" />
    <button type="button" class="mt-3 min-h-12 w-full rounded-2xl bg-mist px-4" @click="fileRef?.click()">
      {{ previewUrl ? '换一张截图' : '上传微信截图' }}
    </button>

    <button
      type="button"
      class="mt-3 min-h-12 w-full rounded-2xl bg-moss-deep px-4 text-white disabled:opacity-50"
      :disabled="loading"
      @click="onDecodeClick"
    >
      {{ loading ? '在看这段话' : '帮我看懂' }}
    </button>
    <p v-if="hint" class="mt-3 text-[15px] leading-relaxed text-ink/75">{{ hint }}</p>

    <section v-if="previewUrl" class="soft-card mt-5">
      <img :src="previewUrl" alt="你选中的截图" class="max-h-48 w-full rounded-2xl object-cover" />
      <p class="mt-3 text-[14px] leading-relaxed text-ink/70">识别在这台手机上演示，图片不会上传。</p>
      <div v-if="ocrLines" class="mt-3 space-y-2">
        <p v-for="(line, index) in ocrLines" :key="index" class="text-[15px] leading-relaxed">
          <span class="mr-2 text-ink/55">{{ line.role }}</span>{{ line.text }}
        </p>
      </div>
    </section>

    <div v-if="result" class="mt-5 space-y-3" aria-live="polite">
      <article class="soft-card">
        <p class="caption">表面行为</p>
        <p class="mt-2 text-[17px] leading-relaxed">{{ result.surface_behavior }}</p>
      </article>

      <article class="overflow-hidden rounded-[22px] shadow-[0_10px_28px_rgba(44,62,53,0.05)]">
        <div class="bg-card px-5 py-5">
          <p class="caption">水面上 · 你看得见的</p>
          <p class="mt-2 text-[17px] leading-relaxed">{{ result.iceberg_model.water_line_above }}</p>
        </div>
        <div class="relative h-8 bg-gradient-to-b from-card to-[#e3ebe4]">
          <div class="absolute inset-x-5 top-1/2 border-t border-dashed border-moss/70" />
          <span class="absolute left-5 top-1/2 -translate-y-1/2 bg-[#e7eee6] px-2 text-[13px] text-moss">水面</span>
        </div>
        <div class="bg-[#e3ebe4] px-5 py-5">
          <p class="caption">水面下 · 还没说出口的</p>
          <p class="mt-2 text-[17px] leading-relaxed">{{ result.iceberg_model.water_line_below }}</p>
        </div>
      </article>

      <article v-for="item in result.communication_templates" :key="item.type" class="soft-card">
        <div class="flex items-center justify-between gap-3">
          <p class="caption">{{ item.type }}</p>
          <button
            type="button"
            class="min-h-10 rounded-full bg-mist px-3 text-[14px]"
            @click="copyTemplate(item.content, item.type)"
          >
            {{ copiedType === item.type ? '已复制' : '用这句' }}
          </button>
        </div>
        <p class="mt-2 text-[17px] leading-relaxed">{{ item.content }}</p>
      </article>

      <RouterLink to="/me" class="block rounded-[22px] bg-mist px-5 py-4">
        <p class="caption">这些句子已按孩子的性格调整</p>
        <p class="mt-2 text-[15px] leading-relaxed">{{ summary }}</p>
      </RouterLink>
    </div>
  </main>
</template>
