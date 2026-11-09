<script setup lang="ts">
import { computed } from 'vue'
import { PERSONALITY_TAGS, TAG_NOTES, getWeeklyArchive } from '../services/ai'
import { useProfile } from '../composables/useProfile'
import { useWarmth } from '../composables/useWarmth'

defineOptions({ name: 'ProfileView' })

const { tags, summary, toggle } = useProfile()
const { today, triggers } = useWarmth()
const archive = computed(() =>
  getWeeklyArchive({
    temperature: today.value.degrees,
    triggers: triggers.value,
  }),
)

function on(tag: (typeof PERSONALITY_TAGS)[number]) {
  return tags.value.includes(tag)
}
</script>

<template>
  <main class="px-5 pb-28 pt-7">
    <h1 class="text-[26px] leading-tight">我的</h1>
    <p class="mt-2 text-[16px] leading-relaxed text-ink/75">
      这些特点会改变解码时的说法，也会改变沙盘里孩子的语气。只留在这台手机上。
    </p>

    <div class="mt-5 space-y-3">
      <button
        v-for="tag in PERSONALITY_TAGS"
        :key="tag"
        type="button"
        role="switch"
        :aria-checked="on(tag)"
        class="flex w-full items-center gap-4 rounded-[20px] px-4 py-4 text-left"
        :class="on(tag) ? 'bg-mist' : 'bg-card shadow-[0_8px_24px_rgba(44,62,53,0.04)]'"
        @click="toggle(tag)"
      >
        <span class="min-w-0 flex-1">
          <span class="block text-[17px] leading-snug">{{ tag }}</span>
          <span class="mt-1 block text-[14px] leading-relaxed text-ink/70">{{ TAG_NOTES[tag] }}</span>
        </span>
        <span
          class="flex h-8 w-14 shrink-0 items-center rounded-full p-1"
          :class="on(tag) ? 'justify-end bg-moss-deep' : 'justify-start bg-ink/15'"
          aria-hidden="true"
        >
          <span class="h-6 w-6 rounded-full bg-white shadow-sm" />
        </span>
      </button>
    </div>

    <section class="mt-4 rounded-[22px] bg-mist px-5 py-4">
      <p class="caption">此刻会怎样</p>
      <p class="mt-2 text-[16px] leading-relaxed">{{ summary }}</p>
    </section>

    <section class="soft-card mt-4">
      <p class="caption">{{ archive.current.label }}档案</p>
      <p class="mt-2 text-[44px] leading-none tabular">{{ archive.current.temperature }}°C</p>
      <p class="caption mt-4">常被点着的话题</p>
      <ul class="mt-2 flex flex-wrap gap-2">
        <li v-for="item in archive.current.triggers" :key="item" class="rounded-full bg-mist px-3 py-1 text-[14px]">
          {{ item }}
        </li>
      </ul>
      <p class="caption mt-4">如果用孩子的眼睛写这周</p>
      <p class="mt-2 whitespace-pre-wrap text-[16px] leading-relaxed">{{ archive.current.diary }}</p>
    </section>

    <section v-for="week in archive.earlier" :key="week.label" class="soft-card mt-3">
      <p class="caption">{{ week.label }}</p>
      <p class="mt-2 text-[28px] leading-none tabular">{{ week.temperature }}°C</p>
      <ul class="mt-3 flex flex-wrap gap-2">
        <li v-for="item in week.triggers" :key="item" class="rounded-full bg-mist px-3 py-1 text-[14px]">
          {{ item }}
        </li>
      </ul>
      <p class="mt-3 text-[15px] leading-relaxed">{{ week.diary }}</p>
    </section>
  </main>
</template>
