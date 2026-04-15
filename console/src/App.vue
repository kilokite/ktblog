<script setup lang="ts">
import Normal from "./components/frame/Normal.vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const menus = [
	{ title: "首页", icon: "mdi-home", to: "/" },
	{ title: "文章管理", icon: "mdi-post-outline", to: "/posts" },
	{ title: "分类与标签", icon: "mdi-tag-outline", to: "/taxonomy" },
	{ title: "个人页", icon: "mdi-account-box-outline", to: "/profile" },
	{ title: "站点设置", icon: "mdi-cog", to: "/setting" },
	{ title: "关于", icon: "mdi-information", to: "/about" },
];

function go(to: string) {
	if (to !== route.path) {
		router.push(to);
	}
}
</script>

<template>
    <Normal>
		<template #bar>
		</template>
		<template #drawer>
			<v-list density="compact" nav>
				<v-list-item
					v-for="item in menus"
					:key="item.to"
					:title="item.title"
					:prepend-icon="item.icon"
					:to="item.to"
					:active="route.path === item.to"
					@click="go(item.to)"
				/>
			</v-list>
		</template>
	</Normal>
</template>

<style scoped></style>
