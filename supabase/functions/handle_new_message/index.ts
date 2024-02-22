import { corsHeaders } from "../_shared/http/cors.ts";
import error_response from "../_shared/http/error_response.ts";
import success_response from "../_shared/http/success_response.ts";
import { SUPABASE_ADMIN } from "../_shared/supabaseAdmin.ts";
import { Tables } from "../_shared/types.ts";
import handle_new_message_request_data from "./handle_new_message_request_data.ts";
import { IInsertNewMessageData } from "./types.ts";

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const requestData = await req.json();
  const data = await requestIsValid(requestData);

  if (!data) {
    return error_response("Not valid");
  }

  const users = [data.fromId, data.toId];

  if (data.roomId) {
    // If roomId provided, just insert new message.
    return applyChanges(data.roomId, data);
  } else {
    const room = await fetchRoomByUsers(users);
    // Else check for rooms with given user uuids, if exists insert new message.

    if (room) {
      return applyChanges(room.id, data);
    } else {
      // Else create new room and insert
      const room = await createNewRoom(users);

      if (!room) {
        return error_response("Biseyler oldu ama hadi hayirlisi");
      }

      return applyChanges(room.id, data);
    }
  }
});

async function broadcastToChannel(roomId: string, message: Tables<"messages">) {
  const channel = SUPABASE_ADMIN.realtime.channel(`room#${roomId}`);

  await channel.send({
    event: "new_message",
    type: "broadcast",
    payload: message,
  });
}

const applyChanges = async (
  roomId: string,
  data: typeof handle_new_message_request_data._type
) => {
  const message = await insertNewMessage({
    ...data,
    roomId,
  });

  if (message) {
    await broadcastToChannel(roomId, message);
    return success_response(message);
  }

  return error_response("Opps");
};

async function insertNewMessage(data: IInsertNewMessageData) {
  const { data: response, error } = await SUPABASE_ADMIN.from("messages")
    .insert({
      message: data.message,
      roomId: data.roomId,
      fromId: data.fromId,
      toId: data.toId,
    })
    .select("*, from:fromId(*), to:toId(*)")
    .single();

  if (error) {
    throw error;
  }

  return response;
}

async function createNewRoom(users: string[]) {
  const { data, error } = await SUPABASE_ADMIN.from("rooms")
    .insert({
      users,
    })
    .select()
    .single();

  if (error) {
    return false;
  }

  return data;
}

async function fetchRoomByUsers(users: string[]) {
  const { data, error } = await SUPABASE_ADMIN.from("rooms")
    .select()
    .containedBy("users", users)
    .single();

  if (error) {
    return false;
  }

  return data;
}

async function requestIsValid(request: unknown) {
  const validator = handle_new_message_request_data;

  try {
    return await validator.parseAsync(request);
  } catch (error) {
    return false;
  }
}
