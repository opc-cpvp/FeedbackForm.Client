import { resolve } from 'path';
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const sourceMaps = mode === "development" ? "inline" : false;

  return {
    // vite config
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },  
    plugins: [vue()],
    build: {
      sourcemap: sourceMaps,
      lib: {
        entry: resolve(__dirname, "src/main.js"),
        name: "Feedback",
        fileName: "feedback",
        formats: ["es"],
      }
    }
  }
});
