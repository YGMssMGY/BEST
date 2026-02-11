import {defineConfig} from "vite";
import htmlMinifier from "vite-plugin-html-minifier";
import {resolve} from "path";

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
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'src/about.html'),
                magazine: resolve(__dirname, 'src/magazine_one.html')
            }
        },
        terserOptions: {
            ecma: 2020,
            compress: {
                passes: 3,
                drop_console: true,
                drop_debugger: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
            },
            mangle: {
                properties: {
                    regex: /^_/,
                },
            },
            format: {
                comments: false,
            },
        },
    },
    plugins: [
        htmlMinifier({
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeAttributeQuotes: true,
            minifyCSS: true,
            minifyJS: true,
        }),
    ],
    server: {
        port: 1331,
        open: false,
        strictPort: true,
        host: true,
    },
    preview: {
        port: 1331,
        open: false,
        strictPort: true,
        host: true,
    },
});