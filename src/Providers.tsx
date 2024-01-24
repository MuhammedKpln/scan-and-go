import { PropsWithChildren } from "react";
import { AuthContextProvider } from "./context/AuthContext";

export default function Providers(props: PropsWithChildren) {
  return <AuthContextProvider>{props.children}</AuthContextProvider>;
}
