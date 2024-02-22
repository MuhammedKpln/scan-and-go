import { corsHeaders } from "./cors.ts";

export default (message: string) =>
  new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
