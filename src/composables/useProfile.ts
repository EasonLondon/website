import { computed, ref, watch } from 'vue'
import {
  DEFAULT_TAGS,
  PERSONALITY_TAGS,
  describeProfile,
  type PersonalityTag,
} from '../services/ai'

const STORAGE_KEY = 'qinzi-profile-tags'

function readTags(): PersonalityTag[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [...DEFAULT_TAGS]
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return [...DEFAULT_TAGS]
    const known = new Set<string>(PERSONALITY_TAGS)
    return parsed.filter((item): item is PersonalityTag => typeof item === 'string' && known.has(item))
  } catch {
    return [...DEFAULT_TAGS]
  }
}

const tags = ref<PersonalityTag[]>(readTags())

watch(tags, (value) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
})

export function useProfile() {
  const summary = computed(() => describeProfile(tags.value))

  function toggle(tag: PersonalityTag) {
    tags.value = tags.value.includes(tag)
      ? tags.value.filter((item) => item !== tag)
      : [...tags.value, tag]
  }

  function has(tag: PersonalityTag) {
    return tags.value.includes(tag)
  }

  return { tags, summary, toggle, has }
}
