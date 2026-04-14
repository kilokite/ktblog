<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <span class="text-h6">站点设置</span>
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
      站点配置加载失败，已禁止保存，请刷新后重试。
    </v-alert>

    <div v-else class="mt-4" style="max-width: 880px">
      <v-tabs v-model="tab" color="primary">
        <v-tab value="basic">基本信息</v-tab>
        <v-tab value="hero">首页</v-tab>
        <v-tab value="nav">导航</v-tab>
        <v-tab value="footer">页脚</v-tab>
        <v-tab value="sidebar">侧边栏</v-tab>
        <v-tab value="messages">页面提示</v-tab>
        <v-tab value="advanced">高级</v-tab>
      </v-tabs>

      <v-divider class="mb-4" />

      <v-window v-model="tab">
        <v-window-item value="basic">
          <span class="text-subtitle-2 text-medium-emphasis">基本信息</span>
          <v-text-field v-model="form.siteName" label="站点名称" class="mt-2" />
        </v-window-item>

        <v-window-item value="hero">
          <span class="text-subtitle-2 text-medium-emphasis">首页 Hero</span>
          <v-text-field v-model="form.renderUi.hero.title" label="主标题" class="mt-2" />
          <v-text-field v-model="form.renderUi.hero.subtitle" label="副标题" />
          <v-text-field v-model="form.renderUi.hero.backgroundUrl" label="背景图 URL" />
          <v-text-field v-model="form.renderUi.hero.accentText" label="高亮文字" hint="标题中需要高亮的文字片段" persistent-hint />
          <div class="mt-2">
            <span class="text-caption text-medium-emphasis">高亮颜色</span>
            <v-color-picker
              v-model="form.renderUi.hero.accentColor"
              mode="hex"
              hide-inputs
              show-swatches
              elevation="0"
            />
          </div>
        </v-window-item>

        <v-window-item value="nav">
          <span class="text-subtitle-2 text-medium-emphasis">导航栏</span>
          <v-text-field v-model="form.renderUi.nav.brandLabel" label="品牌文案" class="mt-2" />

          <v-divider class="my-4" />

          <div class="d-flex align-center justify-space-between">
            <span class="text-subtitle-2 text-medium-emphasis">导航项</span>
            <v-btn variant="text" color="primary" @click="addNavLink">新增</v-btn>
          </div>
          <draggable v-model="form.renderUi.nav.links" item-key="_idx" handle=".drag-handle">
            <template #item="{ element: link, index }">
              <div class="d-flex align-center ga-2 mt-2">
                <v-icon class="drag-handle" style="cursor: grab">mdi-drag</v-icon>
                <v-text-field v-model="link.label" label="文案" density="compact" hide-details />
                <v-text-field v-model="link.href" label="链接" density="compact" hide-details />
                <v-btn icon variant="text" color="error" size="small" @click="removeNavLink(index)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </template>
          </draggable>
        </v-window-item>

        <v-window-item value="footer">
          <span class="text-subtitle-2 text-medium-emphasis">页脚</span>
          <v-text-field v-model="form.footerText" label="底部署名" class="mt-2" />

          <v-divider class="my-4" />

          <div class="d-flex align-center justify-space-between">
            <span class="text-subtitle-2 text-medium-emphasis">页脚链接</span>
            <v-btn variant="text" color="primary" @click="addFooterLink">新增</v-btn>
          </div>
          <draggable v-model="form.renderUi.footer.links" item-key="_idx" handle=".drag-handle">
            <template #item="{ element: link, index }">
              <div class="d-flex align-center ga-2 mt-2">
                <v-icon class="drag-handle" style="cursor: grab">mdi-drag</v-icon>
                <v-text-field v-model="link.label" label="文案" density="compact" hide-details />
                <v-text-field v-model="link.href" label="链接" density="compact" hide-details />
                <v-btn icon variant="text" color="error" size="small" @click="removeFooterLink(index)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </template>
          </draggable>
        </v-window-item>

        <v-window-item value="sidebar">
          <span class="text-subtitle-2 text-medium-emphasis">个人资料</span>
          <v-text-field v-model="form.nickname" label="昵称" class="mt-2" />
          <v-text-field v-model="form.avatarUrl" label="头像 URL" />
          <v-textarea v-model="form.description" label="简短介绍" rows="3" />

          <v-divider class="my-4" />

          <span class="text-subtitle-2 text-medium-emphasis">侧边栏文案</span>
          <v-text-field v-model="form.renderUi.sidebar.nowPlayingLabel" label="Now Playing 标题" class="mt-2" />
          <v-text-field v-model="form.renderUi.sidebar.featuredLink.title" label="推荐卡片标题" />
          <v-text-field v-model="form.renderUi.sidebar.featuredLink.description" label="推荐卡片描述" />
        </v-window-item>

        <v-window-item value="messages">
          <span class="text-subtitle-2 text-medium-emphasis">页面提示文案</span>
          <v-text-field v-model="form.renderUi.pages.archive.title" label="归档页标题" class="mt-2" />
          <v-text-field
            v-model="form.renderUi.pages.archive.countTemplate"
            label="归档页计数模板"
            hint="使用 {{count}} 作为文章数量占位符"
            persistent-hint
          />
          <v-text-field v-model="form.renderUi.messages.noPosts" label="文章列表空状态" />
          <v-text-field v-model="form.renderUi.messages.postNotFound" label="文章不存在提示" />
        </v-window-item>

        <v-window-item value="advanced">
          <span class="text-subtitle-2 text-medium-emphasis">高级</span>
          <v-textarea
            v-model="form.customHtml"
            label="自定义 HTML"
            rows="6"
            class="mt-2"
            hint="注入到页面 <head> 中的自定义 HTML 片段"
            persistent-hint
          />
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import draggable from 'vuedraggable'
import { api } from '../../server'

