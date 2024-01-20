import LoginPage from "@/pages/auth/login";
import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";

export default function AuthRoutes() {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login">
          <LoginPage />
        </Route>

        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
