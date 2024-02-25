import { cert, initializeApp } from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import error_response from "../_shared/http/error_response.ts";
import success_response from "../_shared/http/success_response.ts";
import { SUPABASE_ADMIN } from "../_shared/supabaseAdmin.ts";
import { WebhookPayload } from "./types.ts";

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();

  const serviceAccount = cert({
    projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
    privateKey: Deno.env.get("FIREBASE_PRIVATE_KEY"),
    clientEmail: Deno.env.get("FIREBASE_CLIENT_EMAIL"),
  });

  const app = initializeApp({
    credential: serviceAccount,
  });

  const defaultMessaging = getMessaging(app);
  const token = await findFcmToken(payload.record.toUserId);

  if (!token) return error_response("");

  await defaultMessaging.send({
    token: token.token!,
    notification: {
      title: "Ett nytt notis!",
      body: "Notification",
    },
  });

  return success_response(true);
});

async function findFcmToken(userId: string) {
  const { data, error } = await SUPABASE_ADMIN.from("fcm_tokens")
    .select()
    .eq("userId", userId)
    .single();

  if (error) throw error;

  return data;
}
