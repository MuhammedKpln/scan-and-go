import { useAuthStore } from "@/stores/auth.store";
import { Redirect, Route, RouteProps } from "react-router";
import { Routes } from "./routes";

export default function PrivateRoute({
  component: Component,
  render,
  ...rest
}: RouteProps) {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isSignedIn) {
          if (Component) {
            return <Component {...props} />;
          }

          if (typeof render === "function") {
            return render(props);
          }

          throw new Error("Private Route: could not find any render prop");
        }

        return <Redirect to={Routes.Login} />;
      }}
    />
  );
}
