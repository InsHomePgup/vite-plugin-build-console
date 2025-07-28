import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { consoleBuildInfo } from 'vite-plugin-build-console'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    consoleBuildInfo({
      // 指定需要输出的环境变量
      envString: ['VITE_APP_TITLE', 'VITE_API_URL'],
      // 显示插件版本
      showPluginVersion: false,
    }),
  ],
  server: {
    port: 5178,
    host: '0.0.0.0',
  },
})
