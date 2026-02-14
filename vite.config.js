import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import ssr from "vite-plugin-ssr/plugin"

export default defineConfig({
    root: ".",
    publicDir: "public",
    build: {
        outDir: "dist",
        emptyOutDir: true,
        assetsDir: "assets",
        sourcemap: false,
        minify: "terser",
        cssMinify: "esbuild",
        // Remove rollupOptions.input as vite-plugin-ssr handles routing
        terserOptions: {
            ecma: 2020,
            compress: {
                passes: 3,
                drop_console: true,
                drop_debugger: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true
            },
            mangle: {
                properties: {
                    regex: /^_/
                }
            },
            format: {
                comments: false
            }
        }
    },
    plugins: [
        react(),
        ssr({
            prerender: true
        })
    ],
    server: {
        port: 1331,
        open: false,
        strictPort: true,
        host: true
    },
    preview: {
        port: 1331,
        open: false,
        strictPort: true,
        host: true
    }
})
