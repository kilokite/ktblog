import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vite.dev/config/
export default defineConfig({
  build:{
    outDir: "../dist/public"
  },
  plugins: [vue(), Pages(), vueDevTools({
    launchEditor: "cursor",
				componentInspector:{
					toggleComboKey: "alt-f", // alt+f 启动组件检查器
				}
  })],
})
