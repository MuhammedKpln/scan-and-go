import { EdgeFunctions } from "@/models/cloud-functions";
import { RealtimEvents, RealtimeChannels } from "@/models/realtime.model";
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
    fromId: string,
    toId: string,
    message: string,
    roomUid?: string
  ) {
    const { error, data } = await this.client.functions.invoke(
      EdgeFunctions.SendNewMessage,
      {
        body: JSON.stringify({
          roomUid,
          fromId,
          toId,
          message,
        }),
      }
    );

    if (error) {
      throw error;
    }

    return data as unknown as IMessageWithProfiles;
  }
  listenRoom(roomUid: string, callback: (message: INewMessagePayload) => void) {
    return this.client.realtime
      .channel(`${RealtimeChannels.RoomWithUid}${roomUid}`)
      .on(
        "broadcast",
        {
          event: RealtimEvents.OnNewMessage,
        },
        (event) => callback(event as INewMessagePayload)
      );
  }
}

export const messagesService = new MessagesService();
