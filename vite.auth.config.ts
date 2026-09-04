import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "public/build/auth-loaders",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/auth-loaders.tsx"),
      formats: ["es"],
      fileName: () => "auth-loaders.js",
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css")
            ? "auth-loaders.css"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
})
