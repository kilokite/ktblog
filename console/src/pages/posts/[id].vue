<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <v-btn icon="mdi-arrow-left" variant="text" @click="$router.push('/posts')" />
      <span class="text-h6 ml-2">{{ isNew ? '新建文章' : '编辑文章' }}</span>
      <v-spacer />
      <v-btn color="primary" :loading="saving" @click="save">保存</v-btn>
    </div>

    <v-divider />

    <v-progress-linear v-if="loading" indeterminate class="mt-2" />

    <div v-else class="mt-4" style="max-width: 800px">
      <v-text-field v-model="form.title" label="标题" variant="outlined" density="compact" />

      <v-text-field v-model="form.slug" label="Slug" variant="outlined" density="compact" class="mt-3"
        hint="URL 路径标识，如 my-first-post" persistent-hint />

      <v-textarea v-model="form.summary" label="摘要" variant="outlined" density="compact" rows="2" class="mt-3" />

      <v-divider class="my-4" />

      <v-textarea v-model="form.content" label="正文" variant="outlined" density="compact" rows="16" class="mt-3"
        auto-grow />

      <v-divider class="my-4" />

      <v-text-field v-model="form.coverUrl" label="封面图 URL" variant="outlined" density="compact" />

      <v-text-field v-model="form.categoryId" label="分类 ID" variant="outlined" density="compact" class="mt-3" />

      <v-text-field v-model="form.seriesId" label="系列 ID" variant="outlined" density="compact" class="mt-3" />

      <v-text-field v-model.number="form.seriesOrder" label="系列排序" variant="outlined" density="compact"
        type="number" class="mt-3" />

      <v-divider class="my-4" />

      <v-switch v-model="form.published" label="发布" color="primary" hide-details />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../server'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string)
const isNew = computed(() => id.value === 'new')

const loading = ref(false)
const saving = ref(false)

const form = ref({
  title: '',
  slug: '',
  content: '',
  summary: '',
  coverUrl: '',
  categoryId: '',
  seriesId: '',
  seriesOrder: undefined as number | undefined,
  published: false,
})

onMounted(async () => {
  if (isNew.value) return
  loading.value = true
  const res = await api.posts.manage[':id'].$get({ param: { id: id.value } })
  if (!res.ok) {
    router.push('/posts')
    return
  }
  const post = await res.json()
  form.value = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    summary: post.summary ?? '',
    coverUrl: post.coverUrl ?? '',
    categoryId: post.categoryId ?? '',
    seriesId: post.seriesId ?? '',
    seriesOrder: post.seriesOrder ?? undefined,
    published: post.published,
  }
  loading.value = false
})

async function save() {
  saving.value = true
  const body = {
    title: form.value.title,
    slug: form.value.slug,
    content: form.value.content,
    summary: form.value.summary || undefined,
    coverUrl: form.value.coverUrl || undefined,
    categoryId: form.value.categoryId || undefined,
    seriesId: form.value.seriesId || undefined,
    seriesOrder: form.value.seriesOrder,
    published: form.value.published,
  }

  let ok: boolean
  if (isNew.value) {
    const res = await api.posts.$post({ json: body })
    ok = res.ok
  } else {
    const res = await api.posts[':id'].$put({ param: { id: id.value }, json: body })
    ok = res.ok
  }

  saving.value = false
  if (ok) router.push('/posts')
}
</script>
