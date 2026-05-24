import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/forza-paint-code-picker/",
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
  plugins: [
    remix({
      ssr: false,
      basename: "/forza-paint-code-picker/",
    }),
  ],
});
