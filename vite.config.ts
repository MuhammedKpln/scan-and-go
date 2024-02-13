import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

const plugins = [react(), legacy(), tsconfigPaths()];

if (!process.env.KEYSTORE_PATH) {
  // Build is for Android
  plugins.push(VitePWA({ registerType: "autoUpdate" }));
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
