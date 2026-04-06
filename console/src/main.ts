import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createPinia } from "pinia";
const pinia = createPinia();

// Vuetify

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import '@mdi/font/css/materialdesignicons.css'
// import { md3 } from 'vuetify/blueprints'

const vuetify = createVuetify({
	components,
	directives,
	icons: {
		defaultSet: 'mdi',
	},
	theme: {
		defaultTheme: 'dark',
		themes: {
			dark: {
				colors: {
					primary: '#2979FF',
					secondary: '#1565C0',
					surface: '#111111',
					background: '#000000',
					'surface-variant': '#1A1A1A',
				},
			},
		},
	},
});

import routes from "~pages";
import { createRouter, createWebHistory } from "vue-router";
import { easyKitPlugin } from "./easyKit";

const router = createRouter({
	history: createWebHistory(),
	routes,
});



const app = createApp(App);

// 安装 easyKit 插件
app.use(easyKitPlugin, router);
app.use(pinia);
app.use(vuetify).use(router).mount("#app");
