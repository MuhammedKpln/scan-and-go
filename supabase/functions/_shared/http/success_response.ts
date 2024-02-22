import { corsHeaders } from "./cors.ts";

export default (data: unknown) =>
  new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
