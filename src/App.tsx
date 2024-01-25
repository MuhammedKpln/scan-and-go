import {
  IonApp,
  IonLoading,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";

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
import { useContext } from "react";
import { Route } from "react-router";
import AppOrLogin from "./components/AppOrLogin";
import { AuthContext } from "./context/AuthContext";
import RegisterPage from "./pages/auth/Register/Register";
import LoginPage from "./pages/auth/login";
import TabRoutes from "./routes/tab.route";
import "./theme/variables.css";

setupIonicReact();

export default function App() {
  const s = useContext(AuthContext);

  if (s?.isLoadingUser) {
    return (
      <IonApp>
        <IonLoading message="Starting App..." />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/app" render={() => <TabRoutes />} />
          <Route path="/login" exact>
            <LoginPage />
          </Route>

          <Route path="/register" exact>
            <RegisterPage />
          </Route>

          <Route path="/" exact component={AppOrLogin} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
