import {
  IMessageWithProfiles,
  INewMessagePayload,
  IRoom,
} from "@/models/room.model";
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
    const { data, error } = await this.client
      .rpc("get_rooms_with_users_profile")
      .eq("id", roomUid)
      .single();

    if (error) {
      throw error;
    }

    return data as unknown as IRoom;
  }

  async fetchRoomMessages(roomUid: string) {
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
    message: string
  ) {
    const { error, data } = await this.client
      .from("messages")
      .insert({
        roomId: roomUid,
        toId,
        fromId,
        message,
      })
      .select(
        `*,
    from:fromId(*),
    to:toId(*)`
      )
      .single();

    if (error) {
      throw error;
    }

    await this.sendMessageViaBroadcast(data as unknown as IMessageWithProfiles);

    return data as unknown as IMessageWithProfiles;
  }

  private async sendMessageViaBroadcast(message: IMessageWithProfiles) {
    await this.client.realtime.channel(this.roomUid!).send({
      event: "new_message",
      payload: message,
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

  async createNewRoom(users: string[]) {
    const { data, error } = await this.client
      .from("rooms")
      .insert({
        users,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    const dataWProfiles = await this.fetchRoom(data.id);

    return dataWProfiles;
  }
}

export const messagesService = new MessagesService();
