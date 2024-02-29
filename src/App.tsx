import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Theme variables */
import { IonReactRouter } from "@ionic/react-router";
import { Suspense, useEffect } from "react";
import AppLoading from "./components/App/AppLoading";
import AppUrlListener from "./components/App/AppUrlListener";
import { useAppTheme } from "./hooks/app/useAppTheme";
import { useIsNative } from "./hooks/app/useIsNative";
import { useSplashScreen } from "./hooks/app/useSplashScreen";
import AppRoutes from "./routes/routes";
import { useAuthStore } from "./stores/auth.store";
import { loadIcons } from "./theme/icon";
import "./theme/variables.scss";

setupIonicReact({
  mode: "ios",
});

export default function App() {
  const listenToAuthClient = useAuthStore((state) => state.listenToAuthClient);
  const { isNative } = useIsNative(false);
  const { showLoading, hideLoading } = useSplashScreen();
  useAppTheme();

  useEffect(() => {
    const listener = listenToAuthClient();
    loadIcons();

    if (!isNative.current) {
      showLoading("Värmer upp...");
    }

    return () => {
      hideLoading();
      listener.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <IonApp>
      <Suspense fallback={<AppLoading message="Laddar..." />}>
        <IonReactRouter>
          <AppUrlListener />

          <IonRouterOutlet>
            <AppRoutes />
          </IonRouterOutlet>
        </IonReactRouter>
      </Suspense>
    </IonApp>
  );
}
