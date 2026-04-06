<template>
	<div>
		<h1>Hello, World! about</h1>
		<router-link to="/">Home</router-link>
		<v-btn @click="goHome">Go Home</v-btn>
		<v-btn @click="$uigo('/')">Go Home</v-btn>
		<div>
			<v-text-field v-model="input" label="Input" />
			<v-btn @click="hello">Hello</v-btn>
			<v-btn v-if="ff">ciallo</v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { uigo } from "../easyKit";
import { api } from "../server";
const input = ref("");
const ff = ref(false)
async function hello() {
	try {
		const res = await api.hello2.$get({ query: { input: input.value } });
		const data = await res.json();
		input.value = data.message;
	} catch (error) {
		alert(error);
	}
}
function goHome() {
	uigo("/");
}
//错误处理
</script>
