import ChatPage from "@/pages/Chats/Chat";
import ChatsPage from "@/pages/Chats/Chats";
import EditNotePage from "@/pages/EditNote/EditNote";
import HomePage from "@/pages/Home/Home";
import NewTagPage from "@/pages/NewTag/NewTag";
import NoteDetailsPage from "@/pages/NoteDetails/NoteDetails";
import ProfilePage from "@/pages/Profile/ProfilePage";
import SettingsPage from "@/pages/Settings/Settings";
import EditTagPage from "@/pages/Tags/EditTag";
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
import { lazy } from "react";
import { Redirect, Route } from "react-router";
import PrivateRoute from "./PrivateRoute";
import { Routes } from "./routes";

const ScanPage = lazy(() => import("@/pages/Scan"));

export default function TabRoutes() {
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

        <PrivateRoute path={Routes.EditTag} component={EditTagPage} exact />
        <PrivateRoute path={Routes.NewTag} exact component={NewTagPage} />
        <PrivateRoute path={Routes.EditNote} component={EditNotePage} exact />
        <PrivateRoute
          path={`${Routes.Notes}/:id`}
          exact
          component={NoteDetailsPage}
        />
        <PrivateRoute path={Routes.Settings} component={SettingsPage} exact />
        <PrivateRoute path={Routes.Chat} component={ChatPage} />
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
