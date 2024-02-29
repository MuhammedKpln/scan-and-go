import AppOrLogin from "@/components/AppOrLogin";
import TagPage from "@/pages/Tag/Tag";
import RegisterPage from "@/pages/auth/Register/Register";
import LoginPage from "@/pages/auth/login";
import VerificationPage from "@/pages/auth/verification";
import { Route } from "react-router";
import PublicRoute from "./PublicRoute";
import TabRoutes from "./tab.route";

export enum Routes {
  Root = "/",
  AppRoot = "/app",
  Home = "/app/home",
  Notes = "/app/notes",
  Scan = "/app/scan",
  Chats = "/app/chats",
  Chat = "/app/chat/:roomUid",
  Profile = "/app/profile",
  Tags = "/app/tags",
  Login = "/auth/login",
  Register = "/auth/register",
  Settings = "/app/settings",
  Tag = "/tag/:tagUid",
  EditNote = "/app/edit-note/:noteUid",
  Verification = "/auth/verification",
  NewTag = "/app/new-tag/:tagUid",
  EditTag = "/app/tags/:tagUid",
}

export default function AppRoutes() {
  return (
    <>
      <Route path={Routes.AppRoot} render={() => <TabRoutes />} />
      <Route path={Routes.Verification} component={VerificationPage} exact />

      <Route path={Routes.Tag} component={TagPage} exact />
      <PublicRoute path={Routes.Login} component={LoginPage} exact />
      <PublicRoute path={Routes.Register} component={RegisterPage} exact />
      <Route path="/" exact component={AppOrLogin} />
    </>
  );
}
