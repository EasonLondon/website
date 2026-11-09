<script setup lang="ts">
import { computed, ref } from 'vue'
import { searchSlang, slangCategories } from '../services/ai'
import { copyText } from '../utils/copy'

defineOptions({ name: 'DictView' })

const categories = slangCategories()
const query = ref('')
const category = ref<string | null>(null)
const copied = ref('')

const entries = computed(() => searchSlang(query.value, category.value))

function toggleCategory(item: string) {
  category.value = category.value === item ? null : item
}

function count(item: string) {
  return searchSlang('', item).length
}

async function useLine(term: string, line: string) {
  const ok = await copyText(line)
  if (!ok) return
  copied.value = term
  window.setTimeout(() => {
    if (copied.value === term) copied.value = ''
  }, 1600)
}
</script>

<template>
  <main class="px-5 pb-28 pt-7">
    <h1 class="text-[26px] leading-tight">词典</h1>
    <p class="mt-2 text-[16px] leading-relaxed text-ink/75">
      那些听着刺耳的词，常常不是冲你来的。先看懂，再决定要不要问。
    </p>

    <input
      v-model="query"
      type="text"
      enterkeyhint="search"
      autocomplete="off"
      placeholder="搜一个没听懂的词，比如红温、班味"
      class="mt-5 min-h-12 w-full rounded-2xl bg-card px-4 shadow-[0_8px_24px_rgba(44,62,53,0.05)] outline-none"
    />

    <div class="mt-4 grid grid-cols-2 gap-3">
      <button
        v-for="item in categories"
        :key="item"
        type="button"
        class="min-h-[76px] rounded-[20px] px-4 py-3 text-left"
        :class="category === item ? 'bg-moss-deep text-white' : 'bg-card shadow-[0_8px_24px_rgba(44,62,53,0.05)]'"
        :aria-pressed="category === item"
        @click="toggleCategory(item)"
      >
        <span class="block text-[17px]">{{ item }}</span>
        <span class="mt-1 block text-[13px]" :class="category === item ? 'text-white/80' : 'text-ink/65'">
          {{ count(item) }} 个词
        </span>
      </button>
    </div>

    <p v-if="entries.length === 0" class="mt-5 text-[16px] leading-relaxed">
      没有这个词。可以换个说法，或者下次直接问孩子：这个词在你们那儿是什么意思。
    </p>

    <div v-else class="mt-5 space-y-3">
      <article v-for="entry in entries" :key="entry.term" class="soft-card">
        <div class="flex items-baseline justify-between gap-3">
          <h2 class="text-[24px] leading-tight">{{ entry.term }}</h2>
          <span class="caption">{{ entry.category }}</span>
        </div>
        <h3 class="caption mt-4">字面 / 圈层意思</h3>
        <p class="mt-1 text-[16px] leading-relaxed">字面：{{ entry.literal }}</p>
        <p class="mt-1 text-[16px] leading-relaxed">圈层：{{ entry.circle }}</p>
        <h3 class="caption mt-4">孩子心理隐喻</h3>
        <p class="mt-1 text-[16px] leading-relaxed">{{ entry.metaphor }}</p>
        <h3 class="caption mt-4">破冰切入点</h3>
        <p class="mt-1 text-[16px] leading-relaxed">{{ entry.opener }}</p>
        <button type="button" class="mt-3 min-h-10 rounded-full bg-mist px-4 text-[14px]" @click="useLine(entry.term, entry.opener)">
          {{ copied === entry.term ? '已复制' : '用这句' }}
        </button>
      </article>
    </div>
  </main>
</template>
