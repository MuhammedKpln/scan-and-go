import { IonApp, IonLoading, setupIonicReact } from "@ionic/react";

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
import { useAuthState } from "react-firebase-hooks/auth";
import AuthRoutes from "./routes/auth.route";
import TabRoutes from "./routes/tab.route";
import { auth } from "./services/firebase.service";
import "./theme/variables.css";

setupIonicReact();

function App() {
  const [user, loading, error] = useAuthState(auth, {
    onUserChanged: undefined,
  });

  if (loading) {
    return (
      <IonApp>
        <IonLoading message="Starting App..." />
      </IonApp>
    );
  }

  return <IonApp>{user ? <TabRoutes /> : <AuthRoutes />}</IonApp>;
}

export default App;
