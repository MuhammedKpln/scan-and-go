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
import { useSigninCheck } from "reactfire";
import AuthRoutes from "./routes/auth.route";
import TabRoutes from "./routes/tab.route";
import "./theme/variables.css";

setupIonicReact();

export default function App() {
  const { data: signInData, status: signInStatus } = useSigninCheck();

  if (signInStatus === "loading") {
    return (
      <IonApp>
        <IonLoading message="Starting App..." />
      </IonApp>
    );
  }

  return (
    <IonApp>{signInData.signedIn ? <TabRoutes /> : <AuthRoutes />}</IonApp>
  );
}
