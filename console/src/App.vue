<script setup lang="ts">
import Normal from "./components/frame/Normal.vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const menus = [
	{ title: "首页", icon: "mdi-home", to: "/" },
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
