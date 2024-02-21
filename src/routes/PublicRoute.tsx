import { useAuthContext } from "@/context/AuthContext";
import { Redirect, Route, RouteProps } from "react-router";
import { Routes } from "./routes";

export default function PrivateRoute({
  component: Component,
  ...rest
}: RouteProps) {
  const { isSignedIn } = useAuthContext();

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
