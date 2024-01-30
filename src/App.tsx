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
import { Suspense, lazy } from "react";
import { Route } from "react-router";
import AppLoading from "./components/App/AppLoading";
import AppOrLogin from "./components/AppOrLogin";
import { useAuthContext } from "./context/AuthContext";
import { useAppTheme } from "./hooks/app/useAppTheme";
import { useSplashScreen } from "./hooks/app/useSplashScreen";
import { Routes } from "./routes/routes";
import TabRoutes from "./routes/tab.route";
import "./theme/variables.scss";

const TagPage = lazy(() => import("@/pages/Tag/Tag"));
const SettingsPage = lazy(() => import("@/pages/Settings/Settings"));
const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/Register/Register"));
const NoteDetailsPage = lazy(() => import("@/pages/NoteDetails/NoteDetails"));
const ChatPage = lazy(() => import("@/pages/Chats/Chat"));

setupIonicReact();

export default function App() {
  const authContext = useAuthContext();
  useAppTheme();
  useSplashScreen();

  if (!authContext?.isInitialized) {
    return <AppLoading message="Starting App..." />;
  }

  return (
    <IonApp>
      <Suspense fallback={<AppLoading />}>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path={Routes.AppRoot} render={() => <TabRoutes />} />
            <Route path={Routes.Login} component={LoginPage} exact />
            <Route path={Routes.Register} component={RegisterPage} exact />
            <Route path={Routes.Settings} component={SettingsPage} exact />
            <Route path={Routes.Tag} component={TagPage} exact />
            <Route
              path={`${Routes.Notes}/:id`}
              exact
              component={NoteDetailsPage}
            />
            <Route path={`${Routes.Chats}/:id`} component={ChatPage} exact />
            <Route path="/" exact component={AppOrLogin} />
          </IonRouterOutlet>
        </IonReactRouter>
      </Suspense>
    </IonApp>
  );
}
