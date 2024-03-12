import { useAuthStore } from "@/stores/auth.store";
import { Redirect, Route, RouteProps } from "react-router";
import { Routes } from "./routes";

export default function PublicRoute({
  component: Component,
  ...rest
}: RouteProps) {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  return (
    <Route
      {...rest}
      render={(props) => {
        return !isSignedIn ? (
          Component && <Component {...props} />
        ) : (
          <Redirect to={Routes.AppRoot} />
        );
      }}
    />
  );
}
