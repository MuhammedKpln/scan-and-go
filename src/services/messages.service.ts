import { IMessage, INewMessagePayload, IRoom } from "@/models/room.model";
import { QueryData } from "@supabase/supabase-js";
import { BaseService } from "./base.service";
import { supabaseClient } from "./supabase.service";

export const messagesQuery = supabaseClient.from("messages").select(`
*,
from:fromId(*),
to:toId(*)
`);

class MessagesService extends BaseService {
  protected roomUid?: string;

  async fetchRooms(userUid: string) {
    const { data, error } = await this.client
      .rpc("get_rooms_with_users_profile")
      .contains("users", [userUid]);

    if (error) {
      throw error;
    }

    return data as unknown as IRoom[];
  }

  async fetchRoom(roomUid: string) {
    const { data, error } = await messagesQuery.eq("roomId", roomUid);

    if (error) {
      throw error;
    }

    return data;
  }

  async sendMessage(
    roomUid: string,
    fromId: string,
    toId: string,
    message: Pick<IMessage, "message">
  ) {
    const { error, data } = await this.client.from("messages").insert({
      roomId: roomUid,
      toId,
      fromId,
      ...message,
    }).select(`*,
    from:fromId(*),
    to:toId(*)`);

    if (error) {
      throw error;
    }

    await this.sendMessageViaBroadcast(data);

    return data;
  }

  private async sendMessageViaBroadcast(
    message: QueryData<typeof messagesQuery>
  ) {
    console.log(message);
    await this.client.realtime.channel(this.roomUid!).send({
      event: "new_message",
      payload: message[0],
      type: "broadcast",
    });
  }

  setRoomUid(roomUid: string) {
    this.roomUid = roomUid;
  }

  listenRoom(roomUid: string, callback: (message: INewMessagePayload) => void) {
    return this.client.realtime.channel(this.roomUid!).on(
      "broadcast",
      {
        event: "new_message",
      },
      (event) => callback(event as INewMessagePayload)
    );
  }
}

export const messagesService = new MessagesService();
