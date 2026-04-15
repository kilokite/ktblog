<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <span class="text-h6">个人页</span>
    </div>

    <v-btn :color="saveResultColor" :loading="saving" :disabled="loading || loadFailed" @click="save" style="position: fixed; right: 32px; bottom: 32px; z-index: 10">
      <template #prepend>
        <v-icon v-if="saveResult === 'ok'">mdi-check</v-icon>
        <v-icon v-else-if="saveResult === 'fail'">mdi-close</v-icon>
      </template>
      保存
      <template #append>
        <span class="text-caption text-medium-emphasis ml-1">Ctrl+S</span>
      </template>
    </v-btn>

    <v-divider />

    <v-progress-linear v-if="loading" indeterminate class="mt-2" />
    <v-alert v-else-if="loadFailed" type="error" variant="tonal" class="mt-4">
      配置加载失败，请刷新后重试。
    </v-alert>

    <div v-else class="mt-4" style="max-width: 880px">
      <span class="text-subtitle-2 text-medium-emphasis">背景图片</span>
      <v-text-field v-model="profileConfig.backgroundUrl" label="背景图 URL" class="mt-2" />

      <v-divider class="my-4" />

      <div class="d-flex align-center justify-space-between">
        <span class="text-subtitle-2 text-medium-emphasis">内容块</span>
        <v-menu>
          <template #activator="{ props }">
            <v-btn variant="text" color="primary" v-bind="props">
              <v-icon start>mdi-plus</v-icon>
              添加
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item title="链接列表" prepend-icon="mdi-card-outline" @click="addBlock('item-list')" />
            <v-list-item title="标签列表" prepend-icon="mdi-tag-multiple-outline" @click="addBlock('tag-list')" />
            <v-list-item title="标题" prepend-icon="mdi-format-title" @click="addBlock('title')" />
          </v-list>
        </v-menu>
      </div>

      <div v-if="!profileConfig.content.length" class="text-center text-medium-emphasis py-8">
        暂无内容块，点击上方添加按钮开始配置
      </div>

      <draggable v-model="profileConfig.content" item-key="_idx" handle=".block-drag-handle" class="mt-2">
        <template #item="{ element: block, index }">
          <div class="block-wrapper mb-4">
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon class="block-drag-handle" style="cursor: grab">mdi-drag</v-icon>
              <v-chip size="small" variant="tonal" :color="blockTypeColor(block.type)">
                {{ blockTypeLabel(block.type) }}
              </v-chip>
              <v-spacer />
              <v-btn icon variant="text" color="error" size="small" @click="removeBlock(index)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>

            <!-- title -->
            <template v-if="block.type === 'title'">
              <v-text-field v-model="block.text" label="标题文字" density="compact" hide-details />
            </template>

            <!-- item-list -->
            <template v-if="block.type === 'item-list'">
              <div v-for="(item, i) in block.items" :key="i" class="d-flex align-center ga-2 mb-2">
                <v-text-field v-model="item.symbol" label="符号" density="compact" hide-details style="max-width: 72px" />
                <v-text-field v-model="item.color" label="颜色" density="compact" hide-details style="max-width: 100px" />
                <v-text-field v-model="item.title" label="标题" density="compact" hide-details />
                <v-text-field v-model="item.description" label="描述" density="compact" hide-details />
                <v-text-field v-model="item.link" label="链接" density="compact" hide-details />
                <v-btn icon variant="text" color="error" size="x-small" @click="block.items.splice(i, 1)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <v-btn variant="text" size="small" color="primary" @click="addItem(block)">
                <v-icon start>mdi-plus</v-icon>添加链接
              </v-btn>
            </template>

            <!-- tag-list -->
            <template v-if="block.type === 'tag-list'">
              <div v-for="(tag, i) in block.tags" :key="i" class="d-flex align-center ga-2 mb-2">
                <v-text-field v-model="tag.symbol" label="符号" density="compact" hide-details style="max-width: 72px" />
                <v-text-field v-model="tag.color" label="颜色" density="compact" hide-details style="max-width: 100px" />
                <v-text-field v-model="tag.text" label="文字" density="compact" hide-details />
                <v-btn icon variant="text" color="error" size="x-small" @click="block.tags.splice(i, 1)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <v-btn variant="text" size="small" color="primary" @click="addTag(block)">
                <v-icon start>mdi-plus</v-icon>添加标签
              </v-btn>
            </template>

            <v-divider class="mt-3" />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import draggable from 'vuedraggable'
