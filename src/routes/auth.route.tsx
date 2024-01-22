import OnboardPage from "@/pages/Onboard/Onboard";
import LoginPage from "@/pages/auth/login";
import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router";

export default function AuthRoutes() {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login">
          <LoginPage />
        </Route>

        <Route path="/" exact>
          <OnboardPage />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
