import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { AuthContextProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

export default function Providers(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>{props.children}</AuthContextProvider>
    </QueryClientProvider>
  );
}