import { api } from '../server'

type ProfileItem = { symbol: string; color: string; title: string; description: string; link: string }
type ProfileTag = { symbol: string; text: string; color: string }
type ProfileContentBlock =
  | { type: 'item-list'; items: ProfileItem[] }
  | { type: 'tag-list'; tags: ProfileTag[] }
  | { type: 'title'; text: string }

interface ProfilePageConfig {
  backgroundUrl: string
  content: ProfileContentBlock[]
}

const loading = ref(false)
const loadFailed = ref(false)
const saving = ref(false)
const saveResult = ref<'ok' | 'fail' | null>(null)
let saveResultTimer: ReturnType<typeof setTimeout> | undefined

const saveResultColor = computed(() => {
  if (saveResult.value === 'ok') return 'success'
  if (saveResult.value === 'fail') return 'error'
  return 'primary'
})

const profileConfig = ref<ProfilePageConfig>({
  backgroundUrl: '',
  content: [],
})

let fullConfig = {} as Record<string, unknown>

onMounted(async () => {
  loading.value = true
  const res = await api['site-config'].$get()
  if (res.ok) {
    fullConfig = await res.json() as Record<string, unknown>
    const renderUi = (fullConfig.renderUi ?? {}) as Record<string, unknown>
    const pages = (renderUi.pages ?? {}) as Record<string, unknown>
    const profile = (pages.profile ?? { backgroundUrl: '', content: [] }) as ProfilePageConfig
    profileConfig.value = profile
    loadFailed.value = false
  } else {
    loadFailed.value = true
  }
  loading.value = false
})

async function save() {
  if (saving.value) return
  saving.value = true
  clearTimeout(saveResultTimer)
  saveResult.value = null

  const renderUi = { ...((fullConfig.renderUi ?? {}) as Record<string, unknown>) }
  const pages = { ...((renderUi.pages ?? {}) as Record<string, unknown>) }
  pages.profile = profileConfig.value
  renderUi.pages = pages
  const payload = { ...fullConfig, renderUi }

  const res = await api['site-config'].$put({ json: payload as never })
  saving.value = false
  saveResult.value = res.ok ? 'ok' : 'fail'
  if (res.ok) fullConfig = payload
  saveResultTimer = setTimeout(() => { saveResult.value = null }, 2000)
}

function blockTypeLabel(type: string) {
  const map: Record<string, string> = { 'item-list': '链接列表', 'tag-list': '标签列表', 'title': '标题' }
  return map[type] ?? type
}

function blockTypeColor(type: string) {
  const map: Record<string, string> = { 'item-list': 'blue', 'tag-list': 'green', 'title': 'grey' }
  return map[type] ?? 'default'
}

function addBlock(type: 'item-list' | 'tag-list' | 'title') {
  if (type === 'item-list') {
    profileConfig.value.content.push({ type: 'item-list', items: [] })
  } else if (type === 'tag-list') {
    profileConfig.value.content.push({ type: 'tag-list', tags: [] })
  } else {
    profileConfig.value.content.push({ type: 'title', text: '' })
  }
}

function removeBlock(index: number) {
  profileConfig.value.content.splice(index, 1)
}

function addItem(block: Extract<ProfileContentBlock, { type: 'item-list' }>) {
  block.items.push({ symbol: '🔗', color: '#3a6bff', title: '', description: '', link: '' })
}

function addTag(block: Extract<ProfileContentBlock, { type: 'tag-list' }>) {
  block.tags.push({ symbol: '⭐', text: '', color: '#ff9d9d' })
}

function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    save()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>
