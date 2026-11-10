<script setup lang="ts">
import { computed } from 'vue'
import { PERSONALITY_TAGS, TAG_NOTES, getWeeklyArchive } from '../services/ai'
import { useProfile } from '../composables/useProfile'
import { useWarmth } from '../composables/useWarmth'
import ArcMeter from '../components/ArcMeter.vue'
import Mark from '../components/Mark.vue'

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
  <main class="page">
    <header class="rise-item">
      <h1 class="page-title">我的</h1>
      <p class="lede">这些特点会改变解码时的说法，也会改变沙盘里孩子的语气。只留在这台手机上。</p>
    </header>

    <div class="sheet mt-8">
      <button
        v-for="tag in PERSONALITY_TAGS"
        :key="tag"
        type="button"
        role="switch"
        :aria-checked="on(tag)"
        class="flex w-full items-center gap-4 px-4 py-4 text-left"
        :class="on(tag) ? 'bg-moss/[0.04]' : ''"
        @click="toggle(tag)"
      >
        <span class="min-w-0 flex-1">
          <span class="block text-[17px] leading-snug">{{ tag }}</span>
          <span class="mt-1 block text-[14px] leading-relaxed text-ink/65">{{ TAG_NOTES[tag] }}</span>
        </span>
        <span
          class="flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition-colors duration-300"
          :class="on(tag) ? 'justify-end bg-moss-deep' : 'justify-start bg-ink/15'"
          aria-hidden="true"
        >
          <span class="h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(44,62,53,0.18)]" />
        </span>
      </button>
    </div>

    <section class="mt-5 border-l-2 border-moss/35 py-1 pl-4">
      <p class="eyebrow">
        <Mark name="leaf" :size="14" />
        此刻会怎样
      </p>
      <p class="mt-2 text-[16px] leading-relaxed">{{ summary }}</p>
    </section>

    <section class="soft-card mt-8">
      <p class="eyebrow">
        <Mark name="droplet" :size="14" />
        {{ archive.current.label }}档案
      </p>
      <ArcMeter class="mt-1" :value="archive.current.temperature" size="sm" />
      <p class="eyebrow mt-2">常被点着的话题</p>
      <ul class="mt-3 flex flex-wrap gap-2">
        <li v-for="item in archive.current.triggers" :key="item" class="rounded-full bg-mist px-3 py-1.5 text-[14px]">
          {{ item }}
        </li>
      </ul>
      <p class="eyebrow mt-5">如果用孩子的眼睛写这周</p>
      <p class="mt-3 whitespace-pre-wrap border-l-2 border-moss/30 pl-4 text-[16px] leading-relaxed">
        {{ archive.current.diary }}
      </p>
    </section>

    <section class="sheet mt-4">
      <article v-for="week in archive.earlier" :key="week.label" class="px-5 py-4">
        <div class="flex items-baseline justify-between gap-3">
          <p class="eyebrow">{{ week.label }}</p>
          <p class="text-[28px] font-medium leading-none tabular">
            {{ week.temperature }}<span class="ml-0.5 text-[13px] font-normal tracking-[0.14em] text-moss">°C</span>
          </p>
        </div>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li v-for="item in week.triggers" :key="item" class="rounded-full bg-mist px-3 py-1 text-[13px]">
            {{ item }}
          </li>
        </ul>
        <p class="mt-3 text-[15px] leading-relaxed text-ink/80">{{ week.diary }}</p>
      </article>
    </section>
  </main>
</template>
