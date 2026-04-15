<template>
	<div class="pa-4">
		<span class="text-h6">选择器测试</span>
		<v-divider class="my-4" />

		<v-btn color="primary" prepend-icon="mdi-file-document-outline" @click="showPostSelector = true">
			选择文章
		</v-btn>

		<div v-if="selected" class="mt-4">
			<v-chip closable @click:close="selected = null">
				{{ selected.title }} ({{ selected.slug }})
			</v-chip>
		</div>

		<PostSelector v-model="showPostSelector" @select="onPostSelected" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PostSelector from "../components/selector/PostSelector.vue";

const showPostSelector = ref(false);
const selected = ref<{ id: string; title: string; slug: string } | null>(null);

function onPostSelected(post: { id: string; title: string; slug: string }) {
	selected.value = post;
}
</script>
