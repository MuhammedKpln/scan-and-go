import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { AuthContextProvider } from "./context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      networkMode: "offlineFirst",
    },
  },
});

export default function Providers(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>{props.children}</AuthContextProvider>
    </QueryClientProvider>
  );
}
