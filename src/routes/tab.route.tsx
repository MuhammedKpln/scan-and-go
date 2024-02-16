import { useAuthContext } from "@/context/AuthContext";
import ChatsPage from "@/pages/Chats/Chats";
import HomePage from "@/pages/Home/Home";
import ProfilePage from "@/pages/Profile/ProfilePage";
import TagsPage from "@/pages/Tags/Tags";
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
import { lazy, useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router";
import { Routes } from "./routes";

const ScanPage = lazy(() => import("@/pages/Scan"));

export default function TabRoutes() {
  const router = useHistory();
  const { isSignedIn } = useAuthContext();

  useEffect(() => {
    const unregister = router.listen(() => {
      if (router.location.pathname.startsWith("/app")) {
        if (!isSignedIn) {
          router.replace("/");
        }
      }
    });

    return unregister;
  }, [isSignedIn]);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path={Routes.Home} exact>
          <HomePage />
        </Route>
        <Route path={Routes.Tags} exact>
          <TagsPage />
        </Route>
        <Route path={Routes.Scan} component={ScanPage} exact />
        <Route path={Routes.Chats} exact>
          <ChatsPage />
        </Route>
        <Route path={Routes.Profile} exact>
          <ProfilePage />
        </Route>
        <Route path={Routes.AppRoot} exact>
          <Redirect to={Routes.Home} />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href={Routes.Home}>
          <IonIcon aria-hidden="true" icon={homeOutline} />
        </IonTabButton>
        <IonTabButton tab="tags" href={Routes.Tags}>
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
