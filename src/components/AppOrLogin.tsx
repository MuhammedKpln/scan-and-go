import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect } from "react-router";

export default function AppOrLogin() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  if (isSignedIn) {
    return <Redirect to={Routes.AppRoot} />;
  }

  return <Redirect to={Routes.Login} />;
}
