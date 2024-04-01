import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dotenv from "dotenv-webpack";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/kp2/",
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.repeat(/^\/api/, ""),
      },
    },
  },
});
