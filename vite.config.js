import { defineConfig } from 'vite'


export default defineConfig({
    build: {
        target: "es2015",
    },
    esbuild: {
        include: ["main.js"]
    },
    test: {
        environment: "happy-dom",
    }
})