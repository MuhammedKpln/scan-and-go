import HomePage from "@/pages/Home/Home";
import NoteDetails from "@/pages/NoteDetails/NoteDetails";
import ProfilePage from "@/pages/Profile/ProfilePage";
import ScanPage from "@/pages/Scan";
import Tab3 from "@/pages/Tab3";
import {
  IonFabButton,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  albumsOutline,
  chatbubbleEllipsesOutline,
  homeOutline,
  personCircleOutline,
  qrCodeOutline,
} from "ionicons/icons";
import { Redirect, Route } from "react-router";

export default function TabRoutes() {
  return (
    <IonReactRouter basename="/app">
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/home" exact>
            <HomePage />
          </Route>
          <Route path="/notes" exact>
            <Tab3 />
          </Route>
          <Route path="/scan" exact>
            <ScanPage />
          </Route>
          <Route path="/messages" exact>
            <Tab3 />
          </Route>
          <Route path="/profile" exact>
            <ProfilePage />
          </Route>
          <Route path="/note" exact>
            <NoteDetails />
          </Route>
          <Route path="/" exact>
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon aria-hidden="true" icon={homeOutline} />
          </IonTabButton>
          <IonTabButton tab="notes" href="/tab2">
            <IonIcon aria-hidden="true" icon={albumsOutline} />
          </IonTabButton>
          <IonTabButton tab="scan" href="/scan">
            <IonFabButton>
              <IonIcon aria-hidden="true" icon={qrCodeOutline} />
            </IonFabButton>
          </IonTabButton>
          <IonTabButton tab="messages" href="/tab3">
            <IonIcon aria-hidden="true" icon={chatbubbleEllipsesOutline} />
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <IonIcon aria-hidden="true" icon={personCircleOutline} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}
