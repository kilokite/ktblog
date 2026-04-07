<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <span class="text-h6">站点设置</span>
    </div>

    <v-btn :color="saveResultColor" :loading="saving" @click="save" style="position: fixed; right: 32px; bottom: 32px; z-index: 10">
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

    <div v-else class="mt-4" style="max-width: 720px">
      <span class="text-subtitle-2 text-medium-emphasis">基本信息</span>
      <v-text-field v-model="form.siteName" label="站点名称" class="mt-2" />
      <v-text-field v-model="form.siteSlug" label="站点 Slug" hint="URL 路径标识" persistent-hint />

      <v-divider class="my-4" />

      <span class="text-subtitle-2 text-medium-emphasis">个人信息</span>
      <v-text-field v-model="form.nickname" label="昵称" class="mt-2" />
      <v-text-field v-model="form.avatarUrl" label="头像 URL" />
      <v-textarea v-model="form.description" label="简短介绍" rows="3" />

      <v-divider class="my-4" />

      <span class="text-subtitle-2 text-medium-emphasis">高级</span>
      <v-text-field v-model="form.footerText" label="底部署名" class="mt-2" />
      <v-textarea v-model="form.customHtml" label="自定义 HTML" rows="6"
        hint="注入到页面 <head> 中的自定义 HTML 片段" persistent-hint />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { api } from '../../server'

const loading = ref(false)
const saving = ref(false)
const saveResult = ref<'ok' | 'fail' | null>(null)
let saveResultTimer: ReturnType<typeof setTimeout> | undefined

const saveResultColor = computed(() => {
  if (saveResult.value === 'ok') return 'success'
  if (saveResult.value === 'fail') return 'error'
  return 'primary'
})

const form = ref({
  siteName: '',
  siteSlug: '',
  nickname: '',
  avatarUrl: '',
  description: '',
  footerText: '',
  customHtml: '',
})

onMounted(async () => {
  loading.value = true
  const res = await api['site-config'].$get()
  if (res.ok) {
    const data = await res.json()
    form.value = {
      siteName: data.siteName,
      siteSlug: data.siteSlug,
      nickname: data.nickname,
      avatarUrl: data.avatarUrl,
      description: data.description,
      footerText: data.footerText,
      customHtml: data.customHtml,
    }
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

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>
