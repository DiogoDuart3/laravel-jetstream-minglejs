import { defineConfig } from 'vite';
import laravel, { refreshPaths } from 'laravel-vite-plugin'
import path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            "@mingle": path.resolve(__dirname, "/vendor/ijpatricio/mingle/resources/js"),
        },
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/ChatApp/index.js',
            ],
            refresh: true,
        }),
    ],
});
