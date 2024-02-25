import AppOrLogin from "@/components/AppOrLogin";
import ChatPage from "@/pages/Chats/Chat";
import EditNotePage from "@/pages/EditNote/EditNote";
import NoteDetailsPage from "@/pages/NoteDetails/NoteDetails";
import SettingsPage from "@/pages/Settings/Settings";
import TagPage from "@/pages/Tag/Tag";
import EditTagPage from "@/pages/Tags/EditTag";
import RegisterPage from "@/pages/auth/Register/Register";
import LoginPage from "@/pages/auth/login";
import VerificationPage from "@/pages/auth/verification";
import { Route } from "react-router";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import TabRoutes from "./tab.route";

export enum Routes {
  Root = "/",
  AppRoot = "/app",
  Home = "/app/home",
  Notes = "/app/notes",
  Scan = "/app/scan",
  Chats = "/app/chats",
  Chat = "/chat/:roomUid",
  Profile = "/app/profile",
  Tags = "/app/tags",
  EditTag = "/tags/:tagUid",
  Login = "/auth/login",
  Register = "/auth/register",
  Settings = "/settings",
  Tag = "/tag/:tagUid",
  EditNote = "/edit-note/:noteUid",
  Verification = "/auth/verification",
}

export default function AppRoutes() {
  return (
    <>
      <Route path={Routes.AppRoot} render={() => <TabRoutes />} />
      <Route path={Routes.Verification} component={VerificationPage} exact />
      <PrivateRoute path={Routes.Settings} component={SettingsPage} exact />
      <PrivateRoute path={Routes.Chat} component={ChatPage} />
      <PrivateRoute
        path={`${Routes.Notes}/:id`}
        exact
        component={NoteDetailsPage}
      />
      <PrivateRoute path={Routes.EditTag} component={EditTagPage} exact />
      <PrivateRoute path={Routes.EditNote} component={EditNotePage} exact />
      <Route path={Routes.Tag} component={TagPage} exact />
      <PublicRoute path={Routes.Login} component={LoginPage} exact />
      <PublicRoute path={Routes.Register} component={RegisterPage} exact />
      <Route path="/" exact component={AppOrLogin} />
    </>
  );
}
