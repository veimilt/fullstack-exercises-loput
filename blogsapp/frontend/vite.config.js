import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const baseUrl = "http://localhost:3001";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/blogs": {
        target: `${baseUrl}`,
        changeOrigin: true
      },
      "/api/login": {
        target: `${baseUrl}`,
        changeOrigin: true
      },
      "/api/users": {
        target: `${baseUrl}`,
        changeOrigin: true
      }
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./testSetup.js"
  }
});
