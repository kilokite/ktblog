<template>
  <v-dialog :model-value="modelValue" max-width="640" @update:model-value="emit('update:modelValue', $event)">
    <v-card title="选择文章">
      <v-card-text>
        <v-text-field
          v-model="search"
          placeholder="搜索文章标题…"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          clearable
        />

        <v-divider class="my-3" />

        <v-progress-linear v-if="loading" indeterminate />

        <v-list v-else density="compact" class="py-0" style="max-height: 400px; overflow-y: auto">
          <template v-if="posts.length">
            <v-list-item
              v-for="post in posts"
              :key="post.id"
              :disabled="excludeIds?.includes(post.id)"
              @click="select(post)"
            >
              <v-list-item-title>{{ post.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ post.category?.name ?? '无分类' }}
                · {{ post.published ? '已发布' : '草稿' }}
              </v-list-item-subtitle>
            </v-list-item>
          </template>
          <div v-else class="text-center text-medium-emphasis py-6">暂无文章</div>
        </v-list>

        <template v-if="totalPages > 1">
          <v-divider class="mt-2" />
          <div class="d-flex justify-center mt-3">
            <v-pagination v-model="page" :length="totalPages" density="compact" @update:model-value="load" />
          </div>
        </template>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="emit('update:modelValue', false)">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { api } from '../../server'

type PostItem = {
  id: string
  title: string
  slug: string
  coverUrl: string | null
  published: boolean
  category: { id: string; name: string; slug: string } | null
}

const props = defineProps<{
  modelValue: boolean
  excludeIds?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [post: PostItem]
}>()

const search = ref('')
const page = ref(1)
const size = 20
const posts = ref<PostItem[]>([])
const totalPages = ref(0)
const loading = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | undefined

async function load() {
  loading.value = true
  const query: Record<string, string> = { page: String(page.value), size: String(size) }
  if (search.value) query.search = search.value

  const res = await api.posts.manage.$get({ query })
  if (res.ok) {
    const data = await res.json()
    posts.value = data.posts as PostItem[]
    totalPages.value = Math.ceil(data.total / size)
  }
  loading.value = false
}

function select(post: PostItem) {
  if (props.excludeIds?.includes(post.id)) return
  emit('select', post)
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (open) => {
  if (open) {
    search.value = ''
    page.value = 1
    load()
  }
})

watch(search, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    load()
  }, 300)
})
</script>
