import { defineCustomElements } from "@ionic/pwa-elements/loader";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Providers from "./Providers";

const container = document.getElementById("root");
const root = createRoot(container!);

defineCustomElements(window);

root.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
