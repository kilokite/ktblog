<template>
  <div class="pa-4">
    <v-progress-linear v-if="loading" indeterminate class="mb-2" />

    <v-table v-else-if="data" density="compact">
      <tbody>
        <tr>
          <td><v-icon size="small" icon="mdi-clock-outline" class="mr-2" /> 运行时间</td>
          <td>{{ formatUptime(data.uptime) }}</td>
        </tr>
        <tr>
          <td><v-icon size="small" icon="mdi-memory" class="mr-2" /> 内存占用</td>
          <td>{{ data.memoryMB }} MB</td>
        </tr>
        <tr>
          <td><v-icon size="small" icon="mdi-speedometer" class="mr-2" /> 平均渲染</td>
          <td>{{ data.avgRenderMs }} ms</td>
        </tr>
        <tr v-for="(val, key) in data.counters" :key="key">
          <td><v-icon size="small" :icon="meta(key).icon" class="mr-2" /> {{ meta(key).label }}</td>
          <td>{{ val }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../server'

type Stats = {
  uptime: number
  memoryMB: number
  avgRenderMs: number
  counters: Record<string, number>
}

const labels: Record<string, { label: string; icon: string }> = {
  ssr_render:  { label: '页面渲染次数', icon: 'mdi-file-document-outline' },
  api_request: { label: 'API 请求次数', icon: 'mdi-api' },
  auth_login:  { label: '登录成功次数', icon: 'mdi-login' },
  auth_fail:   { label: '登录失败次数', icon: 'mdi-shield-alert-outline' },
}

function meta(key: string) {
  return labels[key] ?? { label: key, icon: 'mdi-counter' }
}

const data = ref<Stats | null>(null)
const loading = ref(true)

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const parts: string[] = []
  if (d) parts.push(`${d}天`)
  if (h) parts.push(`${h}时`)
  if (m) parts.push(`${m}分`)
  parts.push(`${s}秒`)
  return parts.join(' ')
}

onMounted(async () => {
  const res = await api.stats.$get()
  if (res.ok) {
    data.value = await res.json() as Stats
  }
  loading.value = false
})
</script>
