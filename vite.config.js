import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "./",
    // 强制预构建node_modules中的包
    optimizeDeps: {
      include: ["vue"],
    },
    plugins: [
      vue(),
      legacy({
        targets: ["chrome 64"],
        renderModernChunks: false,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 14456,
      proxy: {
        "/api": {
          target: env.VITE_HTTP_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: false,
        },
      },
    },
  };
});
