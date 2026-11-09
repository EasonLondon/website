<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { listConflicts } from '../services/ai'

const scenes = listConflicts()
</script>

<template>
  <main class="px-5 pb-28 pt-7">
    <h1 class="text-[26px] leading-tight">沙盘</h1>
    <p class="mt-2 text-[16px] leading-relaxed text-ink/75">
      先在这里说一遍。看他可能怎么接，也看看这句话会不会把门带上。不是考试。
    </p>
    <div class="mt-5 space-y-3">
      <RouterLink
        v-for="item in scenes"
        :key="item.id"
        :to="`/sandbox/${item.id}`"
        class="soft-card flex min-h-[84px] items-center gap-3 active:scale-[0.99]"
      >
        <span class="min-w-0 flex-1">
          <span class="block text-[18px]">{{ item.title }}</span>
          <span class="mt-1 block text-[15px] leading-relaxed text-ink/70">{{ item.summary }}</span>
        </span>
        <span aria-hidden="true" class="text-[22px] text-ink/40">›</span>
      </RouterLink>
    </div>
  </main>
</template>
