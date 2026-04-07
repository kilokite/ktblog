<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <span class="text-h6">分类与标签</span>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openNew">
        {{ tab === 'categories' ? '新建分类' : '新建标签' }}
      </v-btn>
    </div>

    <v-divider />

    <v-tabs v-model="tab" class="my-2">
      <v-tab value="categories">分类</v-tab>
      <v-tab value="tags">标签</v-tab>
    </v-tabs>

    <v-divider />

    <v-progress-linear v-if="loading" indeterminate class="mt-2" />

    <v-table v-else density="compact">
      <thead>
        <tr>
          <th>名称</th>
          <th>Slug</th>
          <th style="width: 120px">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.name }}</td>
          <td class="text-medium-emphasis">{{ item.slug }}</td>
          <td>
            <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEdit(item)" />
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="remove(item)" />
          </td>
        </tr>
        <tr v-if="!list.length">
          <td colspan="3" class="text-center text-medium-emphasis py-4">
            {{ tab === 'categories' ? '暂无分类' : '暂无标签' }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="dialog" max-width="420">
      <v-card :title="dialogTitle">
        <v-card-text>
          <v-text-field v-model="form.name" label="名称" />
          <v-text-field v-model="form.slug" label="Slug" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">取消</v-btn>
          <v-btn color="primary" :loading="saving" @click="save">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../server'

type Item = { id: string; name: string; slug: string }

const tab = ref<'categories' | 'tags'>('categories')
const list = ref<Item[]>([])
const loading = ref(true)
const dialog = ref(false)
const saving = ref(false)
const editing = ref<Item | null>(null)
const form = ref({ name: '', slug: '' })

const label = computed(() => tab.value === 'categories' ? '分类' : '标签')
const dialogTitle = computed(() => (editing.value ? '编辑' : '新建') + label.value)

const endpoint = computed(() => tab.value === 'categories' ? api.categories : api.tags)

async function load() {
  loading.value = true
  const res = await endpoint.value.$get()
  if (res.ok) list.value = await res.json() as Item[]
  loading.value = false
}

function openNew() {
  editing.value = null
  form.value = { name: '', slug: '' }
  dialog.value = true
}

function openEdit(item: Item) {
  editing.value = item
  form.value = { name: item.name, slug: item.slug }
  dialog.value = true
}

async function save() {
  saving.value = true
  if (editing.value) {
    await endpoint.value[':id'].$put({ param: { id: editing.value.id }, json: form.value })
  } else {
    await endpoint.value.$post({ json: form.value })
  }
  saving.value = false
  dialog.value = false
  load()
}

async function remove(item: Item) {
  if (!confirm(`确认删除${label.value}「${item.name}」？`)) return
  const res = await endpoint.value[':id'].$delete({ param: { id: item.id } })
  if (res.ok) load()
}

watch(tab, load)
onMounted(load)
</script>