function createDefaultForm() {
  return {
    siteName: '',
    nickname: '',
    avatarUrl: '',
    description: '',
    footerText: '',
    customHtml: '',
    renderUi: {
      hero: {
        title: '',
        subtitle: '',
        backgroundUrl: '',
        accentText: '',
        accentColor: '',
      },
      nav: {
        brandLabel: '',
        links: [] as { label: string; href: string }[],
      },
      footer: {
        links: [] as { label: string; href: string }[],
      },
      sidebar: {
        nowPlayingLabel: '',
        featuredLink: {
          title: '',
          description: '',
        },
      },
      pages: {
        archive: {
          title: '',
          countTemplate: '',
        },
      },
      messages: {
        noPosts: '',
        postNotFound: '',
      },
    },
  }
}

const loading = ref(false)
const loadFailed = ref(false)
const saving = ref(false)
const saveResult = ref<'ok' | 'fail' | null>(null)
const tab = ref('basic')
let saveResultTimer: ReturnType<typeof setTimeout> | undefined

const saveResultColor = computed(() => {
  if (saveResult.value === 'ok') return 'success'
  if (saveResult.value === 'fail') return 'error'
  return 'primary'
})

const form = ref(createDefaultForm())

onMounted(async () => {
  loading.value = true
  const res = await api['site-config'].$get()
  if (res.ok) {
    form.value = await res.json()
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
  const res = await api['site-config'].$put({ json: form.value })
  saving.value = false
  saveResult.value = res.ok ? 'ok' : 'fail'
  saveResultTimer = setTimeout(() => { saveResult.value = null }, 2000)
}

function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    save()
  }
}

function addNavLink() {
  form.value.renderUi.nav.links.push({ label: '', href: '' })
}

function removeNavLink(index: number) {
  form.value.renderUi.nav.links.splice(index, 1)
}

function addFooterLink() {
  form.value.renderUi.footer.links.push({ label: '', href: '' })
}

function removeFooterLink(index: number) {
  form.value.renderUi.footer.links.splice(index, 1)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>
