import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        build: {
            minify: "terser",  // More aggressive minification
            treeshake: true
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src')
            }
        },
        plugins: [react()],
        build: {
            sourcemap: false, // Reduces output size
            terserOptions: {
                compress: {
                    drop_console: true // Removes console logs in production
                }
            }
        }
    }
});