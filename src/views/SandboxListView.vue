<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { listConflicts } from '../services/ai'
import Mark from '../components/Mark.vue'

const scenes = listConflicts()

const iconFor: Record<string, string> = {
  phone: 'phone',
  grades: 'paper',
  silent: 'quiet',
  compare: 'balance',
  homework: 'pen',
  door: 'door',
  tutor: 'campus',
  sleep: 'moon',
  gather: 'people',
  topup: 'coin',
}
</script>

<template>
  <main class="page">
    <header class="rise-item">
      <h1 class="page-title">沙盘</h1>
      <p class="lede">先在这里说一遍。看他可能怎么接，也看看这句话会不会把门带上。不是考试。</p>
    </header>

    <div class="sheet rise mt-8">
      <RouterLink
        v-for="item in scenes"
        :key="item.id"
        :to="`/sandbox/${item.id}`"
        class="flex min-h-[84px] items-center gap-3 px-4 py-3.5 active:bg-mist/70"
      >
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mist text-moss-deep">
          <Mark :name="iconFor[item.id] ?? 'sandbox'" :size="20" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block text-[17px]">{{ item.title }}</span>
          <span class="mt-0.5 block text-[14px] leading-relaxed text-ink/65">{{ item.summary }}</span>
        </span>
        <Mark name="chevron" :size="18" class="text-ink/30" />
      </RouterLink>
    </div>
  </main>
</template>
