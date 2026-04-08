<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <v-btn icon="mdi-arrow-left" variant="text" @click="$router.push('/posts')" />
      <span class="text-h6 ml-2">{{ isNew ? '新建文章' : '编辑文章' }}</span>
    </div>

    <v-divider />

    <v-progress-linear v-if="loading" indeterminate class="mt-2" />

    <div v-else class="editor-layout mt-4">
      <!-- 主编辑区 -->
      <div class="editor-main">
        <v-text-field
          v-model="form.title"
          placeholder="输入文章标题..."
          variant="plain"
          hide-details
          class="editor-title"
          @update:model-value="onTitleChange"
        />

        <div class="slug-row mt-1 mb-3">
          <template v-if="!slugEditing">
            <span
              class="text-caption text-medium-emphasis slug-display"
              @click="slugEditing = true"
            >
              /{{ form.slug || '...' }}
              <v-icon size="12" class="ml-1">mdi-pencil-outline</v-icon>
            </span>
          </template>
          <v-text-field
            v-else
            v-model="form.slug"
            variant="underlined"
            density="compact"
            hide-details
            prefix="/"
            placeholder="post-slug"
            class="slug-input"
            autofocus
            @blur="onSlugBlur"
            @keydown.enter="onSlugBlur"
          />
        </div>

        <v-textarea
          v-model="form.content"
          placeholder="开始写作..."
          variant="plain"
          hide-details
          auto-grow
          class="editor-content"
        />
      </div>

      <!-- 侧边栏 -->
      <div class="editor-sidebar">
        <div class="sidebar-inner">
          <!-- 发布 -->
          <div class="d-flex align-center">
            <v-chip
              :color="form.published ? 'success' : 'default'"
              size="small"
              variant="tonal"
              label
            >
              {{ form.published ? '已发布' : '草稿' }}
            </v-chip>
            <v-switch
              v-model="form.published"
              color="primary"
              hide-details
              density="compact"
              class="ml-2 flex-grow-0"
            />
            <v-spacer />
            <v-btn
              color="primary"
              size="small"
              :loading="saving"
              @click="save"
            >
              保存
            </v-btn>
          </div>

          <v-divider class="my-3" />

          <!-- 摘要 -->
          <div class="text-subtitle-2 text-medium-emphasis mb-2">摘要</div>
          <v-textarea
            v-model="form.summary"
            placeholder="简短描述..."
            variant="outlined"
            density="compact"
            rows="2"
            hide-details
          />

          <v-divider class="my-3" />

          <!-- 分类 & 标签 -->
          <div class="text-subtitle-2 text-medium-emphasis mb-2">分类 & 标签</div>
          <v-select
            v-model="form.categoryId"
            :items="categories"
            item-title="name"
            item-value="id"
            label="分类"
            clearable
            hide-details
            density="compact"
          />
          <v-autocomplete
            v-model="form.tagIds"
            :items="tags"
            item-title="name"
            item-value="id"
            label="标签"
            multiple
            chips
            closable-chips
            hide-details
            density="compact"
            class="mt-3"
          />

          <v-divider class="my-3" />

          <!-- 封面图 -->
          <div class="text-subtitle-2 text-medium-emphasis mb-2">封面图</div>
          <v-text-field
            v-model="form.coverUrl"
            label="图片 URL"
            hide-details
            density="compact"
          />
          <v-img
            v-if="form.coverUrl"
            :src="form.coverUrl"
            class="mt-2 rounded"
            max-height="140"
            cover
          />

          <v-divider class="my-3" />

          <!-- 系列 (可折叠) -->
          <v-expansion-panels variant="accordion" flat>
            <v-expansion-panel>
              <v-expansion-panel-title class="px-0 text-subtitle-2 text-medium-emphasis">
                系列
              </v-expansion-panel-title>
              <v-expansion-panel-text class="panel-flush">
                <v-text-field
                  v-model="form.seriesId"
                  label="系列 ID"
                  hide-details
                  density="compact"
                />
                <v-text-field
                  v-model.number="form.seriesOrder"
                  label="排序"
                  type="number"
                  hide-details
                  density="compact"
                  class="mt-3"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../server'

type TaxonomyItem = { id: string; name: string; slug: string }

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string)
const isNew = computed(() => id.value === 'new')

const loading = ref(false)
const saving = ref(false)
const slugEditing = ref(false)
const slugManual = ref(false)

const categories = ref<TaxonomyItem[]>([])
const tags = ref<TaxonomyItem[]>([])

const form = ref({
  title: '',
  slug: '',
  content: '',
  summary: '',
  coverUrl: '',
  categoryId: null as string | null,
  tagIds: [] as string[],
  seriesId: '',
  seriesOrder: undefined as number | undefined,
  published: false,
})

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

let slugTimer: ReturnType<typeof setTimeout> | undefined
function onTitleChange() {
  if (slugManual.value) return
  clearTimeout(slugTimer)
  slugTimer = setTimeout(() => {
    form.value.slug = toSlug(form.value.title)
  }, 500)
}

function onSlugBlur() {
  slugEditing.value = false
  if (form.value.slug) slugManual.value = true
}

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault()
    if (!saving.value) save()
  }
}

async function loadTaxonomies() {
  const [catRes, tagRes] = await Promise.all([
    api.categories.$get(),
    api.tags.$get(),
  ])
  if (catRes.ok) categories.value = await catRes.json() as TaxonomyItem[]
  if (tagRes.ok) tags.value = await tagRes.json() as TaxonomyItem[]
}

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)

  const taxonomyPromise = loadTaxonomies()

  if (!isNew.value) {
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
      categoryId: post.categoryId ?? null,
      tagIds: post.tags?.map((t: { tag: { id: string } }) => t.tag.id) ?? [],
      seriesId: post.seriesId ?? '',
      seriesOrder: post.seriesOrder ?? undefined,
      published: post.published,
    }
    slugManual.value = true
  }

  await taxonomyPromise
  loading.value = false
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(slugTimer)
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
    tagIds: form.value.tagIds,
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

<style scoped>
.editor-layout {
  display: flex;
  gap: 32px;
}

.editor-main {
  flex: 1;
  min-width: 0;
}

.editor-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.sidebar-inner {
  position: sticky;
  top: 80px;
}

.editor-title :deep(input) {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.3;
}

.slug-row {
  min-height: 28px;
}

.slug-display {
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  padding: 2px 6px;
  transition: background-color 0.15s;
}
.slug-display:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.08);
}

.slug-input {
  max-width: 320px;
}
.slug-input :deep(input) {
  font-size: 0.8rem;
}

.editor-content :deep(textarea) {
  min-height: 400px;
  line-height: 1.75;
}

.panel-flush :deep(.v-expansion-panel-text__wrapper) {
  padding-left: 0;
  padding-right: 0;
}
</style>
