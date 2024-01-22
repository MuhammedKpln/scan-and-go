import React from "react";
import { createRoot } from "react-dom/client";
import { FirebaseAppProvider } from "reactfire";
import App from "./App";
import Providers from "./Providers";
import { firebaseConfig } from "./services/firebase.service";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Providers>
        <App />
      </Providers>
    </FirebaseAppProvider>
  </React.StrictMode>
);
