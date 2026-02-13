import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  server: {
    port: 14456,
    host: "0.0.0.0",
  },
  build: {
    outDir: "dist",
  },
});
