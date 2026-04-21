import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// Figma에서 생성된 코드가 가끔 `figma:asset/파일명` 같은 가상 import를 씁니다.
// 로컬에서는 src/imports/ 혹은 src/assets/ 안의 파일을 찾아주도록 변환해줍니다.
function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '');
        const importsPath = path.resolve(__dirname, 'src/imports', filename);
        const assetsPath = path.resolve(__dirname, 'src/assets', filename);
        return importsPath || assetsPath;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [figmaAssetResolver(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    port: 5173,
    open: true,
  },
});
