import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { Plugin } from "vite";

/**
 * Converts Vite-injected render-blocking CSS <link> tags to non-blocking
 * preload+onload patterns. Works with inline critical CSS in index.html
 * to eliminate Lighthouse "Render-blocking resources" for CSS.
 */
function asyncCss(): Plugin {
  return {
    name: "async-css",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"(.*?)href="(.*?)">/g,
        `<link rel="preload" as="style"$1href="$2" onload="this.onload=null;this.rel='stylesheet'">\n    <noscript><link rel="stylesheet"$1href="$2"></noscript>`
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), asyncCss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

