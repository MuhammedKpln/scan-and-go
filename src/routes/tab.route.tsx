import { useAuthContext } from "@/context/AuthContext";
import ChatPage from "@/pages/Chats/Chat";
import ChatsPage from "@/pages/Chats/Chats";
import HomePage from "@/pages/Home/Home";
import NoteDetails from "@/pages/NoteDetails/NoteDetails";
import ProfilePage from "@/pages/Profile/ProfilePage";
import ScanPage from "@/pages/Scan";
import {
  IonFabButton,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  albumsOutline,
  chatbubbleEllipsesOutline,
  homeOutline,
  personCircleOutline,
  qrCodeOutline,
} from "ionicons/icons";
import { useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router";
import { Routes } from "./routes";

export default function TabRoutes() {
  const router = useHistory();
  const auth = useAuthContext();

  useEffect(() => {
    const unregister = router.listen(() => {
      if (router.location.pathname.startsWith("/app")) {
        if (!auth.isSignedIn) {
          router.replace("/");
        }
      }
    });

    return unregister;
  }, [auth]);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path={Routes.Home} exact>
          <HomePage />
        </Route>
        <Route path={Routes.Notes} exact>
          <HomePage />
        </Route>
        <Route path={Routes.Scan} exact>
          <ScanPage />
        </Route>
        <Route path={Routes.Chats} exact>
          <ChatsPage />
        </Route>
        <Route path={Routes.Profile} exact>
          <ProfilePage />
        </Route>
        <Route path={`${Routes.Notes}/:id`} exact>
          <NoteDetails />
        </Route>
        <Route path={`${Routes.Chats}/:id`} exact>
          <ChatPage />
        </Route>
        <Route path={Routes.AppRoot} exact>
          <Redirect to={Routes.Home} />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href={Routes.Home}>
          <IonIcon aria-hidden="true" icon={homeOutline} />
        </IonTabButton>
        <IonTabButton tab="notes" href={Routes.Notes}>
          <IonIcon aria-hidden="true" icon={albumsOutline} />
        </IonTabButton>
        <IonTabButton tab="scan" href={Routes.Scan}>
          <IonFabButton>
            <IonIcon aria-hidden="true" icon={qrCodeOutline} />
          </IonFabButton>
        </IonTabButton>
        <IonTabButton tab="messages" href={Routes.Chats}>
          <IonIcon aria-hidden="true" icon={chatbubbleEllipsesOutline} />
        </IonTabButton>
        <IonTabButton tab="profile" href={Routes.Profile}>
          <IonIcon aria-hidden="true" icon={personCircleOutline} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
