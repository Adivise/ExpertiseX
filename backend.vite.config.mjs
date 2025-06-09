import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';

// Get all .js files from src/backend and its subdirectories
const backendFiles = glob.sync('src/backend/**/*.js');

// Create input object with keys as relative paths from src/backend (cross-platform)
const input = backendFiles.reduce((acc, file) => {
  const name = file.replace(/^src[\\\/]backend[\\\/]/, '').replace(/\\/g, '/');
  acc[name] = resolve(file);
  return acc;
}, {});

export default defineConfig({
  build: {
    outDir: "out/backend",
    rollupOptions: {
      input,
      output: {
        entryFileNames: "[name]",
        chunkFileNames: "[name]",
        assetFileNames: "[name].[ext]",
        format: "cjs"
      },
      external: (id) => /^node_modules/.test(id),
    },
    sourcemap: false,
    minify: "terser",
    treeshake: true,
    emptyOutDir: true,
    copyPublicDir: false
  },
  resolve: {
    alias: {
      "@backend": resolve(__dirname, "src/backend")
    }
  }
});