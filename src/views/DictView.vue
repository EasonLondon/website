<script setup lang="ts">
import { computed, ref } from 'vue'
import { searchSlang, slangCategories } from '../services/ai'
import { copyText } from '../utils/copy'
import Mark from '../components/Mark.vue'

defineOptions({ name: 'DictView' })

const categories = slangCategories()
const query = ref('')
const category = ref<string | null>(null)
const copied = ref('')

const iconFor: Record<string, string> = {
  情绪: 'mood',
  游戏: 'game',
  二次元: 'star',
  校园: 'campus',
  关系: 'people',
}

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
  <main class="page">
    <header class="rise-item">
      <h1 class="page-title">词典</h1>
      <p class="lede">那些听着刺耳的词，常常不是冲你来的。先看懂，再决定要不要问。</p>
    </header>

    <label class="relative mt-8 block">
      <Mark name="search" :size="18" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-moss" />
      <input
        v-model="query"
        type="text"
        enterkeyhint="search"
        autocomplete="off"
        placeholder="搜一个没听懂的词，比如红温、班味"
        class="field pl-11"
      />
    </label>

    <div class="scroller mt-4 flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="item in categories"
        :key="item"
        type="button"
        class="chip shrink-0"
        :class="category === item ? 'chip-on' : ''"
        :aria-pressed="category === item"
        @click="toggleCategory(item)"
      >
        <Mark :name="iconFor[item] ?? 'spark'" :size="16" />
        {{ item }}
        <span :class="category === item ? 'text-white/70' : 'text-ink/45'">{{ count(item) }}</span>
      </button>
    </div>

    <p v-if="entries.length === 0" class="mt-8 text-[16px] leading-relaxed">
      没有这个词。可以换个说法，或者下次直接问孩子：这个词在你们那儿是什么意思。
    </p>

    <div v-else class="mt-6 space-y-4">
      <article v-for="entry in entries" :key="entry.term" class="soft-card">
        <div class="flex items-start justify-between gap-3">
          <h2 class="text-[28px] font-medium leading-none">{{ entry.term }}</h2>
          <span class="caption shrink-0 pt-1">{{ entry.category }}</span>
        </div>
        <div class="mt-5 border-t border-moss/10 pt-4">
          <h3 class="eyebrow">字面 / 圈层意思</h3>
          <p class="mt-2 text-[16px] leading-relaxed">字面：{{ entry.literal }}</p>
          <p class="mt-1 text-[16px] leading-relaxed text-ink/80">圈层：{{ entry.circle }}</p>
        </div>
        <div class="mt-4 border-t border-moss/10 pt-4">
          <h3 class="eyebrow">孩子心理隐喻</h3>
          <p class="mt-2 text-[16px] leading-relaxed">{{ entry.metaphor }}</p>
        </div>
        <div class="mt-4 border-t border-moss/10 pt-4">
          <h3 class="eyebrow">破冰切入点</h3>
          <p class="mt-2 text-[16px] leading-relaxed">{{ entry.opener }}</p>
          <button type="button" class="btn-text mt-1" @click="useLine(entry.term, entry.opener)">
            {{ copied === entry.term ? '已复制' : '用这句' }}
          </button>
        </div>
      </article>
    </div>
  </main>
</template>
