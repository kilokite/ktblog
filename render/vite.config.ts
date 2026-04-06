import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [solid({ ssr: true })],
  build: {
    emptyOutDir: !isSsrBuild,
  },
}))
