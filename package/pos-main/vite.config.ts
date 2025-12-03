import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 🔥 핵심: @posprac/sdk를 찾을 때, 실제 dist/index.js 파일을 보라고 강제함
      '@posprac/sdk': path.resolve(__dirname, '../sdk/dist/index.js'),
      '@posprac/shared': path.resolve(__dirname, '../shared/dist/index.js'),
    },
  },
});
