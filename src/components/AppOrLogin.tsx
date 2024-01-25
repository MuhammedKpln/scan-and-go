import { useAuthContext } from "@/context/AuthContext";
import { Routes } from "@/routes/routes";
import { Redirect } from "react-router";

export default function AppOrLogin() {
  const auth = useAuthContext();

  if (auth.isSignedIn) {
    return <Redirect to={Routes.AppRoot} />;
  }

  return <Redirect to={Routes.Login} />;
}
