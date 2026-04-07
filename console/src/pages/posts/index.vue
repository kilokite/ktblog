<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <span class="text-h6">文章管理</span>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="$router.push('/posts/new')">
        新建文章
      </v-btn>
    </div>

    <v-divider />

    <v-tabs v-model="tab" class="my-2">
      <v-tab value="all">全部</v-tab>
      <v-tab value="published">已发布</v-tab>
      <v-tab value="draft">草稿</v-tab>
    </v-tabs>

    <v-divider />

    <v-progress-linear v-if="loading" indeterminate class="mt-2" />

    <v-table v-else density="compact">
      <thead>
        <tr>
          <th>标题</th>
          <th>分类</th>
          <th>状态</th>
          <th>时间</th>
          <th style="width: 120px">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td>{{ post.title }}</td>
          <td>{{ post.category?.name ?? '—' }}</td>
          <td>
            <v-chip :color="post.published ? 'success' : 'default'" size="small" variant="tonal">
              {{ post.published ? '已发布' : '草稿' }}
            </v-chip>
          </td>
          <td>{{ formatDate(post.published ? post.publishedAt : post.createdAt) }}</td>
          <td>
            <v-btn icon="mdi-pencil" size="small" variant="text" @click="$router.push(`/posts/${post.id}`)" />
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="remove(post)" />
          </td>
        </tr>
        <tr v-if="!posts.length">
          <td colspan="5" class="text-center text-medium-emphasis py-4">暂无文章</td>
        </tr>
      </tbody>
    </v-table>

    <div v-if="totalPages > 1" class="d-flex justify-center mt-4">
      <v-pagination v-model="page" :length="totalPages" density="compact" @update:model-value="load" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { api } from '../../server'

type PostItem = {
  id: string
  title: string
  slug: string
  summary: string | null
  coverUrl: string | null
  published: boolean
  publishedAt: string | null
  createdAt: string
  category: { id: string; name: string; slug: string } | null
  tags: { tag: { id: string; name: string; slug: string } }[]
}

const tab = ref('all')
const page = ref(1)
const size = 20
const posts = ref<PostItem[]>([])
const total = ref(0)
const loading = ref(true)

const totalPages = ref(0)

async function load() {
  loading.value = true
  const query: Record<string, string> = { page: String(page.value), size: String(size) }
  if (tab.value !== 'all') query.published = tab.value === 'published' ? 'true' : 'false'

  const res = await api.posts.manage.$get({ query })
  if (res.ok) {
    const data = await res.json()
    posts.value = data.posts as PostItem[]
    total.value = data.total
    totalPages.value = Math.ceil(data.total / size)
  }
  loading.value = false
}

function formatDate(raw: string | null) {
  if (!raw) return '—'
  return new Date(raw).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

async function remove(post: PostItem) {
  if (!confirm(`确认删除「${post.title}」？`)) return
  const res = await api.posts[':id'].$delete({ param: { id: post.id } })
  if (res.ok) load()
}

watch(tab, () => { page.value = 1; load() })
onMounted(load)
</script>
