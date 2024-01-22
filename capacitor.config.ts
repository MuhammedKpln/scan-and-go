import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.muhammedkpln.scanandgo",
  appName: "Scan & Go",
  webDir: "dist",
  bundledWebRuntime: true,
  server: {
    androidScheme: "https",
  },
};

export default config;
